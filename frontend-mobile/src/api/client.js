import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base: conectada a la API de PRACNET en Render
const API_URL = 'https://pracnet-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('student_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

export default api;
