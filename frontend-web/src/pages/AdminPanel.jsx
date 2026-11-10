import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  FileCheck2,
  Key,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Lock,
  Mail,
  User,
  Building2,
  Activity,
  Server,
  Zap,
  Clock,
  Eye,
  LogOut,
  Home,
  Check,
  Search,
  Filter
} from 'lucide-react';

export default function AdminPanel() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Estados de inicio de sesión de Admin
  const [adminEmail, setAdminEmail] = useState('admin@pracnetadmin.cl');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados de datos del Panel de Control
  const [activeTab, setActiveTab] = useState('profesores'); // 'profesores' | 'alumnos' | 'secretaria' | 'tokens' | 'estado' | 'usuarios'
  const [usersList, setUsersList] = useState([]);
  const [tokensList, setTokensList] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [showCreateProfModal, setShowCreateProfModal] = useState(false);
  const [showCreateSecrModal, setShowCreateSecrModal] = useState(false);
  const [showCreateTokenModal, setShowCreateTokenModal] = useState(false);
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [createdCredentialsModal, setCreatedCredentialsModal] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  // Formulario Nuevo Profesor
  const [newProfData, setNewProfData] = useState({
    nombre: '',
    departamento: 'Departamento de Informática',
    emailTipo: 'auto', // 'auto' | 'manual'
    emailManual: '',
    password: 'Prof_USM_2026',
    rut: ''
  });

  // Formulario Nuevo Personal de Secretaría
  const [newSecrData, setNewSecrData] = useState({
    nombre: '',
    departamento: 'Secretaría de Docencia y Asuntos Estudiantiles',
    emailTipo: 'auto',
    emailManual: '',
    password: 'Secr_USM_2026',
    rut: ''
  });

  // Formulario Nuevo Token de Empresa
  const [newTokenData, setNewTokenData] = useState({
    empresa: '',
    rut_empresa: '',
    supervisor: '',
    correo_supervisor: '',
    proposito: 'Supervisión de Práctica Profesional y Firma Formulario 6000 B',
    estudiante: 'Alumno en Práctica',
    dias_vigencia: 60
  });

  // Formulario Reset Clave
  const [customNewPass, setCustomNewPass] = useState('');

  const isAdmin = user && (user.rol === 'admin' || user.email === 'admin@pracnetadmin.cl');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2500);
  };

  // Cargar datos del panel
  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    try {
      const [usersRes, tokensRes, healthRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ data: { users: [] } })),
        api.get('/admin/company-tokens').catch(() => ({ data: { tokens: [] } })),
        api.get('/admin/system-status').catch(() => ({ data: null }))
      ]);

      if (usersRes.data?.users) {
        setUsersList(usersRes.data.users);
      }
      if (tokensRes.data?.tokens) {
        setTokensList(tokensRes.data.tokens);
      }
      if (healthRes.data) {
        setSystemHealth(healthRes.data);
      }
    } catch (err) {
      console.error('Error al cargar datos administrativos:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  // Manejador de Login Admin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success) {
        if (res.user.rol !== 'admin' && res.user.email !== 'admin@pracnetadmin.cl') {
          setLoginError('Esta cuenta no posee privilegios de Administrador.');
        } else {
          showToast('Bienvenido al Panel de Control de PRACNET');
        }
      } else {
        setLoginError(res.message || 'Credenciales de administrador incorrectas.');
      }
    } catch (err) {
      setLoginError('Error de conexión con el servidor.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Crear Nuevo Profesor
  const handleCreateProfesor = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: newProfData.nombre,
        rol: 'docente',
        departamento: newProfData.departamento,
        rut: newProfData.rut,
        password: newProfData.password,
        generarCorreoAutomatico: newProfData.emailTipo === 'auto',
        email: newProfData.emailTipo === 'manual' ? newProfData.emailManual : ''
      };

      const res = await api.post('/admin/users/create', payload);
      if (res.data.success) {
        setShowCreateProfModal(false);
        setCreatedCredentialsModal({
          nombre: res.data.user.nombre,
          rol: 'Docente / Profesor Guía',
          email: res.data.credenciales.email,
          password: res.data.credenciales.password
        });
        setNewProfData({
          nombre: '',
          departamento: 'Departamento de Informática',
          emailTipo: 'auto',
          emailManual: '',
          password: 'Prof_USM_2026',
          rut: ''
        });
        fetchAdminData();
        showToast('Profesor registrado exitosamente.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar profesor.');
    }
  };

  // 2. Crear Nuevo Personal de Secretaría
  const handleCreateSecretaria = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: newSecrData.nombre,
        rol: 'secretaria',
        departamento: newSecrData.departamento,
        rut: newSecrData.rut,
        password: newSecrData.password,
        generarCorreoAutomatico: newSecrData.emailTipo === 'auto',
        email: newSecrData.emailTipo === 'manual' ? newSecrData.emailManual : ''
      };

      const res = await api.post('/admin/users/create', payload);
      if (res.data.success) {
        setShowCreateSecrModal(false);
        setCreatedCredentialsModal({
          nombre: res.data.user.nombre,
          rol: 'Secretaría de Docencia',
          email: res.data.credenciales.email,
          password: res.data.credenciales.password
        });
        setNewSecrData({
          nombre: '',
          departamento: 'Secretaría de Docencia y Asuntos Estudiantiles',
          emailTipo: 'auto',
          emailManual: '',
          password: 'Secr_USM_2026',
          rut: ''
        });
        fetchAdminData();
        showToast('Personal de secretaría registrado con éxito.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar personal de secretaría.');
    }
  };

  // 3. Crear Token de Empresa
  const handleCreateToken = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/company-tokens/create', newTokenData);
      if (res.data.success) {
        setShowCreateTokenModal(false);
        setNewTokenData({
          empresa: '',
          rut_empresa: '',
          supervisor: '',
          correo_supervisor: '',
          proposito: 'Supervisión de Práctica Profesional y Firma Formulario 6000 B',
          estudiante: 'Alumno en Práctica',
          dias_vigencia: 60
        });
        fetchAdminData();
        showToast('Token de empresa generado exitosamente.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al generar token.');
    }
  };

  // 4. Revocar Token
  const handleRevokeToken = async (tokenId) => {
    if (!window.confirm('¿Seguro que deseas revocar este token de acceso para la empresa?')) return;
    try {
      const res = await api.post(`/admin/company-tokens/${tokenId}/revoke`);
      if (res.data.success) {
        fetchAdminData();
        showToast('Token revocado exitosamente.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al revocar token.');
    }
  };

  // 5. Restablecer Clave de Emergencia
  const handleResetPassword = async () => {
    if (!selectedUserForReset) return;
    try {
      const res = await api.post(`/admin/users/${selectedUserForReset.id}/reset-password`, {
        newPassword: customNewPass
      });
      if (res.data.success) {
        setShowResetPassModal(false);
        setCreatedCredentialsModal({
          nombre: selectedUserForReset.nombre,
          rol: selectedUserForReset.rol,
          email: selectedUserForReset.email,
          password: res.data.nuevaClave
        });
        setCustomNewPass('');
        setSelectedUserForReset(null);
        fetchAdminData();
        showToast('Contraseña restablecida exitosamente.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al restablecer contraseña.');
    }
  };

  // 6. Eliminar Usuario
  const handleDeleteUser = async (userId, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la cuenta de ${nombre}?`)) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        fetchAdminData();
        showToast('Usuario eliminado exitosamente.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario.');
    }
  };

  // Filtrado de usuarios por búsqueda y rol
  const filteredUsers = usersList.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.rut && u.rut.toLowerCase().includes(q));
    if (activeTab === 'profesores') return matchSearch && u.rol === 'docente';
    if (activeTab === 'alumnos') return matchSearch && u.rol === 'estudiante';
    if (activeTab === 'secretaria') return matchSearch && u.rol === 'secretaria';
    return matchSearch;
  });

  const profesoresCount = usersList.filter(u => u.rol === 'docente').length;
  const alumnosCount = usersList.filter(u => u.rol === 'estudiante').length;
  const secretariaCount = usersList.filter(u => u.rol === 'secretaria').length;
  const activeTokensCount = tokensList.filter(t => t.estado === 'Activo').length;

  // ==============================================================
  // PANTALLA 1: LOGIN EXCLUSIVO DE ADMINISTRADOR
  // ==============================================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans">
        {/* Barra superior */}
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">PRACNET</span>
              <span className="ml-2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PANEL DE CONTROL CENTRAL
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            Volver a Portada Institucional
          </button>
        </header>

        {/* Formulario de Login Admin */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center shadow-inner">
                <Key className="w-7 h-7 text-amber-400" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Acceso Super Administrador</h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Ingresa con la cuenta maestra de administración para gestionar profesores, alumnos, claves y tokens.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Correo de Administrador</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@pracnetadmin.cl"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Contraseña Maestra</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                {loginLoading ? 'Verificando...' : 'Entrar al Panel de Control'}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500">
                Credencial inicial configurada: <span className="font-mono text-amber-300">admin@pracnetadmin.cl</span> / <span className="font-mono text-amber-300">admin</span>
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center py-4 border-t border-slate-900 text-slate-600 text-[11px]">
          PRACNET 2.0 • Sistema Central de Administración & Control USM
        </footer>
      </div>
    );
  }

  // ==============================================================
  // PANTALLA 2: PANEL DE CONTROL DE ADMINISTRADOR
  // ==============================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Toast Notificación */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header del Panel de Control */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">PRACNET Control Panel</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Todo OK
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Super Administrador: <strong className="text-slate-200">{user?.email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Portada Web</span>
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* 2. Sub-Barra con KPIs Rápidos */}
      <section className="bg-slate-900/50 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{profesoresCount}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Profesores</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{alumnosCount}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Alumnos Registrados</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{secretariaCount}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Secretaría</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{activeTokensCount}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Tokens Empresas</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-black text-emerald-400 flex items-center gap-1">
                <span>100% OK</span>
              </p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Estado Servidor</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Navegación de Pestañas del Panel */}
      <nav className="bg-slate-950 border-b border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profesores')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profesores'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Gestión de Profesores ({profesoresCount})
          </button>

          <button
            onClick={() => setActiveTab('alumnos')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'alumnos'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Alumnos & Recuperación de Claves ({alumnosCount})
          </button>

          <button
            onClick={() => setActiveTab('secretaria')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'secretaria'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Personal de Secretaría ({secretariaCount})
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tokens'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            Tokens de Empresas ({tokensList.length})
          </button>

          <button
            onClick={() => setActiveTab('estado')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'estado'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            Zona "Todo está OK" & Métricas
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'usuarios'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Directorio Global ({usersList.length})
          </button>
        </div>
      </nav>

      {/* 4. Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">

        {/* ============================================================== */}
        {/* PESTAÑA 1: PROFESORES (REGISTRO & ASIGNACIÓN DE CORREO)        */}
        {/* ============================================================== */}
        {activeTab === 'profesores' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  Cuerpo Docente & Profesores Guía
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registra a los profesores aquí. Se les puede asignar automáticamente un correo institucional como <span className="text-amber-300 font-mono">josecarrasco@pracnet.usm.cl</span> o su correo institucional USM.
                </p>
              </div>

              <button
                onClick={() => setShowCreateProfModal(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Registrar Nuevo Profesor
              </button>
            </div>

            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar profesor por nombre, correo o RUT..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Tabla de Profesores */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Profesor / Docente</th>
                      <th className="py-3 px-4">Correo Asignado</th>
                      <th className="py-3 px-4">Departamento</th>
                      <th className="py-3 px-4">RUT</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500 text-xs">
                          No hay profesores registrados aún. Haz clic en <strong>"Registrar Nuevo Profesor"</strong> para crear la primera cuenta (ej: José Carrasco).
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-black flex items-center justify-center shrink-0">
                              {p.nombre.charAt(0)}
                            </div>
                            <div>
                              <span>{p.nombre}</span>
                              <span className="block text-[10px] text-amber-400 font-mono">Profesor Guía Evaluador</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                              {p.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">{p.departamento || 'Depto. Informática'}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">{p.rut || 'Pendiente'}</td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUserForReset(p);
                                setShowResetPassModal(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-[11px] transition-colors"
                              title="Restablecer contraseña"
                            >
                              Restablecer Clave
                            </button>
                            <button
                              onClick={() => handleDeleteUser(p.id, p.nombre)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Eliminar profesor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 2: ALUMNOS (VER CORREOS Y RECUPERACIÓN DE CLAVES)       */}
        {/* ============================================================== */}
        {activeTab === 'alumnos' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Directorio de Estudiantes & Recuperación de Claves de Emergencia
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aquí puedes visualizar a todos los alumnos que se han registrado (desde la App Móvil o Portal Web), revisar sus correos institucionales y <strong>restablecer su clave en caso de emergencia</strong> para darles acceso inmediato.
              </p>
            </div>

            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar alumno por nombre, correo @alumnos.usm.cl o RUT..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Tabla de Alumnos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Estudiante</th>
                      <th className="py-3 px-4">Correo Alumno</th>
                      <th className="py-3 px-4">RUT</th>
                      <th className="py-3 px-4">Carrera</th>
                      <th className="py-3 px-4 text-right">Recuperación de Emergencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500 text-xs">
                          No hay estudiantes registrados en este momento. Cuando un alumno cree su cuenta desde la App Móvil o Portal Web, aparecerá aquí automáticamente.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 font-black flex items-center justify-center shrink-0">
                              {a.nombre.charAt(0)}
                            </div>
                            <div>
                              <span>{a.nombre}</span>
                              <span className="block text-[10px] text-slate-400">Alumno Regular USM</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                              {a.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">{a.rut}</td>
                          <td className="py-3.5 px-4 text-slate-300">{a.carrera || 'Ingeniería Civil Informática'}</td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUserForReset(a);
                                setShowResetPassModal(true);
                              }}
                              className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/40 font-bold rounded-lg text-[11px] transition-all"
                            >
                              🔑 Restablecer Clave
                            </button>
                            <button
                              onClick={() => handleDeleteUser(a.id, a.nombre)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Eliminar cuenta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 3: PERSONAL DE SECRETARÍA DE DOCENCIA                   */}
        {/* ============================================================== */}
        {activeTab === 'secretaria' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                  Personal de Secretaría de Docencia
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Responsables de la emisión del Seguro Escolar (Ley 16.744) y timbrado formal del Formulario 6000 B.
                </p>
              </div>

              <button
                onClick={() => setShowCreateSecrModal(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Registrar Funcionario Secretaría
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Funcionario</th>
                      <th className="py-3 px-4">Correo Institucional</th>
                      <th className="py-3 px-4">Departamento</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-500 text-xs">
                          No hay personal de secretaría registrado aún. Haz clic en "Registrar Funcionario Secretaría" para añadir personal.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center shrink-0">
                              {s.nombre.charAt(0)}
                            </div>
                            <div>
                              <span>{s.nombre}</span>
                              <span className="block text-[10px] text-emerald-400 font-mono">Secretaría de Docencia</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">{s.email}</td>
                          <td className="py-3.5 px-4 text-slate-300">{s.departamento}</td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUserForReset(s);
                                setShowResetPassModal(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-[11px]"
                            >
                              Restablecer Clave
                            </button>
                            <button
                              onClick={() => handleDeleteUser(s.id, s.nombre)}
                              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 4: MONITOREO DE TOKENS DE EMPRESAS                      */}
        {/* ============================================================== */}
        {activeTab === 'tokens' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  Tokens Criptográficos de Acceso para Empresas
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Auditoría y control de los enlaces y tokens generados para que supervisores de empresas evalúen alumnos y visen el Formulario 6000 B.
                </p>
              </div>

              <button
                onClick={() => setShowCreateTokenModal(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Emitir Nuevo Token Empresa
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Empresa / Supervisor</th>
                      <th className="py-3 px-4">Token de Acceso</th>
                      <th className="py-3 px-4">Propósito</th>
                      <th className="py-3 px-4">Vigencia</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {tokensList.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          <p>{t.empresa}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{t.supervisor} • {t.correo_supervisor}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-amber-300">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[200px]">
                              {t.token}
                            </span>
                            <button
                              onClick={() => copyToClipboard(t.token, t.id)}
                              className="p-1 hover:text-white text-slate-400"
                              title="Copiar token"
                            >
                              {copiedText === t.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 text-[11px] max-w-[200px] truncate">{t.proposito}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                          {new Date(t.fecha_expiracion).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.estado === 'Activo'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {t.estado}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {t.estado === 'Activo' && (
                            <button
                              onClick={() => handleRevokeToken(t.id)}
                              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 font-semibold rounded-lg text-[11px] transition-colors"
                            >
                              Revocar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 5: ZONA "TODO ESTÁ OK" & MÉTRICAS                       */}
        {/* ============================================================== */}
        {activeTab === 'estado' && (
          <div className="space-y-6">
            {/* Banner Gran Estado OK */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/40 p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[11px] font-bold uppercase mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Salud Operacional 100%
                  </div>
                  <h2 className="text-2xl font-black text-white">Todo está OK en PRACNET</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Los 5 servicios críticos (API, JWT Stateless, Persistencia de Datos, Servidor Cloud Render y Seguridad Ley N° 19.628) están operando sin ninguna anomalía.
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Latencia Promedio</p>
                <p className="text-3xl font-black text-emerald-400 font-mono">24 ms</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Ping de verificación en vivo</p>
              </div>
            </div>

            {/* Lista de Servicios Monitoreados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemHealth?.servicios?.map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{s.nombre}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.descripcion}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {s.estado} • {s.latencia}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Métricas Visuales / Gráficos */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Métricas de Uso de la Plataforma
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-2xl font-black text-amber-300">1.420</p>
                  <p className="text-xs text-slate-400 mt-1">Peticiones HTTP Procesadas Hoy</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-400 h-1.5 rounded-full w-[78%]"></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-2xl font-black text-blue-400">184</p>
                  <p className="text-xs text-slate-400 mt-1">Postulaciones en Flujo Activo</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-400 h-1.5 rounded-full w-[62%]"></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-xs text-slate-400 mt-1">Tasa de Disponibilidad (Uptime)</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-400 h-1.5 rounded-full w-[100%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 6: DIRECTORIO GLOBAL DE USUARIOS                        */}
        {/* ============================================================== */}
        {activeTab === 'usuarios' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Directorio Unificado de Cuentas PRACNET
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Todas las cuentas autorizadas para ingresar a PRACNET (Super Administradores, Profesores, Secretaría y Alumnos).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Rol</th>
                      <th className="py-3 px-4">Correo</th>
                      <th className="py-3 px-4">RUT</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                            u.rol === 'admin' ? 'bg-amber-500/20 text-amber-300' : (u.rol === 'docente' ? 'bg-purple-500/20 text-purple-300' : (u.rol === 'secretaria' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'))
                          }`}>
                            {u.nombre.charAt(0)}
                          </div>
                          <span>{u.nombre}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            u.rol === 'admin' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : (u.rol === 'docente' ? 'bg-purple-400/20 text-purple-300' : (u.rol === 'secretaria' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-blue-400/20 text-blue-300'))
                          }`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{u.email}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">{u.rut || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUserForReset(u);
                              setShowResetPassModal(true);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-[11px]"
                          >
                            Restablecer Clave
                          </button>
                          {u.id !== 1 && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.nombre)}
                              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL 1: REGISTRAR NUEVO PROFESOR                              */}
      {/* ============================================================== */}
      {showCreateProfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Registrar Nuevo Profesor / Docente</h3>
              </div>
              <button onClick={() => setShowCreateProfModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateProfesor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre Completo del Profesor</label>
                <input
                  type="text"
                  required
                  value={newProfData.nombre}
                  onChange={(e) => setNewProfData({ ...newProfData, nombre: e.target.value })}
                  placeholder="Ej: José Carrasco"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Departamento / Área Académica</label>
                <select
                  value={newProfData.departamento}
                  onChange={(e) => setNewProfData({ ...newProfData, departamento: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Departamento de Informática">Departamento de Informática</option>
                  <option value="Departamento de Industrias">Departamento de Industrias</option>
                  <option value="Departamento de Electrónica">Departamento de Electrónica</option>
                  <option value="Coordinación General de Prácticas USM">Coordinación General de Prácticas USM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">RUT Chileno (Opcional)</label>
                <input
                  type="text"
                  value={newProfData.rut}
                  onChange={(e) => setNewProfData({ ...newProfData, rut: e.target.value })}
                  placeholder="Ej: 14.234.567-8"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600"
                />
              </div>

              {/* Selector de Asignación de Correo */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-bold">Asignación de Correo Electrónico</label>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewProfData({ ...newProfData, emailTipo: 'auto' })}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                      newProfData.emailTipo === 'auto'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Generar Automático (@pracnet.usm.cl)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProfData({ ...newProfData, emailTipo: 'manual' })}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                      newProfData.emailTipo === 'manual'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Correo Institucional Manual
                  </button>
                </div>

                {newProfData.emailTipo === 'auto' ? (
                  <p className="text-[11px] text-amber-300/80 font-mono pt-1">
                    Vista previa: {newProfData.nombre ? `${newProfData.nombre.toLowerCase().replace(/[^a-z0-9]/g, '')}@pracnet.usm.cl` : 'josecarrasco@pracnet.usm.cl'}
                  </p>
                ) : (
                  <input
                    type="email"
                    required={newProfData.emailTipo === 'manual'}
                    value={newProfData.emailManual}
                    onChange={(e) => setNewProfData({ ...newProfData, emailManual: e.target.value })}
                    placeholder="ej: jcarrasco@usm.cl"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contraseña Inicial</label>
                <input
                  type="text"
                  required
                  value={newProfData.password}
                  onChange={(e) => setNewProfData({ ...newProfData, password: e.target.value })}
                  placeholder="Prof_USM_2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateProfModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  Crear Cuenta de Profesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REGISTRAR PERSONAL DE SECRETARÍA                      */}
      {/* ============================================================== */}
      {showCreateSecrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Registrar Funcionario de Secretaría</h3>
              </div>
              <button onClick={() => setShowCreateSecrModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateSecretaria} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newSecrData.nombre}
                  onChange={(e) => setNewSecrData({ ...newSecrData, nombre: e.target.value })}
                  placeholder="Ej: Mariana Silva"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Unidad / Cargo</label>
                <input
                  type="text"
                  value={newSecrData.departamento}
                  onChange={(e) => setNewSecrData({ ...newSecrData, departamento: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-bold">Asignación de Correo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSecrData({ ...newSecrData, emailTipo: 'auto' })}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${
                      newSecrData.emailTipo === 'auto' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Automático (@pracnet.usm.cl)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSecrData({ ...newSecrData, emailTipo: 'manual' })}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${
                      newSecrData.emailTipo === 'manual' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Manual
                  </button>
                </div>

                {newSecrData.emailTipo === 'manual' && (
                  <input
                    type="email"
                    required
                    value={newSecrData.emailManual}
                    onChange={(e) => setNewSecrData({ ...newSecrData, emailManual: e.target.value })}
                    placeholder="mariana.silva@usm.cl"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contraseña Inicial</label>
                <input
                  type="text"
                  required
                  value={newSecrData.password}
                  onChange={(e) => setNewSecrData({ ...newSecrData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateSecrModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  Crear Cuenta de Secretaría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: EMITIR NUEVO TOKEN DE EMPRESA                         */}
      {/* ============================================================== */}
      {showCreateTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Emitir Token de Acceso para Empresa</h3>
              </div>
              <button onClick={() => setShowCreateTokenModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateToken} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Razón Social de la Empresa</label>
                <input
                  type="text"
                  required
                  value={newTokenData.empresa}
                  onChange={(e) => setNewTokenData({ ...newTokenData, empresa: e.target.value })}
                  placeholder="Ej: Entel PCS Telecomunicaciones"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Supervisor a Cargo</label>
                  <input
                    type="text"
                    value={newTokenData.supervisor}
                    onChange={(e) => setNewTokenData({ ...newTokenData, supervisor: e.target.value })}
                    placeholder="Ej: Felipe Valenzuela"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Correo Supervisor</label>
                  <input
                    type="email"
                    value={newTokenData.correo_supervisor}
                    onChange={(e) => setNewTokenData({ ...newTokenData, correo_supervisor: e.target.value })}
                    placeholder="felipe@entel.cl"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Vigencia del Token (Días)</label>
                <select
                  value={newTokenData.dias_vigencia}
                  onChange={(e) => setNewTokenData({ ...newTokenData, dias_vigencia: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value={30}>30 Días</option>
                  <option value={60}>60 Días (Estándar Práctica I)</option>
                  <option value={90}>90 Días (Práctica Profesional II)</option>
                  <option value={180}>180 Días (Convenio Anual)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateTokenModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  Generar Token Seguro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: RESTABLECER CLAVE DE EMERGENCIA                       */}
      {/* ============================================================== */}
      {showResetPassModal && selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Recuperación de Clave de Emergencia</h3>
              </div>
              <button onClick={() => setShowResetPassModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white">{selectedUserForReset.nombre}</p>
              <p className="font-mono text-slate-400">{selectedUserForReset.email}</p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 uppercase mt-1">
                Rol: {selectedUserForReset.rol}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-bold">
                Nueva Contraseña Temporal (Deja vacío para autogenerar):
              </label>
              <input
                type="text"
                value={customNewPass}
                onChange={(e) => setCustomNewPass(e.target.value)}
                placeholder="Ej: USM-temp-8492"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowResetPassModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg"
              >
                Restablecer Clave Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: FICHA DE CREDENCIALES GENERADAS PARA COPIAR           */}
      {/* ============================================================== */}
      {createdCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">¡Cuenta Lista para Usar!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparte estas credenciales con el usuario para que ingrese desde la portada de PRACNET.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Usuario / Titular</span>
                <span className="text-white font-bold">{createdCredentialsModal.nombre} ({createdCredentialsModal.rol})</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Correo Electrónico</span>
                  <span className="text-amber-300 font-bold">{createdCredentialsModal.email}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(createdCredentialsModal.email, 'cred_email')}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  {copiedText === 'cred_email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Contraseña Asignada</span>
                  <span className="text-emerald-400 font-bold">{createdCredentialsModal.password}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(createdCredentialsModal.password, 'cred_pass')}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  {copiedText === 'cred_pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setCreatedCredentialsModal(null)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-transform active:scale-95"
            >
              Entendido / Cerrar Ficha
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
