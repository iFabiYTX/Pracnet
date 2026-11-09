import React, { useState } from 'react';
import Header from '../components/Header';
import {
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Building,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  Printer,
  ShieldCheck,
  Star,
  Users,
  Award
} from 'lucide-react';

export default function Reportes() {
  const [selectedReport, setSelectedReport] = useState('empleabilidad');
  const [carreraFilter, setCarreraFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 1. Datos Reporte 1: Empleabilidad y Retención Empresarial
  const reporteEmpleabilidadData = [
    { id: 1, area: 'Desarrollo de Software & Cloud', alumnos: 45, contratados: 19, retencion: '42%', salarioPromedio: '$320.000', empresaTop: 'Tech Solutions' },
    { id: 2, area: 'Ciencia de Datos & Machine Learning', alumnos: 28, contratados: 12, retencion: '43%', salarioPromedio: '$350.000', empresaTop: 'Banco Estado' },
    { id: 3, area: 'Ingeniería Industrial & Procesos', alumnos: 52, contratados: 18, retencion: '35%', salarioPromedio: '$290.000', empresaTop: 'CMPC Automotriz' },
    { id: 4, area: 'Ciberseguridad & Redes', alumnos: 32, contratados: 14, retencion: '44%', salarioPromedio: '$340.000', empresaTop: 'Entel Digital' },
    { id: 5, area: 'Diseño UX/UI & Producto', alumnos: 15, contratados: 4, retencion: '27%', salarioPromedio: '$260.000', empresaTop: 'Latam Airlines' }
  ];

  // 2. Datos Reporte 2: Registro Institucional de Seguro Escolar (Ley N° 16.744) & SIGA
  const reporteSegurosData = [
    { id: 1, alumno: 'Valentina Ríos Pérez', rut: '20.456.789-3', carrera: 'Ing. Civil Informática', empresa: 'Banco Estado', poliza: 'POL-16744-892', estadoSeguro: 'Visado & Timbrado', convalidacionSIGA: 'En Trámite', horas: 360 },
    { id: 2, alumno: 'Carlos Mendoza Silva', rut: '20.123.456-7', carrera: 'Ing. Civil Informática', empresa: 'Tech Solutions', poliza: 'POL-16744-893', estadoSeguro: 'Visado & Timbrado', convalidacionSIGA: 'Aprobado', horas: 180 },
    { id: 3, alumno: 'Matías González Araya', rut: '19.987.654-1', carrera: 'Ing. Civil Informática', empresa: 'MercadoLibre', poliza: 'POL-16744-884', estadoSeguro: 'Visado & Timbrado', convalidacionSIGA: 'Convalidado SIGA', horas: 360 },
    { id: 4, alumno: 'Sofía Valenzuela Castro', rut: '21.002.334-K', carrera: 'Ing. Civil Industrial', empresa: 'CMPC Automotriz', poliza: 'POL-16744-881', estadoSeguro: 'Visado & Timbrado', convalidacionSIGA: 'Convalidado SIGA', horas: 360 },
    { id: 5, alumno: 'Sebastián Alarcón Tapia', rut: '20.789.012-4', carrera: 'Ing. Civil Informática', empresa: 'Falabella Retail', poliza: 'POL-16744-895', estadoSeguro: 'En Revisión', convalidacionSIGA: 'Pendiente', horas: 180 }
  ];

  // 3. Datos Reporte 3: Pautas de Desempeño y Calificaciones (Formulario 6000 B)
  const reporteCalificacionesData = [
    { id: 1, alumno: 'Valentina Ríos Pérez', empresa: 'Banco Estado', supervisor: 'Ing. Rodrigo Castillo', notaEmpresa6000B: 96, notaDocente: 94, promedioFinal: 95.0, resultado: 'Sobresaliente' },
    { id: 2, alumno: 'Carlos Mendoza Silva', empresa: 'Tech Solutions', supervisor: 'Ing. Patricia Lagos', notaEmpresa6000B: 92, notaDocente: 90, promedioFinal: 91.0, resultado: 'Distinción' },
    { id: 3, alumno: 'Matías González Araya', empresa: 'MercadoLibre', supervisor: 'Ing. Felipe Morales', notaEmpresa6000B: 98, notaDocente: 95, promedioFinal: 96.5, resultado: 'Sobresaliente' },
    { id: 4, alumno: 'Sofía Valenzuela Castro', empresa: 'CMPC Automotriz', supervisor: 'Ing. Gonzalo Núñez', notaEmpresa6000B: 88, notaDocente: 89, promedioFinal: 88.5, resultado: 'Aprobado' },
    { id: 5, alumno: 'Sebastián Alarcón Tapia', empresa: 'Falabella Retail', supervisor: 'Ing. Marcela Pavez', notaEmpresa6000B: 90, notaDocente: 92, promedioFinal: 91.0, resultado: 'Distinción' }
  ];

  // Función para descargar Excel (CSV Real compatible con Excel en UTF-8 con BOM)
  const handleExportCSV = (tipo) => {
    let headers = [];
    let rows = [];
    let filename = '';

    if (tipo === 'empleabilidad') {
      filename = 'Reporte_Empleabilidad_y_Retencion_USM_2026.csv';
      headers = ['Area de Especialidad', 'Total Alumnos', 'Alumnos Contratados', 'Tasa de Retencion', 'Asignacion Promedio', 'Empresa Lider'];
      rows = reporteEmpleabilidadData.map(r => [
        `"${r.area}"`,
        r.alumnos,
        r.contratados,
        `"${r.retencion}"`,
        `"${r.salarioPromedio}"`,
        `"${r.empresaTop}"`
      ]);
    } else if (tipo === 'seguros') {
      filename = 'Reporte_Seguro_Escolar_Ley_16744_y_SIGA_USM.csv';
      headers = ['Estudiante', 'RUT', 'Carrera', 'Empresa Asignada', 'Poliza Ley 16.744', 'Estado Visado', 'Estado SIGA', 'Horas'];
      rows = reporteSegurosData.map(r => [
        `"${r.alumno}"`,
        `"${r.rut}"`,
        `"${r.carrera}"`,
        `"${r.empresa}"`,
        `"${r.poliza}"`,
        `"${r.estadoSeguro}"`,
        `"${r.convalidacionSIGA}"`,
        r.horas
      ]);
    } else if (tipo === 'calificaciones') {
      filename = 'Reporte_Calificaciones_Formulario_6000B_USM.csv';
      headers = ['Estudiante', 'Empresa', 'Supervisor', 'Nota Supervisor (6000 B)', 'Nota Docente USM', 'Promedio Final', 'Calificacion'];
      rows = reporteCalificacionesData.map(r => [
        `"${r.alumno}"`,
        `"${r.empresa}"`,
        `"${r.supervisor}"`,
        r.notaEmpresa6000B,
        r.notaDocente,
        r.promedioFinal,
        `"${r.resultado}"`
      ]);
    }

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Archivo Excel exportado exitosamente: ${filename}`);
  };

  // Función para imprimir / Guardar como PDF
  const handlePrintPDF = (tipo) => {
    window.print();
    showToast('Ventana de impresión institucional abierta. Selecciona "Guardar como PDF".');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Generación de Reportes Oficiales"
        subtitle="Módulo Institucional de Acreditación CNA, Empleabilidad y Cumplimiento Normativo USM"
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

        {/* 1. Selector de los 3 Reportes Obligatorios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarjeta Reporte 1 */}
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
              Desglose de inserción laboral post-práctica (38% promedio) y salarios por área tecnológica.
            </p>
          </div>

          {/* Tarjeta Reporte 2 */}
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
                Reporte 2 • Legal & Secretaría
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Nómina Seguro Escolar (Ley 16.744)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Registro oficial de pólizas visadas por Secretaría de Docencia y actas enviadas a SIGA.
            </p>
          </div>

          {/* Tarjeta Reporte 3 */}
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
                Reporte 3 • Desempeño USM
              </span>
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Calificaciones Formulario 6000 B
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Ponderación de notas emitidas por supervisor de empresa y evaluación del profesor guía.
            </p>
          </div>
        </div>

        {/* 2. Barra de Control de Exportación y Filtros */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por estudiante, empresa o área..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue w-64"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Vigencia: Semestre 2026-2
            </span>
          </div>

          {/* Botones de Exportación Real */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportCSV(selectedReport)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
              title="Descargar archivo .CSV con formato UTF-8 para Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar Excel (.csv)
            </button>
            <button
              onClick={() => handlePrintPDF(selectedReport)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
              title="Abrir vista de impresión y guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              Descargar / Imprimir PDF
            </button>
          </div>
        </div>

        {/* 3. VISTA DEL REPORTE SELECCIONADO */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 print:border-none print:shadow-none">
          
          {/* Encabezado Oficial Institucional para Documentos e Impresión */}
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold text-usm-blue uppercase tracking-widest">
                Universidad Técnica Federico Santa María • Dirección General de Docencia
              </p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {selectedReport === 'empleabilidad' && 'Informe Consolidado de Empleabilidad & Retención Laboral (CNA)'}
                {selectedReport === 'seguros' && 'Acta Oficial de Nómina y Cobertura Seguro Escolar (Ley N° 16.744)'}
                {selectedReport === 'calificaciones' && 'Registro Consolidado de Calificaciones Formulario 6000 B & Evaluación Docente'}
              </h3>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-medium">
              <p>Fecha de emisión: {new Date().toLocaleDateString('es-CL')}</p>
              <p>Sello de Certificación: USM-VAL-2026-X9</p>
            </div>
          </div>

          {/* TABLA DE DATOS DEL REPORTE 1: EMPLEABILIDAD */}
          {selectedReport === 'empleabilidad' && (
            <div className="space-y-6">
              {/* Tarjetas resumen del reporte */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">Total Practicantes</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">172</p>
                </div>
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold">Tasa de Retención Promedio</p>
                  <p className="text-2xl font-black text-usm-blue mt-0.5">38.0%</p>
                </div>
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-semibold">Alumnos Contratados</p>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">67</p>
                </div>
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs text-amber-700 font-semibold">Asignación Promedio</p>
                  <p className="text-2xl font-black text-amber-800 mt-0.5">$312.000</p>
                </div>
              </div>

              {/* Tabla Detallada */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                      <th className="p-3 rounded-l-xl">Área de Especialidad</th>
                      <th className="p-3 text-center">Alumnos</th>
                      <th className="p-3 text-center">Contratados</th>
                      <th className="p-3 text-center">Tasa Retención</th>
                      <th className="p-3">Asignación Voluntaria</th>
                      <th className="p-3 rounded-r-xl">Empresa con Mayor Retención</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reporteEmpleabilidadData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{row.area}</td>
                        <td className="p-3 text-center">{row.alumnos}</td>
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

          {/* TABLA DE DATOS DEL REPORTE 2: SEGUROS ESCOLARES (LEY 16.744) */}
          {selectedReport === 'seguros' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>Certificación de Cobertura Legal:</strong> La presente nómina acredita la expedición del Seguro Escolar contra Accidentes del Trabajo y de Trayecto (Ley N° 16.744 y D.S. N° 313) visada por Secretaría de Docencia antes del inicio de las actividades formativas de los estudiantes señalados.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                      <th className="p-3 rounded-l-xl">Estudiante</th>
                      <th className="p-3 font-mono">RUT</th>
                      <th className="p-3">Carrera</th>
                      <th className="p-3">Empresa</th>
                      <th className="p-3 font-mono">N° Póliza</th>
                      <th className="p-3">Estado Visado</th>
                      <th className="p-3 rounded-r-xl">Estado SIGA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reporteSegurosData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{row.alumno}</td>
                        <td className="p-3 font-mono text-slate-600">{row.rut}</td>
                        <td className="p-3 text-slate-600">{row.carrera}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.empresa}</td>
                        <td className="p-3 font-mono text-xs text-emerald-800 font-bold">{row.poliza}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ✓ {row.estadoSeguro}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            row.convalidacionSIGA.includes('Convalidado')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {row.convalidacionSIGA}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLA DE DATOS DEL REPORTE 3: CALIFICACIONES (FORMULARIO 6000 B) */}
          {selectedReport === 'calificaciones' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                <strong>Ponderación Curricular Institucional:</strong> La nota final de práctica corresponde a la ponderación del Formulario 6000 B emitido por la empresa (50%) y la calificación del informe técnico efectuada por el Profesor Guía de la USM (50%).
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                      <th className="p-3 rounded-l-xl">Estudiante</th>
                      <th className="p-3">Empresa</th>
                      <th className="p-3">Supervisor</th>
                      <th className="p-3 text-center">Form. 6000 B (Empresa)</th>
                      <th className="p-3 text-center">Nota Docente USM</th>
                      <th className="p-3 text-center">Promedio Final</th>
                      <th className="p-3 rounded-r-xl">Calificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reporteCalificacionesData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{row.alumno}</td>
                        <td className="p-3 text-slate-700">{row.empresa}</td>
                        <td className="p-3 text-slate-500">{row.supervisor}</td>
                        <td className="p-3 text-center font-bold font-mono text-slate-800">{row.notaEmpresa6000B}/100</td>
                        <td className="p-3 text-center font-bold font-mono text-purple-700">{row.notaDocente}/100</td>
                        <td className="p-3 text-center font-black text-sm text-usm-blue">{row.promedioFinal}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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

          {/* Pie del Reporte con firmas institucionales */}
          <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs text-slate-500">
            <div className="space-y-1">
              <div className="w-48 border-b border-slate-400 mx-auto mb-2"></div>
              <p className="font-bold text-slate-800">Dr. Roberto Canales</p>
              <p className="text-[11px]">Jefatura de Carrera • Depto. Informática USM</p>
            </div>
            <div className="space-y-1">
              <div className="w-48 border-b border-slate-400 mx-auto mb-2"></div>
              <p className="font-bold text-slate-800">Mariana Silva</p>
              <p className="text-[11px]">Secretaría de Docencia & Registro SIGA</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
