import React from "react";
import styled from "styled-components";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Section = styled.section`
  scroll-margin-top: 50px; // 👈 esto evita que el navbar lo tape
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

const ContactGrid = styled.div`
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 900px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 260px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #bdbdbd;
  font-size: 1.05rem;

  svg {
    color: #e94560;
    font-size: 1.2rem;
  }
`;

const Form = styled.form`
  background: rgba(30, 30, 50, 0.92);
  border-radius: 18px;
  padding: 32px 28px;
  min-width: 320px;
  max-width: 380px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  background: #23234a;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: #bdbdbd;
  }
`;

const Textarea = styled.textarea`
  background: #23234a;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1rem;
  min-height: 80px;
  outline: none;
  resize: vertical;

  &::placeholder {
    color: #bdbdbd;
  }
`;

const Button = styled.button`
  background: #e94560;
  color: #fff;
  padding: 12px 0;
  border: none;
  border-radius: 22px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: #ff2e63;
    transform: scale(1.04);
  }
`;

export default function ContactSection() {
  return (
    <Section id="contact">
      <Title>Contacto</Title>
      <Subtitle>
        ¿Tienes dudas o quieres agendar una visita? Escríbenos o utiliza nuestros medios de contacto.
      </Subtitle>
      <ContactGrid>
        <ContactInfo>
          <InfoItem><FaPhoneAlt /> +52 123 456 7890</InfoItem>
          <InfoItem><FaEnvelope /> contacto@systemagym.com</InfoItem>
          <InfoItem><FaMapMarkerAlt /> Calle Ejemplo 123, Ciudad, País</InfoItem>
        </ContactInfo>
        <Form onSubmit={e => e.preventDefault()}>
          <Input type="text" placeholder="Tu nombre" required />
          <Input type="email" placeholder="Tu correo" required />
          <Textarea placeholder="Tu mensaje" required />
          <Button type="submit">Enviar mensaje</Button>
        </Form>
      </ContactGrid>
    </Section>
  );
}