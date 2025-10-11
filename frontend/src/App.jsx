import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicLayout from "./layouts/PublicLayout";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/login") || location.pathname.startsWith("/register");
  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/adminpanel");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/plans/:id" element={<PublicLayout><Plans /></PublicLayout>} />
          <Route path="/plans" element={<PublicLayout><Plans /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Rutas privadas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
