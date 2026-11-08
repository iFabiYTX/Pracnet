import React, { useState } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  Send,
  User,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Mail
} from 'lucide-react';

export default function SupervisionJefatura() {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      estudiante: 'Valentina Ríos Pérez',
      carrera: 'Ingeniería Civil Informática (9° Semestre)',
      empresa: 'Banco Estado',
      asunto: 'Consulta sobre convalidación de horas adicionales',
      ultimoMensaje: 'Profesor, en la empresa me ofrecieron extender 40 horas para terminar la puesta en producción del modelo ETL. ¿Cuenta para la práctica?',
      fecha: 'Hoy, 11:20',
      estado: 'respondido',
      respuesta: 'Estimada Valentina, excelente iniciativa. Esas 40 horas quedarán consignadas en el anexo del Formulario 6000 B timbrado por tu supervisor.'
    },
    {
      id: 2,
      estudiante: 'Carlos Mendoza Silva',
      carrera: 'Ingeniería Civil Informática (6° Semestre)',
      empresa: 'Tech Solutions SpA',
      asunto: 'Alerta de atraso en carga de certificado de seguro',
      ultimoMensaje: 'Estimado Jefe de Carrera, ya solicité el certificado de alumno regular en SIGA pero el sistema estaba en mantención ayer.',
      fecha: 'Ayer, 16:45',
      estado: 'pendiente_atencion',
      respuesta: ''
    },
    {
      id: 3,
      estudiante: 'Sebastián Alarcón Tapia',
      carrera: 'Ingeniería Civil Informática (8° Semestre)',
      empresa: 'CMPC Automotriz',
      asunto: 'Cambio de modalidad de trabajo (Remoto a Presencial)',
      ultimoMensaje: 'Estimada Jefatura, la jefatura de la empresa me solicitó acudir a planta 2 días por semana. ¿Se debe actualizar la cobertura del seguro?',
      fecha: 'Hace 2 días',
      estado: 'respondido',
      respuesta: 'Sebastián, el Seguro Escolar Ley N° 16.744 cubre tanto teletrabajo como desplazamientos in itinere (trayecto directo). Ya lo notificamos a Secretaría.'
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(mensajes[1]);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!respuestaTexto.trim()) return;

    setMensajes((prev) =>
      prev.map((m) =>
        m.id === selectedChat.id
          ? { ...m, estado: 'respondido', respuesta: respuestaTexto }
          : m
      )
    );
    setSelectedChat((prev) => ({ ...prev, estado: 'respondido', respuesta: respuestaTexto }));
    setRespuestaTexto('');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Rol: Jefatura de Carrera
            </span>
            <span className="text-xs text-slate-500">Módulo de Monitoreo & Contacto Directo</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Supervisión y Comunicación con Alumnos
          </h1>
          <p className="text-sm text-slate-600">
            Canal institucional para resolver contingencias académicas, seguimiento de casos de práctica y alertas tempranas.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center">
            <p className="text-xs font-bold text-amber-700">Por Atender</p>
            <p className="text-xl font-black text-amber-900">
              {mensajes.filter((m) => m.estado === 'pendiente_atencion').length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center">
            <p className="text-xs font-bold text-blue-700">Casos Activos</p>
            <p className="text-xl font-black text-blue-900">{mensajes.length}</p>
          </div>
        </div>
      </div>

      {/* Grid de Chat / Bandeja de Entrada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {/* Columna Izquierda: Casos */}
        <div className="lg:col-span-5 border-r border-slate-200 divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Bandeja de Consultas de Estudiantes
            </h3>
          </div>
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedChat(msg)}
              className={`p-4 cursor-pointer transition-all ${
                selectedChat?.id === msg.id
                  ? 'bg-blue-50/70 border-l-4 border-usm-blue'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-usm-blue" />
                  {msg.estudiante}
                </span>
                <span className="text-[10px] text-slate-400">{msg.fecha}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 line-clamp-1">{msg.asunto}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{msg.ultimoMensaje}</p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  {msg.empresa}
                </span>
                {msg.estado === 'pendiente_atencion' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Por responder
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Atendido
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Columna Derecha: Detalle y Respuesta */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6">
          {selectedChat ? (
            <>
              <div className="space-y-4">
                {/* Cabecera del Alumno */}
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedChat.estudiante}</h3>
                    <p className="text-xs text-slate-500">{selectedChat.carrera} | {selectedChat.empresa}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="mailto:alumno@alumnos.usm.cl"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                      title="Enviar correo institucional"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Mensaje del Estudiante */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Asunto: {selectedChat.asunto}</span>
                    <span className="text-slate-400 font-normal">{selectedChat.fecha}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-2">
                    "{selectedChat.ultimoMensaje}"
                  </p>
                </div>

                {/* Respuesta previa si existe */}
                {selectedChat.respuesta && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-usm-blue">
                      <Sparkles className="w-4 h-4 text-usm-blue" />
                      Respuesta Oficial Jefatura de Carrera:
                    </div>
                    <p className="text-xs text-blue-950 leading-relaxed mt-1">
                      {selectedChat.respuesta}
                    </p>
                  </div>
                )}
              </div>

              {/* Formulario de Respuesta */}
              <form onSubmit={handleEnviar} className="space-y-3 pt-4 border-t border-slate-100">
                {enviado && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Respuesta enviada al buzón del estudiante.
                  </p>
                )}
                <label className="block text-xs font-bold text-slate-700">
                  Emitir Orientación / Resolución Institucional:
                </label>
                <textarea
                  rows="3"
                  value={respuestaTexto}
                  onChange={(e) => setRespuestaTexto(e.target.value)}
                  placeholder="Escribe tu indicación para el alumno..."
                  className="w-full p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue text-xs"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-usm-navy hover:bg-usm-blue text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Indicación a PRACNET Móvil
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-24 text-slate-400 text-sm">
              Selecciona una consulta para revisar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
