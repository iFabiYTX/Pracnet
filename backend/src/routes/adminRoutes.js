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
  getReportesData
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

export default router;
