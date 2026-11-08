import { Router } from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import adminRoutes from './adminRoutes.js';
import empresaRoutes from './empresaRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/estudiante', studentRoutes);
router.use('/admin', adminRoutes);
router.use('/empresa', empresaRoutes);

// Health check para balanceadores de carga y AWS EC2
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    platform: 'PRACNET USM API v2.0',
    timestamp: new Date().toISOString()
  });
});

export default router;
