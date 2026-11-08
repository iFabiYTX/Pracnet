import { Router } from 'express';
import { 
  getMuro, 
  postular, 
  getValidacion, 
  getSeguimiento, 
  getPerfil, 
  asistenteAi, 
  getMensajes, 
  enviarMensaje 
} from '../controllers/studentController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas de estudiante requieren autenticación y rol 'estudiante'
router.use(authenticateToken, requireRole(['estudiante']));

router.get('/muro', getMuro);
router.post('/postular/:ofertaId', postular);
router.get('/validacion', getValidacion);
router.get('/seguimiento', getSeguimiento);
router.get('/perfil', getPerfil);
router.post('/asistente-ai', asistenteAi);
router.get('/mensajes', getMensajes);
router.post('/mensajes', enviarMensaje);

export default router;
