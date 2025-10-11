import React from "react";
import styled from "styled-components";

const Hero = styled.section`
scroll-margin-top: 110px; // 👈 esto evita que el navbar lo tape

  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f4f6fa 60%, #e9ecf3 100%);
  padding: 60px 0 40px 0;
  color: #23234a;

  @media (max-width: 900px) {
    flex-direction: column;
    padding: 40px 0 20px 0;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  z-index: 2;
  color: #fff;
  padding-left: 5vw;

  @media (max-width: 900px) {
    padding-left: 0;
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 18px;
  line-height: 1.1;
  color: #fff;
  text-shadow: 0 4px 24px rgba(0,0,0,0.25);

  span {
    color: #e94560;
  }

  @media (max-width: 600px) {
    font-size: 2.1rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.3rem;
  margin-bottom: 32px;
  color: #e0e0e0;
  max-width: 500px;

  @media (max-width: 900px) {
    margin: 0 auto 32px auto;
  }
`;

const HeroButton = styled.a`
  display: inline-block;
  background: #e94560;
  color: #fff;
  padding: 16px 38px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(233,69,96,0.18);
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #ff2e63;
    transform: translateY(-2px) scale(1.04);
  }
`;

const HeroImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    margin-top: 32px;
  }
`;

const HeroImage = styled.img`
  width: 90%;
  max-width: 620px;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  object-fit: cover;
`;

export default function HeroSection() {
  return (
    <Hero id="hero">
      <HeroContent>
        <HeroTitle>
          Transforma tu <span>cuerpo</span>, mejora tu vida 💪
        </HeroTitle>
        <HeroText>
          Únete al mejor gimnasio de la ciudad. Planes flexibles, ambiente motivador y entrenadores profesionales que te guiarán en cada paso.
        </HeroText>
        <HeroButton href="#plans">Ver Membresías</HeroButton>
      </HeroContent>
      <HeroImageWrapper>
        <HeroImage
          src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=900&q=80"
          alt="Entrenamiento"
        />
      </HeroImageWrapper>
    </Hero>
  );
}