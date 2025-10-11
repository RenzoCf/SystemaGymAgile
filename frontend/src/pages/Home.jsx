import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import BenefitSection from "../components/BenefitSection";
import PlanSection from "../components/PlanSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding-top: 20px;
  background: #f4f6fa;
  min-height: 100vh;
`;

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <HeroSection />
      <BenefitSection />
      <PlanSection />
      <ContactSection />
    </PageWrapper>
  );
}