import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, ShieldCheck, Home, Clock, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, subtitle }) {
  const { user, clientIp, timeRemainingFormatted, resetInactivityTimer } = useAuth();
  const navigate = useNavigate();

  const roleStyles = {
    jefe_carrera: 'bg-blue-100 text-blue-800 border-blue-200',
    secretaria: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    docente: 'bg-purple-100 text-purple-800 border-purple-200',
    estudiante: 'bg-amber-100 text-amber-900 border-amber-200',
    admin: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const roleDisplay = {
    jefe_carrera: 'Jefatura de Carrera',
    secretaria: 'Secretaría de Docencia',
    docente: 'Profesor Guía',
    estudiante: 'Estudiante USM',
    admin: 'Administrador'
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-usm-navy tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Indicador de Seguridad con Timer de Inactividad de 2 Horas & IP */}
        <div
          onClick={resetInactivityTimer}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
          title="El contador se reinicia a 2 horas cada vez que interactúas con la plataforma (clic para reiniciar ahora)"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>IP: <strong className="font-mono text-slate-800">{clientIp}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-semibold text-usm-navy">
            <Clock className="w-3 h-3 text-amber-500" />
            Inactividad: {timeRemainingFormatted}
          </span>
        </div>

        {/* Badge de Rol Activo */}
        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-xs font-bold text-slate-800">
              {user?.nombre || 'Usuario USM'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleStyles[user?.rol] || 'bg-slate-100'}`}>
              {roleDisplay[user?.rol] || 'Personal Académico'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {user?.cargo || 'Universidad Técnica Federico Santa María'}
          </p>
        </div>

        {/* Botón Volver a Portada Institucional */}
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          title="Ver Portada Institucional y cambiar de perfil"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Portada / Roles</span>
        </button>
      </div>
    </header>
  );
}
