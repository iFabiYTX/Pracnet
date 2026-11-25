import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import PlanLimitBanner from '../components/PlanLimitBanner';
import api from '../api/client';
import { Clock, Briefcase, Users, FileCheck2, Building2 } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    planStatus: null,
    kpis: {
      practicasActivas: 24,
      alumnosHabilitados: 215,
      alumnosTotales: 250,
      alumnosEnPractica: 60,
      practicasFinalizadas: 65,
      alumnosSinPractica: 50,
      postulacionesHoy: 200,
      conveniosEmpresas: 22
    },
    actividadReciente: []
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (e) {}
    }
    fetchDashboard();
  }, []);

  const kpiCards = [
    {
      title: 'ALUMNOS PLAN BÁSICO',
      value: `${data.kpis.alumnosTotales ?? 250} / ${data.planStatus?.maxAlumnos ?? 250}`,
      note: `${data.kpis.alumnosHabilitados ?? 0} habilitados (+70% malla) • ${data.kpis.alumnosSinPractica ?? 0} sin práctica`,
      icon: Users,
      color: 'text-usm-blue'
    },
    {
      title: 'PRÁCTICAS ACTIVAS',
      value: data.kpis.practicasActivas,
      note: `${data.kpis.alumnosEnPractica ?? 0} en curso • ${data.kpis.practicasFinalizadas ?? 0} finalizadas`,
      icon: Briefcase,
      color: 'text-usm-navy'
    },
    {
      title: 'POSTULACIONES ACTIVAS',
      value: data.kpis.postulacionesHoy,
      note: 'Trazabilidad USM Sede Concepción',
      icon: FileCheck2,
      color: 'text-amber-600'
    },
    {
      title: 'CONVENIOS EMPRESAS',
      value: data.kpis.conveniosEmpresas,
      note: 'Empresas Biobío & nacionales',
      icon: Building2,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Panel de administración"
        subtitle="Monitor de prácticas profesionales • Plan Básico USM Sede Concepción."
      />

      <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Aviso oficial de límite de usuarios del Plan Básico para Jefe de Carrera / Admin */}
        <PlanLimitBanner planStatus={data.planStatus} />

        {/* 4 Tarjetas KPI */}
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
                <div className="text-3xl font-extrabold text-usm-navy tracking-tight my-2">
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

        {/* Sección Actividad Reciente */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-7 shadow-sm">
          <h3 className="text-base font-bold text-usm-navy mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-usm-blue" />
            Actividad Reciente — USM Sede Concepción
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
