// src/components/EditPlanModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #23234a;
  margin-bottom: 24px;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: block;
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #e94560;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  width: 100%;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #e94560;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(Button)`
  background: #e94560;
  color: white;
  
  &:hover {
    background: #d63851;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #5a6268;
  }
`;

const ErrorMsg = styled.div`
  color: #f44336;
  background: #ffebee;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
`;

export default function EditPlanModal({ plan, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    label: "",
    highlight: false,
    desc: "",
    specs: "",
    bonus: "",
    show_in_landing: false
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      // Convertir specs de array a texto con saltos de línea
      const specsText = Array.isArray(plan.specs) 
        ? plan.specs.join("\n") 
        : "";

      setFormData({
        name: plan.name || "",
        price: plan.price || "",
        duration: plan.duration || "",
        label: plan.label || "",
        highlight: plan.highlight || false,
        desc: plan.desc || "",
        specs: specsText,
        bonus: plan.bonus || "",
        show_in_landing: plan.show_in_landing || false
      });
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.duration) {
      setError("Nombre, precio y duración son obligatorios");
      return;
    }

    // Convertir specs de texto a array
    const specsArray = formData.specs
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => line.trim());

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      duration: formData.duration,
      label: formData.label || null,
      highlight: formData.highlight,
      desc: formData.desc || null,
      specs: specsArray.length > 0 ? specsArray : null,
      bonus: formData.bonus || null,
      show_in_landing: formData.show_in_landing
    };

    try {
      const res = await fetch(`http://localhost:5000/api/admin/plans/${plan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al actualizar plan");
      }

      alert("Plan actualizado exitosamente");
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al actualizar plan");
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Editar Plan</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Nombre del plan *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Precio *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Duración *</Label>
            <Input
              type="text"
              placeholder="Ej: 1 mes, 12 meses"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Etiqueta</Label>
            <Input
              type="text"
              placeholder="Ej: Básico, Popular, Ahorro"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Input
              type="text"
              placeholder="Descripción breve del plan"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            />
          </div>

          <div>
            <Label>Características (una por línea)</Label>
            <TextArea
              placeholder="Acceso al gimnasio&#10;Rutinas personalizadas&#10;Locker personal"
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              rows={5}
            />
          </div>

          <div>
            <Label>Bonus</Label>
            <Input
              type="text"
              placeholder="Ej: 🎁 2 meses gratis"
              value={formData.bonus}
              onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
            />
          </div>

          <CheckboxLabel>
            <input
              type="checkbox"
              checked={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
            />
            ¿Destacar este plan?
          </CheckboxLabel>

          <CheckboxLabel>
            <input
              type="checkbox"
              checked={formData.show_in_landing}
              onChange={(e) => setFormData({ ...formData, show_in_landing: e.target.checked })}
            />
            ¿Mostrar en landing? (máx. 3)
          </CheckboxLabel>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <ButtonGroup>
            <SaveButton type="submit">Guardar Cambios</SaveButton>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
}