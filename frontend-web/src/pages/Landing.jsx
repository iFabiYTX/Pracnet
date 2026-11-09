import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Award,
  FileCheck2,
  GraduationCap,
  Smartphone,
  Mail,
  Lock,
  ChevronRight,
  Info,
  ExternalLink,
  BookOpen,
  Building2,
  CheckCircle2,
  Sparkles,
  User
} from 'lucide-react';

export default function Landing() {
  const { quickLogin, login, loading } = useAuth();
  const navigate = useNavigate();
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (roleKey, redirectPath = '/dashboard') => {
    quickLogin(roleKey);
    navigate(redirectPath);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. Barra Superior Institucional (Estilo Aula USM) */}
      <header className="bg-[#002855] text-white text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm text-amber-400">USM</span>
              <span className="text-white/40">|</span>
              <span className="text-white/90 hidden sm:inline font-medium">UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-white/80 font-medium">
            <a href="https://usm.cl" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              USM.cl <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <span className="hidden md:inline hover:text-white cursor-pointer">Reglamento Prácticas</span>
            <span className="hidden sm:inline hover:text-white cursor-pointer">SIGA</span>
            <span className="text-amber-400 hover:text-amber-300 cursor-pointer">Accesibilidad y Ayuda</span>
          </div>
        </div>
      </header>

      {/* 2. Sub-Barra de Navegación de la Plataforma */}
      <nav className="bg-[#003865] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow">
              <Award className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">PRACNET</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90 uppercase tracking-wider">
                Portal Institucional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-white/70">Ambiente Seguro</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              API v2.0 Online
            </span>
          </div>
        </div>
      </nav>

      {/* 3. Contenedor Principal: Hero Dividido */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          
          {/* COLUMNA IZQUIERDA: Banner Visual Informativo */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#002855] via-[#003B71] to-[#0A4D8C] text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Elementos visuales de fondo */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Gestión de Innovación USM
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
                Gestión de prácticas, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">
                  en un solo lugar.
                </span>
              </h1>

              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Ecosistema digital unificado para optimizar el acceso, supervisión y convalidación formal de prácticas profesionales de la Universidad Técnica Federico Santa María.
              </p>

              {/* Pilares Institucionales y Marco Legal */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Ley N° 16.744 & Art. 8 Código del Trabajo</span>
                    <p className="text-white/70 text-[11px] mt-0.5">Cobertura de Seguro Escolar y marco formativo no laboral.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Flujo Diferenciado por Roles</span>
                    <p className="text-white/70 text-[11px] mt-0.5">Monitoreo para Jefatura, validación documental para Secretaría y evaluación para Docentes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Convalidación Formulario 6000 B & SIGA</span>
                    <p className="text-white/70 text-[11px] mt-0.5">Firma digital institucional y registro curricular centralizado.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de KPIs en tiempo real */}
            <div className="relative z-10 pt-6 border-t border-white/15 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-amber-300">145</p>
                <p className="text-[11px] text-white/70 font-medium">Plazas Activas</p>
              </div>
              <div className="border-x border-white/15">
                <p className="text-2xl font-black text-white">89</p>
                <p className="text-[11px] text-white/70 font-medium">Convenios</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-300">38%</p>
                <p className="text-[11px] text-white/70 font-medium">Retención Lab.</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Selector Multi-Rol y Acceso Seguro */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              {/* Encabezado del Formulario */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-usm-blue flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-usm-blue" />
                    Acceso Seguro Multiusuario
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Prototipo Evaluativo
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Ingresa a la plataforma
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Selecciona la opción que corresponde a tu perfil para ingresar con los permisos respectivos:
                </p>
              </div>

              {/* OPCIONES DE ACCESO POR ROL INSTITUCIONAL */}
              <div className="space-y-3.5 mb-6">
                
                {/* 1. JEFATURA DE CARRERA */}
                <div 
                  onClick={() => handleRoleSelect('jefe', '/dashboard')}
                  className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-usm-blue hover:bg-sky-50/50 cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-usm-navy text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-usm-blue transition-colors text-base">
                          Jefatura de Carrera
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                          Monitoreo
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Monitoreo de alumnos, motor de matching IA, comunicación directa y reportes.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-usm-blue group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>

                {/* 2. SECRETARÍA DE DOCENCIA */}
                <div 
                  onClick={() => handleRoleSelect('secretaria', '/documentos-secretaria')}
                  className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                      <FileCheck2 className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base">
                          Secretaría de Docencia
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                          Gestión Documental
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Aprobación de Seguro Escolar (Ley 16.744), visado de Formulario 6000 B y timbres.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>

                {/* 3. DOCENTES & PROFESORES GUÍA */}
                <div 
                  onClick={() => handleRoleSelect('docente', '/evaluacion-docente')}
                  className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/50 cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                      <GraduationCap className="w-6 h-6 text-purple-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors text-base">
                          Profesores Guía y Docentes
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">
                          Evaluación
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Acompañamiento académico, corrección de Informes de Práctica y retroalimentación.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>

                {/* 4. ESTUDIANTES (Portal Web + App Móvil) */}
                <div 
                  onClick={() => handleRoleSelect('estudiante', '/portal-estudiante')}
                  className="group p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 cursor-pointer transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">
                          Portal Estudiante & App Móvil
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                          Web + Móvil QR
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5">
                        Perfil Discord-style con alias, muro web completo, Seguro Escolar y código QR para la App Móvil.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>
              </div>

              {/* TOGGLE: Ingreso Manual con Credenciales */}
              <div className="border-t border-slate-200 pt-4 mb-4">
                <button
                  type="button"
                  onClick={() => setShowManualLogin(!showManualLogin)}
                  className="text-xs font-semibold text-usm-blue hover:text-usm-navy flex items-center gap-1 transition-colors"
                >
                  {showManualLogin ? '▲ Ocultar formulario manual' : '▼ O ingresa con tu correo y contraseña institucional'}
                </button>

                {showManualLogin && (
                  <form onSubmit={handleManualSubmit} className="mt-3 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {error && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Institucional USM</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nombre.apellido@usm.cl"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 bg-usm-navy hover:bg-usm-blue text-white text-xs font-semibold rounded-lg shadow transition-colors"
                    >
                      {loading ? 'Validando...' : 'Entrar con credenciales'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Cuadro de Información (Estilo "¿Nuevo aquí?" del Aula USM) */}
            <div className="bg-slate-50 border-l-4 border-amber-400 rounded-r-xl p-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Info className="w-4 h-4 text-amber-500" />
                ¿Nuevo aquí? Información importante para usuarios:
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600">
                <li>
                  <span className="font-semibold text-slate-700">Jefatura y Docentes:</span> Monitorean alumnos y convalidan la práctica según la pauta institucional.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Secretaría de Docencia:</span> Es el único rol facultado para emitir y timbrar el Seguro Escolar y Formulario 6000 B.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Privacidad de Datos:</span> Plataforma protegida conforme a la Ley N° 19.628 de Protección de la Vida Privada.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      {/* 4. Pie de Página Institucional */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Universidad Técnica Federico Santa María. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="hover:text-usm-blue cursor-pointer">Términos de Uso</span>
            <span className="hover:text-usm-blue cursor-pointer">Ley N° 19.628</span>
            <span className="hover:text-usm-blue cursor-pointer">Mesa de Ayuda</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
