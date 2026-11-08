import { verifyJwt } from '../utils/security.js';
import { pool, redis } from '../config/db.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token no proporcionado.'
    });
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado. Por favor inicia sesión nuevamente.'
    });
  }

  // Opcional: verificar sesión en Redis si el servidor Redis está activo
  try {
    const sessionKey = `pracnet:session:${decoded.id}:${token}`;
    const sessionData = await redis.get(sessionKey);
    if (sessionData) {
      req.sessionData = JSON.parse(sessionData);
    }
  } catch (err) {
    // Si Redis está en fallback, continuamos con la verificación criptográfica del JWT
  }

  req.user = decoded;
  next();
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: No posees los privilegios requeridos para este módulo.'
      });
    }

    next();
  };
}

/**
 * Registra eventos en la bitácora de auditoría para dar cumplimiento a la Ley N° 19.628 y OWASP.
 */
export async function logAuditEvent(usuarioId, accion, detalle, req = null) {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';
    await pool.execute(
      'INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address) VALUES (?, ?, ?, ?)',
      [usuarioId || null, accion, detalle, typeof ip === 'string' ? ip.split(',')[0].trim() : ip]
    );
  } catch (err) {
    console.error('>> Error al registrar bitácora de auditoría:', err.message);
  }
}
