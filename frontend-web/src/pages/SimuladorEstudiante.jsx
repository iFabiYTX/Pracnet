import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  Send,
  FileText,
  User,
  ArrowRight,
  Filter,
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react';

export default function SimuladorEstudiante() {
  const [activeTab, setActiveTab] = useState('muro');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { remitente: 'bot', texto: '¡Hola Valentina! Soy el Asistente Virtual de PRACNET. ¿En qué puedo orientarte hoy sobre tu práctica profesional o el Seguro Escolar (Ley 16.744)?' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [postulaciones, setPostulaciones] = useState([
    { id: 1, oferta: 'Desarrollo Backend Node.js & Cloud', empresa: 'Tech Solutions SpA', estado: 'Aprobado por Jefatura', fase: 4 },
    { id: 2, oferta: 'Analista de Datos Jr. (ETL)', empresa: 'Banco Estado', estado: 'En Selección Técnica', fase: 2 }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    const q = userText.toLowerCase();
    setChatMessages((prev) => [...prev, { remitente: 'user', texto: userText }]);
    setInputQuery('');

    setTimeout(() => {
      let botResp = '';
      if (q.includes('seguro') || q.includes('16.744')) {
        botResp = 'El Seguro Escolar (Ley N° 16.744) cubre accidentes de trabajo y de trayecto durante tu jornada formativa. Ya fue visado y timbrado con firma digital por Secretaría de Docencia.';
      } else if (q.includes('formulario') || q.includes('6000')) {
        botResp = 'El Formulario 6000 B debe ser completado por tu supervisor en la empresa al término de tus 360 horas. Debes solicitar su firma y timbre oficial.';
      } else if (q.includes('siga') || q.includes('convalid')) {
        botResp = 'La convalidación en SIGA se efectúa una vez que tu profesor guía califica tu informe de práctica y Secretaría emite el acta oficial.';
      } else {
        botResp = `Comprendo tu duda sobre "${userText}". Recuerda que puedes enviar un mensaje directo a tu Jefatura de Carrera desde la pestaña Seguimiento.`;
      }
      setChatMessages((prev) => [...prev, { remitente: 'bot', texto: botResp }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Simulador Web: Experiencia del Estudiante
          </span>
          <span className="text-xs text-slate-500">React Native / PRACNET Móvil</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          App PRACNET Estudiante (Mockup 9.1)
        </h1>
        <p className="text-sm text-slate-600">
          Vista interactiva de la aplicación móvil donde el alumno postula, monitorea sus 4 fases de práctica y consulta al Asistente IA.
        </p>
      </div>

      {/* Contenedor Mockup de Teléfono Celular */}
      <div className="flex justify-center py-4">
        <div className="w-[380px] h-[750px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-900"></span>
          </div>

          {/* Pantalla del Teléfono (Viewport Móvil) */}
          <div className="flex-1 bg-slate-50 rounded-[36px] overflow-hidden flex flex-col relative text-slate-800">
            {/* Top Bar Móvil */}
            <div className="bg-[#002855] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow">
              <div>
                <p className="text-xs font-bold text-amber-300">PRACNET MÓVIL</p>
                <p className="text-[11px] text-white/80">Valentina Ríos (9° Sem)</p>
              </div>
              <button
                onClick={() => setChatOpen(true)}
                className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow hover:scale-105 transition-transform"
                title="Asistente IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido según Tab Móvil */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* TAB 1: MURO DE PRÁCTICAS */}
              {activeTab === 'muro' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="font-extrabold text-slate-900 text-sm">Muro de Ofertas USM</p>
                    <p className="text-[11px] text-slate-500">Filtrado por tu carrera: Ing. Civil Informática</p>
                  </div>

                  {/* Tarjeta Oferta 1 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Convenio Activo
                      </span>
                      <span className="text-[10px] text-slate-400">Publicado hoy</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Práctica Desarrollo Backend & Cloud</h4>
                    <p className="text-[11px] text-slate-600">Tech Solutions SpA</p>
                    <div className="flex gap-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> Remoto / Santiago</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> 360 hrs</span>
                    </div>
                    <button className="w-full py-1.5 bg-usm-navy text-white rounded-xl font-bold text-[11px]">
                      Postular en 1 Clic
                    </button>
                  </div>

                  {/* Tarjeta Oferta 2 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        95% Match IA
                      </span>
                      <span className="text-[10px] text-slate-400">Ayer</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Analista de Datos Jr. (Machine Learning)</h4>
                    <p className="text-[11px] text-slate-600">Banco Estado</p>
                    <div className="flex gap-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> Híbrido</span>
                      <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" /> $280.000</span>
                    </div>
                    <span className="block text-center text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1 rounded-lg">
                      ✓ Postulación Enviada
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: VALIDACIÓN CURRICULAR (65%) */}
              {activeTab === 'validacion' && (
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Progreso de Habilitación</span>
                      <span className="font-black text-usm-blue text-sm">65%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-usm-blue to-cyan-500 h-2.5 rounded-full w-[65%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-500">Completados 3 de 5 requisitos de Jefatura y Secretaría</p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        80% Créditos Malla Aprobados
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">OK</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Certificado Alumno Regular
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">Cargado</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Seguro Escolar Ley 16.744
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">Visado</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-amber-900">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Formulario 6000 B Timbrado
                      </span>
                      <span className="text-[10px] text-amber-800 font-bold">En Proceso</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEGUIMIENTO EN 4 FASES */}
              {activeTab === 'seguimiento' && (
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="font-bold text-slate-900">Línea de Tiempo de Práctica</p>
                    <p className="text-[11px] text-slate-500">Banco Estado - Analista de Datos</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">1. Postulación Enviada</p>
                        <p className="text-[10px] text-slate-400">10 Oct 2026</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">2. Selección de Empresa</p>
                        <p className="text-[10px] text-slate-400">Aceptado por Supervisor</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">
                        3
                      </div>
                      <div>
                        <p className="font-bold text-cyan-800">3. Validación y Seguro Escolar</p>
                        <p className="text-[10px] text-slate-500">Visado por Secretaría de Docencia</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 opacity-50">
                      <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        4
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">4. Aprobación y SIGA</p>
                        <p className="text-[10px] text-slate-400">Pendiente informe final</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL DEL ASISTENTE IA EN LA APP */}
            {chatOpen && (
              <div className="absolute inset-0 bg-white z-20 flex flex-col">
                <div className="bg-[#002855] text-white p-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-bold text-xs">Asistente Virtual PRACNET</p>
                      <p className="text-[10px] text-amber-200">Experto en Ley 16.744 y SIGA</p>
                    </div>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-white font-bold text-xs p-1">
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-2xl max-w-[85%] ${
                        m.remitente === 'user'
                          ? 'ml-auto bg-usm-navy text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      {m.texto}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-200 flex gap-1">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Pregunta sobre tu práctica..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-usm-blue"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Navigation Bar del Teléfono */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 text-[10px] font-bold">
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
                onClick={() => setChatOpen(true)}
                className="flex flex-col items-center gap-0.5 text-amber-600"
              >
                <Sparkles className="w-4 h-4" />
                Asistente IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
