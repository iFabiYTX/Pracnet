import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, quickLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Credenciales incorrectas');
    }
  };

  const handleQuick = (role) => {
    quickLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Barra de Acceso Rápido para Demostración y Evaluación */}
      <div className="w-full max-w-md mb-4 bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-usm-blue" />
          Acceso Rápido Demo:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handleQuick('jefe')}
            className="px-2.5 py-1 bg-usm-navy text-white rounded font-medium hover:bg-usm-blue transition-colors"
          >
            Jefe Carrera
          </button>
          <button
            onClick={() => handleQuick('admin')}
            className="px-2.5 py-1 bg-slate-700 text-white rounded font-medium hover:bg-slate-900 transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Card Principal - Diseño Fiel al Mockup Web 9.2 */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-usm-navy tracking-tight">PracNet</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
            Sistema de Gestión
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@universidad.cl"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue/30 focus:border-usm-blue transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-usm-blue/30 focus:border-usm-blue transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-usm-navy hover:bg-usm-blue text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Validando...' : 'Entrar al Sistema'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2 text-xs text-slate-500">
          <p>
            <a href="#olvidaste" className="text-usm-blue hover:underline font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
          <p>
            ¿No tienes cuenta?{' '}
            <a href="#solicitar" className="text-usm-blue hover:underline font-semibold">
              Solicitar acceso
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
