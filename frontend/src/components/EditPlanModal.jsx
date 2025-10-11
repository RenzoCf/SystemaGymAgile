// src/components/EditPlanModal.jsx
import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display:flex;
  gap:24px;
  max-width: 800px;
  width: 100%;
`;

const Form = styled.form`
  flex:1;
  display:flex;
  flex-direction:column;
  gap:12px;
`;

const Input = styled.input`
  padding:10px;
  border-radius:8px;
  border:1px solid #ccc;
`;

const Textarea = styled.textarea`
  padding:10px;
  border-radius:8px;
  border:1px solid #ccc;
  resize:none;
`;

const Button = styled.button`
  padding: 10px 16px;
  background:${props=>props.bg||"#4CAF50"};
  color:#fff;
  border:none;
  border-radius:8px;
  cursor:pointer;
  margin-top:8px;
  &:hover{ opacity:0.85; }
`;

const Preview = styled.div`
  flex:1;
  background:#f9f9f9;
  border-radius:12px;
  padding:16px;
  display:flex;
  flex-direction:column;
  gap:8px;
  text-align:center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export default function EditPlanModal({ plan, onClose }) {
  const [formData, setFormData] = useState({ ...plan });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.price || !formData.duration) {
      setError("Nombre, precio y duración son obligatorios");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/admin/plans/${plan.id}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(formData)
      });
      if(!res.ok) throw new Error("Error al actualizar plan");
      onClose(); // Cierra modal y refresca lista
    } catch(err){ console.error(err); setError("Error al actualizar plan"); }
  };

  return (
    <Overlay>
      <Modal>
        <Form onSubmit={handleSubmit}>
          <h3>Editar Plan</h3>
          <Input placeholder="Nombre" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/>
          <Input placeholder="Precio" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})}/>
          <Input placeholder="Duración" value={formData.duration} onChange={e=>setFormData({...formData, duration:e.target.value})}/>
          <Input placeholder="Label" value={formData.label} onChange={e=>setFormData({...formData, label:e.target.value})}/>
          <Input placeholder="Highlight" value={formData.highlight} onChange={e=>setFormData({...formData, highlight:e.target.value})}/>
          <Textarea placeholder="Descripción" rows={4} value={formData.desc} onChange={e=>setFormData({...formData, desc:e.target.value})}/>
          {error && <div style={{color:"#e94560"}}>{error}</div>}
          <div style={{display:"flex", gap:"12px", marginTop:"12px"}}>
            <Button type="submit">Guardar</Button>
            <Button bg="#ccc" onClick={onClose} type="button">Cancelar</Button>
          </div>
        </Form>

        <Preview>
          <h4>{formData.name}</h4>
          <p><strong>Precio:</strong> {formData.price}</p>
          <p><strong>Duración:</strong> {formData.duration}</p>
          {formData.label && <p><strong>Label:</strong> {formData.label}</p>}
          {formData.highlight && <p style={{color:"#e94560"}}>{formData.highlight}</p>}
          {formData.desc && <p>{formData.desc}</p>}
        </Preview>
      </Modal>
    </Overlay>
  );
}
