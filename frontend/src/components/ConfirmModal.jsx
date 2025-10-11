import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 30px 25px;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #23234a;
  }

  p {
    color: #555;
    margin-bottom: 30px;
  }

  button {
    padding: 10px 20px;
    border-radius: 15px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    margin: 0 8px;
    font-size: 0.95rem;
    transition: all 0.2s;

    &.confirm {
      background: #e94560;
      color: white;
      &:hover { background: #ff2e63; }
    }

    &.cancel {
      background: #ccc;
      color: #23234a;
      &:hover { background: #aaa; }
    }
  }
`;

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Overlay>
      <Modal>
        <h3>Confirmación</h3>
        <p>{message}</p>
        <div>
          <button className="cancel" onClick={onCancel}>Cancelar</button>
          <button className="confirm" onClick={onConfirm}>Sí, cerrar sesión</button>
        </div>
      </Modal>
    </Overlay>
  );
}
