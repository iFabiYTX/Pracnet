import React from 'react';
import Header from '../components/Header';
import { Download, FileSpreadsheet, FileText, TrendingUp, Building } from 'lucide-react';

export default function Reportes() {
  const areasData = [
    { area: 'Software', cantidad: 45, color: 'bg-usm-blue' },
    { area: 'Datos', cantidad: 28, color: 'bg-amber-500' },
    { area: 'Industria', cantidad: 52, color: 'bg-emerald-600' },
    { area: 'Diseño', cantidad: 15, color: 'bg-slate-800' },
    { area: 'Redes', cantidad: 32, color: 'bg-slate-400' }
  ];

  const maxArea = Math.max(...areasData.map(a => a.cantidad));

  const estadosData = [
    { label: 'En Proceso', porcentaje: 65, color: 'bg-usm-blue' },
    { label: 'Aprobadas', porcentaje: 25, color: 'bg-emerald-600' },
    { label: 'Rechazadas', porcentaje: 10, color: 'bg-red-500' }
  ];

  const topEmpresas = [
    { puesto: 1, nombre: 'Tech Solutions', alumnos: 12 },
    { puesto: 2, nombre: 'Banco Estado', alumnos: 8 },
    { puesto: 3, nombre: 'CMPC Automotriz', alumnos: 5 }
  ];

  const handleExport = (tipo) => {
    alert(`Descargando reporte oficial en formato ${tipo.toUpperCase()} para acreditación CNA y CAE.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Generación de reportes"
        subtitle="Módulo: Generación de reportes"
      />

      <main className="p-8 max-w-7xl space-y-6">
        {/* Banner Superior con Botones de Descarga del Mockup Web 9.2 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-usm-navy">Dashboard e Indicadores</h3>
            <p className="text-xs text-slate-500">Métricas generales y exportación de datos.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              ↓ PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              ↓ Excel
            </button>
          </div>
        </div>

        {/* Gráficos e Indicadores - Disposición Exacta del Mockup Web 9.2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico 1: Prácticas por Área de Especialidad */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-6">
              Prácticas por Área de Especialidad
            </h4>
            <div className="h-64 flex items-end justify-between gap-4 px-4 pt-4 border-b border-slate-200 pb-2">
              {areasData.map((item, idx) => {
                const heightPercent = (item.cantidad / maxArea) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700">{item.cantidad}</span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md ${item.color} transition-all duration-500 group-hover:opacity-90 shadow-sm`}
                    ></div>
                    <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                      {item.area}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gráfico 2: Estado de Postulaciones (Barras horizontales) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-6">
                Estado de Postulaciones
              </h4>
              <div className="space-y-5">
                {estadosData.map((est, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">{est.label}</span>
                      <span className="text-slate-900">{est.porcentaje}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${est.color}`}
                        style={{ width: `${est.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Widget 3: Top Empresas Contratantes */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-usm-blue" />
              Top Empresas Contratantes
            </h4>
            <div className="divide-y divide-slate-100">
              {topEmpresas.map((emp) => (
                <div key={emp.puesto} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                      {emp.puesto}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{emp.nombre}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-100">
                    {emp.alumnos} Alumnos
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Tasa de Retención Post-Práctica (38% Exacto del Mockup 9.2) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tasa de Retención Post-Práctica
            </span>
            <div className="text-6xl font-black text-usm-gold tracking-tight my-2">
              38%
            </div>
            <p className="text-[11px] font-medium text-slate-500 max-w-xs mt-1">
              Alumnos que continuaron trabajando tras la práctica en el último semestre.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
