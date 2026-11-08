import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api/client';
import { Plus, Edit3, Trash2, Link, Check, ExternalLink } from 'lucide-react';

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([
    {
      id: 1,
      empresa_nombre: 'Tech Solutions',
      titulo: 'Práctica Desarrollo Backend',
      requisito_academico: 'Min. 6to Semestre',
      duracion_horas: 360,
      estado: 'Activa',
      token_acceso: 'tWPPZe1XNrbGswiCchORWA'
    },
    {
      id: 2,
      empresa_nombre: 'Banco Estado',
      titulo: 'Analista de Datos Jr.',
      requisito_academico: 'Min. 70% Malla',
      duracion_horas: 180,
      estado: 'Activa',
      token_acceso: 'U0BWWPFWua7igZSqrZFl0g'
    },
    {
      id: 3,
      empresa_nombre: 'Latam Airlines',
      titulo: 'Práctica UX/UI',
      requisito_academico: 'Min. 4to Semestre',
      duracion_horas: 180,
      estado: 'Activa',
      token_acceso: 'ash8J9337Wj00zWhS-DBLg'
    },
    {
      id: 4,
      empresa_nombre: 'CMPC Automotriz',
      titulo: 'Práctica Mantenimiento',
      requisito_academico: 'Min. 80% Malla',
      duracion_horas: 360,
      estado: 'Borrador',
      token_acceso: 'Y1oO0rq73st3DzeFkikZKg'
    }
  ]);

  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function loadOfertas() {
      try {
        const res = await api.get('/admin/ofertas');
        if (res.data.success && res.data.catalogo.length > 0) {
          setOfertas(res.data.catalogo);
        }
      } catch (e) {}
    }
    loadOfertas();
  }, []);

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
        subtitle="Módulo: Gestión ofertas de prácticas"
      />

      <main className="p-8 max-w-7xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header de la Tabla con Botón de Nueva Oferta */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-usm-navy">Catálogo de Ofertas</h3>
            <button
              onClick={() => alert('Abriendo modal para crear nueva convocatoria de práctica')}
              className="px-4 py-2 bg-usm-navy hover:bg-usm-blue text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              + Nueva Oferta
            </button>
          </div>

          {/* Tabla de Ofertas - Diseño Fiel al Mockup Web 9.2 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Empresa / Cargo</th>
                  <th className="py-4 px-6">Requisito Académico</th>
                  <th className="py-4 px-6">Duración</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6">Enlace Empresa</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {ofertas.map((of) => (
                  <tr key={of.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{of.empresa_nombre}</div>
                      <div className="text-xs text-slate-500 font-medium">{of.titulo}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                        {of.requisito_academico}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {of.duracion_horas} hrs
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          of.estado === 'Activa'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {of.estado}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleCopyLink(of.token_acceso, of.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-usm-blue hover:text-usm-navy"
                        title="Copiar Magic Link para la empresa"
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
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => alert(`Editar oferta #${of.id}`)}
                        className="px-3 py-1.5 bg-usm-navy hover:bg-usm-blue text-white rounded text-xs font-semibold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => alert(`Eliminar oferta #${of.id}`)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                      >
                        Eliminar
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
