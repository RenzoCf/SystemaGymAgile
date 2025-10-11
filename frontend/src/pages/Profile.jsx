import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 text-lg">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div className="bg-white p-6 shadow rounded space-y-4">
        <p><strong>Nombre:</strong> {user.name || "Sin nombre registrado"}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <p><strong>Membresía:</strong> Básico (30 días)</p>

        <a
          href={`https://wa.me/${import.meta.env.VITE_GYM_WA}?text=Hola,%20quiero%20renovar%20mi%20membresía`}
          target="_blank"
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Renovar membresía
        </a>
      </div>
    </div>
  );
}
