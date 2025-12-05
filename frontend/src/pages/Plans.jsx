import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaDumbbell, FaRunning, FaUserShield, FaTimes } from "react-icons/fa";
import { API_URL } from "../config";

// ======================
// Styled Components
// ======================
const Page = styled.div`
  min-height: 90vh;
  background: #f9f9f9;
  color: #23234a;
  font-family: "Segoe UI", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 28px;
`;

const Grid = styled.div`
  display: flex;
  gap: 36px;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 320px;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 28px 24px;
  background: ${(props) => props.highlight || "#fff"};
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${(props) =>
    props.highlight ? "0 6px 18px rgba(233,69,96,0.25)" : "0 4px 12px rgba(0,0,0,0.08)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(233, 69, 96, 0.25);
  }

  svg {
    font-size: 2.6rem;
    color: #e94560;
    margin-bottom: 10px;
  }

  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; }
  .label { background: #e94560; color: white; border-radius: 16px; padding: 4px 12px; font-size: 0.8rem; font-weight: bold; display: inline-block; margin-bottom: 10px; }
  .desc { font-size: 0.95rem; color: #555; margin-bottom: 12px; }
  .focus { font-weight: 600; font-size: 0.9rem; color: #23234a; margin-bottom: 8px; }
  .duration { font-size: 0.85rem; color: #777; margin-bottom: 10px; }
  .price { font-size: 1.4rem; font-weight: 700; color: #e94560; margin-bottom: 14px; }
  ul { list-style: none; padding: 0; margin-bottom: 16px; flex-grow: 1;
    li { font-size: 0.95rem; color: #444; margin-bottom: 6px; position: relative; padding-left: 18px;
      &::before { content: "✓"; position: absolute; left: 0; color: #e94560; font-weight: bold; }
    }
  }
  .bonus { font-size: 0.85rem; color: #23234a; background: #ffe6ea; border-radius: 10px; padding: 8px; margin-bottom: 16px; }
  button { background: none; border: 1px solid #e94560; color: #e94560; padding: 8px 20px; border-radius: 20px; font-size: 0.95rem; cursor: pointer; transition: background 0.2s, color 0.2s;
    &:hover { background: #e94560; color: #fff; }
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 999;
`;

const ModalContent = styled.div`
  background: white; padding: 40px 30px; border-radius: 16px; text-align: center;
  width: 95%; max-width: 500px; position: relative;
`;

const CloseBtn = styled.button`
  position: absolute; top: 12px; right: 12px; border: none; background: none; font-size: 1.5rem; cursor: pointer;
`;

const Input = styled.input`
  width: 80%; padding: 10px; margin: 10px 0; border-radius: 12px; border: 1px solid #ccc; font-size: 1rem;
`;

const LoginBtn = styled.button`
  margin-top: 12px; padding: 10px 18px; background: #e94560; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 1rem;
  &:hover { background: #d63250; }
`;

const RegisterBtn = styled.button`
  margin-top: 12px; padding: 10px 18px; background: #23234a; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 1rem;
  &:hover { background: #444; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
  
  h3 {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1rem;
    color: #999;
  }
`;

// ======================
// Componente principal
// ======================
export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⭐ CAMBIO: Usar /api/plans/landing en lugar de /api/plans
    fetch(`${API_URL}/api/plans/landing`)
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al traer planes:", err);
        setLoading(false);
      });
  }, []);

  const handleEnroll = () => setShowModal(true);

  const handleLogin = async () => {
    const { username, password } = loginData;
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const userData = await res.json();
        window.location.href = `/dashboard?username=${userData.username}&id=${userData.id}`;
      } else {
        const error = await res.json();
        alert("Error al iniciar sesión: " + (error.error || error.message));
      }
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  if (loading) {
    return (
      <Page>
        <Title>Planes de Membresía</Title>
        <p>Cargando planes...</p>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Planes de Membresía</Title>
      
      {plans.length === 0 ? (
        <EmptyState>
          <h3>📋 No hay planes disponibles</h3>
          <p>Actualmente no hay planes configurados para mostrar. Por favor, contacta con el gimnasio.</p>
        </EmptyState>
      ) : (
        <Grid>
          {plans.map((plan) => (
            <Card key={plan.id} highlight={plan.highlight}>
              <div>
                <div className="label">{plan.label || "Plan"}</div>
                {plan.name.includes("Básico") ? <FaDumbbell /> : plan.name.includes("Intermedio") ? <FaRunning /> : <FaUserShield />}
                <h3>{plan.name}</h3>
                <div className="desc">{plan.desc}</div>
                <div className="focus">{plan.focus || ""}</div>
                <div className="duration">{plan.duration || ""}</div>
                <div className="price">S/ {plan.price}</div>
                <ul>{plan.specs?.map((spec, i) => <li key={i}>{spec}</li>)}</ul>
                {plan.bonus && <div className="bonus">{plan.bonus}</div>}
              </div>
              <button onClick={() => handleEnroll(plan.id)}>Elegir Plan</button>
            </Card>
          ))}
        </Grid>
      )}

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseBtn onClick={() => setShowModal(false)}><FaTimes /></CloseBtn>
            <h2>¡Inicia sesión o regístrate!</h2>
            <p>Debes estar registrado para inscribirte a un plan.</p>
            <Input
              type="text"
              placeholder="Usuario"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <LoginBtn onClick={handleLogin}>Iniciar sesión</LoginBtn>
            <RegisterBtn onClick={handleRegister}>Registrarse</RegisterBtn>
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
}