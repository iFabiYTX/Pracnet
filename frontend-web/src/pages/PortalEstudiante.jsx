import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Briefcase,
  QrCode,
  Download,
  Camera,
  CheckCircle2,
  ExternalLink,
  Award,
  Hash,
  Mail,
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Palette,
  Edit3,
  Save,
  FileText
} from 'lucide-react';

export default function PortalEstudiante() {
  const { user, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [toastMessage, setToastMessage] = useState('');

  // Estado del Perfil Discord-Style
  const [perfil, setPerfil] = useState({
    nombreCompleto: user?.nombre || 'Valentina Ríos Pérez',
    alias: '@valen_dev',
    email: user?.email || 'valentina.rios@alumnos.usm.cl',
    rut: '20.456.789-3',
    carrera: 'Ingeniería Civil Informática',
    semestre: '9° Semestre (85% Malla)',
    estadoActividad: '🟢 Buscando Práctica Profesional (360 hrs)',
    bannerTheme: 'from-indigo-600 via-purple-600 to-pink-500',
    avatarDecor: 'gold', // 'none', 'gold', 'cyber', 'matrix'
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Estudiante apasionada por arquitecturas backend en Node.js, pipelines ETL en Python y bases de datos distribuidas. Busco práctica profesional para aplicar ingeniería de software en proyectos de impacto real.',
    skills: ['Node.js', 'Python', 'MySQL', 'Redis', 'React', 'AWS EC2', 'Docker']
  });

  const [nuevoSkill, setNuevoSkill] = useState('');

  // Banners predefinidos estilo Discord
  const bannerOptions = [
    { name: 'Púrpura Galáctico', class: 'from-indigo-600 via-purple-600 to-pink-500' },
    { name: 'USM Navy & Gold', class: 'from-[#002855] via-[#003B71] to-amber-500' },
    { name: 'Cyberpunk Neón', class: 'from-cyan-500 via-blue-600 to-fuchsia-600' },
    { name: 'Matrix Emerald', class: 'from-emerald-700 via-teal-800 to-slate-900' },
    { name: 'Sunset Warm', class: 'from-amber-500 via-orange-600 to-rose-600' }
  ];

  // Marcos decorativos estilo Discord
  const decorOptions = [
    { id: 'none', label: 'Sin Marco', ringClass: 'border-white' },
    { id: 'gold', label: 'Marco Dorado USM 🌟', ringClass: 'ring-4 ring-amber-400 ring-offset-2 border-amber-300' },
    { id: 'cyber', label: 'Cyberpunk Neón ⚡', ringClass: 'ring-4 ring-cyan-400 ring-offset-2 border-fuchsia-400' },
    { id: 'matrix', label: 'Matrix Hacker 🌿', ringClass: 'ring-4 ring-emerald-500 ring-offset-2 border-emerald-400' }
  ];

  // Guardar Cambios del Perfil
  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    localStorage.setItem('pracnet_student_profile', JSON.stringify(perfil));
    setToastMessage('¡Perfil actualizado con éxito! Tus cambios ya son visibles para Jefatura de Carrera.');
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!nuevoSkill.trim()) return;
    if (!perfil.skills.includes(nuevoSkill.trim())) {
      setPerfil({ ...perfil, skills: [...perfil.skills, nuevoSkill.trim()] });
    }
    setNuevoSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setPerfil({ ...perfil, skills: perfil.skills.filter(s => s !== skillToRemove) });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 min-h-screen font-sans">
      <Header
        title="Portal Web del Estudiante"
        subtitle="Entorno completo para personalización de perfil, gestión de postulaciones y Seguro Escolar USM"
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Toast Notificación */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="font-bold text-slate-500 hover:text-slate-800">✕</button>
          </div>
        )}

        {/* Barra de Pestañas del Portal del Estudiante */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'perfil'
                ? 'bg-usm-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-amber-400" />
            Mi Perfil (Estilo Discord)
          </button>
          <button
            onClick={() => setActiveTab('muro')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'muro'
                ? 'bg-usm-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-400" />
            Muro de Ofertas Web
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'documentos'
                ? 'bg-usm-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Seguro Escolar & Trámites
          </button>
          <button
            onClick={() => setActiveTab('app_movil')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'app_movil'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            Descargar PRACNET Móvil (Código QR)
          </button>
        </div>

        {/* ============================================================== */}
        {/* SECCIÓN 1: MI PERFIL ESTILO DISCORD                             */}
        {/* ============================================================== */}
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: Tarjeta de Vista Previa Estilo Discord */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 sticky top-6">
              {/* Banner Personalizado */}
              <div className={`h-36 bg-gradient-to-r ${perfil.bannerTheme} relative transition-all duration-300`}>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white/90">
                  Vista Previa Discord-Style
                </span>
              </div>

              {/* Contenedor del Avatar y Datos Principales */}
              <div className="px-6 pb-6 relative pt-0">
                {/* Avatar con Marco Decorativo */}
                <div className="relative -mt-16 mb-3 inline-block">
                  <div className={`w-28 h-28 rounded-full overflow-hidden border-4 bg-slate-800 shadow-xl ${
                    decorOptions.find(d => d.id === perfil.avatarDecor)?.ringClass || 'border-white'
                  }`}>
                    <img
                      src={perfil.avatarUrl}
                      alt={perfil.nombreCompleto}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Insignia online/status */}
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" title="En línea en PRACNET"></span>
                </div>

                {/* Nombre y Alias */}
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    {perfil.nombreCompleto}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      {perfil.alias}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                      Estudiante USM
                    </span>
                  </div>
                </div>

                {/* Estado Activo */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
                  <span>{perfil.estadoActividad}</span>
                </div>

                {/* Insignias de Perfil (Badges estilo Discord) */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Insignias de Reconocimiento USM
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-700/50 text-[10px] font-bold">
                      <GraduationCap className="w-3 h-3" /> Alumno Regular 2026-2
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" /> Ley 16.744 Vigente
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-900/40 text-amber-300 border border-amber-700/50 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" /> Habilitado Práctica
                    </span>
                  </div>
                </div>

                {/* Acerca de mí */}
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Acerca de mí
                  </p>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {perfil.bio}
                  </p>
                </div>

                {/* Competencias y Tecnologías */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Habilidades Técnicas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {perfil.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono">
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Editor de Perfil y Personalización */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-usm-blue flex items-center gap-1.5">
                  <Palette className="w-4 h-4" />
                  Personalización de Identidad Estudiantil
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Editar mi Perfil en PRACNET
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Tu nombre completo es el oficial de registro curricular. Tu <strong>alias</strong> permite a Jefatura de Carrera y empresas ubicarte fácilmente si existen alumnos con nombres similares.
                </p>
              </div>

              <form onSubmit={handleGuardarPerfil} className="space-y-5 text-xs">
                {/* 1. Selector de Banner */}
                <div>
                  <label className="font-bold text-slate-800 block mb-2">
                    Selecciona el Banner de tu Perfil (Estilo Discord):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {bannerOptions.map((b, i) => (
                      <div
                        key={i}
                        onClick={() => setPerfil({ ...perfil, bannerTheme: b.class })}
                        className={`h-12 rounded-xl bg-gradient-to-r ${b.class} cursor-pointer p-2 flex items-end justify-start border-2 transition-all ${
                          perfil.bannerTheme === b.class ? 'border-usm-navy scale-105 shadow' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded backdrop-blur">
                          {b.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Selector de Marco Decorativo de Avatar */}
                <div>
                  <label className="font-bold text-slate-800 block mb-2">
                    Marco Decorativo para tu Foto de Perfil:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {decorOptions.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setPerfil({ ...perfil, avatarDecor: d.id })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          perfil.avatarDecor === d.id
                            ? 'border-usm-navy bg-blue-50 font-bold text-usm-navy shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Datos de Identificación (Nombre, Alias, Correo, RUT) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre Completo (Curricular)</label>
                    <input
                      type="text"
                      value={perfil.nombreCompleto}
                      onChange={(e) => setPerfil({ ...perfil, nombreCompleto: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-usm-blue"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>Alias / Apodo Distintivo</span>
                      <span className="text-[10px] text-amber-700 font-normal">Identificador único</span>
                    </label>
                    <input
                      type="text"
                      value={perfil.alias}
                      onChange={(e) => setPerfil({ ...perfil, alias: e.target.value })}
                      required
                      placeholder="@tu_apodo"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-usm-navy font-mono focus:ring-2 focus:ring-usm-blue"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Correo Institucional USM</label>
                    <input
                      type="email"
                      value={perfil.email}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">RUT</label>
                    <input
                      type="text"
                      value={perfil.rut}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* 4. Estado de Actividad */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado de Actividad Actual</label>
                  <select
                    value={perfil.estadoActividad}
                    onChange={(e) => setPerfil({ ...perfil, estadoActividad: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="🟢 Buscando Práctica Profesional (360 hrs)">🟢 Buscando Práctica Profesional (360 hrs)</option>
                    <option value="🟡 En Proceso de Selección con Empresas">🟡 En Proceso de Selección con Empresas</option>
                    <option value="🟣 Práctica Aprobada por Jefatura">🟣 Práctica Aprobada por Jefatura</option>
                    <option value="⚪ Validando Informe Final en SIGA">⚪ Validando Informe Final en SIGA</option>
                  </select>
                </div>

                {/* 5. Biografía / Acerca de mí */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Biografía / Acerca de mí</label>
                  <textarea
                    rows="3"
                    value={perfil.bio}
                    onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-usm-blue leading-relaxed"
                    placeholder="Describe tus intereses y áreas tecnológicas de especialidad..."
                  ></textarea>
                </div>

                {/* 6. Habilidades Técnicas */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Habilidades y Tecnologías</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={nuevoSkill}
                      onChange={(e) => setNuevoSkill(e.target.value)}
                      placeholder="Ej: FastAPI, GraphQL, Kotlin..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900"
                    >
                      + Agregar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {perfil.skills.map((s) => (
                      <span
                        key={s}
                        onClick={() => handleRemoveSkill(s)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors"
                        title="Clic para eliminar"
                      >
                        #{s} <span className="font-bold text-slate-400 hover:text-red-600">✕</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón Guardar */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-usm-navy hover:bg-usm-blue text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    Guardar Perfil Estudiantil
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN 2: MURO DE OFERTAS WEB COMPLETO                         */}
        {/* ============================================================== */}
        {activeTab === 'muro' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Catálogo de Ofertas Disponibles</h3>
                <p className="text-xs text-slate-500">Filtrado automáticamente para tu carrera: {perfil.carrera}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                145 Plazas Activas en Convenio
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Convenio Oficial USM
                    </span>
                    <span className="text-[11px] text-slate-400">Publicado hoy</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Práctica Desarrollo Backend Node.js & Cloud
                  </h4>
                  <p className="text-xs font-semibold text-usm-blue">Tech Solutions SpA</p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Participa en la modernización de microservicios, optimización de base de datos MySQL y caché en Redis.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Remoto / Santiago</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 360 horas</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> $320.000 asignación</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setToastMessage('¡Postulación enviada con éxito a Tech Solutions! Puedes revisarla en la pestaña Mis Trámites.');
                    setTimeout(() => setToastMessage(''), 4500);
                  }}
                  className="w-full py-2 bg-usm-navy hover:bg-usm-blue text-white rounded-xl font-bold text-xs shadow transition-colors"
                >
                  Postular con mi Perfil
                </button>
              </div>

              {/* Tarjeta 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      95% Compatibilidad IA
                    </span>
                    <span className="text-[11px] text-slate-400">Ayer</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Analista de Datos Jr. (ETL & ML)
                  </h4>
                  <p className="text-xs font-semibold text-usm-blue">Banco Estado</p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Modelamiento de datos y desarrollo de dashboards analíticos para la división de riesgo crediticio.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Híbrido / Santiago</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 360 horas</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> $350.000 asignación</span>
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-center text-xs font-bold text-emerald-800 border border-emerald-200">
                  ✓ Postulación Aprobada por Jefatura
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                      Convenio Estratégico
                    </span>
                    <span className="text-[11px] text-slate-400">Hace 3 días</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Práctica Arquitectura de Software & APIs
                  </h4>
                  <p className="text-xs font-semibold text-usm-blue">MercadoLibre Chile</p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Construcción de componentes distribuidos de alta concurrencia en Golang y Node.js.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Remoto</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 360 horas</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> $380.000 asignación</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setToastMessage('¡Postulación enviada a MercadoLibre Chile!');
                    setTimeout(() => setToastMessage(''), 4500);
                  }}
                  className="w-full py-2 bg-usm-navy hover:bg-usm-blue text-white rounded-xl font-bold text-xs shadow transition-colors"
                >
                  Postular con mi Perfil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN 3: SEGURO ESCOLAR Y TRÁMITES FORMALES                    */}
        {/* ============================================================== */}
        {activeTab === 'documentos' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Validación Oficial USM
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Estado de Cobertura y Documentos Curriculares
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Cumplimiento normativo según la Ley N° 16.744 (Seguro Escolar contra Accidentes del Trabajo) y Art. 8 del Código del Trabajo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Seguro Escolar</span>
                <p className="text-base font-extrabold text-emerald-950">✓ Visado y Timbrado</p>
                <p className="text-[11px] text-emerald-700">Póliza POL-16744-892 emitida por Secretaría de Docencia.</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase">Habilitación Curricular</span>
                <p className="text-base font-extrabold text-blue-950">85% Malla Aprobada</p>
                <p className="text-[11px] text-blue-700">Cumples con el requisito mínimo del 70% para Práctica II.</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Formulario 6000 B</span>
                <p className="text-base font-extrabold text-amber-950">Pendiente Fin de Periodo</p>
                <p className="text-[11px] text-amber-700">Tu supervisor en la empresa lo completará al finalizar tus 360 hrs.</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN 4: DESCARGA DE APP MÓVIL CON CÓDIGO QR                   */}
        {/* ============================================================== */}
        {activeTab === 'app_movil' && (
          <div className="bg-gradient-to-br from-[#002855] via-[#003B71] to-[#0A4D8C] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Información y explicaciones */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase">
                  <Smartphone className="w-3.5 h-3.5" /> Experiencia Móvil Optimizada
                </span>
                
                <h2 className="text-3xl font-black tracking-tight leading-tight">
                  Lleva tu práctica en el bolsillo con <span className="text-amber-400">PRACNET Móvil</span>
                </h2>

                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  A diferencia del portal web completo, la aplicación móvil está diseñada exclusivamente para teléfonos estándar: interfaz simplificada, notificaciones push de selección, seguimiento en 4 pasos y Asistente IA disponible 24/7.
                </p>

                <div className="space-y-2 text-xs text-white/90 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Postulación en 1 toque adaptada a pantallas táctiles.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Línea de tiempo de avance en 4 fases en tiempo real.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Asistente Virtual con conocimiento del Art. 8 y Ley 16.744.</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <a
                    href="https://github.com/iFabiYTX/Pracnet/releases"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Descargar APK Oficial (Android)
                  </a>
                  <button
                    onClick={() => window.open('/simulador-estudiante', '_blank')}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir Simulador Web
                  </button>
                </div>
              </div>

              {/* TARJETA CON CÓDIGO QR REAL GENERADO */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-3xl shadow-2xl text-slate-900 text-center max-w-xs w-full space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-usm-navy">
                    Escanear con tu Celular
                  </p>

                  {/* Imagen PNG del Código QR Real */}
                  <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-200 inline-block shadow-inner">
                    <img
                      src="/qr_code_pracnet.png"
                      alt="Código QR Oficial PRACNET Móvil"
                      className="w-44 h-44 mx-auto rounded-xl shadow-sm object-contain"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Apunta con la cámara de tu smartphone para instalar la versión móvil de PRACNET.
                  </p>

                  <div className="pt-1">
                    <a
                      href="/qr_code_pracnet.png"
                      download="QR_PRACNET_Movil.png"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                      title="Descargar imagen PNG del código QR"
                    >
                      <Download className="w-3.5 h-3.5 text-usm-blue" />
                      Descargar Imagen QR (.png)
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
