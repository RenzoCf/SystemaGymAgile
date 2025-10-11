import React from "react";
import styled from "styled-components";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const FooterContainer = styled.footer`
  background: #161625;
  color: #bdbdbd;
  padding: 38px 0 18px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GymName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e94560;
  margin-bottom: 10px;
  letter-spacing: 1px;
`;

const Motivational = styled.div`
  color: #fff;
  font-size: 1.08rem;
  margin-bottom: 18px;
  text-align: center;
  max-width: 420px;
`;

const Socials = styled.div`
  display: flex;
  gap: 22px;
  margin-bottom: 18px;
  a {
    color: #e94560;
    font-size: 1.6rem;
    transition: color 0.2s;
    &:hover {
      color: #fff;
    }
  }
`;

const Contact = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
  text-align: center;
  color: #bdbdbd;
`;

const Copyright = styled.div`
  color: #444;
  font-size: 0.95rem;
  text-align: center;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <GymName>Systema Gym</GymName>
      <Motivational>
        “El dolor que sientes hoy será la fuerza que sentirás mañana.”
      </Motivational>
      <Socials>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebookF />
        </a>
        <a href="https://wa.me/521234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <FaWhatsapp />
        </a>
      </Socials>
      <Contact>
        contacto@systemagym.com · +52 123 456 7890 · Calle Ejemplo 123, Ciudad
      </Contact>
      <Copyright>
        © {new Date().getFullYear()} Systema Gym. Todos los derechos reservados.
      </Copyright>
    </FooterContainer>
  );
}