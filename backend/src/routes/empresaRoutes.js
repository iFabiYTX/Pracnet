import { Router } from 'express';
import { getPortalByToken, tomarDecision } from '../controllers/empresaController.js';

const router = Router();

// Acceso directo seguro por token sin requerir credenciales
router.get('/portal/:token', getPortalByToken);
router.post('/portal/:token/postulante/:postulacionId/decision', tomarDecision);

export default router;
