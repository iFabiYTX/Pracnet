import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import api from '../api/client';
import { Plus, Link, Check, Search, Filter, MapPin } from 'lucide-react';

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('todas');

  useEffect(() => {
    async function loadOfertas() {
      try {
        const res = await api.get('/admin/ofertas');
        if (res.data.success && res.data.catalogo) {
          setOfertas(res.data.catalogo);
        }
      } catch (e) {}
    }
    loadOfertas();
  }, []);

  const areas = useMemo(() => {
    return [...new Set(ofertas.map((o) => o.area).filter(Boolean))].sort();
  }, [ofertas]);

  const filteredOfertas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return ofertas.filter((o) => {
      const matchArea = areaFilter === 'todas' || o.area === areaFilter;
      const matchQ =
        !q ||
        (o.empresa_nombre || '').toLowerCase().includes(q) ||
        (o.titulo || '').toLowerCase().includes(q) ||
        (o.area || '').toLowerCase().includes(q) ||
        (o.ubicacion || '').toLowerCase().includes(q);
      return matchArea && matchQ;
    });
  }, [ofertas, areaFilter, searchTerm]);

  const handleCopyLink = (token, id) => {
    const url = `${window.location.origin}/empresa/portal/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header
        title="Gestión ofertas de prácticas"
        subtitle={`Catálogo Multidisciplinario USM Sede Concepción • ${ofertas.length} convocatorias en ${areas.length} áreas`}
      />

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-usm-navy">
                Catálogo de Ofertas ({filteredOfertas.length} de {ofertas.length})
              </h3>
              <p className="text-xs text-slate-500">
                Prácticas industriales, técnicas y tecnológicas para todas las carreras de USM Sede Concepción.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar empresa, cargo, comuna..."
                  className="pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 w-56 focus:outline-none focus:ring-2 focus:ring-usm-blue"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="todas">Todas las áreas ({areas.length})</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => alert('Módulo de creación de oferta disponible en modo edición.')}
                className="px-4 py-2 bg-usm-navy hover:bg-usm-blue text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Oferta
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Empresa / Cargo</th>
                  <th className="py-4 px-5">Área USM</th>
                  <th className="py-4 px-5">Requisito / Duración</th>
                  <th className="py-4 px-5">Estado</th>
                  <th className="py-4 px-5">Enlace Empresa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOfertas.map((of) => (
                  <tr key={of.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">{of.empresa_nombre}</div>
                      <div className="text-xs text-slate-600 font-medium">{of.titulo}</div>
                      {of.ubicacion && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {of.ubicacion} • {of.modalidad} • {of.monto_remuneracion}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200">
                        {of.area || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        {of.requisito_academico}
                      </span>
                      <div className="text-xs text-slate-500 mt-1">{of.duracion_horas} hrs ({of.cupos || 2} cupos)</div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          of.estado === 'Activa'
                            ? 'bg-emerald-100 text-emerald-800'
                            : of.estado === 'Cerrada'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {of.estado}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleCopyLink(of.token_acceso, of.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-usm-blue hover:text-usm-navy"
                      >
                        {copiedId === of.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Link className="w-3.5 h-3.5" />
                            <span>Copiar Token</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
