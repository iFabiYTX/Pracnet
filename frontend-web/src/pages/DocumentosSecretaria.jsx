import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Send,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Stamp,
  User,
  Building,
  Calendar
} from 'lucide-react';

export default function DocumentosSecretaria() {
  const [activeTab, setActiveTab] = useState('pendientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [firmando, setFirmando] = useState(false);
  const [notificacion, setNotificacion] = useState('');

  // Casos de estudiantes en trámite documental
  const [tramites, setTramites] = useState([
    {
      id: 1,
      estudiante: 'Valentina Ríos Pérez',
      rut: '20.456.789-3',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'Banco Estado - División Analítica',
      tipoPractica: 'Práctica Profesional (360 hrs)',
      fechaInicio: '15/12/2026',
      documentos: [
        { nombre: 'Certificado de Alumno Regular (Semestre 2026-2)', estado: 'Verificado', tipo: 'requisito' },
        { nombre: 'Póliza Seguro Escolar (Ley N° 16.744)', estado: 'Pendiente Firma Jefatura/Secretaría', tipo: 'seguro' },
        { nombre: 'Carta de Aceptación Empresa', estado: 'Verificado', tipo: 'empresa' }
      ],
      estadoTramite: 'pendiente_firma',
      progresoCurricular: '9° Semestre (85% Malla)'
    },
    {
      id: 2,
      estudiante: 'Carlos Mendoza Silva',
      rut: '20.123.456-7',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'Tech Solutions SpA',
      tipoPractica: 'Práctica Inicial (180 hrs)',
      fechaInicio: '02/01/2027',
      documentos: [
        { nombre: 'Certificado de Alumno Regular', estado: 'Verificado', tipo: 'requisito' },
        { nombre: 'Póliza Seguro Escolar (Ley N° 16.744)', estado: 'Pendiente Firma Jefatura/Secretaría', tipo: 'seguro' }
      ],
      estadoTramite: 'pendiente_firma',
      progresoCurricular: '6° Semestre (60% Malla)'
    },
    {
      id: 3,
      estudiante: 'Matías González Araya',
      rut: '19.987.654-1',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'MercadoLibre Chile',
      tipoPractica: 'Práctica Profesional (360 hrs)',
      fechaInicio: '10/11/2026',
      documentos: [
        { nombre: 'Formulario 6000 B Timbrado por Empresa (Nota 95/100)', estado: 'Aprobado', tipo: 'formulario' },
        { nombre: 'Informe Final de Práctica Visado', estado: 'Aprobado', tipo: 'informe' },
        { nombre: 'Acta de Convalidación Curricular', estado: 'Listo para SIGA', tipo: 'siga' }
      ],
      estadoTramite: 'en_siga',
      progresoCurricular: '10° Semestre (95% Malla)'
    },
    {
      id: 4,
      estudiante: 'Sofía Valenzuela Castro',
      rut: '21.002.334-K',
      carrera: 'Ingeniería Civil Informática',
      empresa: 'Entel Digital',
      tipoPractica: 'Práctica Inicial (180 hrs)',
      fechaInicio: '01/10/2026',
      documentos: [
        { nombre: 'Póliza Seguro Escolar Firmada', estado: 'Firmado y Timbrado', tipo: 'seguro' },
        { nombre: 'Registro SIGA N° 45892', estado: 'Convalidado', tipo: 'siga' }
      ],
      estadoTramite: 'completado',
      progresoCurricular: '6° Semestre (55% Malla)'
    }
  ]);

  const aplicarFirmaYTimbre = (tramiteId) => {
    setFirmando(true);
    setTimeout(() => {
      setTramites((prev) =>
        prev.map((t) => {
          if (t.id === tramiteId) {
            return {
              ...t,
              estadoTramite: 'en_siga',
              documentos: t.documentos.map((d) =>
                d.tipo === 'seguro' ? { ...d, estado: 'Firmado con Sello Digital SHA-256' } : d
              )
            };
          }
          return t;
        })
      );
      setFirmando(false);
      setSelectedStudent(null);
      setNotificacion('Documento visado exitosamente con Timbre Oficial de Secretaría de Docencia USM.');
      setTimeout(() => setNotificacion(''), 4500);
    }, 1200);
  };

  const enviarASIGA = (tramiteId) => {
    setTramites((prev) =>
      prev.map((t) => (t.id === tramiteId ? { ...t, estadoTramite: 'completado' } : t))
    );
    setNotificacion('Acta enviada satisfactoriamente al sistema central SIGA USM.');
    setTimeout(() => setNotificacion(''), 4500);
  };

  const filteredTramites = tramites.filter((t) => {
    const matchSearch =
      t.estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.rut.includes(searchTerm);
    if (!matchSearch) return false;
    if (activeTab === 'pendientes') return t.estadoTramite === 'pendiente_firma';
    if (activeTab === 'en_siga') return t.estadoTramite === 'en_siga';
    if (activeTab === 'completados') return t.estadoTramite === 'completado';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Alerta de notificación flotante */}
      {notificacion && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">{notificacion}</span>
          </div>
          <button onClick={() => setNotificacion('')} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Cabecera de la Sección */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Rol: Secretaría de Docencia
            </span>
            <span className="text-xs text-slate-500">Módulo de Aprobación & Formalización</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Gestión Documental & Seguros Escolares
          </h1>
          <p className="text-sm text-slate-600">
            Revisión, visado oficial de Seguro Escolar (Ley N° 16.744) y tramitación del Formulario 6000 B para SIGA.
          </p>
        </div>

        {/* Tarjetas KPI de Secretaría */}
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Por Visar</p>
            <p className="text-xl font-black text-amber-600">
              {tramites.filter((t) => t.estadoTramite === 'pendiente_firma').length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Para SIGA</p>
            <p className="text-xl font-black text-blue-600">
              {tramites.filter((t) => t.estadoTramite === 'en_siga').length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Convalidados</p>
            <p className="text-xl font-black text-emerald-600">
              {tramites.filter((t) => t.estadoTramite === 'completado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'pendientes'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pendientes de Firma ({tramites.filter((t) => t.estadoTramite === 'pendiente_firma').length})
          </button>
          <button
            onClick={() => setActiveTab('en_siga')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'en_siga'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            En Trámite SIGA ({tramites.filter((t) => t.estadoTramite === 'en_siga').length})
          </button>
          <button
            onClick={() => setActiveTab('completados')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'completados'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Convalidados ({tramites.filter((t) => t.estadoTramite === 'completado').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por estudiante, RUT o empresa..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Lista de Trámites */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTramites.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Información del Estudiante y Práctica */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  {item.estudiante}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                  RUT: {item.rut}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {item.progresoCurricular}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-800">Empresa:</strong> {item.empresa}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-800">Inicio:</strong> {item.fechaInicio}
                </span>
                <span className="text-emerald-700 font-medium">
                  {item.tipoPractica}
                </span>
              </div>

              {/* Documentos Asignados */}
              <div className="flex flex-wrap gap-2 pt-1">
                {item.documentos.map((doc, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                      doc.estado.includes('Pendiente')
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : doc.estado.includes('Firmado') || doc.estado.includes('Aprobado')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    {doc.nombre}: <strong>{doc.estado}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones de Secretaría */}
            <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
              <button
                onClick={() => setSelectedStudent(item)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4 text-slate-600" />
                Ver Expediente
              </button>

              {item.estadoTramite === 'pendiente_firma' && (
                <button
                  onClick={() => aplicarFirmaYTimbre(item.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Stamp className="w-4 h-4 text-emerald-200" />
                  Visar Seguro Escolar
                </button>
              )}

              {item.estadoTramite === 'en_siga' && (
                <button
                  onClick={() => enviarASIGA(item.id)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-blue-200" />
                  Enviar a SIGA
                </button>
              )}

              {item.estadoTramite === 'completado' && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Convalidado en SIGA
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredTramites.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            No hay trámites en este estado.
          </div>
        )}
      </div>

      {/* MODAL: Expediente de Práctica y Emisión Formal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">Expediente Oficial USM</span>
                <h3 className="text-xl font-black text-slate-900">{selectedStudent.estudiante}</h3>
                <p className="text-xs text-slate-500">RUT: {selectedStudent.rut} | {selectedStudent.carrera}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Detalle de Requisitos y Cobertura */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Seguro Escolar Ley N° 16.744 y D.S. N° 313
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Este trámite formaliza la cobertura médica institucional ante accidentes de trabajo y trayecto durante las {selectedStudent.tipoPractica} en la empresa <strong>{selectedStudent.empresa}</strong>.
              </p>
            </div>

            {/* Lista de Documentos del Expediente */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Documentos Verificados por Secretaría
              </h4>
              <div className="space-y-2">
                {selectedStudent.documentos.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-800">{doc.nombre}</span>
                    </div>
                    <span className="text-emerald-700 font-bold">{doc.estado}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificación y Timbre */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Timbre y Firma Digital Secretaría de Docencia</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Hash SHA-256: 7f83b165...9b9c024d</p>
              </div>
              <Stamp className="w-8 h-8 text-emerald-700" />
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cerrar
              </button>
              {selectedStudent.estadoTramite === 'pendiente_firma' && (
                <button
                  disabled={firmando}
                  onClick={() => aplicarFirmaYTimbre(selectedStudent.id)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <Stamp className="w-4 h-4" />
                  {firmando ? 'Aplicando Timbre Oficial...' : 'Aprobar y Timbrar Seguro Escolar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
