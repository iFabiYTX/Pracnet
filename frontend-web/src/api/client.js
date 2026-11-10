import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pracnet_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuesta para manejar sesiones expiradas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No redirigir si el 401 ocurrió durante el intento de inicio de sesión
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    if (error.response && error.response.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('pracnet_token');
      localStorage.removeItem('pracnet_user');
      if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/admin') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
