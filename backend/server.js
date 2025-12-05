// server.js - COMPLETO Y DEFINITIVO
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ======================
// RUTAS USUARIO (Planes, Login, Inscripción, Membresía)
// ======================

app.get("/api/plans", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*, desc") 
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al traer planes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/plans/landing", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("show_in_landing", true)
      .limit(3)
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al traer planes de landing:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  const { nombre_completo, username, password } = req.body;
  if (!nombre_completo || !username || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ nombre_completo, username, password, is_admin: false }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) return res.status(401).json({ error: "Usuario o contraseña incorrecta" });

    res.json({ id: data.id, username: data.username, is_admin: data.is_admin });
  } catch (err) {
    console.error("Error login:", err.message);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.post("/api/enroll", async (req, res) => {
  const { user_id, plan_id } = req.body;
  if (!user_id || !plan_id) return res.status(400).json({ error: "Faltan datos" });

  try {
    const today = new Date();
    const nextPayment = new Date(today);
    nextPayment.setDate(nextPayment.getDate() + 30);

    const { data: existing } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("enrollments")
        .update({ 
          plan_id, 
          status: "Activo",
          payment_status: "Al día",
          last_payment_date: today.toISOString().split('T')[0],
          next_payment_date: nextPayment.toISOString().split('T')[0],
          next_plan_id: null 
        })
        .eq("user_id", user_id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert([{ 
        user_id, 
        plan_id, 
        status: "Activo",
        payment_status: "Al día",
        last_payment_date: today.toISOString().split('T')[0],
        next_payment_date: nextPayment.toISOString().split('T')[0],
        next_plan_id: null
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al inscribir plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/:id/membership", async (req, res) => {
  const userId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        plan_id, status, next_plan_id, next_payment_date,
        plans!enrollments_plan_id_fkey (id, name, price, duration),
        next_plans:plans!enrollments_next_plan_id_fkey (id, name, price, duration)
      `)
      .eq("user_id", userId)
      .single();

    if (error || !data) return res.json(null);

    res.json({
      id: data.plans.id,
      name: data.plans.name,
      active: data.status === "Activo",
      next_plan: data.next_plan_id ? {
        id: data.next_plans.id,
        name: data.next_plans.name
      } : null,
      expiresAt: data.next_payment_date 
    });
  } catch (err) {
    console.error("Error al obtener membresía:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ⭐ NUEVA RUTA: Historial de pagos para el CLIENTE
app.get("/api/user/:id/payments", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("payment_history")
      .select(`
        id, amount, payment_date, payment_method, notes,
        plans (name)
      `)
      .eq("user_id", id)
      .order("payment_date", { ascending: false }); // Ordenar del más reciente al más antiguo

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al traer pagos del usuario:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ======================
// RUTAS DE PROGRESO
// ======================

app.get("/api/user/:id/progress", async (req, res) => {
  const userId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') { 
        throw error;
    }

    if (!data) return res.json(null);

    res.json({
        workoutsThisWeek: data.workouts_this_week,
        totalCaloriesBurned: data.total_calories_burned,
        nextGoal: data.next_goal,
        lastWeight: data.last_weight,
        lastMeasurementDate: data.last_measurement_date, 
        consistencyStreak: data.consistency_streak,
        lastAttendanceDate: data.last_attendance_date,
    });

  } catch (err) {
    console.error("Error al obtener progreso de usuario:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/progress/update", async (req, res) => {
  const { user_id, last_weight, next_goal, last_measurement_date } = req.body;
  if (!user_id || last_weight === undefined || !next_goal || !last_measurement_date) 
      return res.status(400).json({ error: "Faltan datos de peso o meta" });

  try {
    const updates = {
      last_weight,
      next_goal,
      last_measurement_date,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("user_progress")
      .update(updates)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al actualizar progreso:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/progress/log-workout", async (req, res) => {
  try {
    const { user_id, calories } = req.body;
    if (!user_id || calories === undefined) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const uid = isNaN(Number(user_id)) ? user_id : Number(user_id);

    // 1. Ver si el progreso YA existe
    let { data: currentProgress, error: selectError } = await supabase
      .from("user_progress")
      .select("workouts_this_week, total_calories_burned")
      .eq("user_id", uid)
      .single();

    // 2. Si NO existe → crearlo
    if (selectError || !currentProgress) {
      const initialRow = {
        user_id: uid,
        workouts_this_week: 0,
        total_calories_burned: 0,
        next_goal: null,
        last_weight: null,
        last_measurement_date: null,
        consistency_streak: 0,
        last_attendance_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: created, error: insertError } = await supabase
        .from("user_progress")
        .insert([initialRow])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ error: "Error al inicializar progreso" });
      }
      currentProgress = created; 
    }

    const newWorkouts = (currentProgress.workouts_this_week || 0) + 1;
    const newCalories = (currentProgress.total_calories_burned || 0) + Number(calories);

    const { data: updated, error: updateError } = await supabase
      .from("user_progress")
      .update({
        workouts_this_week: newWorkouts,
        total_calories_burned: newCalories,
        last_attendance_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString()
      })
      .eq("user_id", uid)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.json({
      message: "Entrenamiento registrado",
      workoutsThisWeek: updated.workouts_this_week,
      totalCaloriesBurned: updated.total_calories_burned,
      lastAttendanceDate: updated.last_attendance_date
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Error del servidor" });
  }
});

// ======================
// RUTAS ADMIN
// ======================

app.post("/api/admin/plans", async (req, res) => {
  const { name, price, duration, label, highlight, desc, specs, bonus, show_in_landing } = req.body;
  
  if (!name || !price || !duration) {
    return res.status(400).json({ error: "Nombre, precio y duración son obligatorios" });
  }

  try {
    const { data, error } = await supabase
      .from("plans")
      .insert([{ 
        name, price, duration, 
        label: label || null, 
        highlight: highlight || false, 
        desc: desc || null,
        specs: specs || null,
        bonus: bonus || null,
        show_in_landing: show_in_landing || false
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al crear plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/plans", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al listar planes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/plans/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, duration, label, highlight, desc, specs, bonus, show_in_landing } = req.body;

  try {
    const updates = {
      name, price, duration,
      label: label || null,
      highlight: highlight || false,
      desc: desc || null,
      specs: specs || null,
      bonus: bonus || null,
      show_in_landing: show_in_landing || false
    };

    const { data, error } = await supabase
      .from("plans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al actualizar plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/plans/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res.json({ message: "Plan eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, nombre_completo, username")
      .neq("is_admin", true)
      .order("id", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al traer usuarios:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/schedule-plan-change", async (req, res) => {
  const { user_id, next_plan_id } = req.body;
  if (!user_id || !next_plan_id) return res.status(400).json({ error: "Faltan datos" });

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .update({ next_plan_id })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: "Cambio de plan programado correctamente", enrollment: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al programar cambio de plan" });
  }
});

app.post("/api/admin/cancel-plan-change", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "Falta user_id" });

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .update({ next_plan_id: null })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: "Cambio de plan cancelado", enrollment: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cancelar cambio de plan" });
  }
});

app.get("/api/admin/payments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        id, user_id, plan_id, next_plan_id, status, payment_status, last_payment_date, next_payment_date,
        users (id, nombre_completo, username),
        plans!enrollments_plan_id_fkey (id, name, price),
        next_plans:plans!enrollments_next_plan_id_fkey (id, name, price)
      `)
      .eq("status", "Activo");

    if (error) throw error;

    const today = new Date();
    const paymentsWithStatus = data.map(enrollment => {
      let paymentStatus = enrollment.payment_status || "Al día";
      
      if (enrollment.next_payment_date) {
        const nextDate = new Date(enrollment.next_payment_date);
        const daysUntilPayment = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilPayment < 0) {
          paymentStatus = "Vencido";
        } else if (daysUntilPayment <= 7) {
          paymentStatus = "Por vencer";
        } else {
          paymentStatus = "Al día";
        }
      }

      return {
        id: enrollment.id,
        user_id: enrollment.user_id,
        user_name: enrollment.users.nombre_completo,
        username: enrollment.users.username,
        plan_name: enrollment.plans.name,
        plan_price: enrollment.plans.price,
        next_plan_name: enrollment.next_plan_id ? enrollment.next_plans.name : null,
        payment_status: paymentStatus,
        last_payment_date: enrollment.last_payment_date,
        next_payment_date: enrollment.next_payment_date
      };
    });

    res.json(paymentsWithStatus);
  } catch (err) {
    console.error("Error al traer pagos:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// server.js - CORRECCIÓN EN RUTA DE PAGO

app.post("/api/admin/register-payment", async (req, res) => {
  const { user_id, amount, payment_method, notes } = req.body;
  
  if (!user_id) return res.status(400).json({ error: "Falta el ID del usuario" });

  try {
    const today = new Date();

    // 1. Obtener información del enrollment (incluyendo la fecha actual de vencimiento)
    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .select("plan_id, next_plan_id, next_payment_date") // <--- IMPORTANTE: pedimos la fecha actual
      .eq("user_id", user_id)
      .single();

    if (enrollError) {
        console.error("Error buscando enrollment:", enrollError);
        return res.status(404).json({ error: "No se encontró inscripción activa para este usuario." });
    }

    // --- LÓGICA CORREGIDA DE FECHAS ---
    let newExpirationDate = new Date(); // Por defecto empezamos hoy
    
    // Si tiene una fecha de vencimiento válida...
    if (enrollment.next_payment_date) {
        // ...y esa fecha es FUTURA (mayor a hoy)...
        // Ajustamos la zona horaria sumando las horas para comparar correctamente fechas puras
        const currentExpiration = new Date(enrollment.next_payment_date);
        // Truco para evitar problemas de zona horaria al comparar solo fechas:
        const todayString = today.toISOString().split('T')[0];
        const expString = enrollment.next_payment_date;

        if (expString >= todayString) {
             // Entonces la base para sumar no es hoy, es la fecha de vencimiento que ya tiene
             newExpirationDate = new Date(enrollment.next_payment_date);
             // Le sumamos 1 día extra para asegurar que no se solape si paga el mismo día que vence
             // O simplemente usamos esa fecha como base.
        }
    }
    
    // Sumamos 30 días a la base calculada (sea HOY o sea la FECHA FUTURA)
    newExpirationDate.setDate(newExpirationDate.getDate() + 30);
    // -----------------------------------

    const newPlanId = enrollment.next_plan_id || enrollment.plan_id;
    const planChanged = enrollment.next_plan_id !== null;

    // 2. Registrar en historial
    const { error: historyError } = await supabase
      .from("payment_history")
      .insert([{
        user_id,
        plan_id: enrollment.plan_id, 
        amount: Number(amount) || 0, 
        payment_date: today.toISOString().split('T')[0],
        payment_method: payment_method || "Efectivo",
        notes: notes || null
      }]);

    if (historyError) throw historyError;

    // 3. Actualizar enrollment
    const { data, error } = await supabase
      .from("enrollments")
      .update({
        plan_id: newPlanId,
        next_plan_id: null,
        payment_status: "Al día",
        last_payment_date: today.toISOString().split('T')[0],
        next_payment_date: newExpirationDate.toISOString().split('T')[0] // <--- Usamos la nueva fecha acumulada
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      message: planChanged 
        ? "Pago registrado y cambio de plan aplicado" 
        : "Pago registrado exitosamente (Membresía extendida)", 
      enrollment: data,
      plan_changed: planChanged
    });

  } catch (err) {
    console.error("Error en register-payment:", err);
    res.status(500).json({ error: err.message || "Error interno del servidor" });
  }
});

app.get("/api/admin/payment-history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payment_history")
      .select(`
        id, user_id, plan_id, amount, payment_date, payment_method, notes,
        users (id, nombre_completo, username),
        plans (id, name)
      `)
      .order("payment_date", { ascending: false });

    if (error) throw error;

    const formattedHistory = data.map(payment => ({
      id: payment.id,
      user_id: payment.user_id,
      user_name: payment.users.nombre_completo,
      username: payment.users.username,
      plan_name: payment.plans.name,
      amount: payment.amount,
      payment_date: payment.payment_date,
      payment_method: payment.payment_method,
      notes: payment.notes
    }));

    res.json(formattedHistory);
  } catch (err) {
    console.error("Error al traer historial:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/deactivate-membership", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "Falta user_id" });

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .update({ 
        status: "Inactivo",
        payment_status: "Vencido",
        next_plan_id: null 
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: "Membresía desactivada", enrollment: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al desactivar membresía" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});