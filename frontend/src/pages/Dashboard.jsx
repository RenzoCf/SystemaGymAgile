// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DashboardNavbar from "../components/DashboardNavbar";
import { FaDumbbell, FaRunning, FaUserShield } from "react-icons/fa";
import { API_URL } from "../config";

// ======================
// Styled Components
// ======================
const Wrapper = styled.div`
  font-family: "Segoe UI", sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
`;

const Section = styled.section`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #23234a;
  margin-bottom: 36px;
  text-align: center;
`;

const MembershipCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 30px 40px;
  max-width: 600px;
  margin: 0 auto 50px auto;
  text-align: center;
  box-shadow: 0 6px 18px rgba(233, 69, 96, 0.25);

  h3 {
    font-size: 2rem;
    margin-bottom: 12px;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #555;
  }

  .status {
    font-weight: 700;
    color: ${props => (props.$isActive ? "#28a745" : "#dc3545")};
  }
`;

const Grid = styled.div`
  display: flex;
  gap: 36px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  width: 300px;
  background: #fff;
  border-radius: 20px;
  padding: 28px 24px;
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

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .label {
    background: #e94560;
    color: white;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
    margin-bottom: 10px;
  }

  .desc {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 12px;
  }

  .duration {
    font-size: 0.85rem;
    color: #777;
    margin-bottom: 10px;
  }

  .price {
    font-size: 1.4rem;
    font-weight: 700;
    color: #e94560;
    margin-bottom: 14px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 16px;
    flex-grow: 1;

    li {
      font-size: 0.95rem;
      color: #444;
      margin-bottom: 6px;
      position: relative;
      padding-left: 18px;

      &::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #e94560;
        font-weight: bold;
      }
    }
  }

  .bonus {
    font-size: 0.85rem;
    color: #23234a;
    background: #ffe6ea;
    border-radius: 10px;
    padding: 8px;
    margin-bottom: 16px;
  }

  button {
    background: #e94560;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: background 0.2s;

    &:hover {
      background: #ff2e63;
    }
  }
`;

// ======================
// Componente principal
// ======================
export default function Dashboard() {
  const [user, setUser] = useState({ username: "", role: "user", id: null });
  const [plans, setPlans] = useState([]);
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const id = params.get("id");
    const role = params.get("role") || "user";
    setUser({ username, id, role });

    // Traer todos los planes
    fetch(`${API_URL}/api/plans`)
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error("Error al traer planes:", err));

    // Traer membresía activa del usuario
    if (id) {
      fetch(`${API_URL}/api/user/${id}/membership`)
        .then((res) => res.json())
        .then((data) => setMembership(data))
        .catch(() => setMembership(null));
    }
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handlePlanClick = (plan) => {
    const message = `Hola, quiero adquirir el plan: ${plan.name} (${plan.price}). Usuario: ${user.username}`;
    window.open(`https://wa.me/51900000000?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Wrapper>
      <DashboardNavbar username={user.username} onLogout={handleLogout} />

      {/* Sección Mis Membresías */}
      <Section id="mis-membresias">
        <Title>Mi Membresía</Title>
        {membership ? (
          <MembershipCard $isActive={membership.active}>
            <h3>{membership.name}</h3>
            <p>
              Estado: <span className="status">{membership.active ? "Activa" : "No activa"}</span>
            </p>
            {membership.active && <p>Vence el: {membership.expiresAt}</p>}
          </MembershipCard>
        ) : (
          <MembershipCard $isActive={false}>
            <h3>Sin membresía</h3>
            <p>Actualmente no tienes ninguna membresía activa.</p>
          </MembershipCard>
        )}
      </Section>

      {/* Sección Planes */}
      <Section id="planes">
        <Title>Planes Disponibles</Title>
        <Grid>
          {plans.map((plan) => (
            <Card key={plan.id} highlight={plan.highlight}>
              <div>
                <div className="label">{plan.label || "Plan"}</div>
                {plan.name.includes("Básico") ? (
                  <FaDumbbell />
                ) : plan.name.includes("Intermedio") ? (
                  <FaRunning />
                ) : (
                  <FaUserShield />
                )}
                <h3>{plan.name}</h3>
                <div className="desc">{plan.desc}</div>
                <div className="duration">{plan.duration || ""}</div>
                <div className="price">{plan.price}</div>
                <ul>
                  {plan.specs?.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
                <div className="bonus">{plan.bonus || ""}</div>
              </div>
              <button onClick={() => handlePlanClick(plan)}>Elegir Plan</button>
            </Card>
          ))}
        </Grid>
      </Section>
    </Wrapper>
  );
}
