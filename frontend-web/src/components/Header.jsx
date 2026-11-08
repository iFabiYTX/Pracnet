import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck } from 'lucide-react';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-usm-navy tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-sm font-semibold text-slate-800">
              {user?.nombre || 'Admin PracNet'}
            </span>
            <UserCheck className="w-4 h-4 text-usm-blue" />
          </div>
          <p className="text-[11px] font-medium text-emerald-600 flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            En línea
          </p>
        </div>
      </div>
    </header>
  );
}
