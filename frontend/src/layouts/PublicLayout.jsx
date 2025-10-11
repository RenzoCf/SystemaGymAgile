import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlanSection from "../components/PlanSection";
import styled from "styled-components";
import plans from "../pages/Plans";

const NAVBAR_HEIGHT = 80;

const PageWrapper = styled.div`
  padding-top: ${NAVBAR_HEIGHT}px;
  min-height: 100vh;
  background: #f4f6fa;
  display: flex;
  flex-direction: column;
`;


export default function PublicLayout({ children }) {
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/register","/planseciton","/plans"];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <PageWrapper>
        {children}
      </PageWrapper>
      {shouldShowFooter && <Footer />}
    </>
  );
}