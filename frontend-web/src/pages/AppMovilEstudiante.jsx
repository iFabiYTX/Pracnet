import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  Bot,
  Send,
  Lock,
  Mail,
  ShieldCheck,
  ChevronRight,
  LogOut,
  MapPin,
  DollarSign,
  AlertCircle,
  FileText
} from 'lucide-react';
import api from '../api/client';

export default function AppMovilEstudiante() {
  // Estado de autenticación móvil
  const [estudianteUser, setEstudianteUser] = useState(() => {
    const saved = localStorage.getItem('pracnet_movil_estudiante');
    return saved ? JSON.parse(saved) : null;
  });

  // 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('muro'); // 'muro' | 'validacion' | 'seguimiento' | 'perfil'
  const [chatOpen, setChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos de Registro
  const [regData, setRegData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rut: '',
    carrera: 'Ingeniería Civil Informática',
    anoIngreso: '2022',
    password: '',
    terminos: false
  });

  // Mensajes del Asistente IA
  const [chatMessages, setChatMessages] = useState([
    { remitente: 'bot', texto: '¡Hola! Soy el Asistente Virtual de PRACNET. ¿En qué puedo orientarte hoy sobre tu práctica profesional o el Seguro Escolar (Ley N° 16.744)?' }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // Ofertas del Muro Móvil
  const [ofertas, setOfertas] = useState([
    {
      id: 1,
      titulo: 'Práctica Desarrollo Backend & Cloud',
      empresa: 'Tech Solutions SpA',
      modalidad: 'Remoto / Santiago',
      duracion: '360 hrs',
      estipendio: '$320.000',
      requisito: 'Mínimo 6° Semestre',
      postulado: false
    },
    {
      id: 2,
      titulo: 'Analista de Datos Jr. (ETL)',
      empresa: 'Banco Estado',
      modalidad: 'Híbrido / Santiago',
      duracion: '360 hrs',
      estipendio: '$350.000',
      requisito: 'Mínimo 70% Malla',
      postulado: true
    },
    {
      id: 3,
      titulo: 'Práctica Arquitectura Microservicios',
      empresa: 'MercadoLibre Chile',
      modalidad: 'Remoto',
      duracion: '360 hrs',
      estipendio: '$380.000',
      requisito: 'Mínimo 8° Semestre',
      postulado: false
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Login de Estudiante
  const handleLogin = (e) => {
    e.preventDefault();
    const demo = {
      nombre: 'Valentina Ríos Pérez',
      alias: '@valen_dev',
      email: loginEmail || 'valentina.rios@alumnos.usm.cl',
      rut: '20.456.789-3',
      carrera: 'Ingeniería Civil Informática',
      semestre: '9° Semestre',
      avanceMalla: '85%'
    };
    setEstudianteUser(demo);
    localStorage.setItem('pracnet_movil_estudiante', JSON.stringify(demo));
    showToast('¡Bienvenida a PRACNET Móvil!');
  };

  // Demo Login Rápido (1 toque para pruebas)
  const handleQuickStudent = (alumno) => {
    let mock;
    if (alumno === 'carlos') {
      mock = {
        nombre: 'Carlos Mendoza Silva',
        alias: '@carlos_m',
        email: 'carlos.mendoza@alumnos.usm.cl',
        rut: '20.123.456-7',
        carrera: 'Ingeniería Civil Informática',
        semestre: '6° Semestre',
        avanceMalla: '60%'
      };
    } else {
      mock = {
        nombre: 'Valentina Ríos Pérez',
        alias: '@valen_dev',
        email: 'valentina.rios@alumnos.usm.cl',
        rut: '20.456.789-3',
        carrera: 'Ingeniería Civil Informática',
        semestre: '9° Semestre',
        avanceMalla: '85%'
      };
    }
    setEstudianteUser(mock);
    localStorage.setItem('pracnet_movil_estudiante', JSON.stringify(mock));
    showToast(`Sesión iniciada como ${mock.nombre}`);
  };

  // Registro de Estudiante
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regData.terminos) {
      showToast('Debes aceptar la Política de Privacidad (Ley N° 19.628)');
      return;
    }
    const nuevo = {
      nombre: `${regData.nombre} ${regData.apellido}`,
      alias: `@${regData.nombre.toLowerCase()}_usm`,
      email: regData.email,
      rut: regData.rut,
      carrera: regData.carrera,
      semestre: '6° Semestre',
      avanceMalla: '60%'
    };
    setEstudianteUser(nuevo);
    localStorage.setItem('pracnet_movil_estudiante', JSON.stringify(nuevo));
    showToast('¡Cuenta creada exitosamente!');
  };

  const handleLogout = () => {
    localStorage.removeItem('pracnet_movil_estudiante');
    setEstudianteUser(null);
    showToast('Sesión cerrada.');
  };

  const handlePostular = (id) => {
    setOfertas(prev => prev.map(o => o.id === id ? { ...o, postulado: true } : o));
    showToast('¡Postulación enviada exitosamente a la empresa!');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userQ = inputQuery;
    const q = userQ.toLowerCase();
    setChatMessages(prev => [...prev, { remitente: 'user', texto: userQ }]);
    setInputQuery('');

    setTimeout(() => {
      let botResp = '';
      if (q.includes('seguro') || q.includes('16.744')) {
        botResp = 'El Seguro Escolar (Ley N° 16.744) cubre accidentes de trabajo y trayecto. Debe ser visado por Secretaría de Docencia antes de tu primer día de práctica.';
      } else if (q.includes('remuneracion') || q.includes('sueldo') || q.includes('pago')) {
        botResp = 'Según el Art. 8 del Código del Trabajo, la práctica no constituye contrato laboral ni exige sueldo mínimo, pero las empresas suelen dar asignaciones de movilización/colación.';
      } else if (q.includes('6000') || q.includes('formulario')) {
        botResp = 'El Formulario 6000 B es la pauta institucional que tu supervisor de empresa debe calificar y firmar al finalizar tus horas.';
      } else {
        botResp = `Respecto a "${userQ}", te recomiendo consultar en la pestaña Validación o revisar el estado con tu Jefatura.`;
      }
      setChatMessages(prev => [...prev, { remitente: 'bot', texto: botResp }]);
    }, 600);
  };

  return (
    <div className={`min-h-screen ${!estudianteUser ? 'bg-[#002855]' : 'bg-slate-50'} sm:bg-slate-900 text-slate-800 flex justify-center items-center p-0 sm:p-4 font-sans`}>
      
      {/* Contenedor exclusivo móvil: simula o renderiza pantalla nativa */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[820px] sm:max-h-[90vh] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-8 sm:border-slate-800">
        
        {/* Toast Flotante */}
        {toastMessage && (
          <div className="absolute top-14 left-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold p-3 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between animate-fade-in">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-amber-400 font-bold ml-2">✕</button>
          </div>
        )}

        {/* ============================================================== */}
        {/* PANTALLA 1: SI NO ESTÁ AUTENTICADO ➔ LOGIN & REGISTRO ESTUDIANTE */}
        {/* ============================================================== */}
        {!estudianteUser ? (
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto bg-gradient-to-b from-[#002855] via-[#003865] to-[#0A4D8C] text-white">
            
            {/* Cabecera Móvil */}
            <div className="text-center pt-6 pb-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg mb-3">
                <Briefcase className="w-7 h-7 text-slate-950" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">PRACNET Móvil</h1>
              <p className="text-xs text-amber-300 font-semibold tracking-wide uppercase mt-0.5">
                Acceso Exclusivo Estudiantes USM
              </p>
              <p className="text-[11px] text-white/70 max-w-xs mx-auto mt-2">
                Postula a prácticas profesionales, revisa tu cobertura de Seguro Escolar (Ley N° 16.744) y monitorea tus avances.
              </p>
            </div>

            {/* Selector de Pestañas: Iniciar Sesión / Registrarse */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 flex mb-4 border border-white/15">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {/* FORMULARIO DE LOGIN ESTUDIANTE */}
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-white/90 mb-1">
                    Correo Institucional (@alumnos.usm.cl)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/60 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nombre.apellido@alumnos.usm.cl"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/90 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/60 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-transform active:scale-95"
                >
                  Entrar como Estudiante
                </button>

                {/* Accesos Rápidos Demo para Evaluación */}
                <div className="pt-3 border-t border-white/15 space-y-2">
                  <p className="text-[10px] text-center text-white/70 font-semibold uppercase">
                    O ingresa con 1 toque (Demo Alumnos):
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickStudent('valentina')}
                      className="flex-1 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-[11px] font-bold text-white transition-colors"
                    >
                      Valentina Ríos (9°)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStudent('carlos')}
                      className="flex-1 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-[11px] font-bold text-white transition-colors"
                    >
                      Carlos Mendoza (6°)
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* FORMULARIO DE REGISTRO ESTUDIANTE */
              <form onSubmit={handleRegister} className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-xs overflow-y-auto max-h-[380px]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-white/90 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={regData.nombre}
                      onChange={(e) => setRegData({ ...regData, nombre: e.target.value })}
                      placeholder="Ej: Sofía"
                      className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs placeholder-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/90 mb-1">Apellido</label>
                    <input
                      type="text"
                      required
                      value={regData.apellido}
                      onChange={(e) => setRegData({ ...regData, apellido: e.target.value })}
                      placeholder="Ej: Valenzuela"
                      className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs placeholder-white/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/90 mb-1">RUT Chileno</label>
                  <input
                    type="text"
                    required
                    value={regData.rut}
                    onChange={(e) => setRegData({ ...regData, rut: e.target.value })}
                    placeholder="20.123.456-7"
                    className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs placeholder-white/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/90 mb-1">Correo Institucional USM</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="sofia.valenzuela@alumnos.usm.cl"
                    className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs placeholder-white/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/90 mb-1">Carrera</label>
                  <select
                    value={regData.carrera}
                    onChange={(e) => setRegData({ ...regData, carrera: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/30 text-white text-xs"
                  >
                    <option value="Ingeniería Civil Informática">Ingeniería Civil Informática</option>
                    <option value="Ingeniería Civil Industrial">Ingeniería Civil Industrial</option>
                    <option value="Técnico Universitario en Informática">Técnico Universitario en Informática</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/90 mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs placeholder-white/50"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="term_movil"
                    checked={regData.terminos}
                    onChange={(e) => setRegData({ ...regData, terminos: e.target.checked })}
                    className="mt-1 rounded accent-amber-400"
                  />
                  <label htmlFor="term_movil" className="text-[10px] text-white/80 leading-tight">
                    Acepto la Política de Privacidad de Datos de la USM conforme a la <strong>Ley N° 19.628</strong>.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-transform active:scale-95"
                >
                  Registrarme e Ingresar
                </button>
              </form>
            )}

            <p className="text-[10px] text-center text-white/50 pt-2">
              © 2026 Universidad Técnica Federico Santa María • App Estudiantil
            </p>
          </div>
        ) : (
          /* ============================================================== */
          /* PANTALLA 2: ESTUDIANTE AUTENTICADO ➔ INTERFAZ MÓVIL EXCLUSIVA   */
          /* ============================================================== */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* Top Bar Móvil */}
            <div className="bg-[#002855] text-white px-5 py-3 flex items-center justify-between shrink-0 shadow">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  {estudianteUser.nombre.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-xs tracking-tight text-white">{estudianteUser.nombre}</p>
                  <p className="text-[10px] text-amber-300 font-mono">{estudianteUser.alias || '@alumno_usm'} • {estudianteUser.semestre}</p>
                </div>
              </div>

              {/* Botón Asistente IA Flotante */}
              <button
                onClick={() => setChatOpen(true)}
                className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition-transform"
              >
                <Sparkles className="w-3 h-3" />
                Asistente IA
              </button>
            </div>

            {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA MÓVIL */}
            <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4">
              
              {/* TAB 1: MURO DE PRÁCTICAS MÓVIL */}
              {activeTab === 'muro' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900 text-sm">Muro de Ofertas</p>
                      <p className="text-[10px] text-slate-500">Exclusivo para {estudianteUser.carrera}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                      3 vacantes hoy
                    </span>
                  </div>

                  {ofertas.map((of) => (
                    <div key={of.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Convenio Vigente
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{of.duracion}</span>
                      </div>

                      <h4 className="font-black text-slate-900 text-xs">{of.titulo}</h4>
                      <p className="text-xs font-semibold text-usm-blue">{of.empresa}</p>

                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {of.modalidad}</span>
                        <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> {of.estipendio}</span>
                      </div>

                      <div className="pt-2">
                        {of.postulado ? (
                          <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-center text-xs">
                            ✓ Postulación Enviada
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePostular(of.id)}
                            className="w-full py-2 bg-usm-navy hover:bg-usm-blue text-white font-bold rounded-xl text-xs shadow transition-colors active:scale-95"
                          >
                            Postular en 1 Toque
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: VALIDACIÓN CURRICULAR (65%) */}
              {activeTab === 'validacion' && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900 text-xs">Progreso de Habilitación</span>
                      <span className="font-black text-usm-blue text-sm">{estudianteUser.avanceMalla || '85%'}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-usm-blue to-emerald-500 h-2.5 rounded-full w-[85%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-500">Cumples con el mínimo para realizar Práctica Profesional (360 hrs)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">Créditos Curriculares</p>
                          <p className="text-[10px] text-slate-500">+70% asignaturas aprobadas</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">OK</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">Seguro Escolar Ley N° 16.744</p>
                          <p className="text-[10px] text-slate-500">Visado por Secretaría de Docencia</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Visado</span>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-bold text-amber-950 text-xs">Formulario 6000 B</p>
                          <p className="text-[10px] text-amber-700">Se entrega al finalizar tu práctica</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Pendiente</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEGUIMIENTO EN 4 FASES */}
              {activeTab === 'seguimiento' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="font-black text-slate-900 text-xs">Línea de Tiempo de Práctica</p>
                    <p className="text-[10px] text-slate-500">Empresa: Banco Estado (Analista ETL)</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">✓</div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">1. Postulación Enviada</p>
                        <p className="text-[10px] text-slate-400">10 Oct 2026</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">✓</div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">2. Selección Empresa</p>
                        <p className="text-[10px] text-slate-400">Aceptada por Supervisor</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">3</div>
                      <div>
                        <p className="font-bold text-blue-900 text-xs">3. Validación y Seguro Escolar</p>
                        <p className="text-[10px] text-slate-500">Firma digital aplicada por Secretaría</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 opacity-50">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">4</div>
                      <div>
                        <p className="font-bold text-slate-600 text-xs">4. Convalidación en SIGA</p>
                        <p className="text-[10px] text-slate-400">Pendiente informe final</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PERFIL MÓVIL ESTUDIANTE */}
              {activeTab === 'perfil' && (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-usm-navy text-amber-400 mx-auto flex items-center justify-center font-black text-2xl shadow">
                      {estudianteUser.nombre.charAt(0)}
                    </div>
                    <h3 className="font-black text-slate-900 text-sm">{estudianteUser.nombre}</h3>
                    <p className="text-xs font-mono font-bold text-usm-blue">{estudianteUser.alias || '@alumno_usm'}</p>
                    <p className="text-[11px] text-slate-500">{estudianteUser.carrera}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">RUT:</span>
                      <span className="font-mono font-bold text-slate-800">{estudianteUser.rut}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Correo:</span>
                      <span className="font-mono text-slate-800">{estudianteUser.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Seguro Ley 16.744:</span>
                      <span className="font-bold text-emerald-700">✓ Activo</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión Móvil
                  </button>
                </div>
              )}
            </div>

            {/* MODAL DEL ASISTENTE IA */}
            {chatOpen && (
              <div className="absolute inset-0 bg-white z-50 flex flex-col">
                <div className="bg-[#002855] text-white p-3.5 flex items-center justify-between shrink-0 shadow">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-bold text-xs">Asistente Virtual PRACNET</p>
                      <p className="text-[10px] text-amber-200">Ley 16.744, Art. 8 Código del Trabajo & SIGA</p>
                    </div>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-white font-bold p-1">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-3.5 space-y-2 text-xs bg-slate-50">
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        m.remitente === 'user'
                          ? 'ml-auto bg-usm-navy text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                      }`}
                    >
                      {m.texto}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Haz tu consulta institucional..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-usm-blue"
                  />
                  <button type="submit" className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* BOTTOM NAVIGATION BAR TÁCTIL (MOCKUP 9.1) */}
            <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-around shrink-0 text-[10px] font-bold shadow-lg">
              <button
                onClick={() => setActiveTab('muro')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'muro' ? 'text-usm-blue' : 'text-slate-400'}`}
              >
                <Briefcase className="w-4 h-4" />
                Muro
              </button>
              <button
                onClick={() => setActiveTab('validacion')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'validacion' ? 'text-usm-blue' : 'text-slate-400'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Validación
              </button>
              <button
                onClick={() => setActiveTab('seguimiento')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'seguimiento' ? 'text-usm-blue' : 'text-slate-400'}`}
              >
                <Clock className="w-4 h-4" />
                Seguimiento
              </button>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`flex flex-col items-center gap-0.5 ${activeTab === 'perfil' ? 'text-usm-blue' : 'text-slate-400'}`}
              >
                <User className="w-4 h-4" />
                Mi Perfil
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
