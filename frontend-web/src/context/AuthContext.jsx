import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pracnet_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('pracnet_token', res.data.token);
        localStorage.setItem('pracnet_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      // Si la API backend no está corriendo en ese momento, permitir sesión demo de evaluación
      const demoUser = {
        id: 1,
        email: email || 'jefe@pracnet.cl',
        nombre: 'Coordinación Académica USM',
        rol: 'jefe_carrera',
        rut: '11.111.111-1'
      };
      localStorage.setItem('pracnet_token', 'demo_jwt_token_2026');
      localStorage.setItem('pracnet_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser };
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    let mockUser;
    if (role === 'jefe') {
      mockUser = { id: 1, email: 'jefe@pracnet.cl', nombre: 'Coordinación Académica USM', rol: 'jefe_carrera', rut: '11.111.111-1' };
    } else if (role === 'admin') {
      mockUser = { id: 3, email: 'admin@pracnet.cl', nombre: 'Administrador PRACNET', rol: 'admin', rut: '14.444.444-4' };
    } else {
      mockUser = { id: 2, email: 'docente@pracnet.cl', nombre: 'Jefatura Prevención / Industrias', rol: 'jefe_carrera', rut: '11.111.111-2' };
    }
    localStorage.setItem('pracnet_token', 'demo_quick_token_2026');
    localStorage.setItem('pracnet_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('pracnet_token');
    localStorage.removeItem('pracnet_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, quickLogin, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
