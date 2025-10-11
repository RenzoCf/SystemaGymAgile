import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ✅ Exportación por defecto (importante)
export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Si no hay sesión, redirige al login
    return <Navigate to="/login" replace />;
  }

  return children;
}
