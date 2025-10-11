// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditPlanModal from "../components/EditPlanModal";
import { useNavigate } from "react-router-dom";

// ===== Styled Components =====
const Container = styled.div`
  padding: 20px 40px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  background: #23234a;
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  align-items: center;
`;

const NavItem = styled.div`
  margin-right: 16px;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  &:hover { opacity: 0.8; }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #23234a;
  margin-bottom: 24px;
  text-align: center;
`;

const SectionContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #e9ecf3;
  border-bottom: 2px solid #ccc;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  background: ${(props) => props.bg || "#e94560"};
  color: #fff;
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-right: ${(props) => props.marginRight || "8px"};
  &:hover { opacity: 0.85; }
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex: 1;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex: 1;
`;

const ErrorMsg = styled.div`
  color: #e94560;
  margin-top: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top:0; left:0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: ${(props)=>props.show?"flex":"none"};
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
`;

const DraftCard = styled.div`
  border: 2px dashed #e94560;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  background: #fff5f7;
`;

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Usuarios");
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: "", price: "", duration: "", label: "", highlight: "", desc: ""
  });
  const [draftPlan, setDraftPlan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({user:"", amount:"", method:""});
  const [error, setError] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [userPlanSelection, setUserPlanSelection] = useState({});

  // ===== Fetch usuarios =====
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();

      // Para cada usuario, traer membresía activa
      const usersWithStatus = await Promise.all(
        data.map(async u => {
          const resp = await fetch(`http://localhost:5000/api/user/${u.id}/membership`);
          const membership = await resp.json();
          return {
            ...u,
            membership
          };
        })
      );

      setUsers(usersWithStatus);
    } catch (err) { console.error(err); }
  };

  // ===== Fetch planes =====
  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/plans");
      if (!res.ok) throw new Error("Error al cargar planes");
      const data = await res.json();
      setPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchPayments = async () => { setPayments([]); };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
    fetchPayments();
  }, []);

  // ===== Crear borrador =====
  const handleCreateDraft = (e) => {
    e.preventDefault();
    setError("");

    const priceNum = Number(formData.price);
    const durationNum = Number(formData.duration);

    if (!formData.name || isNaN(priceNum) || isNaN(durationNum)) {
      setError("Nombre, precio y duración son obligatorios y deben ser números válidos");
      return;
    }

    setDraftPlan({
      ...formData,
      price: priceNum,
      duration: durationNum
    });
  };

  // ===== Guardar plan definitivo =====
  const handleSavePlan = async () => {
    if(!draftPlan) return;
    const payload = {
      ...draftPlan,
      price: Number(draftPlan.price),
      duration: Number(draftPlan.duration)
    };

    if(!payload.name || isNaN(payload.price) || isNaN(payload.duration)){
      setError("Nombre, precio y duración son obligatorios y deben ser números válidos");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if(!res.ok){
        const text = await res.text();
        console.error("Error backend:", text);
        throw new Error("Error al crear plan");
      }

      await fetchPlans();
      setDraftPlan(null);
      setFormData({ name:"", price:"", duration:"", label:"", highlight:"", desc:"" });
      setError("");
    } catch(err) {
      console.error(err);
      setError("Error al crear plan");
    }
  };

  // ===== Eliminar plan =====
  const handleDeletePlan = async (plan)=>{
    if(!window.confirm(`Eliminar plan "${plan.name}"?`)) return;
    try{
      const res = await fetch(`http://localhost:5000/api/admin/plans/${plan.id}`,{method:"DELETE"});
      if(!res.ok) throw new Error("Error al eliminar plan");
      await fetchPlans();
    }catch(err){ console.error(err); alert("Error al eliminar plan"); }
  };

  // ===== Agregar pago =====
  const handleAddPayment = (e)=>{
    e.preventDefault();
    if(!newPayment.user || !newPayment.amount || !newPayment.method) return;
    setPayments([...payments, {...newPayment, id: payments.length+1}]);
    setNewPayment({user:"", amount:"", method:""});
  };

  // ===== Asignar plan a usuario =====
  const handleAssignPlan = async (userId) => {
    const planId = userPlanSelection[userId];
    if(!planId) { alert("Selecciona un plan"); return; }

    try {
      const res = await fetch("http://localhost:5000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, plan_id: planId })
      });
      if(!res.ok) throw new Error("Error al asignar plan");
      alert("Membresía activada correctamente");
      fetchUsers();
    } catch(err) {
      console.error(err);
      alert("Error al activar membresía");
    }
  };

  // ===== Desactivar membresía =====
  const handleDeactivate = async (userId) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/deactivate-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      if(!res.ok) throw new Error("Error al desactivar membresía");
      alert("Membresía desactivada correctamente");
      fetchUsers();
    } catch(err) {
      console.error(err);
      alert("Error al desactivar membresía");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowLogout(false);
    navigate("/login");
  };

  return (
    <Container>
      {/* Navbar */}
      <Navbar>
        <div style={{display:"flex"}}>
          {["Usuarios","Planes","Pagos","Clases","Programas","Instalaciones"].map(sec=>(<NavItem key={sec} active={activeSection===sec} onClick={()=>setActiveSection(sec)}>{sec}</NavItem>))}
        </div>
        <Button onClick={()=>setShowLogout(true)}>Cerrar sesión</Button>
      </Navbar>

      {/* Título sección */}
      <Title>{activeSection}</Title>

      {/* Usuarios */}
      {activeSection==="Usuarios" && (
        <SectionContainer>
          <Table>
            <thead>
              <tr><Th>ID</Th><Th>Nombre completo</Th><Th>Usuario</Th><Th>Plan</Th><Th>Acción</Th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <Td>{u.id}</Td>
                  <Td>{u.fullname}</Td>
                  <Td>{u.username}</Td>
                  <Td>
                    <Select
                      value={userPlanSelection[u.id] || ""}
                      onChange={(e)=>setUserPlanSelection({...userPlanSelection,[u.id]: Number(e.target.value)})}
                    >
                      <option value="">Selecciona plan</option>
                      {plans.map(p=>(<option key={p.id} value={p.id}>{p.name}</option>))}
                    </Select>
                  </Td>
                  <Td>
                    {u.membership?.active 
                      ? <Button bg="#ff4444" onClick={()=>handleDeactivate(u.id)}>Desactivar</Button>
                      : <Button bg="#28a745" onClick={()=>handleAssignPlan(u.id)}>Activar</Button>
                    }
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </SectionContainer>
      )}

      {/* Aquí irían secciones Planes, Pagos, etc. */}
      {activeSection==="Planes" && <SectionContainer><p>Sección planes...</p></SectionContainer>}
      {activeSection==="Pagos" && <SectionContainer><p>Sección pagos...</p></SectionContainer>}

      {/* Modal Cerrar Sesión */}
      <ModalOverlay show={showLogout}>
        <ModalContent>
          <p>¿Deseas cerrar sesión?</p>
          <div style={{marginTop:"16px"}}>
            <Button onClick={handleLogout}>Sí, cerrar</Button>
            <Button bg="#ccc" marginRight="0" onClick={()=>setShowLogout(false)} style={{marginLeft:"12px"}}>Cancelar</Button>
          </div>
        </ModalContent>
      </ModalOverlay>

      {/* Modal Editar Plan */}
      {editPlan && <EditPlanModal plan={editPlan} onClose={()=>{ setEditPlan(null); fetchPlans(); }} />}
    </Container>
  );
}
