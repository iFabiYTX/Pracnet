import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import api from '../api/client';
import { FileText, CheckCircle, X, ShieldCheck, Search, Filter } from 'lucide-react';

export default function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [modalPost, setModalPost] = useState(null);
  const [firmado, setFirmado] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [faseFilter, setFaseFilter] = useState('todas');

  useEffect(() => {
    async function loadPostulaciones() {
      try {
        const res = await api.get('/admin/postulaciones');
        if (res.data.success && res.data.postulaciones) {
          setPostulaciones(res.data.postulaciones);
        }
      } catch (e) {}
    }
    loadPostulaciones();
  }, []);

  const fasesDisponibles = useMemo(() => {
    return [...new Set(postulaciones.map((p) => p.fase_administrativa).filter(Boolean))];
  }, [postulaciones]);

  const filteredPostulaciones = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return postulaciones.filter((p) => {
      const matchFase = faseFilter === 'todas' || p.fase_administrativa === faseFilter;
      const matchQ =
        !q ||
        (p.estudiante_nombre || '').toLowerCase().includes(q) ||
        (p.estudiante_email || '').toLowerCase().includes(q) ||
        (p.carrera || '').toLowerCase().includes(q) ||
        (p.empresa_nombre || '').toLowerCase().includes(q) ||
        (p.oferta_titulo || '').toLowerCase().includes(q);
      return matchFase && matchQ;
    });
  }, [postulaciones, faseFilter, searchTerm]);

  const getFaseBadgeColor = (fase) => {
    switch (fase) {
      case 'Pendiente Seguro Escolar':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Carta Presentación Emitida':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Entrevista Técnica Realizada':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Práctica Iniciada':
        return 'bg-blue-600 text-white border-blue-700';
      case 'Práctica Finalizada':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'Postulación Desestimada':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleFirmar = async () => {
    setFirmado(true);
    try {
      await api.patch(`/admin/postulaciones/${modalPost.id}/fase`, {
        fase_administrativa: 'Carta Presentación Emitida',
        estado: 'Validación Académica'
      });
    } catch (e) {}
    setTimeout(() => {
      setPostulaciones((prev) =>
        prev.map((p) => (p.id === modalPost.id ? { ...p, fase_administrativa: 'Carta Presentación Emitida' } : p))
      );
      setModalPost(null);
      setFirmado(false);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Seguimiento postulaciones"
        subtitle={`Trazabilidad de prácticas USM Sede Concepción • ${filteredPostulaciones.length} de ${postulaciones.length} registros`}
      />

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar alumno, usuarioX@..., carrera o empresa..."
                className="pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 w-72 focus:outline-none focus:ring-2 focus:ring-usm-blue"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={faseFilter}
                onChange={(e) => setFaseFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="todas">Todas las fases ({postulaciones.length})</option>
                {fasesDisponibles.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">Alumno & Carrera</th>
                  <th className="py-3.5 px-5">Empresa / Práctica</th>
                  <th className="py-3.5 px-5">Fase Administrativa</th>
                  <th className="py-3.5 px-5 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPostulaciones.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">{p.estudiante_nombre}</div>
                      <div className="text-[11px] font-mono text-slate-500">{p.estudiante_email}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.carrera} • Avance: {p.avance_malla}%
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">
                      <div className="font-bold text-slate-800">{p.empresa_nombre}</div>
                      <div className="text-[11px] text-slate-500">{p.oferta_titulo}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold border ${getFaseBadgeColor(p.fase_administrativa)}`}>
                        {p.fase_administrativa}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setModalPost(p)}
                        className="px-3.5 py-1.5 bg-usm-navy hover:bg-usm-blue text-white rounded text-xs font-semibold shadow-sm transition-colors"
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

      {modalPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-7 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-usm-navy">Expediente de {modalPost.estudiante_nombre}</h3>
                <p className="text-xs text-slate-500">
                  {modalPost.empresa_nombre} • {modalPost.oferta_titulo}
                </p>
              </div>
              <button onClick={() => setModalPost(null)} className="text-slate-400 hover:text-slate-600 p-1">
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
                <button onClick={() => alert('Abriendo documento PDF')} className="text-xs font-semibold text-usm-blue hover:underline">
                  Visualizar
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-usm-blue" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Seguro_Escolar_Ley_16744.pdf</p>
                    <p className="text-[10px] text-amber-600 font-semibold">{modalPost.fase_administrativa}</p>
                  </div>
                </div>
                <button onClick={() => alert('Abriendo certificado')} className="text-xs font-semibold text-usm-blue hover:underline">
                  Visualizar
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalPost(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                onClick={handleFirmar}
                disabled={firmado}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
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
