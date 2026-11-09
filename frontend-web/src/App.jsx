import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Ofertas from './pages/Ofertas';
import Recomendacion from './pages/Recomendacion';
import Postulaciones from './pages/Postulaciones';
import Reportes from './pages/Reportes';
import DocumentosSecretaria from './pages/DocumentosSecretaria';
import DocenteEvaluacion from './pages/DocenteEvaluacion';
import SupervisionJefatura from './pages/SupervisionJefatura';
import SimuladorEstudiante from './pages/SimuladorEstudiante';
import PortalEstudiante from './pages/PortalEstudiante';

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/recomendacion" element={<Recomendacion />} />
          <Route path="/postulaciones" element={<Postulaciones />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/documentos-secretaria" element={<div className="p-6 sm:p-8"><DocumentosSecretaria /></div>} />
          <Route path="/evaluacion-docente" element={<div className="p-6 sm:p-8"><DocenteEvaluacion /></div>} />
          <Route path="/supervision-jefatura" element={<div className="p-6 sm:p-8"><SupervisionJefatura /></div>} />
          <Route path="/portal-estudiante" element={<PortalEstudiante />} />
          <Route path="/simulador-estudiante" element={<div className="p-6 sm:p-8"><SimuladorEstudiante /></div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Portada Institucional Principal inspirada en Aula USM */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
