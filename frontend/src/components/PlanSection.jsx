import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Importante para la redirección
import PlanCard from "./PlanCard";
import { API_URL } from "../config"; // Asegúrate de importar tu API_URL si lo tienes, o usa localhost directo

const Section = styled.section`
  scroll-margin-top: 30px;
  background: linear-gradient(120deg, #f4f6fa 60%, #e9ecf3 100%);
  padding: 60px 0 70px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #23234a;
`;

const Title = styled.h2`
  color: #23234a; /* Cambié a oscuro para que se lea sobre el fondo claro, ajusta si prefieres blanco */
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 14px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 36px;
  text-align: center;
  max-width: 600px;
`;

const PlansGrid = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const LoadingText = styled.p`
  color: #23234a;
  font-size: 1.2rem;
`;

export default function PlanSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para redirigir

  // Cargar SOLO planes de Landing desde BD
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // CORRECCIÓN: Usamos el endpoint /landing para que respete tu configuración del Admin
        // Si tienes configurado API_URL en un archivo config, úsalo. Si no, usa http://localhost:5000
        const url = typeof API_URL !== 'undefined' ? `${API_URL}/api/plans/landing` : "http://localhost:5000/api/plans/landing";
        
        const response = await fetch(url);
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error cargando planes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Función para redirigir a la página completa de planes
  const handleRedirect = () => {
    navigate("/plans");
    // Opcional: scrollear arriba al cambiar de página
    window.scrollTo(0, 0);
  };

  return (
    <Section id="plans">
      <Title>Elige tu plan</Title>
      <Subtitle>
        Selecciona el plan que mejor se adapte a tus objetivos y comienza tu transformación hoy mismo.
      </Subtitle>

      {loading ? (
        <LoadingText>Cargando planes destacados...</LoadingText>
      ) : (
        <PlansGrid>
          {plans.length > 0 ? (
            plans.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={`S/ ${plan.price}`}
                // La BD devuelve 'specs', PlanCard espera 'features'
                features={plan.specs || []} 
                // Pasamos la función de redirección al botón del Card
                onClick={handleRedirect} 
                // Si tu PlanCard usa otro nombre para la acción (ej. onSelect), cámbialo aquí
                buttonText="Ver Detalles"
                highlight={plan.highlight} // Para que se ilumine si está destacado
              />
            ))
          ) : (
            <p>No hay planes destacados por el momento.</p>
          )}
        </PlansGrid>
      )}
    </Section>
  );
}