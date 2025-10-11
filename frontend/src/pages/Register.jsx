// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { API_URL } from "../config"; // Tu URL del backend

// ======================
// Styled Components
// ======================
const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  box-sizing: border-box;
`;

const RegisterContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(30,30,50,0.10);
  max-width: 800px;
  width: 100%;
  height: 580px;

  @media (max-width: 900px) {
    flex-direction: column;
    max-width: 400px;
    height: auto;
  }
`;

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 36px 32px;
  min-width: 200px;
  max-width: 500px;
`;

const ImageSide = styled.div`
  flex: 1;
  background: #e9ecf3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const GymImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 400px;
  object-fit: cover;
  border-radius: 0 18px 18px 0;
  box-shadow: 0 2px 16px rgba(30,30,50,0.08);
`;

const Title = styled.h2`
  color: #23234a;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #23234a;
  margin-bottom: 4px;
`;

const Input = styled.input`
  background: #f4f6fa;
  border: 1px solid #e9ecf3;
  border-radius: 6px;
  padding: 10px;
  color: #23234a;
  font-size: 0.95rem;
  outline: none;
  width: 100%;
  margin-bottom: 2px;

  &:focus {
    border: 1.5px solid #e94560;
  }
`;

const Button = styled.button`
  background: #e94560;
  color: #fff;
  padding: 12px 0;
  border: none;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;

  &:hover {
    background: #ff2e63;
  }
`;

const ErrorMsg = styled.div`
  color: #e94560;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 4px;
`;

const LoginLink = styled.div`
  text-align: center;
  font-size: 0.95rem;
  margin-top: 12px;

  a {
    color: #e94560;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ======================
// Componente Register
// ======================
export default function Register() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombreCompleto || !username || !password || !confirm) {
      setError("Completa todos los campos.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Enviamos nombre_completo al backend
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: nombreCompleto,
          username,
          password
        })
      });

      if (res.ok) {
        const userData = await res.json();
        alert(`Usuario ${userData.username} creado con éxito!`);
        navigate("/login"); // Redirige a login
      } else {
        const errData = await res.json();
        setError(errData.error || "Error al registrar usuario.");
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error al registrar usuario.");
    }
  };

  return (
    <Wrapper>
      <RegisterContainer>
        <Card>
          <Title>Crear cuenta</Title>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Form onSubmit={handleSubmit}>
            <Label>Nombre completo</Label>
            <Input
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
            <Label>Usuario</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Label>Confirmar contraseña</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <Button type="submit">Registrarme</Button>
          </Form>
          <LoginLink>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </LoginLink>
        </Card>
        <ImageSide>
          <GymImage
            src="https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&w=600&q=80"
            alt="Registro gimnasio"
          />
        </ImageSide>
      </RegisterContainer>
    </Wrapper>
  );
}
