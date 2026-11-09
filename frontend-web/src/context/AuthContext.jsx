import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

// Tiempo límite de inactividad: 2 horas exactas (en milisegundos)
const INACTIVITY_LIMIT_MS = 2 * 60 * 60 * 1000; // 7.200.000 ms

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pracnet_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');
  const [clientIp, setClientIp] = useState('190.161.45.12');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(7200);

  const lastActivityRef = useRef(Number(localStorage.getItem('pracnet_last_activity')) || Date.now());
  const throttleTimeoutRef = useRef(null);

  // Función para reiniciar el contador de inactividad a 2 horas tras interacción del usuario
  const resetInactivityTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    localStorage.setItem('pracnet_last_activity', now.toString());
    setTimeRemainingSeconds(7200);

    // Opcional: Notificar al backend cada 15 minutos para refrescar TTL en Redis / registrar actividad
    if (!throttleTimeoutRef.current) {
      throttleTimeoutRef.current = setTimeout(() => {
        api.post('/auth/ping').catch(() => {});
        throttleTimeoutRef.current = null;
      }, 15 * 60 * 1000);
    }
  }, []);

  // Cierre de sesión formal
  const logout = useCallback(async (reason = '') => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('pracnet_token');
    localStorage.removeItem('pracnet_user');
    localStorage.removeItem('pracnet_last_activity');
    setUser(null);
    if (reason) {
      setSessionExpiredMessage(reason);
    }
  }, []);

  // Detector de Inactividad (Revisa periódicamente el tiempo transcurrido)
  useEffect(() => {
    if (!user) return;

    // Obtener IP pública/registrada para la bitácora
    api.post('/auth/ping')
      .then((res) => {
        if (res.data?.ip) setClientIp(res.data.ip);
      })
      .catch(() => {});

    // Guardar timestamp inicial si no existe
    if (!localStorage.getItem('pracnet_last_activity')) {
      localStorage.setItem('pracnet_last_activity', Date.now().toString());
    }

    const interval = setInterval(() => {
      const storedLastActivity = Number(localStorage.getItem('pracnet_last_activity')) || lastActivityRef.current;
      const elapsed = Date.now() - storedLastActivity;
      const remaining = Math.max(0, Math.floor((INACTIVITY_LIMIT_MS - elapsed) / 1000));
      setTimeRemainingSeconds(remaining);

      // Si pasaron 2 horas sin interacción, forzar cierre de sesión por seguridad
      if (elapsed >= INACTIVITY_LIMIT_MS) {
        clearInterval(interval);
        logout('Tu sesión fue cerrada automáticamente por inactividad (2 horas sin interacción) para proteger tus datos bajo la Ley N° 19.628.');
      }
    }, 5000);

    // Escuchadores de eventos globales para detectar interacción del usuario
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    let lastThrottledTime = Date.now();

    const handleUserInteraction = () => {
      const now = Date.now();
      // Throttle a cada 5 segundos para no sobrecargar el almacenamiento
      if (now - lastThrottledTime > 5000) {
        lastThrottledTime = now;
        resetInactivityTimer();
      }
    };

    events.forEach((ev) => window.addEventListener(ev, handleUserInteraction, { passive: true }));

    return () => {
      clearInterval(interval);
      events.forEach((ev) => window.removeEventListener(ev, handleUserInteraction));
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
    };
  }, [user, resetInactivityTimer, logout]);

  const login = async (email, password) => {
    setLoading(true);
    setSessionExpiredMessage('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('pracnet_token', res.data.token);
        localStorage.setItem('pracnet_user', JSON.stringify(res.data.user));
        resetInactivityTimer();
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      // Fallback contingencia demo
      const demoUser = {
        id: 1,
        email: email || 'jefe.carrera@usm.cl',
        nombre: 'Dr. Roberto Canales',
        cargo: 'Jefatura de Carrera - Depto. Informática',
        rol: 'jefe_carrera',
        rut: '11.111.111-1'
      };
      localStorage.setItem('pracnet_token', 'demo_jwt_token_2026');
      localStorage.setItem('pracnet_user', JSON.stringify(demoUser));
      resetInactivityTimer();
      setUser(demoUser);
      return { success: true, user: demoUser };
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    setSessionExpiredMessage('');
    let mockUser;
    if (role === 'jefe') {
      mockUser = {
        id: 1,
        email: 'jefe.carrera@usm.cl',
        nombre: 'Dr. Roberto Canales',
        cargo: 'Jefatura de Carrera - Depto. Informática',
        rol: 'jefe_carrera',
        rut: '11.111.111-1'
      };
    } else if (role === 'secretaria') {
      mockUser = {
        id: 2,
        email: 'secretaria.docencia@usm.cl',
        nombre: 'Mariana Silva',
        cargo: 'Secretaría de Docencia & Coordinación',
        rol: 'secretaria',
        rut: '12.222.222-2'
      };
    } else if (role === 'docente') {
      mockUser = {
        id: 3,
        email: 'carlos.soto@usm.cl',
        nombre: 'Prof. Carlos Soto',
        cargo: 'Profesor Guía de Práctica Profesional',
        rol: 'docente',
        rut: '13.333.333-3'
      };
    } else if (role === 'estudiante') {
      mockUser = {
        id: 4,
        email: 'valentina.rios@alumnos.usm.cl',
        nombre: 'Valentina Ríos',
        cargo: 'Estudiante Ing. Civil Informática (9° Semestre)',
        rol: 'estudiante',
        rut: '20.456.789-3'
      };
    } else {
      mockUser = {
        id: 5,
        email: 'admin.general@usm.cl',
        nombre: 'Administrador Institucional PRACNET',
        cargo: 'Dirección de Estudios Institucionales USM',
        rol: 'admin',
        rut: '14.444.444-4'
      };
    }
    localStorage.setItem('pracnet_token', 'demo_quick_token_2026');
    localStorage.setItem('pracnet_user', JSON.stringify(mockUser));
    resetInactivityTimer();
    setUser(mockUser);
    return mockUser;
  };

  // Formato para mostrar tiempo restante (Ej: "1h 58m" o "52m")
  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemainingSeconds / 3600);
    const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        quickLogin,
        logout: () => logout(),
        loading,
        isAuthenticated: !!user,
        clientIp,
        timeRemainingFormatted: formatTimeRemaining(),
        timeRemainingSeconds,
        sessionExpiredMessage,
        clearExpiredMessage: () => setSessionExpiredMessage(''),
        resetInactivityTimer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
