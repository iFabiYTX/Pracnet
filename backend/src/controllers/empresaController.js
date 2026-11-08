import { pool } from '../config/db.js';
import { logAuditEvent } from '../middlewares/auth.js';

/**
 * Portal Empresa con Acceso sin Contraseña (Magic Link / Estilo Copec)
 * Resuelve el dolor planteado en las entrevistas por los Jefes de Carrera
 */
export async function getPortalByToken(req, res) {
  try {
    const { token } = req.params;

    // 1. Buscar la oferta asociada al token seguro
    const [ofertas] = await pool.execute(`
      SELECT o.*, e.nombre AS empresa_nombre, e.area AS empresa_area, e.correo_contacto
      FROM ofertas_practica o
      JOIN empresas e ON o.empresa_id = e.id
      WHERE o.token_acceso = ?
    `, [token]);

    if (ofertas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El enlace o token de acceso no es válido o ha expirado.'
      });
    }

    const oferta = ofertas[0];

    // 2. Obtener los postulantes a esta vacante
    const [postulantes] = await pool.execute(`
      SELECT p.*,
             e.id AS estudiante_id, e.nombre AS est_nombre, e.apellido AS est_apellido,
             e.carrera, e.avance_malla, e.semestre_actual, e.habilidades, e.correo_institucional, e.telefono,
             (SELECT nombre_archivo FROM documentos_practica WHERE estudiante_id = e.id AND tipo_documento = 'curriculum' LIMIT 1) AS cv_archivo
      FROM postulaciones p
      JOIN estudiantes e ON p.estudiante_id = e.id
      WHERE p.oferta_practica_id = ?
      ORDER BY p.id DESC
    `, [oferta.id]);

    return res.json({
      success: true,
      oferta,
      postulantes,
      token
    });
  } catch (error) {
    console.error('>> Error en getPortalByToken:', error);
    return res.status(500).json({ success: false, message: 'Error al consultar portal de empresa.' });
  }
}

/**
 * Toma de decisión por la empresa (Aceptar para entrevista o Rechazar con Retroalimentación)
 */
export async function tomarDecision(req, res) {
  try {
    const { token, postulacionId } = req.params;
    const { decision, observacion } = req.body; // 'aceptar' o 'rechazar'

    if (!['aceptar', 'rechazar'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decisión inválida. Debe ser "aceptar" o "rechazar".' });
    }

    // 1. Verificar pertenencia del token a la oferta
    const [ofertas] = await pool.execute('SELECT id, titulo FROM ofertas_practica WHERE token_acceso = ?', [token]);
    if (ofertas.length === 0) {
      return res.status(403).json({ success: false, message: 'Token no autorizado para esta operación.' });
    }
    const oferta = ofertas[0];

    // 2. Verificar que la postulación corresponda a esta oferta
    const [postulaciones] = await pool.execute(`
      SELECT p.*, e.usuario_id, e.nombre AS est_nombre
      FROM postulaciones p
      JOIN estudiantes e ON p.estudiante_id = e.id
      WHERE p.id = ? AND p.oferta_practica_id = ?
    `, [postulacionId, oferta.id]);

    if (postulaciones.length === 0) {
      return res.status(404).json({ success: false, message: 'Postulación no encontrada para esta oferta.' });
    }

    const postulacion = postulaciones[0];
    let nuevoEstado, nuevaFase, msgNotif, flashMsg;

    if (decision === 'aceptar') {
      nuevoEstado = 'En Selección';
      nuevaFase = 'Entrevista Técnica Realizada';
      msgNotif = `¡Buenas noticias! La empresa ha seleccionado tu postulación para "${oferta.titulo}". Nota de la empresa: ${observacion || 'Te contactaremos a la brevedad para coordinar la entrevista.'}`;
      flashMsg = `Postulante ${postulacion.est_nombre} aceptado/a para proceso de entrevista.`;
    } else {
      nuevoEstado = 'Rechazado';
      nuevaFase = 'Postulación Desestimada';
      msgNotif = `Tu postulación a "${oferta.titulo}" no ha sido seleccionada en esta oportunidad. Retroalimentación de la empresa: ${observacion || 'El perfil no coincide con los requerimientos actuales del cargo.'}`;
      flashMsg = `Postulante ${postulacion.est_nombre} rechazado/a. Se notificó la retroalimentación constructiva.`;
    }

    // Actualizar estado y feedback en MySQL
    await pool.execute(`
      UPDATE postulaciones 
      SET estado = ?, fase_administrativa = ?, observaciones = ? 
      WHERE id = ?
    `, [nuevoEstado, nuevaFase, observacion || null, postulacionId]);

    // Notificación en tiempo real para el estudiante
    await pool.execute(`
      INSERT INTO notificaciones (usuario_id, titulo, mensaje)
      VALUES (?, 'Actualización de tu Postulación', ?)
    `, [postulacion.usuario_id, msgNotif]);

    await logAuditEvent(null, 'DECISION_EMPRESA_TOKEN', `Empresa evaluó postulación #${postulacionId} con resultado: ${decision.toUpperCase()}`, req);

    return res.json({
      success: true,
      message: flashMsg,
      nuevoEstado,
      nuevaFase
    });
  } catch (error) {
    console.error('>> Error en tomarDecision:', error);
    return res.status(500).json({ success: false, message: 'Error al registrar decisión sobre el postulante.' });
  }
}
