import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Sparkles, 
  FileText, 
  BarChart3, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Panel de administración', icon: LayoutDashboard },
    { to: '/ofertas', label: 'Gestión ofertas de prácticas', icon: Briefcase },
    { to: '/recomendacion', label: 'Sistema de recomendación', icon: Sparkles },
    { to: '/postulaciones', label: 'Seguimiento postulaciones', icon: FileText },
    { to: '/reportes', label: 'Generación de reportes', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-usm-navy text-white flex flex-col min-h-screen shrink-0 shadow-xl border-r border-slate-800">
      {/* Branding institucional del Mockup 9.2 */}
      <div className="p-6 border-b border-slate-800/80">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span className="text-usm-gold font-black">PracNet</span>
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
          Sistema de Gestión
        </p>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 py-6 px-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-usm-blue text-usm-gold shadow-md font-semibold border-l-4 border-usm-gold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Pie de Sidebar y Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.nombre || 'Jefatura USM'}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user?.rol === 'jefe_carrera' ? 'Jefe de Carrera' : 'Administrador'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
