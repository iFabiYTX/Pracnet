import { Router } from 'express';
import {
  getDashboard,
  getOfertas,
  createOferta,
  updateOfertaEstado,
  getRecomendaciones,
  notificarAlumno,
  getPostulaciones,
  updateFasePostulacion,
  getDocumentos,
  firmarDocumento,
  getReportesData,
  getUsersList,
  createUserByAdmin,
  resetUserPassword,
  deleteUserByAdmin,
  getSystemHealthStatus,
  getCompanyTokensList,
  createCompanyTokenAction,
  revokeCompanyTokenAction
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = Router();

// Accesible por 'jefe_carrera' y 'admin'
router.use(authenticateToken, requireRole(['jefe_carrera', 'admin']));

router.get('/dashboard', getDashboard);
router.get('/ofertas', getOfertas);
router.post('/ofertas', createOferta);
router.patch('/ofertas/:id/estado', updateOfertaEstado);
router.get('/recomendaciones', getRecomendaciones);
router.post('/notificar-alumno', notificarAlumno);
router.get('/postulaciones', getPostulaciones);
router.patch('/postulaciones/:postulacionId/fase', updateFasePostulacion);
router.get('/documentos', getDocumentos);
router.post('/documentos/:docId/firmar', firmarDocumento);
router.get('/reportes', getReportesData);

// Rutas Especiales del Panel de Control & Administración PRACNET
router.get('/users', getUsersList);
router.post('/users/create', createUserByAdmin);
router.post('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUserByAdmin);

router.get('/system-status', getSystemHealthStatus);

router.get('/company-tokens', getCompanyTokensList);
router.post('/company-tokens/create', createCompanyTokenAction);
router.post('/company-tokens/:id/revoke', revokeCompanyTokenAction);

export default router;
