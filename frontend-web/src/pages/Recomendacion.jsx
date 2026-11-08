import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';
import { Sparkles, Bell, CheckCircle2 } from 'lucide-react';

export default function Recomendacion() {
  const [matches, setMatches] = useState([
    {
      estudiante: {
        id: 1,
        nombre: 'Carlos Mendoza',
        carrera: 'Ing. Informática',
        avanceMalla: 85,
        habilidades: 'Python, SQL, Git, Docker'
      },
      oferta: {
        id: 1,
        titulo: 'Práctica Desarrollo Backend',
        empresaNombre: 'Tech Solutions'
      },
      matchScore: 95
    },
    {
      estudiante: {
        id: 2,
        nombre: 'Ana Rojas',
        carrera: 'Ing. Comercial',
        avanceMalla: 72,
        habilidades: 'PowerBI, Excel, Finanzas'
      },
      oferta: {
        id: 2,
        titulo: 'Analista de Datos Jr.',
        empresaNombre: 'Banco Estado'
      },
      matchScore: 88
    }
  ]);

  const [notificados, setNotificados] = useState({});

  useEffect(() => {
    async function loadRecomendaciones() {
      try {
        const res = await api.get('/admin/recomendaciones');
        if (res.data.success && res.data.matches.length > 0) {
          setMatches(res.data.matches);
        }
      } catch (e) {}
    }
    loadRecomendaciones();
  }, []);

  const handleNotificar = async (matchIdx, estId, ofId) => {
    try {
      await api.post('/admin/notificar-alumno', { estudianteId: estId, ofertaId: ofId });
    } catch (e) {}
    setNotificados(prev => ({ ...prev, [matchIdx]: true }));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Sistema de recomendación"
        subtitle="Módulo: Sistema de recomendación"
      />

      <main className="p-8 max-w-7xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-usm-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-usm-gold" />
              Motor de Recomendación
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Matches generados para alumnos sin práctica asignada mediante algoritmo de afinidad curricular y habilidades.
            </p>
          </div>

          {/* Tarjetas de Calce - Disposición Exacta del Mockup Web 9.2 */}
          <div className="space-y-4">
            {matches.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-slate-200 hover:border-usm-blue/30 bg-slate-50/50 hover:bg-white transition-all shadow-sm"
              >
                <div className="space-y-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {item.estudiante.nombre}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      - {item.estudiante.carrera}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <strong className="font-semibold text-usm-blue">Avance Malla:</strong>{' '}
                      {item.estudiante.avanceMalla}%
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>
                      <strong className="font-semibold text-slate-700">Habilidades:</strong>{' '}
                      {item.estudiante.habilidades}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600">
                      {item.matchScore}% Match
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      con "{item.oferta.empresaNombre}"
                    </div>
                  </div>

                  {notificados[idx] ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      Notificado
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNotificar(idx, item.estudiante.id, item.oferta.id)}
                      className="px-4 py-2 bg-usm-gold hover:bg-amber-600 text-usm-navy font-bold rounded-lg text-xs shadow-sm hover:shadow transition-colors flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Notificar Alumno
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
