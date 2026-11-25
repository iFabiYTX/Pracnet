import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import PlanLimitBanner from '../components/PlanLimitBanner';
import api from '../api/client';
import {
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  Search,
  Printer,
  ShieldCheck,
  Star,
  Filter,
  Loader2
} from 'lucide-react';

export default function Reportes() {
  const [selectedReport, setSelectedReport] = useState('empleabilidad');
  const [carreraFilter, setCarreraFilter] = useState('todas');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [reportData, setReportData] = useState({
    planStatus: null,
    resumenGlobal: {
      totalUsuariosAlumnos: 0,
      maxAlumnosPlan: 250,
      totalJefesCarrera: 0,
      maxJefesPlan: 5,
      practicasFinalizadas: 0,
      enPracticaActiva: 0,
      enValidacionOPostulados: 0,
      sinPractica: 0,
      totalContratados: 0,
      tasaRetencionGlobal: '0.0',
      segurosVisados: 0,
      asignacionPromedio: '$312.500'
    },
    carrerasDisponibles: [],
    reporteEmpleabilidad: [],
    reporteSeguros: [],
    reporteCalificaciones: []
  });

  useEffect(() => {
    async function loadReportes() {
      setLoading(true);
      try {
        const res = await api.get('/admin/reportes');
        if (res.data?.success) {
          setReportData(res.data);
        }
      } catch (err) {
        console.error('Error cargando reportes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReportes();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Filtrado dinámico para cada reporte
  const filteredEmpleabilidad = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (reportData.reporteEmpleabilidad || []).filter((r) => {
      if (!q) return true;
      return (
        r.area.toLowerCase().includes(q) ||
        r.empresaTop.toLowerCase().includes(q)
      );
    });
  }, [reportData.reporteEmpleabilidad, searchTerm]);

  const filteredSeguros = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (reportData.reporteSeguros || []).filter((r) => {
      const matchCarrera = carreraFilter === 'todas' || r.carrera === carreraFilter;
      const matchEstado = estadoFilter === 'todos' || r.estadoPractica === estadoFilter;
      const matchQ =
        !q ||
        r.alumno.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.rut.toLowerCase().includes(q) ||
        r.carrera.toLowerCase().includes(q) ||
        r.empresa.toLowerCase().includes(q) ||
        r.poliza.toLowerCase().includes(q);
      return matchCarrera && matchEstado && matchQ;
    });
  }, [reportData.reporteSeguros, carreraFilter, estadoFilter, searchTerm]);

  const filteredCalificaciones = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (reportData.reporteCalificaciones || []).filter((r) => {
      const matchCarrera = carreraFilter === 'todas' || r.carrera === carreraFilter;
      const matchEstado = estadoFilter === 'todos' || r.estadoPractica === estadoFilter;
      const matchQ =
        !q ||
        r.alumno.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.rut.toLowerCase().includes(q) ||
        r.carrera.toLowerCase().includes(q) ||
        r.empresa.toLowerCase().includes(q) ||
        r.supervisor.toLowerCase().includes(q);
      return matchCarrera && matchEstado && matchQ;
    });
  }, [reportData.reporteCalificaciones, carreraFilter, estadoFilter, searchTerm]);

  // Exportación real a Excel (.csv UTF-8 con BOM)
  const handleExportCSV = (tipo) => {
    let headers = [];
    let rows = [];
    let filename = '';

    if (tipo === 'empleabilidad') {
      filename = 'Reporte_1_Empleabilidad_y_Retencion_USM_Concepcion_250_Alumnos.csv';
      headers = ['Area de Especialidad', 'Total Alumnos', 'Finalizadas', 'En Practica', 'En Proceso', 'Sin Practica', 'Contratados', 'Tasa Retencion', 'Asignacion Promedio', 'Empresa Lider'];
      rows = filteredEmpleabilidad.map((r) => [
        `"${r.area}"`,
        r.alumnos,
        r.finalizadas,
        r.enPractica,
        r.enProceso,
        r.sinPractica,
        r.contratados,
        `"${r.retencion}"`,
        `"${r.salarioPromedio}"`,
        `"${r.empresaTop}"`
      ]);
    } else if (tipo === 'seguros') {
      filename = 'Reporte_2_Nomina_Seguro_Escolar_Ley_16744_250_Alumnos.csv';
      headers = ['N°', 'Estudiante', 'Correo', 'RUT', 'Carrera', 'Estado Practica', 'Empresa Asignada', 'Poliza Ley 16.744', 'Estado Visado', 'Estado SIGA', 'Horas'];
      rows = filteredSeguros.map((r) => [
        r.numero,
        `"${r.alumno}"`,
        `"${r.email}"`,
        `"${r.rut}"`,
        `"${r.carrera}"`,
        `"${r.estadoPractica}"`,
        `"${r.empresa}"`,
        `"${r.poliza}"`,
        `"${r.estadoSeguro}"`,
        `"${r.convalidacionSIGA}"`,
        r.horas
      ]);
    } else if (tipo === 'calificaciones') {
      filename = 'Reporte_3_Calificaciones_Formulario_6000B_250_Alumnos.csv';
      headers = ['N°', 'Estudiante', 'Correo', 'Carrera', 'Estado Practica', 'Empresa', 'Supervisor', 'Nota Empresa (6000 B)', 'Nota Docente USM', 'Promedio Final', 'Resultado'];
      rows = filteredCalificaciones.map((r) => [
        r.numero,
        `"${r.alumno}"`,
        `"${r.email}"`,
        `"${r.carrera}"`,
        `"${r.estadoPractica}"`,
        `"${r.empresa}"`,
        `"${r.supervisor}"`,
        r.notaEmpresa6000B ?? '—',
        r.notaDocente ?? '—',
        r.promedioFinal ?? '—',
        `"${r.resultado}"`
      ]);
    }

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Archivo Excel exportado (${rows.length} registros): ${filename}`);
  };

  const handlePrintPDF = () => {
    window.print();
    showToast('Ventana de impresión institucional abierta. Selecciona "Guardar como PDF".');
  };

  const getEstadoPracticaBadge = (estado) => {
    switch (estado) {
      case 'Práctica Finalizada':
        return 'bg-emerald-100 text-emerald-800';
      case 'En Práctica Activa':
        return 'bg-blue-100 text-blue-800';
      case 'En Validación':
        return 'bg-amber-100 text-amber-800';
      case 'En Selección':
      case 'Postulado':
        return 'bg-indigo-100 text-indigo-800';
      case 'Postulación Rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const rg = reportData.resumenGlobal;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Generación de Reportes Oficiales (Plan Básico)"
        subtitle="3 Reportes Básicos Institucionales • Nómina completa de 250 estudiantes USM Sede Concepción"
      />

      <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Aviso Plan Básico */}
        <PlanLimitBanner planStatus={reportData.planStatus} />

        {/* Toast Notificación */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="font-bold text-slate-500 hover:text-slate-800">✕</button>
          </div>
        )}

        {/* 1. Selector de los 3 Reportes Básicos Obligatorios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedReport('empleabilidad')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedReport === 'empleabilidad'
                ? 'bg-white border-usm-blue shadow-md ring-2 ring-usm-blue/20'
                : 'bg-white/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                Reporte 1 • CNA & Empleabilidad
              </span>
              <TrendingUp className="w-4 h-4 text-usm-blue" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Empleabilidad & Retención Laboral
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Consolidado de los <strong>{rg.totalUsuariosAlumnos} estudiantes</strong> por área USM Concepción, retención y empresas líderes.
            </p>
          </div>

          <div
            onClick={() => setSelectedReport('seguros')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedReport === 'seguros'
                ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                : 'bg-white/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                Reporte 2 • Ley 16.744 & SIGA
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Nómina Seguro Escolar ({rg.totalUsuariosAlumnos} Alumnos)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Listado completo de los {rg.totalUsuariosAlumnos} usuarios, carreras USM Concepción, estado de práctica, pólizas y SIGA.
            </p>
          </div>

          <div
            onClick={() => setSelectedReport('calificaciones')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedReport === 'calificaciones'
                ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
                : 'bg-white/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">
                Reporte 3 • Formulario 6000 B
              </span>
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Calificaciones 6000 B ({rg.totalUsuariosAlumnos} Alumnos)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Evaluación empresa (50%) y docente USM (50%) para los {rg.totalUsuariosAlumnos} estudiantes en sus distintos estados.
            </p>
          </div>
        </div>

        {/* 2. Barra de Filtros y Exportación */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuario1@..., nombre, RUT, empresa..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue w-64"
              />
            </div>

            {selectedReport !== 'empleabilidad' && (
              <>
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={carreraFilter}
                    onChange={(e) => setCarreraFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white max-w-[230px]"
                  >
                    <option value="todas">Todas las carreras USM Concepción ({reportData.carrerasDisponibles.length})</option>
                    {reportData.carrerasDisponibles.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="todos">Todos los estados (250)</option>
                  <option value="Práctica Finalizada">Práctica Finalizada ({rg.practicasFinalizadas})</option>
                  <option value="En Práctica Activa">En Práctica Activa ({rg.enPracticaActiva})</option>
                  <option value="En Validación">En Validación</option>
                  <option value="En Selección">En Selección</option>
                  <option value="Postulado">Postulado</option>
                  <option value="Postulación Rechazada">Postulación Rechazada</option>
                  <option value="Sin Práctica">Sin Práctica ({rg.sinPractica})</option>
                </select>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleExportCSV(selectedReport)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar Excel (.csv)
            </button>
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* 3. VISTA DEL REPORTE SELECCIONADO */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 print:border-none print:shadow-none">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold text-usm-blue uppercase tracking-widest">
                Universidad Técnica Federico Santa María • Sede Concepción • Plan Básico
              </p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {selectedReport === 'empleabilidad' && 'Reporte 1: Empleabilidad & Retención Laboral (250 Estudiantes)'}
                {selectedReport === 'seguros' && `Reporte 2: Nómina Oficial Seguro Escolar Ley 16.744 (${filteredSeguros.length} de ${rg.totalUsuariosAlumnos} alumnos)`}
                {selectedReport === 'calificaciones' && `Reporte 3: Calificaciones Formulario 6000 B (${filteredCalificaciones.length} de ${rg.totalUsuariosAlumnos} alumnos)`}
              </h3>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-medium">
              <p>Fecha de emisión: {new Date().toLocaleDateString('es-CL')}</p>
              <p>Sello Institucional: USM-CONCE-2026-PB</p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-usm-blue" />
              <p className="text-xs font-semibold">Cargando nómina oficial de 250 estudiantes...</p>
            </div>
          ) : (
            <>
              {/* REPORTE 1: EMPLEABILIDAD */}
              {selectedReport === 'empleabilidad' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] text-slate-500 font-semibold">Total Alumnos Plan</p>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">{rg.totalUsuariosAlumnos}</p>
                    </div>
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="text-[11px] text-emerald-700 font-semibold">Práctica Finalizada</p>
                      <p className="text-2xl font-black text-emerald-700 mt-0.5">{rg.practicasFinalizadas}</p>
                    </div>
                    <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-[11px] text-blue-700 font-semibold">En Práctica Activa</p>
                      <p className="text-2xl font-black text-usm-blue mt-0.5">{rg.enPracticaActiva}</p>
                    </div>
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-[11px] text-amber-700 font-semibold">Sin Práctica</p>
                      <p className="text-2xl font-black text-amber-800 mt-0.5">{rg.sinPractica}</p>
                    </div>
                    <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="text-[11px] text-purple-700 font-semibold">Retención (Contratados)</p>
                      <p className="text-2xl font-black text-purple-800 mt-0.5">{rg.tasaRetencionGlobal}% ({rg.totalContratados})</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
                          <th className="p-3 rounded-l-xl">Área Académica USM Concepción</th>
                          <th className="p-3 text-center">Total Alumnos</th>
                          <th className="p-3 text-center">Finalizadas</th>
                          <th className="p-3 text-center">En Práctica</th>
                          <th className="p-3 text-center">En Proceso</th>
                          <th className="p-3 text-center">Sin Práctica</th>
                          <th className="p-3 text-center">Contratados</th>
                          <th className="p-3 text-center">Retención</th>
                          <th className="p-3">Asignación</th>
                          <th className="p-3 rounded-r-xl">Empresa Líder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredEmpleabilidad.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-800">{row.area}</td>
                            <td className="p-3 text-center font-black text-slate-900">{row.alumnos}</td>
                            <td className="p-3 text-center text-emerald-700 font-bold">{row.finalizadas}</td>
                            <td className="p-3 text-center text-blue-700 font-bold">{row.enPractica}</td>
                            <td className="p-3 text-center text-amber-700">{row.enProceso}</td>
                            <td className="p-3 text-center text-slate-500">{row.sinPractica}</td>
                            <td className="p-3 text-center text-emerald-700 font-bold">{row.contratados}</td>
                            <td className="p-3 text-center font-mono font-bold text-usm-blue">{row.retencion}</td>
                            <td className="p-3">{row.salarioPromedio}</td>
                            <td className="p-3 text-slate-700">{row.empresaTop}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REPORTE 2: SEGUROS ESCOLARES (250 ALUMNOS) */}
              {selectedReport === 'seguros' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>
                      <strong>Certificación Ley N° 16.744:</strong> Nómina completa de los <strong>{rg.totalUsuariosAlumnos} estudiantes</strong> de USM Sede Concepción ({rg.segurosVisados} pólizas visadas y timbradas).
                    </span>
                    <span className="font-mono font-bold text-emerald-800 shrink-0">
                      Mostrando {filteredSeguros.length} / {rg.totalUsuariosAlumnos}
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[560px] overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
                          <th className="p-3">#</th>
                          <th className="p-3">Estudiante & Correo</th>
                          <th className="p-3 font-mono">RUT</th>
                          <th className="p-3">Carrera (USM Concepción)</th>
                          <th className="p-3">Estado Práctica</th>
                          <th className="p-3">Empresa</th>
                          <th className="p-3 font-mono">N° Póliza</th>
                          <th className="p-3">Seguro / SIGA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredSeguros.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono text-slate-400">{row.numero}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{row.alumno}</div>
                              <div className="font-mono text-[10px] text-slate-500">{row.email}</div>
                            </td>
                            <td className="p-3 font-mono text-slate-600 whitespace-nowrap">{row.rut}</td>
                            <td className="p-3 text-slate-700 max-w-[200px]">{row.carrera}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${getEstadoPracticaBadge(row.estadoPractica)}`}>
                                {row.estadoPractica}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{row.empresa}</td>
                            <td className="p-3 font-mono text-[11px] text-emerald-800 font-bold whitespace-nowrap">{row.poliza}</td>
                            <td className="p-3 space-y-1">
                              <div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  row.estadoSeguro === 'Visado & Timbrado' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {row.estadoSeguro}
                                </span>
                              </div>
                              <div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  row.convalidacionSIGA === 'Convalidado SIGA' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {row.convalidacionSIGA}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REPORTE 3: CALIFICACIONES FORMULARIO 6000 B (250 ALUMNOS) */}
              {selectedReport === 'calificaciones' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>
                      <strong>Ponderación Curricular USM:</strong> Nota final = 50% Formulario 6000 B (Empresa) + 50% Informe Técnico (Docente USM). Se incluyen los <strong>{rg.totalUsuariosAlumnos} estudiantes</strong> del Plan Básico.
                    </span>
                    <span className="font-mono font-bold text-purple-800 shrink-0">
                      Mostrando {filteredCalificaciones.length} / {rg.totalUsuariosAlumnos}
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[560px] overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
                          <th className="p-3">#</th>
                          <th className="p-3">Estudiante & Correo</th>
                          <th className="p-3">Carrera</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3">Empresa / Supervisor</th>
                          <th className="p-3 text-center">6000 B</th>
                          <th className="p-3 text-center">Docente</th>
                          <th className="p-3 text-center">Final</th>
                          <th className="p-3">Resultado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredCalificaciones.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono text-slate-400">{row.numero}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{row.alumno}</div>
                              <div className="font-mono text-[10px] text-slate-500">{row.email}</div>
                            </td>
                            <td className="p-3 text-slate-600 max-w-[180px]">{row.carrera}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${getEstadoPracticaBadge(row.estadoPractica)}`}>
                                {row.estadoPractica}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800">{row.empresa}</div>
                              <div className="text-[10px] text-slate-500">{row.supervisor}</div>
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-slate-800">
                              {row.notaEmpresa6000B !== null ? `${row.notaEmpresa6000B}/100` : '—'}
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-purple-700">
                              {row.notaDocente !== null ? `${row.notaDocente}/100` : '—'}
                            </td>
                            <td className="p-3 text-center font-black text-sm text-usm-blue">
                              {row.promedioFinal !== null ? row.promedioFinal : '—'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                row.resultado === 'Sobresaliente' || row.resultado === 'Distinción' || row.resultado === 'Aprobado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.resultado === 'En Curso'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-600'
                              }`}>
                                {row.resultado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Pie del Reporte */}
          <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs text-slate-500">
            <div className="space-y-1">
              <div className="w-48 border-b border-slate-400 mx-auto mb-2"></div>
              <p className="font-bold text-slate-800">Dr. Roberto Canales Mendoza</p>
              <p className="text-[11px]">Jefatura de Carrera • USM Sede Concepción</p>
            </div>
            <div className="space-y-1">
              <div className="w-48 border-b border-slate-400 mx-auto mb-2"></div>
              <p className="font-bold text-slate-800">Dirección de Prácticas Profesionales</p>
              <p className="text-[11px]">Secretaría de Docencia & Registro SIGA</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
