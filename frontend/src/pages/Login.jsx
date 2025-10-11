// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

// ===== Styled Components =====
const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  box-sizing: border-box;
`;

const LoginContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(30,30,50,0.10);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  min-height: 520px;
  align-items: stretch;

  @media (max-width: 900px) {
    flex-direction: column;
    max-width: 400px;
    min-height: unset;
  }
`;

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 40px;
  min-width: 340px;
  max-width: 420px;

  @media (max-width: 900px) {
    width: 100%;
    padding: 32px 18px;
  }
`;

const ImageSide = styled.div`
  flex: 1;
  background: #e9ecf3;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

const GymImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0 18px 18px 0;
`;

const Title = styled.h2`
  color: #23234a;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 18px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #23234a;
`;

const Input = styled.input`
  background: #f4f6fa;
  border: 1px solid #e9ecf3;
  border-radius: 6px;
  padding: 12px;
  color: #23234a;
  font-size: 1rem;
  outline: none;
  width: 100%;

  &:focus {
    border: 1.5px solid #e94560;
  }
`;

const Button = styled.button`
  background: #e94560;
  color: #fff;
  padding: 14px 0;
  border: none;
  border-radius: 18px;
  font-size: 1.08rem;
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
  font-size: 0.98rem;
  text-align: center;
`;

const RegisterLink = styled.div`
  text-align: center;
  font-size: 1rem;
  margin-top: 14px;

  a {
    color: #e94560;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 2px;
  margin-bottom: 2px;

  a {
    color: #e94560;
    font-size: 0.97rem;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ===== Componente principal =====
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Admin hardcodeado
    if (username === "admin" && password === "admin123") {
      login({ username: "admin", is_admin: true, id: 0 });
      navigate("/adminpanel");
      return;
    }

    // Usuario normal con BD
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Usuario o contraseña incorrecta");
        return;
      }

      const userData = await res.json();
      login(userData);

      navigate(`/dashboard?username=${userData.username}&id=${userData.id}`);

    } catch (err) {
      console.error("Error en login:", err);
      setError("Error en el servidor");
    }
  };

  return (
    <Wrapper>
      <LoginContainer>
        <Card>
          <Title>Iniciar sesión</Title>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Form onSubmit={handleSubmit}>
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <ForgotPassword><Link to="/forgot-password">¿Olvidaste tu contraseña?</Link></ForgotPassword>
            <Button type="submit">Ingresar</Button>
          </Form>
          <RegisterLink>¿No tienes cuenta? <Link to="/register">Regístrate</Link></RegisterLink>
        </Card>
        <ImageSide>
          <GymImage src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?cs=srgb&dl=pexels-leonmart-1552252.jpg&fm=jpg" alt="Gimnasio"/>
        </ImageSide>
      </LoginContainer>
    </Wrapper>
  );
}
