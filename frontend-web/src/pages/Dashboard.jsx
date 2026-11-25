import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import PlanLimitBanner from '../components/PlanLimitBanner';
import api from '../api/client';
import {
  Clock,
  Briefcase,
  Users,
  FileCheck2,
  Building2,
  BarChart3,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
    graficos: {
      estadosPractica: [],
      alumnosPorArea: [],
      trazabilidadLegal: []
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

  // Gráfico 1: Dona de Estados de Práctica (250 Alumnos)
  const estadosData = {
    labels: (data.graficos?.estadosPractica || []).map((e) => e.label),
    datasets: [
      {
        label: 'Estudiantes',
        data: (data.graficos?.estadosPractica || []).map((e) => e.cantidad),
        backgroundColor: [
          '#059669', // Finalizada
          '#2563eb', // En Práctica Activa
          '#d97706', // En Validación
          '#6366f1', // Postulado / Selección
          '#dc2626', // Rechazada
          '#94a3b8'  // Sin Práctica
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  // Gráfico 2: Barras Apiladas por Área USM Sede Concepción
  const areasData = {
    labels: (data.graficos?.alumnosPorArea || []).map((a) => a.area),
    datasets: [
      {
        label: 'Finalizadas',
        data: (data.graficos?.alumnosPorArea || []).map((a) => a.finalizadas),
        backgroundColor: '#059669',
        borderRadius: 4
      },
      {
        label: 'En Práctica Activa',
        data: (data.graficos?.alumnosPorArea || []).map((a) => a.activas),
        backgroundColor: '#2563eb',
        borderRadius: 4
      },
      {
        label: 'En Proceso / Validación',
        data: (data.graficos?.alumnosPorArea || []).map((a) => a.proceso),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      },
      {
        label: 'Sin Práctica',
        data: (data.graficos?.alumnosPorArea || []).map((a) => a.sinPractica),
        backgroundColor: '#cbd5e1',
        borderRadius: 4
      }
    ]
  };

  // Gráfico 3: Barras de Trazabilidad Legal (Ley 16.744 & SIGA / 6000 B)
  const legalData = {
    labels: (data.graficos?.trazabilidadLegal || []).map((t) => t.label),
    datasets: [
      {
        label: 'Estudiantes',
        data: (data.graficos?.trazabilidadLegal || []).map((t) => t.cantidad),
        backgroundColor: ['#059669', '#f59e0b', '#003865', '#3b82f6', '#94a3b8'],
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Panel de administración"
        subtitle="Monitor de trazabilidad de prácticas profesionales • Plan Básico USM Sede Concepción."
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Aviso oficial de límite de usuarios del Plan Básico */}
        <PlanLimitBanner planStatus={data.planStatus} />

        {/* 4 Tarjetas KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {kpi.title}
                  </span>
                  <Icon className="w-5 h-5 text-slate-300" />
                </div>
                <div className="text-3xl font-extrabold text-usm-navy tracking-tight my-1.5">
                  {kpi.value}
                </div>
                {kpi.note && (
                  <p className="text-xs text-slate-500 font-medium">{kpi.note}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* SECCIÓN DE GRÁFICOS DE TRAZABILIDAD (250 ALUMNOS USM)           */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Gráfico 1: Ciclo de Vida / Estados de Práctica */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-black text-usm-navy flex items-center gap-2">
                <PieChart className="w-4 h-4 text-usm-blue" />
                Trazabilidad por Estado de Práctica ({data.kpis.alumnosTotales ?? 250} Alumnos)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribución actual del flujo de prácticas desde postulación hasta convalidación SIGA.
              </p>
            </div>
            <div className="h-64 flex items-center justify-center">
              {estadosData.labels.length > 0 && (
                <Doughnut
                  data={estadosData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: { boxWidth: 12, font: { size: 11 } }
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Gráfico 3: Trazabilidad Legal (Ley 16.744 & SIGA) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-black text-usm-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Trazabilidad Normativa: Seguro Escolar (Ley 16.744) y SIGA
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Control de pólizas visadas por Secretaría de Docencia y cierre de Formulario 6000 B.
              </p>
            </div>
            <div className="h-64">
              {legalData.labels.length > 0 && (
                <Bar
                  data={legalData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 25, font: { size: 11 } } },
                      x: { ticks: { font: { size: 10 } } }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Gráfico 2: Trazabilidad por Área Académica (Ancho completo) */}
          <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-black text-usm-navy flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-usm-blue" />
                Trazabilidad de Estudiantes por Área Académica — USM Sede Concepción
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativa de prácticas finalizadas, en curso, en validación y alumnos sin práctica por área.
              </p>
            </div>
            <div className="h-80">
              {areasData.labels.length > 0 && (
                <Bar
                  data={areasData}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
                    },
                    scales: {
                      x: { stacked: true, beginAtZero: true, ticks: { font: { size: 11 } } },
                      y: { stacked: true, ticks: { font: { size: 11 } } }
                    }
                  }}
                />
              )}
            </div>
          </div>
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
