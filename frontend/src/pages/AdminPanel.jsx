// src/pages/AdminPanel.jsx - VERSIÓN VISUAL MEJORADA
import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import EditPlanModal from "../components/EditPlanModal";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaExclamationTriangle, FaWhatsapp, FaExchangeAlt, FaTimes, FaUserFriends, FaDumbbell, FaMoneyBillWave, FaSignOutAlt } from "react-icons/fa";

// ==========================================
//  🎨 STYLED COMPONENTS (DISEÑO RENOVADO)
// ==========================================

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 30px 5%;
  max-width: 1600px;
  margin: 0 auto;
  font-family: 'Segoe UI', 'Roboto', sans-serif; /* Tipografía más moderna */
  background: #f0f2f5; /* Gris azulado muy suave, típico de dashboards modernos */
  min-height: 100vh;
  color: #1a1a1a;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  background: #23234a;
  color: #fff;
  padding: 15px 30px;
  border-radius: 16px;
  margin-bottom: 35px;
  align-items: center;
  box-shadow: 0 10px 25px rgba(35, 35, 74, 0.2); /* Sombra elegante */
`;

const NavItem = styled.div`
  margin-right: 8px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${(props) => (props.$active ? "#fff" : "#aab0c4")};
  background: ${(props) => (props.$active ? "rgba(233, 69, 96, 1)" : "transparent")};
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover { 
    background: ${(props) => (props.$active ? "#d63250" : "rgba(255,255,255,0.1)")}; 
    color: white;
  }
`;

const AlertBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border: 2px solid #23234a; /* Borde para separarlo del fondo */
`;

const Title = styled.h2`
  font-size: 2.2rem;
  color: #23234a;
  margin-bottom: 30px;
  font-weight: 800;
  letter-spacing: -0.5px;
  animation: ${fadeIn} 0.5s ease;
`;

// Contenedor tipo "Card" para las secciones
const SectionContainer = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05); /* Sombra muy suave */
  margin-bottom: 30px;
  border: 1px solid rgba(0,0,0,0.03);
  animation: ${fadeIn} 0.5s ease;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  align-items: center;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid #e1e4e8;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid transparent;
  background: white;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  
  &:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid #e1e4e8;
  font-size: 0.95rem;
  cursor: pointer;
  background: white;
  font-weight: 500;
  color: #444;
  
  &:focus {
    outline: none;
    border-color: #e94560;
  }
`;

// Tabla Rediseñada
const Table = styled.table`
  width: 100%;
  border-collapse: separate; 
  border-spacing: 0;
  margin-top: 10px;
`;

const Th = styled.th`
  text-align: left;
  padding: 18px 16px;
  background: #f8f9fa;
  color: #6c757d;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e9ecef;
  cursor: ${props => props.$sortable ? "pointer" : "default"};
  
  &:first-child { border-top-left-radius: 10px; }
  &:last-child { border-top-right-radius: 10px; }

  &:hover {
    color: ${props => props.$sortable ? "#e94560" : "#6c757d"};
  }
  
  svg { margin-left: 6px; vertical-align: middle; }
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f3f5;
  color: #2d3436;
  font-size: 0.95rem;
  background: white;
  transition: background 0.2s;

  /* Efecto hover en la fila completa */
  ${Table} tr:hover & {
    background: #fafafa;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.$status) {
      case "Activa":
      case "Al día":
        return css`background: #e6fcf5; color: #0ca678; border: 1px solid #0ca67833;`;
      case "Vencida":
      case "Vencido":
        return css`background: #fff5f5; color: #fa5252; border: 1px solid #fa525233;`;
      case "Por vencer":
        return css`background: #fff9db; color: #f59f00; border: 1px solid #f59f0033;`;
      default: // Sin membresía
        return css`background: #f1f3f5; color: #868e96; border: 1px solid #ced4da;`;
    }
  }}
  display: inline-block;
`;

const Button = styled.button`
  background: ${(props) => props.$bg || "#e94560"};
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-right: ${(props) => props.$marginRight || "8px"};
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* Sombra suave en botones */
  
  &:hover { 
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
  
  &:active { transform: translateY(0); }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Inputs mejorados
const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 0.9rem;
  background-color: #fff;
  cursor: pointer;
  transition: border 0.2s;
  
  &:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.1);
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  flex: 1;
  min-width: 240px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  width: 100%;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
`;

const ErrorMsg = styled.div`
  color: #d63031;
  background: #ff767522;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ff7675;
  margin-top: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Modal más limpio
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(35, 35, 74, 0.7); /* Azul oscuro translúcido */
  backdrop-filter: blur(4px); /* Efecto de desenfoque */
  display: ${(props) => (props.$show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 500px;
  position: relative;
  
  h3 { margin-top: 0; }
  
  p {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 25px;
  }
`;

// Estadísticas con Grid y mejor diseño
const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
  margin-bottom: 35px;
`;

const StatCard = styled.div`
  background: white; /* Tarjetas blancas más limpias */
  color: #333;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
  border-bottom: 4px solid ${props => props.$color1}; /* Línea de color abajo */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
  
  h3 {
    font-size: 2.5rem;
    margin: 10px 0 0 0;
    font-weight: 800;
    color: #23234a;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  /* Icono decorativo de fondo */
  .icon-bg {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 6rem;
    opacity: 0.05;
    color: #000;
    transform: rotate(15deg);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #a0a0a0;
  
  svg {
    font-size: 5rem;
    margin-bottom: 20px;
    color: #e0e0e0;
  }
  
  p {
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: background 0.2s;
  
  &:hover { background: #e9ecef; }
  
  input {
    width: 20px;
    height: 20px;
    accent-color: #e94560;
    cursor: pointer;
  }
`;

const AlertBox = styled.div`
  background: ${props => props.$type === "danger" ? "#fff5f5" : "#fff9db"};
  border: 1px solid ${props => props.$type === "danger" ? "#ffc9c9" : "#ffec99"};
  border-left: 5px solid ${props => props.$type === "danger" ? "#fa5252" : "#fab005"};
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  
  svg {
    color: ${props => props.$type === "danger" ? "#fa5252" : "#fab005"};
    font-size: 1.8rem;
  }
  
  div {
    flex: 1;
    h4 {
      margin: 0 0 6px 0;
      color: ${props => props.$type === "danger" ? "#c92a2a" : "#e67700"};
      font-size: 1.1rem;
    }
    p {
      margin: 0;
      color: #555;
      font-size: 0.95rem;
    }
  }
`;

const PlanChangeInfo = styled.div`
  margin-top: 8px;
  padding: 6px 10px;
  background: #fff3bf;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #e67700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
`;

// ==========================================
//  LÓGICA DEL COMPONENTE (SIN CAMBIOS)
// ==========================================

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Usuarios");
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    label: "",
    highlight: false,
    desc: "",
    specs: "",
    bonus: "",
    show_in_landing: false
  });
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showLogout, setShowLogout] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [userPlanSelection, setUserPlanSelection] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    payment_method: "Efectivo",
    notes: ""
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();

      const usersWithStatus = await Promise.all(
        data.map(async u => {
          try {
            const resp = await fetch(`http://localhost:5000/api/user/${u.id}/membership`);
            const membership = await resp.json();
            return {
              ...u,
              membership,
              membershipStatus: membership?.active ? "Activa" : membership ? "Vencida" : "Sin membresía"
            };
          } catch {
            return { ...u, membership: null, membershipStatus: "Sin membresía" };
          }
        })
      );

      setUsers(usersWithStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/plans");
      if (!res.ok) throw new Error("Error al cargar planes");
      const data = await res.json();
      setPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/payments");
      if (!res.ok) throw new Error("Error al cargar pagos");
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
      setPayments([]);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/payment-history");
      if (!res.ok) throw new Error("Error al cargar historial");
      const data = await res.json();
      setPaymentHistory(data);
    } catch (err) {
      console.error(err);
      setPaymentHistory([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
    fetchPayments();
    fetchPaymentHistory();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.duration) {
      setError("Nombre, precio y duración son obligatorios");
      return;
    }

    if (formData.show_in_landing) {
      const plansInLanding = plans.filter(p => p.show_in_landing).length;
      if (plansInLanding >= 3) {
        setError("Ya hay 3 planes marcados para mostrar en la landing. Desmarca uno primero.");
        return;
      }
    }

    const specsArray = formData.specs
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => line.trim());

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      duration: formData.duration,
      label: formData.label || null,
      highlight: formData.highlight,
      desc: formData.desc || null,
      specs: specsArray.length > 0 ? specsArray : null,
      bonus: formData.bonus || null,
      show_in_landing: formData.show_in_landing
    };

    try {
      const res = await fetch("http://localhost:5000/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear plan");
      }

      alert("Plan creado exitosamente");
      await fetchPlans();

      setFormData({
        name: "",
        price: "",
        duration: "",
        label: "",
        highlight: false,
        desc: "",
        specs: "",
        bonus: "",
        show_in_landing: false
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al crear plan");
    }
  };

  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`¿Eliminar el plan "${plan.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/plans/${plan.id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error al eliminar plan");

      alert("Plan eliminado correctamente");
      await fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar plan");
    }
  };

  const handleToggleLanding = async (plan) => {
    if (!plan.show_in_landing) {
      const plansInLanding = plans.filter(p => p.show_in_landing).length;
      if (plansInLanding >= 3) {
        alert("Ya hay 3 planes en la landing. Desmarca uno primero.");
        return;
      }
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/plans/${plan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...plan, show_in_landing: !plan.show_in_landing })
      });

      if (!res.ok) throw new Error("Error al actualizar plan");
      await fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar plan");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "Todos" ||
      user.membershipStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "planName") {
      aValue = a.membership?.name || "";
      bValue = b.membership?.name || "";
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp style={{ color: "#e94560" }} /> : <FaSortDown style={{ color: "#e94560" }} />;
  };

  const stats = {
    total: users.length,
    activos: users.filter(u => u.membershipStatus === "Activa").length,
    vencidos: users.filter(u => u.membershipStatus === "Vencida").length,
    sinMembresia: users.filter(u => u.membershipStatus === "Sin membresía").length
  };

  const paymentsOverdue = payments.filter(p => p.payment_status === "Vencido").length;

  const handleSchedulePlanChange = async (userId) => {
    const nextPlanId = userPlanSelection[userId];
    if (!nextPlanId) {
      alert("Selecciona un plan");
      return;
    }

    const user = users.find(u => u.id === userId);
    const currentPlanId = user?.membership?.id;

    if (nextPlanId === currentPlanId) {
      alert("El plan seleccionado es el mismo que el actual");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/schedule-plan-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, next_plan_id: nextPlanId })
      });
      if (!res.ok) throw new Error("Error al programar cambio de plan");
      alert("Cambio de plan programado. Se aplicará en el próximo pago.");
      fetchUsers();
      fetchPayments();
      setUserPlanSelection({ ...userPlanSelection, [userId]: "" });
    } catch (err) {
      console.error(err);
      alert("Error al programar cambio de plan");
    }
  };

  const handleCancelPlanChange = async (userId) => {
    if (!window.confirm("¿Cancelar el cambio de plan programado?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/cancel-plan-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      if (!res.ok) throw new Error("Error al cancelar cambio de plan");
      alert("Cambio de plan cancelado");
      fetchUsers();
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert("Error al cancelar cambio de plan");
    }
  };

  const handleAssignPlan = async (userId) => {
    const planId = userPlanSelection[userId];
    if (!planId) {
      alert("Selecciona un plan");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, plan_id: planId })
      });
      if (!res.ok) throw new Error("Error al asignar plan");
      alert("Membresía activada correctamente");
      fetchUsers();
      fetchPayments();
      fetchPaymentHistory();
      setUserPlanSelection({ ...userPlanSelection, [userId]: "" });
    } catch (err) {
      console.error(err);
      alert("Error al activar membresía");
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm("¿Deseas desactivar esta membresía?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/deactivate-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      if (!res.ok) throw new Error("Error al desactivar membresía");
      alert("Membresía desactivada correctamente");
      fetchUsers();
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert("Error al desactivar membresía");
    }
  };

  const handleRegisterPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentFormData({
      amount: payment.plan_price || "",
      payment_method: "Efectivo",
      notes: ""
    });
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!selectedPayment) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/register-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedPayment.user_id,
          amount: parseFloat(paymentFormData.amount),
          payment_method: paymentFormData.payment_method,
          notes: paymentFormData.notes
        })
      });
      if (!res.ok) throw new Error("Error al registrar pago");
      const result = await res.json();
      
      if (result.plan_changed) {
        alert("Pago registrado y cambio de plan aplicado correctamente!");
      } else {
        alert("Pago registrado correctamente");
      }
      
      setShowPaymentModal(false);
      setSelectedPayment(null);
      fetchUsers();
      fetchPayments();
      fetchPaymentHistory();
    } catch (err) {
      console.error(err);
      alert("Error al registrar pago");
    }
  };

  const sendWhatsAppReminder = (payment) => {
    const message = `Hola ${payment.user_name}, te recordamos que tu pago del plan ${payment.plan_name} está ${payment.payment_status === "Vencido" ? "vencido" : "por vencer"}. Por favor, realiza tu pago lo antes posible.`;
    window.open(`https://wa.me/51900000000?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowLogout(false);
    navigate("/login");
  };

  return (
    <Container>
      <Navbar>
        <div style={{ display: "flex", alignItems: "center" }}>
          {["Usuarios", "Planes", "Pagos"].map(sec => (
            <NavItem
              key={sec}
              $active={activeSection === sec}
              onClick={() => setActiveSection(sec)}
            >
              {sec}
              {sec === "Pagos" && paymentsOverdue > 0 && (
                <AlertBadge>{paymentsOverdue}</AlertBadge>
              )}
            </NavItem>
          ))}
        </div>
        <Button 
          onClick={() => setShowLogout(true)} 
          $bg="rgba(255,255,255,0.1)"
          style={{ border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <FaSignOutAlt /> Salir
        </Button>
      </Navbar>

      <Title>{activeSection}</Title>

      {/* Sección Usuarios */}
      {activeSection === "Usuarios" && (
        <>
          <StatsBar>
            <StatCard $color1="#20c997">
              <FaUserFriends className="icon-bg"/>
              <p>Membresías Activas</p>
              <h3>{stats.activos}</h3>
            </StatCard>
            <StatCard $color1="#ff6b6b">
              <FaExclamationTriangle className="icon-bg"/>
              <p>Vencidos</p>
              <h3>{stats.vencidos}</h3>
            </StatCard>
            <StatCard $color1="#adb5bd">
              <FaUserFriends className="icon-bg"/>
              <p>Inactivos</p>
              <h3>{stats.sinMembresia}</h3>
            </StatCard>
            <StatCard $color1="#339af0">
              <FaDumbbell className="icon-bg"/>
              <p>Total Usuarios</p>
              <h3>{stats.total}</h3>
            </StatCard>
          </StatsBar>

          <SectionContainer>
            <SearchBar>
              <FaSearch style={{ color: "#adb5bd", fontSize: "1.1rem" }} />
              <SearchInput
                type="text"
                placeholder="Buscar por nombre o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FilterSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Activa">Activa</option>
                <option value="Vencida">Vencida</option>
                <option value="Sin membresía">Sin membresía</option>
              </FilterSelect>
            </SearchBar>

            {sortedUsers.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr>
                      <Th $sortable onClick={() => handleSort("id")}>
                        ID {getSortIcon("id")}
                      </Th>
                      <Th $sortable onClick={() => handleSort("nombre_completo")}>
                        Nombre {getSortIcon("nombre_completo")}
                      </Th>
                      <Th $sortable onClick={() => handleSort("username")}>
                        Usuario {getSortIcon("username")}
                      </Th>
                      <Th $sortable onClick={() => handleSort("planName")}>
                        Plan Actual {getSortIcon("planName")}
                      </Th>
                      <Th $sortable onClick={() => handleSort("membershipStatus")}>
                        Estado {getSortIcon("membershipStatus")}
                      </Th>
                      <Th>Gestión de Plan</Th>
                      <Th>Acción</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map(u => (
                      <tr key={u.id}>
                        <Td>#{u.id}</Td>
                        <Td>
                          <div style={{ fontWeight: "600" }}>{u.nombre_completo}</div>
                        </Td>
                        <Td style={{ color: "#868e96" }}>@{u.username}</Td>
                        <Td>
                          <div style={{ fontWeight: "500" }}>{u.membership?.name || "—"}</div>
                          {u.membership?.next_plan && (
                            <PlanChangeInfo>
                              <FaExchangeAlt size={10} />
                              {u.membership.next_plan.name}
                            </PlanChangeInfo>
                          )}
                        </Td>
                        <Td>
                          <StatusBadge $status={u.membershipStatus}>
                            {u.membershipStatus}
                          </StatusBadge>
                        </Td>
                        <Td>
                          {u.membershipStatus === "Activa" ? (
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <Select
                                value={userPlanSelection[u.id] || ""}
                                onChange={(e) =>
                                  setUserPlanSelection({
                                    ...userPlanSelection,
                                    [u.id]: Number(e.target.value)
                                  })
                                }
                                style={{ width: "160px" }}
                              >
                                <option value="">Cambiar Plan...</option>
                                {plans.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </Select>
                              {userPlanSelection[u.id] && (
                                <Button 
                                  $bg="#fcc419" 
                                  onClick={() => handleSchedulePlanChange(u.id)}
                                  title="Programar cambio"
                                  style={{ padding: "8px 10px" }}
                                >
                                  <FaExchangeAlt />
                                </Button>
                              )}
                              {u.membership?.next_plan && (
                                <Button 
                                  $bg="#adb5bd" 
                                  onClick={() => handleCancelPlanChange(u.id)}
                                  title="Cancelar cambio programado"
                                  style={{ padding: "8px 10px" }}
                                >
                                  <FaTimes />
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Select
                              value={userPlanSelection[u.id] || ""}
                              onChange={(e) =>
                                setUserPlanSelection({
                                  ...userPlanSelection,
                                  [u.id]: Number(e.target.value)
                                })
                              }
                            >
                              <option value="">Selecciona plan...</option>
                              {plans.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Td>
                        <Td>
                          {u.membershipStatus === "Activa" ? (
                            <Button $bg="#ff6b6b" onClick={() => handleDeactivate(u.id)}>
                              Desactivar
                            </Button>
                          ) : (
                            <Button $bg="#20c997" onClick={() => handleAssignPlan(u.id)}>
                              Activar
                            </Button>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <EmptyState>
                <FaSearch />
                <p>No se encontraron usuarios con los filtros aplicados</p>
              </EmptyState>
            )}
          </SectionContainer>
        </>
      )}

      {/* Sección Planes */}
      {activeSection === "Planes" && (
        <>
          <SectionContainer>
            <h3 style={{ marginBottom: "25px", color: "#23234a", fontSize: "1.5rem" }}>Crear Nuevo Plan</h3>
            <Form onSubmit={handleCreatePlan}>
              <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                <Input
                  type="text"
                  placeholder="Nombre del plan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Precio (S/)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  style={{ maxWidth: "150px" }}
                />
                 <Input
                  type="text"
                  placeholder="Duración (ej: 1 mes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  style={{ maxWidth: "200px" }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                <Input
                  type="text"
                  placeholder="Etiqueta (ej: Popular)"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Bonus (ej: 🎁 2 meses gratis)"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                 <Input
                  type="text"
                  placeholder="Breve descripción del plan..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>

              <div style={{ width: "100%", display: "flex", gap: "20px" }}>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                  />
                  <span>Destacar visualmente</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={formData.show_in_landing}
                    onChange={(e) => setFormData({ ...formData, show_in_landing: e.target.checked })}
                  />
                  <span>Mostrar en Landing Page (máx. 3)</span>
                </CheckboxLabel>
              </div>

              <TextArea
                placeholder="Características del plan (una por línea)&#10;Ej:&#10;Acceso ilimitado&#10;Toalla gratis"
                value={formData.specs}
                onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                rows={4}
              />
              <Button type="submit" style={{ width: "100%", padding: "14px", fontSize: "1rem" }}>
                Crear Plan
              </Button>
            </Form>
            {error && <ErrorMsg><FaExclamationTriangle /> {error}</ErrorMsg>}
          </SectionContainer>

          <SectionContainer>
            <h3 style={{ marginBottom: "20px", color: "#23234a" }}>
              Planes Existentes <span style={{fontSize: "1rem", color: "#888", fontWeight: "normal"}}>({plans.length})</span>
            </h3>
            {plans.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Precio</Th>
                    <Th>Duración</Th>
                    <Th>Etiqueta</Th>
                    <Th>Destacado</Th>
                    <Th>En Landing</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <Td>#{plan.id}</Td>
                      <Td><strong>{plan.name}</strong></Td>
                      <Td style={{ color: "#e94560", fontWeight: "bold" }}>S/ {plan.price}</Td>
                      <Td>{plan.duration}</Td>
                      <Td>
                        {plan.label ? <StatusBadge $status="Activa">{plan.label}</StatusBadge> : <span style={{color: "#ccc"}}>—</span>}
                      </Td>
                      <Td>{plan.highlight ? "⭐ Sí" : "No"}</Td>
                      <Td>
                        <CheckboxLabel style={{ justifyContent: "center", margin: 0, padding: "5px", background: "transparent", border: "none" }}>
                          <input
                            type="checkbox"
                            checked={plan.show_in_landing || false}
                            onChange={() => handleToggleLanding(plan)}
                          />
                        </CheckboxLabel>
                      </Td>
                      <Td>
                        <Button $bg="#339af0" onClick={() => setEditPlan(plan)} style={{ padding: "8px 12px" }}>
                          Editar
                        </Button>
                        <Button $bg="#ff6b6b" $marginRight="0" onClick={() => handleDeletePlan(plan)} style={{ padding: "8px 12px" }}>
                          Eliminar
                        </Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState>
                <p>No hay planes creados todavía</p>
              </EmptyState>
            )}
          </SectionContainer>
        </>
      )}

      {/* Sección Pagos */}
      {activeSection === "Pagos" && (
        <>
          {paymentsOverdue > 0 && (
            <AlertBox $type="danger">
              <FaExclamationTriangle />
              <div>
                <h4>¡Atención! Tienes {paymentsOverdue} pago(s) vencido(s)</h4>
                <p>Revisa la tabla y contacta a los usuarios para actualizar sus pagos.</p>
              </div>
            </AlertBox>
          )}

          <SectionContainer>
            <h3 style={{ marginBottom: "20px", color: "#23234a" }}>
              Estado de Pagos ({payments.length} membresías activas)
            </h3>
            {payments.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Usuario</Th>
                    <Th>Plan Actual</Th>
                    <Th>Precio</Th>
                    <Th>Estado Pago</Th>
                    <Th>Último Pago</Th>
                    <Th>Próximo Pago</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <Td>
                        <div style={{fontWeight: "600"}}>{payment.user_name}</div>
                        <div style={{ color: "#868e96", fontSize: "0.85rem" }}>@{payment.username}</div>
                      </Td>
                      <Td>
                        {payment.plan_name}
                        {payment.next_plan_name && (
                          <div style={{marginTop: "5px"}}>
                             <PlanChangeInfo>
                                <FaExchangeAlt size={10} />
                                Próx: {payment.next_plan_name}
                             </PlanChangeInfo>
                          </div>
                        )}
                      </Td>
                      <Td style={{ fontWeight: "bold" }}>S/ {payment.plan_price}</Td>
                      <Td>
                        <StatusBadge $status={payment.payment_status}>
                          {payment.payment_status}
                        </StatusBadge>
                      </Td>
                      <Td>{payment.last_payment_date || "—"}</Td>
                      <Td style={{ fontWeight: "600", color: payment.payment_status === "Vencido" ? "#fa5252" : "inherit" }}>
                          {payment.next_payment_date || "—"}
                      </Td>
                      <Td>
                        <div style={{display: "flex", gap: "5px"}}>
                        {payment.payment_status === "Vencido" || payment.payment_status === "Por vencer" ? (
                          <>
                            <Button
                              $bg="#25D366"
                              onClick={() => sendWhatsAppReminder(payment)}
                              title="Enviar recordatorio por WhatsApp"
                              style={{ padding: "8px 12px" }}
                            >
                              <FaWhatsapp />
                            </Button>
                            {payment.payment_status === "Vencido" && (
                              <Button
                                $bg="#ff6b6b"
                                onClick={() => handleDeactivate(payment.user_id)}
                                title="Desactivar membresía"
                                style={{ padding: "8px 12px" }}
                              >
                                <FaTimes />
                              </Button>
                            )}
                          </>
                        ) : null}
                        <Button
                          $bg="#339af0"
                          $marginRight="0"
                          onClick={() => handleRegisterPayment(payment)}
                          title="Registrar pago"
                          style={{ padding: "8px 12px" }}
                        >
                          <FaMoneyBillWave /> Pagar
                        </Button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState>
                <p>No hay pagos pendientes para revisar</p>
              </EmptyState>
            )}
          </SectionContainer>

          {/* Historial de Pagos */}
          <SectionContainer>
            <h3 style={{ marginBottom: "20px", color: "#23234a" }}>
              Historial de Pagos ({paymentHistory.length} registros)
            </h3>
            {paymentHistory.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Usuario</Th>
                    <Th>Plan</Th>
                    <Th>Monto</Th>
                    <Th>Método</Th>
                    <Th>Notas</Th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map(record => (
                    <tr key={record.id}>
                      <Td>{record.payment_date}</Td>
                      <Td>
                        <div style={{fontWeight: "600"}}>{record.user_name}</div>
                      </Td>
                      <Td>{record.plan_name}</Td>
                      <Td style={{ fontWeight: "bold", color: "#0ca678" }}>S/ {record.amount}</Td>
                      <Td><span style={{background: "#f1f3f5", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem"}}>{record.payment_method}</span></Td>
                      <Td style={{ color: "#868e96", fontStyle: "italic" }}>{record.notes || "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState>
                <p>No hay historial de pagos todavía</p>
              </EmptyState>
            )}
          </SectionContainer>
        </>
      )}

      {/* Modal Cerrar Sesión */}
      <ModalOverlay $show={showLogout}>
        <ModalContent>
          <h3 style={{color: "#23234a", marginBottom: "15px"}}>¿Cerrar Sesión?</h3>
          <p>Estás a punto de salir del panel de administración.</p>
          <div style={{ marginTop: "25px", display: "flex", gap: "15px", justifyContent: "center" }}>
            <Button onClick={handleLogout} style={{ minWidth: "120px", justifyContent: "center" }}>Sí, salir</Button>
            <Button
              $bg="#f1f3f5"
              $marginRight="0"
              onClick={() => setShowLogout(false)}
              style={{ color: "#333", minWidth: "120px", justifyContent: "center" }}
            >
              Cancelar
            </Button>
          </div>
        </ModalContent>
      </ModalOverlay>

      {/* Modal Registrar Pago */}
      <ModalOverlay $show={showPaymentModal}>
        <ModalContent style={{ textAlign: "left", maxWidth: "500px" }}>
          <h3 style={{ marginBottom: "25px", color: "#23234a", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
             Registrar Nuevo Pago
          </h3>
          {selectedPayment && (
            <>
              <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                <p style={{ margin: "0 0 5px 0", color: "#666" }}>Usuario: <strong style={{color: "#333"}}>{selectedPayment.user_name}</strong></p>
                <p style={{ margin: "0", color: "#666" }}>Plan: <strong style={{color: "#333"}}>{selectedPayment.plan_name}</strong></p>
                {selectedPayment.next_plan_name && (
                   <div style={{ marginTop: "10px", padding: "10px", background: "#fff9db", borderRadius: "6px", fontSize: "0.9rem", color: "#e67700", border: "1px solid #ffe066" }}>
                      ⚠️ <strong>Nota:</strong> Se aplicará cambio a <u>{selectedPayment.next_plan_name}</u>
                   </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>
                  Monto (S/)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentFormData.amount}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                  placeholder="0.00"
                  style={{ width: "100%", minWidth: "auto", fontSize: "1.1rem", fontWeight: "bold" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>
                  Método de pago
                </label>
                <Select
                  value={paymentFormData.payment_method}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, payment_method: e.target.value })}
                  style={{ width: "100%" }}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                </Select>
              </div>
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>
                  Notas (opcional)
                </label>
                <TextArea
                  value={paymentFormData.notes}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                  placeholder="Ej: Pago adelantado..."
                  rows={2}
                  style={{ width: "100%", minHeight: "80px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <Button onClick={submitPayment} style={{ flex: 1, justifyContent: "center", padding: "12px" }}>
                  Confirmar Pago
                </Button>
                <Button
                  $bg="#f1f3f5"
                  $marginRight="0"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                  }}
                  style={{ flex: 1, justifyContent: "center", color: "#333", padding: "12px" }}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </ModalContent>
      </ModalOverlay>

      {/* Modal Editar Plan */}
      {editPlan && (
        <EditPlanModal
          plan={editPlan}
          onClose={() => {
            setEditPlan(null);
            fetchPlans();
          }}
        />
      )}
    </Container>
  );
}