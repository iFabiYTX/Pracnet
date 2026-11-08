import { Router } from 'express';
import { login, register, recuperarPassword, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/recuperar-password', recuperarPassword);
router.post('/logout', authenticateToken, logout);

export default router;
