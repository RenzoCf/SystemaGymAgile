import React, { useState } from "react";
import styled from "styled-components";
import ConfirmModal from "./ConfirmModal";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #23234a;
  padding: 12px 24px;
  color: white;

  .username {
    font-weight: 600;
  }

  button {
    background: #e94560;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover { background: #ff2e63; }
  }
`;

export default function DashboardNavbar({ username, onLogout }) {
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    onLogout();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Nav>
        <div className="username">Hola, {username}</div>
        <button onClick={handleLogoutClick}>Cerrar sesión</button>
      </Nav>
      {showModal && (
        <ConfirmModal
          message="¿Seguro que deseas cerrar sesión?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
