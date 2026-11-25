import React from 'react';
import { AlertTriangle, Mail, ShieldAlert, Users, GraduationCap } from 'lucide-react';

export default function PlanLimitBanner({ planStatus, dark = false }) {
  if (!planStatus) return null;

  const {
    nombre = 'Plan Básico',
    precio = '$150.000 + IVA / mes',
    segmento = 'Sedes pequeñas',
    alumnosActuales = 0,
    maxAlumnos = 250,
    jefesActuales = 0,
    maxJefesCarrera = 5,
    alumnosLimiteAlcanzado = false,
    jefesLimiteAlcanzado = false,
    algunLimiteAlcanzado = false,
    correoSoporte = 'soporte@pracnet.usm.cl'
  } = planStatus;

  if (!algunLimiteAlcanzado) {
    return (
      <div
        className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          dark
            ? 'bg-slate-900 border-slate-800 text-slate-300'
            : 'bg-blue-50/70 border-blue-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded-full font-extrabold uppercase text-[10px] ${
              dark ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-usm-navy text-white'
            }`}
          >
            {nombre} • {precio}
          </span>
          <span className="font-semibold">
            Capacidad activa ({segmento}): <strong>{alumnosActuales}/{maxAlumnos}</strong> alumnos •{' '}
            <strong>{jefesActuales}/{maxJefesCarrera}</strong> Jefes de Carrera / Profesores.
          </span>
        </div>
        <a
          href={`mailto:${correoSoporte}?subject=Solicitud%20de%20Ampliaci%C3%B3n%20de%20Plan%20PRACNET`}
          className={`inline-flex items-center gap-1.5 font-bold underline ${
            dark ? 'text-amber-300 hover:text-amber-200' : 'text-usm-blue hover:text-usm-navy'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Ampliar plan con Soporte
        </a>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`rounded-2xl border-2 p-5 shadow-lg space-y-3 ${
        dark
          ? 'bg-gradient-to-r from-red-950/90 via-amber-950/60 to-slate-900 border-red-500/60 text-red-100'
          : 'bg-gradient-to-r from-red-50 via-amber-50 to-white border-red-400 text-red-950'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              dark ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-red-100 text-red-600 border border-red-200'
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  dark ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                }`}
              >
                Límite Alcanzado • {nombre} ({precio})
              </span>
              <span
                className={`text-[11px] font-bold flex items-center gap-1 ${
                  dark ? 'text-amber-300' : 'text-amber-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Registro de nuevos usuarios bloqueado
              </span>
            </div>
            <h3 className={`text-sm sm:text-base font-black ${dark ? 'text-white' : 'text-red-950'}`}>
              PRACNET ya alcanzó el límite de usuarios permitidos en tu {nombre}
            </h3>
            <p className={`text-xs leading-relaxed ${dark ? 'text-red-100/90' : 'text-red-900/90'}`}>
              Actualmente tienes{' '}
              <strong>
                {alumnosActuales}/{maxAlumnos} alumnos
              </strong>{' '}
              y{' '}
              <strong>
                {jefesActuales}/{maxJefesCarrera} Jefes de Carrera / Profesores
              </strong>
              . <strong>A menos que se elimine un usuario existente, NO podrá registrarse uno nuevo.</strong> Si deseas
              cambiar tu plan y aumentar la cantidad, por favor contacta a soporte.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
            <span
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                alumnosLimiteAlcanzado
                  ? dark
                    ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                    : 'bg-red-100 text-red-800 border border-red-300'
                  : dark
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {alumnosActuales}/{maxAlumnos}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                jefesLimiteAlcanzado
                  ? dark
                    ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                    : 'bg-red-100 text-red-800 border border-red-300'
                  : dark
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {jefesActuales}/{maxJefesCarrera}
            </span>
          </div>

          <a
            href={`mailto:${correoSoporte}?subject=Cambio%20de%20Plan%20PRACNET%20-%20Aumento%20de%20Cupos`}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95 ${
              dark
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contactar a Soporte ({correoSoporte})
          </a>
        </div>
      </div>
    </div>
  );
}
