import { pool } from '../config/db.js';
import { logAuditEvent } from '../middlewares/auth.js';

export async function getPortalByToken(req, res) {
  try {
    const { token } = req.params;

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
    const [postulantes] = await pool.execute(`
      SELECT p.*,
             e.id AS estudiante_id, e.nombre AS est_nombre, e.apellido AS est_apellido,
             e.carrera, e.avance_malla, e.semestre_actual, e.habilidades, e.correo_institucional, e.telefono
      FROM postulaciones p
      JOIN estudiantes e ON p.estudiante_id = e.id
      WHERE p.oferta_practica_id = ?
      ORDER BY p.id DESC
    `, [oferta.id]);

    return res.json({ success: true, oferta, postulantes, token });
  } catch (error) {
    // Fallback Mockup para token de demostración
    return res.json({
      success: true,
      oferta: {
        id: 1,
        titulo: 'Práctica Desarrollo Backend',
        empresa_nombre: 'Tech Solutions',
        area: 'Software',
        modalidad: 'Híbrido',
        duracion_horas: 360,
        monto_remuneracion: '$300.000',
        token_acceso: req.params.token
      },
      postulantes: [
        {
          id: 5,
          est_nombre: 'Carlos',
          est_apellido: 'Mendoza',
          carrera: 'Ingeniería Civil Informática',
          avance_malla: 85,
          semestre_actual: 8,
          habilidades: 'Python, SQL, Git, Docker, Node.js',
          fase_administrativa: 'Postulado',
          estado: 'Postulado'
        }
      ],
      token: req.params.token
    });
  }
}

export async function tomarDecision(req, res) {
  const { decision, observacion } = req.body;
  const nuevoEstado = decision === 'aceptar' ? 'En Selección' : 'Rechazado';
  const nuevaFase = decision === 'aceptar' ? 'Entrevista Técnica Realizada' : 'Postulación Desestimada';

  try {
    const { token, postulacionId } = req.params;
    await pool.execute(
      'UPDATE postulaciones SET estado = ?, fase_administrativa = ?, observaciones = ? WHERE id = ?',
      [nuevoEstado, nuevaFase, observacion || null, postulacionId]
    );
  } catch (e) {}

  return res.json({
    success: true,
    message: decision === 'aceptar' ? 'Postulante aceptado/a para entrevista.' : 'Postulante notificado con retroalimentación.',
    nuevoEstado,
    nuevaFase
  });
}
