import mysql from 'mysql2/promise';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// ====================================================================
// 1. POOL DE CONEXIÓN A MYSQL 8.0.x (InnoDB, utf8mb4)
// ====================================================================
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'pracnet_user',
  password: process.env.DB_PASSWORD || 'PracNet_USM_2026!',
  database: process.env.DB_NAME || 'pracnet_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '-04:00' // Horario oficial de Chile Continental (CLT)
});

// ====================================================================
// 2. CLIENTE DE REDIS 7.2 (Sesiones, Tokens Mágicos y Caché)
// ====================================================================
export const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    // Reconexión exponencial con tope de 3 segundos
    return Math.min(times * 100, 3000);
  },
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

// Manejo resiliente de eventos de Redis
redis.on('connect', () => {
  console.log('>> [Redis 7.2] Conexión establecida con éxito.');
});

redis.on('error', (err) => {
  console.warn('>> [Redis 7.2] Advertencia de conexión:', err.message);
});
