import React from "react";
import styled from "styled-components";
import PlanCard from "./PlanCard";

const Section = styled.section`
scroll-margin-top: 30px; // 👈 esto evita que el navbar lo tape
  background: linear-gradient(120deg, #f4f6fa 60%, #e9ecf3 100%);
  padding: 60px 0 70px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #23234a;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 14px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #bdbdbd;
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

const plans = [
  {
    name: "Básico",
    price: "S/ 69",
    features: [
      "Acceso a sala de pesas",
      "Rutinas personalizadas",
      "Locker personal"
    ]
  },
  {
    name: "Premium",
    price: "S/ 119",
    features: [
      "Todo lo del Básico",
      "Clases grupales ilimitadas",
      "Evaluación física mensual",
      "Bebida energética semanal"
    ]
  },
  {
    name: "VIP",
    price: "S/ 169",
    features: [
      "Todo lo del Premium",
      "Entrenador personal",
      "Nutricionista exclusivo",
      "Acceso 24/7"
    ]
  }
];

export default function PlanSection() {
  return (
    <Section id="plans">
      <Title>Elige tu plan</Title>
      <Subtitle>
        Selecciona el plan que mejor se adapte a tus objetivos y comienza tu transformación hoy mismo.
      </Subtitle>
      <PlansGrid>
        {plans.map(plan => (
          <PlanCard
            key={plan.name}
            name={plan.name}
            price={plan.price}
            features={plan.features}
          />
        ))}
      </PlansGrid>
    </Section>
  );
}