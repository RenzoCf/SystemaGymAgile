import React from "react";
import styled from "styled-components";
import { FaDumbbell, FaUsers, FaHeartbeat, FaStar } from "react-icons/fa";

const Section = styled.section`
  background: #f4f6fa;
  padding: 60px 0 70px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #23234a;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 14px;
  text-align: center;
  color: #e94560;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 36px;
  text-align: center;
  max-width: 600px;
  color: #555;
`;

const BenefitsGrid = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
`;

const BenefitCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 28px 24px;
  width: 240px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(233,69,96,0.12);
  }

  svg {
    font-size: 2.2rem;
    color: #e94560;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #23234a;
  }

  p {
    font-size: 0.95rem;
    color: #777;
  }
`;

export default function BenefitSection() {
  const benefits = [
    {
      icon: <FaDumbbell />,
      title: "Equipamiento de alto nivel",
      desc: "Contamos con máquinas modernas y zonas especializadas para cada tipo de entrenamiento."
    },
    {
      icon: <FaUsers />,
      title: "Comunidad motivadora",
      desc: "Entrena rodeado de personas que comparten tus metas y te impulsan a dar lo mejor."
    },
    {
      icon: <FaHeartbeat />,
      title: "Bienestar integral",
      desc: "No solo físico: también cuidamos tu salud mental, nutrición y descanso."
    },
    {
      icon: <FaStar />,
      title: "Resultados garantizados",
      desc: "Planes personalizados y seguimiento constante para que alcances tus objetivos."
    }
  ];

  return (
    <Section>
      <Title>¿Por qué elegirnos?</Title>
      <Subtitle>
        Más que un gimnasio, somos un espacio de transformación personal. Estos son algunos de los beneficios que ofrecemos:
      </Subtitle>
      <BenefitsGrid>
        {benefits.map((b, i) => (
          <BenefitCard key={i}>
            {b.icon}
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </BenefitCard>
        ))}
      </BenefitsGrid>
    </Section>
  );
}