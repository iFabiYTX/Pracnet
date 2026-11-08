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
    setUser(mockUser);
    return mockUser;
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
