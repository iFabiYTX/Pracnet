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
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  BookOpen,
  Building2,
  CheckCircle2,
  Sparkles,
  User,
  Download,
  QrCode,
  AlertCircle
} from 'lucide-react';

export default function Landing() {
  const { login, loading, sessionExpiredMessage, clearExpiredMessage } = useAuth();
  const navigate = useNavigate();

  // Rol actualmente abierto en el acordeón de login: null | 'jefe' | 'secretaria' | 'docente' | 'estudiante'
  const [openRole, setOpenRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rutFuncionario, setRutFuncionario] = useState('');
  const [error, setError] = useState('');

  const toggleRole = (roleKey) => {
    if (openRole === roleKey) {
      setOpenRole(null);
    } else {
      setOpenRole(roleKey);
      setError('');
      setPassword('');
      setEmail('');
      setRutFuncionario('');
    }
  };

  const handleRoleLogin = async (e, roleKey) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    const res = await login(email, password);
    if (res.success && res.user) {
      if (res.user.rol === 'admin') {
        navigate('/admin');
      } else if (res.user.rol === 'docente') {
        navigate('/evaluacion-docente');
      } else if (res.user.rol === 'secretaria') {
        navigate('/documentos-secretaria');
      } else if (res.user.rol === 'estudiante') {
        navigate('/portal-estudiante');
      } else if (res.user.rol === 'jefe_carrera') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
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
            <a
              href="/descargar-app"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-transform shadow active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Descargar App Móvil (APK)
            </a>
            <span className="hidden md:inline text-white/70">Ambiente Seguro</span>
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
                {sessionExpiredMessage && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{sessionExpiredMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearExpiredMessage}
                      className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
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

              {/* TARJETA DESTACADA: RECOMENDACIÓN DE DESCARGA APP MÓVIL ESTUDIANTE CON CÓDIGO QR */}
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#002855] via-[#003865] to-[#0A4D8C] text-white shadow-xl border border-amber-400/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                  {/* Código QR Real de Descarga */}
                  <div className="bg-white p-2.5 rounded-2xl shadow-md text-center shrink-0 border border-white/20">
                    <img
                      src="/qr_code_pracnet.png"
                      alt="Código QR PRACNET Móvil"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-contain mx-auto"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block mt-1">
                      Escanear QR
                    </span>
                  </div>

                  {/* Explicación y Llamado a la Acción */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      Recomendado para Estudiantes
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                      Lleva PRACNET en tu celular
                    </h3>

                    <p className="text-xs text-white/80 leading-relaxed">
                      Escanea este código QR con la cámara de tu smartphone para descargar el APK directo (11.9 MB) o ingresa directamente a la versión móvil.
                    </p>

                    <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <a
                        href="/descargar-app"
                        className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar APK (11.9 MB)
                      </a>
                      <button
                        type="button"
                        onClick={() => navigate('/app')}
                        className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir App Móvil
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPCIONES DE ACCESO POR ROL INSTITUCIONAL (CADA ROL ABRE SU PROPIO LOGIN) */}
              <div className="space-y-4 mb-6">
                
                {/* 1. JEFATURA DE CARRERA */}
                <div 
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                    openRole === 'jefe' ? 'border-usm-blue bg-sky-50/70 shadow-md ring-2 ring-usm-blue/20' : 'border-slate-200 bg-white hover:border-usm-blue hover:bg-sky-50/40'
                  }`}
                >
                  <div 
                    onClick={() => toggleRole('jefe')}
                    className="p-4 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-usm-navy text-white flex items-center justify-center shrink-0 shadow">
                        <Award className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
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
                    {openRole === 'jefe' ? (
                      <ChevronUp className="w-5 h-5 text-usm-blue shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-usm-blue shrink-0 ml-2" />
                    )}
                  </div>

                  {/* FORMULARIO ESPECÍFICO DE JEFATURA */}
                  {openRole === 'jefe' && (
                    <div className="p-5 border-t border-sky-200 bg-white text-xs space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 text-usm-blue">
                          <Lock className="w-3.5 h-3.5" /> Credenciales de Jefatura de Carrera
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenRole(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                        >
                          ✕ Cerrar
                        </button>
                      </div>

                      {error && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={(e) => handleRoleLogin(e, 'jefe')} className="space-y-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Correo Institucional Jefatura
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="jefatura.informatica@pracnet.usm.cl o @usm.cl"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-usm-blue"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Contraseña</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-usm-blue"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 bg-usm-navy hover:bg-usm-blue text-white font-bold rounded-xl text-xs shadow transition-all active:scale-95"
                        >
                          {loading ? 'Verificando...' : 'Ingresar como Jefe de Carrera'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* 2. SECRETARÍA DE DOCENCIA */}
                <div 
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                    openRole === 'secretaria' ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20' : 'border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/40'
                  }`}
                >
                  <div 
                    onClick={() => toggleRole('secretaria')}
                    className="p-4 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow">
                        <FileCheck2 className="w-6 h-6 text-emerald-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
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
                    {openRole === 'secretaria' ? (
                      <ChevronUp className="w-5 h-5 text-emerald-700 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 shrink-0 ml-2" />
                    )}
                  </div>

                  {/* FORMULARIO ESPECÍFICO DE SECRETARÍA */}
                  {openRole === 'secretaria' && (
                    <div className="p-5 border-t border-emerald-200 bg-white text-xs space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 text-emerald-800">
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Acceso Secretaría & Firma Digital
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenRole(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                        >
                          ✕ Cerrar
                        </button>
                      </div>

                      {error && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={(e) => handleRoleLogin(e, 'secretaria')} className="space-y-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Correo Institucional de Secretaría
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="secretaria@pracnet.usm.cl o @usm.cl"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            RUT de Funcionario (Opcional)
                          </label>
                          <input
                            type="text"
                            value={rutFuncionario}
                            onChange={(e) => setRutFuncionario(e.target.value)}
                            placeholder="12.345.678-9"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Contraseña</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow transition-all active:scale-95"
                        >
                          {loading ? 'Verificando...' : 'Ingresar a Secretaría de Docencia'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* 3. DOCENTES & PROFESORES GUÍA */}
                <div 
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                    openRole === 'docente' ? 'border-purple-600 bg-purple-50/70 shadow-md ring-2 ring-purple-600/20' : 'border-slate-200 bg-white hover:border-purple-600 hover:bg-purple-50/40'
                  }`}
                >
                  <div 
                    onClick={() => toggleRole('docente')}
                    className="p-4 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow">
                        <GraduationCap className="w-6 h-6 text-purple-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
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
                    {openRole === 'docente' ? (
                      <ChevronUp className="w-5 h-5 text-purple-700 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-purple-700 shrink-0 ml-2" />
                    )}
                  </div>

                  {/* FORMULARIO ESPECÍFICO DE DOCENTES */}
                  {openRole === 'docente' && (
                    <div className="p-5 border-t border-purple-200 bg-white text-xs space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 text-purple-800">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Acceso para Profesores y Docentes
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenRole(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                        >
                          ✕ Cerrar
                        </button>
                      </div>

                      {error && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={(e) => handleRoleLogin(e, 'docente')} className="space-y-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Correo Institucional o Asignado por Administración
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="ej: josecarrasco@pracnet.usm.cl o @usm.cl"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Contraseña</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs shadow transition-all active:scale-95"
                        >
                          {loading ? 'Verificando...' : 'Ingresar a Evaluación Docente'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* 4. ESTUDIANTE: PORTAL WEB (ESCRITORIO) */}
                <div 
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                    openRole === 'estudiante' ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/40'
                  }`}
                >
                  <div 
                    onClick={() => toggleRole('estudiante')}
                    className="p-4 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            Portal Web Estudiante (Escritorio)
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                            Perfil Discord & Muro Web
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Perfil estilo Discord con alias, biografía personalizada, Seguro Escolar y catálogo completo.
                        </p>
                      </div>
                    </div>
                    {openRole === 'estudiante' ? (
                      <ChevronUp className="w-5 h-5 text-amber-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                    )}
                  </div>

                  {/* FORMULARIO ESPECÍFICO DE ESTUDIANTE WEB */}
                  {openRole === 'estudiante' && (
                    <div className="p-5 border-t border-amber-200 bg-white text-xs space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 text-amber-800">
                          <User className="w-3.5 h-3.5 text-amber-600" /> Acceso al Portal de Estudiantes
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenRole(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                        >
                          ✕ Cerrar
                        </button>
                      </div>

                      {error && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={(e) => handleRoleLogin(e, 'estudiante')} className="space-y-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Correo Institucional Alumno (@alumnos.usm.cl)
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="nombre.apellido@alumnos.usm.cl"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Contraseña</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow transition-all active:scale-95"
                        >
                          {loading ? 'Verificando...' : 'Ingresar al Portal Estudiante'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* 5. PRACNET MÓVIL ESTUDIANTE (EXCLUSIVA MÓVIL / APK QR) */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-sky-400 bg-sky-50/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">
                          PRACNET Móvil (App Estudiantil)
                        </h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 uppercase">
                          Exclusivo Celular
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Interfaz 100% móvil exclusiva para alumnos (login, registro, Asistente IA).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => navigate('/app')}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow"
                    >
                      Abrir App Móvil
                    </button>
                    <a
                      href="/descargar-app"
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-colors shadow flex items-center gap-1"
                    >
                      📥 APK (11.9MB)
                    </a>
                  </div>
                </div>

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
