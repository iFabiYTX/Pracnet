import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';
import { FileText, CheckCircle, X, ShieldCheck } from 'lucide-react';

export default function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState([
    {
      id: 1,
      estudiante_nombre: 'María Soto L.',
      avance_malla: 82,
      empresa_nombre: 'CMPC',
      oferta_titulo: 'Mantenimiento',
      fase_administrativa: 'Pendiente Seguro Escolar'
    },
    {
      id: 2,
      estudiante_nombre: 'Juan Pérez G.',
      avance_malla: 75,
      empresa_nombre: 'Tech Solutions',
      oferta_titulo: 'Dev Backend',
      fase_administrativa: 'Carta Presentación Emitida'
    },
    {
      id: 3,
      estudiante_nombre: 'Diego Tapia R.',
      avance_malla: 68,
      empresa_nombre: 'Entel',
      oferta_titulo: 'Soporte Redes',
      fase_administrativa: 'Entrevista Técnica Realizada'
    },
    {
      id: 4,
      estudiante_nombre: 'Valentina Ríos',
      avance_malla: 90,
      empresa_nombre: 'Latam',
      oferta_titulo: 'UX/UI',
      fase_administrativa: 'Práctica Iniciada'
    }
  ]);

  const [modalPost, setModalPost] = useState(null);
  const [firmado, setFirmado] = useState(false);

  useEffect(() => {
    async function loadPostulaciones() {
      try {
        const res = await api.get('/admin/postulaciones');
        if (res.data.success && res.data.postulaciones.length > 0) {
          setPostulaciones(res.data.postulaciones);
        }
      } catch (e) {}
    }
    loadPostulaciones();
  }, []);

  const getFaseBadgeColor = (fase) => {
    switch (fase) {
      case 'Pendiente Seguro Escolar':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Carta Presentación Emitida':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Entrevista Técnica Realizada':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Práctica Iniciada':
        return 'bg-green-600 text-white border-green-700';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleFirmar = () => {
    setFirmado(true);
    setTimeout(() => {
      setPostulaciones(prev => prev.map(p => p.id === modalPost.id ? { ...p, fase_administrativa: 'Carta Presentación Emitida' } : p));
      setModalPost(null);
      setFirmado(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Seguimiento postulaciones"
        subtitle="Módulo: Seguimiento postulaciones"
      />

      <main className="p-8 max-w-7xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Alumno</th>
                  <th className="py-4 px-6">Empresa / Práctica</th>
                  <th className="py-4 px-6">Fase Administrativa</th>
                  <th className="py-4 px-6 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {postulaciones.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{p.estudiante_nombre}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        Avance: {p.avance_malla}%
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {p.empresa_nombre} - {p.oferta_titulo}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border ${getFaseBadgeColor(p.fase_administrativa)}`}>
                        {p.fase_administrativa}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setModalPost(p)}
                        className="px-4 py-1.5 bg-usm-navy hover:bg-usm-blue text-white rounded text-xs font-semibold shadow-sm transition-colors"
                      >
                        Ver Docs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Auditoría Documental y Firma Digital Institucional */}
      {modalPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-7 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-usm-navy">
                  Expediente de {modalPost.estudiante_nombre}
                </h3>
                <p className="text-xs text-slate-500">
                  {modalPost.empresa_nombre} • {modalPost.oferta_titulo}
                </p>
              </div>
              <button
                onClick={() => setModalPost(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Curriculum_Vitae.pdf</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Validado</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Abriendo documento PDF')}
                  className="text-xs font-semibold text-usm-blue hover:underline"
                >
                  Visualizar
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-usm-blue" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Seguro_Escolar_Ley_16744.pdf</p>
                    <p className="text-[10px] text-amber-600 font-semibold">Pendiente de Firma de Jefatura</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Abriendo certificado')}
                  className="text-xs font-semibold text-usm-blue hover:underline"
                >
                  Visualizar
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalPost(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleFirmar}
                disabled={firmado}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {firmado ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>¡Firma Digital Aplicada!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Aplicar Firma Digital USM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
