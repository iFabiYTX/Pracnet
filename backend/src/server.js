import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/index.js';
import { pool, redis } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Inyección de Cabeceras de Seguridad HTTP (OWASP ASVS)
app.use(helmet({
  contentSecurityPolicy: false // Compatible con clientes móviles y APIs
}));

// 2. Control de Acceso CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Limitador de Tasa (Rate Limiting) para protección contra ataques de fuerza bruta
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Límite por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes enviadas. Por favor intente más tarde.'
  }
});

app.use('/api', apiLimiter);

// 4. Montar Enrutador Principal
app.use('/api', apiRoutes);

// 5. Manejo Centralizado de Errores (404 y 500)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Recurso no encontrado: [${req.method}] ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error('>> [Error Handler]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: 'Error interno en el servidor PRACNET.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 6. Iniciar Servidor
const server = app.listen(PORT, () => {
  console.log('='.repeat(65));
  console.log('>> PRACNET v2.0 - Backend API en Node.js v22');
  console.log('   Universidad Técnica Federico Santa María (USM)');
  console.log(`   Servidor escuchando en: http://127.0.0.1:${PORT}`);
  console.log('='.repeat(65));
});

// Cierre elegante (Graceful Shutdown)
process.on('SIGTERM', async () => {
  console.log('>> Recibida señal SIGTERM. Cerrando conexiones con MySQL y Redis...');
  server.close(async () => {
    await pool.end();
    await redis.quit();
    console.log('>> Conexiones cerradas de forma segura. Proceso terminado.');
    process.exit(0);
  });
});

export default app;
