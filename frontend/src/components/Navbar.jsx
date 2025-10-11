import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiMenu, FiX } from "react-icons/fi";

const Header = styled.header`
  background: #0e2949ff;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 50;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #e94560;
  text-decoration: none;
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  align-items: center;
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    right: ${({ open }) => (open ? "0" : "-100%")};
    flex-direction: column;
    background: #0f3460;
    width: 220px;
    height: 100vh;
    padding-top: 2rem;
    transition: right 0.3s;
    box-shadow: -2px 0 16px rgba(0,0,0,0.12);
    z-index: 100;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  outline: none;
  position: relative;
  transition: color 0.2s;

  &:after {
    content: "";
    display: block;
    height: 2px;
    width: 0;
    background: #e94560;
    transition: width 0.3s;
    position: absolute;
    left: 0;
    bottom: -4px;
  }
  &:hover,
  &:focus {
    color: #e94560;
  }
  &:hover:after,
  &:focus:after {
    width: 100%;
  }
`;

const LoginBtn = styled(Link)`
  background: #e94560;
  color: #fff;
  padding: 8px 22px;
  border-radius: 18px;
  font-weight: 600;
  text-decoration: none;
  margin-left: 1.5rem;
  transition: background 0.2s;
  &:hover {
    background: #ff2e63;
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 2rem;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
  }
`;

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Header>
      <Nav>
        <Logo to="/">GYM SYSTEM</Logo>
        <MenuIcon onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menú">
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuIcon>
        <NavLinks open={menuOpen}>
          <NavItem>
            <NavButton onClick={() => scrollToSection("hero")}>Home</NavButton>
          </NavItem>
          <NavItem>
            <NavButton onClick={() => scrollToSection("plans")}>Planes</NavButton>
          </NavItem>
          <NavItem>
            <NavButton onClick={() => scrollToSection("contact")}>Contacto</NavButton>
          </NavItem>
          <NavItem>
            <LoginBtn to="/login">Iniciar Sesión</LoginBtn>
          </NavItem>
        </NavLinks>
      </Nav>
    </Header>
  );
}