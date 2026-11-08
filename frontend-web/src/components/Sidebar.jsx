import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Sparkles, 
  FileText, 
  BarChart3, 
  FileCheck2,
  GraduationCap,
  MessageSquare,
  Smartphone,
  LogOut,
  Home,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Elementos de navegación adaptados por rol
  let navItems = [];

  if (user?.rol === 'secretaria') {
    navItems = [
      { to: '/documentos-secretaria', label: 'Gestión Documental & Seguros', icon: FileCheck2 },
      { to: '/postulaciones', label: 'Seguimiento y Firmas', icon: FileText },
      { to: '/dashboard', label: 'Panel Resumen', icon: LayoutDashboard },
      { to: '/simulador-estudiante', label: 'Simulador Estudiante', icon: Smartphone }
    ];
  } else if (user?.rol === 'docente') {
    navItems = [
      { to: '/evaluacion-docente', label: 'Evaluación de Informes', icon: GraduationCap },
      { to: '/supervision-jefatura', label: 'Consultas Académicas', icon: MessageSquare },
      { to: '/dashboard', label: 'Resumen de Prácticas', icon: LayoutDashboard },
      { to: '/simulador-estudiante', label: 'Simulador Estudiante', icon: Smartphone }
    ];
  } else if (user?.rol === 'estudiante') {
    navItems = [
      { to: '/simulador-estudiante', label: 'App PRACNET Móvil', icon: Smartphone },
      { to: '/ofertas', label: 'Muro de Prácticas', icon: Briefcase }
    ];
  } else {
    // Jefatura de Carrera y Administrador Institucional
    navItems = [
      { to: '/dashboard', label: 'Panel de Administración', icon: LayoutDashboard },
      { to: '/supervision-jefatura', label: 'Supervisión y Alumnos', icon: MessageSquare },
      { to: '/ofertas', label: 'Gestión de Prácticas', icon: Briefcase },
      { to: '/recomendacion', label: 'Sistema de Recomendación', icon: Sparkles },
      { to: '/postulaciones', label: 'Seguimiento Postulaciones', icon: FileText },
      { to: '/documentos-secretaria', label: 'Trámites de Secretaría', icon: FileCheck2 },
      { to: '/evaluacion-docente', label: 'Evaluación Docente', icon: GraduationCap },
      { to: '/reportes', label: 'Generación de Reportes', icon: BarChart3 },
      { to: '/simulador-estudiante', label: 'Simulador Estudiante', icon: Smartphone }
    ];
  }

  const roleLabels = {
    jefe_carrera: 'Jefe de Carrera',
    secretaria: 'Secretaría de Docencia',
    docente: 'Profesor Guía',
    estudiante: 'Estudiante USM',
    admin: 'Administrador'
  };

  return (
    <aside className="w-64 bg-usm-navy text-white flex flex-col min-h-screen shrink-0 shadow-xl border-r border-slate-800">
      {/* Branding institucional */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
            <span className="text-amber-400 font-black">PracNet</span>
          </h1>
          <button
            onClick={() => navigate('/')}
            title="Ir a Portada Institucional"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
          Plataforma Institucional USM
        </p>
      </div>

      {/* Identificador de Rol Activo */}
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="overflow-hidden">
            <p className="font-bold text-white truncate">{user?.nombre || 'Usuario USM'}</p>
            <p className="text-[10px] text-amber-300 font-semibold truncate">
              {roleLabels[user?.rol] || 'Personal Académico'}
            </p>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-usm-blue text-white shadow-md font-bold border-l-4 border-amber-400'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Pie de Sidebar y Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-800/80 rounded-xl transition-colors border border-amber-400/20"
        >
          <Home className="w-4 h-4" />
          <span>Cambiar de Perfil / Portada</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
