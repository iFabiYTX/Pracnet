import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedUser = await AsyncStorage.getItem('student_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        await AsyncStorage.setItem('student_token', res.data.token);
        await AsyncStorage.setItem('student_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (e) {
      // Demo fallback con la cuenta de Carlos Mendoza (Mockup 9.1)
      const mockStudent = {
        id: 5,
        estudianteId: 1,
        nombre: 'Carlos Mendoza',
        email: email || 'alumno@pracnet.cl',
        rol: 'estudiante',
        rut: '20.123.456-7',
        carrera: 'Ingeniería Civil Informática',
        avanceMalla: 85,
        semestre: '8° Semestre'
      };
      await AsyncStorage.setItem('student_token', 'demo_token_mobile');
      await AsyncStorage.setItem('student_user', JSON.stringify(mockStudent));
      setUser(mockStudent);
      return { success: true };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      return res.data;
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Error al conectar con el servidor.' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('student_token');
    await AsyncStorage.removeItem('student_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
