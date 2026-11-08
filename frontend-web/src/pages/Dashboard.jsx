import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../api/client';
import { Clock, Briefcase, Users, FileCheck2, Building2 } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    kpis: {
      practicasActivas: 145,
      alumnosHabilitados: 312,
      postulacionesHoy: 24,
      conveniosEmpresas: 89
    },
    actividadReciente: [
      { id: 1, tiempo: 'Hace 10 min', detalle: 'Carlos Mendoza postuló a Tech Solutions - Dev Backend' },
      { id: 2, tiempo: 'Hace 45 min', detalle: 'Firma digital aplicada al Seguro Escolar de Valentina Ríos' },
      { id: 3, tiempo: 'Hace 2 horas', detalle: 'Nueva vacante "Analista de Datos Jr." publicada por Banco Estado' },
      { id: 4, tiempo: 'Ayer', detalle: '4 alumnos completaron la validación formal en SIGA' }
    ]
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (e) {
        // Mantiene valores del Mockup 9.2 por defecto
      }
    }
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'PRÁCTICAS ACTIVAS',
      value: data.kpis.practicasActivas,
      note: 'Convocatorias en proceso',
      icon: Briefcase,
      color: 'text-usm-navy'
    },
    {
      title: 'ALUMNOS HABILITADOS',
      value: data.kpis.alumnosHabilitados,
      note: '+70% de avance malla',
      icon: Users,
      color: 'text-usm-blue'
    },
    {
      title: 'POSTULACIONES HOY',
      value: data.kpis.postulacionesHoy,
      note: 'Últimas 24 horas',
      icon: FileCheck2,
      color: 'text-amber-600'
    },
    {
      title: 'CONVENIOS EMPRESAS',
      value: data.kpis.conveniosEmpresas,
      note: 'Empresas activas con CAE',
      icon: Building2,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Panel de administración"
        subtitle="Monitor de prácticas profesionales en curso."
      />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* 4 Tarjetas KPI - Disposición Exacta del Mockup Web 9.2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {kpi.title}
                  </span>
                  <Icon className="w-5 h-5 text-slate-300" />
                </div>
                <div className="text-4xl font-extrabold text-usm-navy tracking-tight my-2">
                  {kpi.value}
                </div>
                {kpi.note && (
                  <p className="text-xs text-slate-500 font-medium">
                    {kpi.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Sección Actividad Reciente - Mockup Web 9.2 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-7 shadow-sm">
          <h3 className="text-base font-bold text-usm-navy mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-usm-blue" />
            Actividad Reciente
          </h3>
          <ul className="divide-y divide-slate-100">
            {data.actividadReciente.map((item, idx) => (
              <li key={idx} className="py-3.5 flex items-start gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-usm-blue mt-2 shrink-0"></span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-slate-700 font-medium">{item.detalle || item.accion}</span>
                  <span className="text-xs font-semibold text-slate-400 shrink-0">
                    {item.tiempo || item.fecha?.slice(0, 16)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
