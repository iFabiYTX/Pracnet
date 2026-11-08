import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Star,
  Send,
  MessageSquare,
  User,
  Building
} from 'lucide-react';

export default function DocenteEvaluacion() {
  const [estudiantes, setEstudiantes] = useState([
    {
      id: 1,
      nombre: 'Valentina Ríos Pérez',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'Banco Estado - División Analítica',
      tituloInforme: 'Implementación de Pipeline ETL y Modelos Predictivos para Riesgo Crediticio',
      supervisorEmpresa: 'Ing. Rodrigo Castillo',
      notaEmpresa6000B: 96,
      estadoInforme: 'Entregado (Pendiente Corrección)',
      notaDocente: 0,
      feedback: ''
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza Silva',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'Tech Solutions SpA',
      tituloInforme: 'Optimización de Microservicios Backend con Node.js y Redis Cache',
      supervisorEmpresa: 'Ing. Patricia Lagos',
      notaEmpresa6000B: 92,
      estadoInforme: 'Entregado (Pendiente Corrección)',
      notaDocente: 0,
      feedback: ''
    },
    {
      id: 3,
      nombre: 'Matías González Araya',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'MercadoLibre Chile',
      tituloInforme: 'Desarrollo de Arquitectura Basada en Eventos para Facturación Electrónica',
      supervisorEmpresa: 'Ing. Felipe Morales',
      notaEmpresa6000B: 98,
      estadoInforme: 'Aprobado y Calificado',
      notaDocente: 95,
      feedback: 'Excelente rigor técnico en la implementación del patrón saga y consistencia eventual.'
    }
  ]);

  const [selectedEval, setSelectedEval] = useState(null);
  const [nota, setNota] = useState(90);
  const [comentarios, setComentarios] = useState('');
  const [guardado, setGuardado] = useState(false);

  const handleOpenEval = (est) => {
    setSelectedEval(est);
    setNota(est.notaDocente || 90);
    setComentarios(est.feedback || '');
  };

  const handleSaveEval = (e) => {
    e.preventDefault();
    setEstudiantes((prev) =>
      prev.map((est) =>
        est.id === selectedEval.id
          ? {
              ...est,
              estadoInforme: 'Aprobado y Calificado',
              notaDocente: Number(nota),
              feedback: comentarios
            }
          : est
      )
    );
    setSelectedEval(null);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 4000);
  };

  return (
    <div className="space-y-6">
      {guardado && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-sm flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-purple-600" />
          <span className="font-semibold">Calificación y retroalimentación guardadas con éxito en el expediente del estudiante.</span>
        </div>
      )}

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              Rol: Profesor Guía / Docente
            </span>
            <span className="text-xs text-slate-500">Módulo de Evaluación Pedagógica</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Evaluación de Informes de Práctica Profesional
          </h1>
          <p className="text-sm text-slate-600">
            Revisión de informes técnicos finales, ponderación de la evaluación del supervisor (Formulario 6000 B) y entrega de retroalimentación formativa.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Alumnos a Cargo</p>
          <p className="text-2xl font-black text-purple-700">{estudiantes.length}</p>
        </div>
      </div>

      {/* Listado de Informes */}
      <div className="grid grid-cols-1 gap-4">
        {estudiantes.map((est) => (
          <div
            key={est.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-600" />
                    {est.nombre}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {est.carrera}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-slate-500" />
                  {est.tituloInforme}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Empresa:</strong> {est.empresa}
                  </span>
                  <span>
                    <strong>Supervisor Empresa:</strong> {est.supervisorEmpresa}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                    Nota Supervisor (Form. 6000 B): {est.notaEmpresa6000B}/100
                  </span>
                </div>
              </div>

              {/* Botón de Evaluación */}
              <div className="shrink-0 flex items-center gap-3">
                {est.notaDocente > 0 ? (
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-semibold block">Nota Final</span>
                    <span className="text-xl font-black text-purple-700">{est.notaDocente}/100</span>
                  </div>
                ) : null}
                <button
                  onClick={() => handleOpenEval(est)}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  {est.notaDocente > 0 ? 'Editar Calificación' : 'Evaluar Informe'}
                </button>
              </div>
            </div>

            {/* Retroalimentación ya emitida */}
            {est.feedback && (
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 text-xs text-purple-950 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Comentario Formativo al Alumno:</span>
                  <p className="mt-0.5 italic text-slate-700">{est.feedback}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Calificación y Rúbrica USM */}
      {selectedEval && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase">Pauta Oficial USM</span>
                <h3 className="text-lg font-black text-slate-900">{selectedEval.nombre}</h3>
                <p className="text-xs text-slate-500">{selectedEval.tituloInforme}</p>
              </div>
              <button
                onClick={() => setSelectedEval(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEval} className="space-y-4 text-xs">
              {/* Rúbrica de Evaluación */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800">Criterios de Corrección USM:</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Cap. 1: Contexto Empresarial (20%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Cap. 2: Solución Técnica (40%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Cap. 3: Aportes e Innovación (20%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Formulario 6000 B Empresa (20%)</span>
                  </div>
                </div>
              </div>

              {/* Slider de Calificación */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800">Calificación Final (Escala 1 a 100):</label>
                  <span className="text-base font-black text-purple-700">{nota} pts</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="100"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>

              {/* Comentarios de Retroalimentación */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Retroalimentación Pedagógica al Estudiante:
                </label>
                <textarea
                  rows="3"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Detalla los puntos fuertes del informe y competencias a reforzar en el ámbito profesional..."
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs"
                ></textarea>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEval(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Emitir Calificación y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
