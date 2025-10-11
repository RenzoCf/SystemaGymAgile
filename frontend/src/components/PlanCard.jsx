import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const Card = styled.div`
  background: rgba(30, 30, 50, 0.92);
  border-radius: 18px;
  padding: 38px 28px;
  width: 270px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  transition: transform 0.16s, box-shadow 0.16s, border 0.2s;

  &:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 8px 32px rgba(233,69,96,0.13);
    border: 2px solid #e94560;
  }
`;

const Name = styled.h3`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;
`;

const Price = styled.div`
  color: #e94560;
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 18px;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  width: 100%;
`;

const Feature = styled.li`
  color: #bdbdbd;
  font-size: 1rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #e94560;
    font-size: 1rem;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  background: #e94560;
  color: #fff;
  padding: 12px 30px;
  border-radius: 22px;
  font-size: 1.08rem;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(233,69,96,0.10);
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: #ff2e63;
    transform: scale(1.04);
  }
`;


export default function PlanCard({ name, price, features }) {
  return (
    <Card>
      <Name>{name}</Name>
      <Price>{price}<span style={{ fontSize: "1rem", color: "#bdbdbd" }}>/mes</span></Price>
      <Features>
        {features.map((f, i) => (
          <Feature key={i}><FaCheck /> {f}</Feature>
        ))}
      </Features>
      <Button to="/plans">Elegir plan</Button>

    </Card>
  );
}