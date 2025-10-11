// server.js
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

// ======================
// Conexión a Supabase
// ======================
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ======================
// RUTAS USUARIO
// ======================

// Traer todos los planes
app.get("/api/plans", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al traer planes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Registrar usuario normal
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

// Login de usuario
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

// Inscribir usuario a un plan o actualizar inscripción
app.post("/api/enroll", async (req, res) => {
  const { user_id, plan_id } = req.body;
  if (!user_id || !plan_id) return res.status(400).json({ error: "Faltan datos" });

  try {
    // Revisar si ya existe inscripción
    const { data: existing } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("enrollments")
        .update({ plan_id, status: "Activo" })
        .eq("user_id", user_id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }

    // Crear nueva inscripción
    const { data, error } = await supabase
      .from("enrollments")
      .insert([{ user_id, plan_id, status: "Activo" }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al inscribir plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Obtener membresía activa de usuario
app.get("/api/user/:id/membership", async (req, res) => {
  const userId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        plan_id, status,
        plans (id, name, price, duration)
      `)
      .eq("user_id", userId)
      .single();

    if (error || !data) return res.json(null);

    res.json({
      id: data.plans.id,
      name: data.plans.name,
      active: data.status === "Activo",
      expiresAt: data.expires_at || null
    });
  } catch (err) {
    console.error("Error al obtener membresía:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ======================
// RUTAS ADMIN
// ======================

// Crear plan
app.post("/api/admin/plans", async (req, res) => {
  const { name, price, duration, label, highlight, desc } = req.body;
  if (!name || !price || !duration) return res.status(400).json({ error: "Todos los campos obligatorios" });

  try {
    const { data, error } = await supabase
      .from("plans")
      .insert([{ name, price, duration, label, highlight, desc }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al crear plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Listar todos los planes (admin)
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

// Editar plan
app.put("/api/admin/plans/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
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

// Eliminar plan
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

// Listar todos los usuarios (admin)
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

// ======================
// NUEVA RUTA: Desactivar membresía
// ======================
app.post("/api/admin/deactivate-membership", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "Falta user_id" });

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .update({ status: "Inactivo" })
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

// ======================
// Servidor
// ======================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
