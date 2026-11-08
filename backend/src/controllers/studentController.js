import { pool } from '../config/db.js';
import { logAuditEvent } from '../middlewares/auth.js';

/**
 * Muro de Oportunidades con filtros (Mockup 9.1: Ubicación, Área, Remuneración, Modalidad)
 */
export async function getMuro(req, res) {
  try {
    const estudianteId = req.user.estudianteId;
    const { area, modalidad, ubicacion } = req.query;

    let query = `
      SELECT o.*, e.nombre AS empresa_nombre, e.area AS empresa_area,
             (SELECT p.id FROM postulaciones p WHERE p.estudiante_id = ? AND p.oferta_practica_id = o.id LIMIT 1) AS mi_postulacion_id,
             (SELECT p.estado FROM postulaciones p WHERE p.estudiante_id = ? AND p.oferta_practica_id = o.id LIMIT 1) AS mi_postulacion_estado
      FROM ofertas_practica o
      JOIN empresas e ON o.empresa_id = e.id
      WHERE o.estado = 'Activa'
    `;
    const params = [estudianteId, estudianteId];

    if (area) {
      query += ' AND o.area = ?';
      params.push(area);
    }
    if (modalidad) {
      query += ' AND o.modalidad = ?';
      params.push(modalidad);
    }
    if (ubicacion) {
      query += ' AND o.ubicacion LIKE ?';
      params.push(`%${ubicacion}%`);
    }

    query += ' ORDER BY o.id DESC';

    const [ofertas] = await pool.execute(query, params);
    const [areas] = await pool.execute("SELECT DISTINCT area FROM ofertas_practica WHERE estado = 'Activa'");

    return res.json({
      success: true,
      ofertas,
      areasDisponibles: areas.map(a => a.area)
    });
  } catch (error) {
    console.error('>> Error en getMuro:', error);
    return res.status(500).json({ success: false, message: 'Error al consultar ofertas del muro.' });
  }
}

/**
 * Postular a una vacante validando requisitos de avance de malla
 */
export async function postular(req, res) {
  try {
    const estudianteId = req.user.estudianteId;
    const { ofertaId } = req.params;

    if (!estudianteId) {
      return res.status(403).json({ success: false, message: 'Ficha de estudiante no asociada a la cuenta.' });
    }

    // 1. Verificar si ya postuló
    const [existente] = await pool.execute(
      'SELECT id FROM postulaciones WHERE estudiante_id = ? AND oferta_practica_id = ?',
      [estudianteId, ofertaId]
    );

    if (existente.length > 0) {
      return res.status(409).json({ success: false, message: 'Ya has postulado a esta vacante de práctica.' });
    }

    // 2. Verificar cumplimiento de avance curricular mínimo
    const [ofertas] = await pool.execute('SELECT * FROM ofertas_practica WHERE id = ?', [ofertaId]);
    if (ofertas.length === 0) {
      return res.status(404).json({ success: false, message: 'Oferta de práctica no encontrada.' });
    }

    const [estudiantes] = await pool.execute('SELECT * FROM estudiantes WHERE id = ?', [estudianteId]);
    const estudiante = estudiantes[0];
    const oferta = ofertas[0];

    if (estudiante.avance_malla < oferta.min_avance_malla) {
      return res.status(400).json({
        success: false,
        message: `Requisito no cumplido: Esta vacante exige mínimo ${oferta.min_avance_malla}% de avance curricular (tu avance actual es ${estudiante.avance_malla}%).`
      });
    }

    // 3. Crear postulación
    const [result] = await pool.execute(
      `INSERT INTO postulaciones (estudiante_id, oferta_practica_id, estado, fase_administrativa)
       VALUES (?, ?, 'Postulado', 'Postulado')`,
      [estudianteId, ofertaId]
    );

    await logAuditEvent(req.user.id, 'POSTULACION_CREADA', `Postulación a oferta #${ofertaId}: ${oferta.titulo}`, req);

    return res.status(201).json({
      success: true,
      message: '¡Postulación enviada con éxito! Ya puedes realizar el seguimiento de fases.',
      postulacionId: result.insertId
    });
  } catch (error) {
    console.error('>> Error en postular:', error);
    return res.status(500).json({ success: false, message: 'Error interno al enviar la postulación.' });
  }
}

/**
 * Vista de Validación de Práctica y Guía Paso a Paso (Mockup Móvil 9.1)
 */
export async function getValidacion(req, res) {
  try {
    const estudianteId = req.user.estudianteId;

    const [estudiantes] = await pool.execute('SELECT * FROM estudiantes WHERE id = ?', [estudianteId]);
    const estudiante = estudiantes[0];

    // Postulación más reciente
    const [postulaciones] = await pool.execute(
      `SELECT p.*, o.titulo AS oferta_titulo, e.nombre AS empresa_nombre
       FROM postulaciones p
       JOIN ofertas_practica o ON p.oferta_practica_id = o.id
       JOIN empresas e ON o.empresa_id = e.id
       WHERE p.estudiante_id = ?
       ORDER BY p.id DESC LIMIT 1`,
      [estudianteId]
    );
    const postulacion = postulaciones[0] || null;

    // Documentos subidos
    const [documentos] = await pool.execute(
      'SELECT * FROM documentos_practica WHERE estudiante_id = ?',
      [estudianteId]
    );

    const docsMap = {};
    documentos.forEach(doc => {
      docsMap[doc.tipo_documento] = doc;
    });

    // Cálculo del porcentaje de progreso (Checklist 65% del Mockup 9.1)
    let progreso = 0;
    const checklist = {
      inscripcionPractica: false,
      seguroEscolar: false,
      validacionHoras: false,
      informeFinal: false
    };

    if (postulacion) {
      checklist.inscripcionPractica = true;
      progreso += 25;
    }
    if (docsMap['seguro_escolar'] && docsMap['seguro_escolar'].estado_validacion === 'Aprobado') {
      checklist.seguroEscolar = true;
      progreso += 25;
    } else if (docsMap['seguro_escolar']) {
      progreso += 15;
    }

    if (docsMap['formulario_6000b'] || (postulacion && ['Entrevista Técnica Realizada', 'Carta Presentación Emitida', 'Práctica Iniciada', 'Aprobado'].includes(postulacion.fase_administrativa))) {
      checklist.validacionHoras = true;
      progreso += 15;
    }
    if (docsMap['informe_final'] && docsMap['informe_final'].estado_validacion === 'Aprobado') {
      checklist.informeFinal = true;
      progreso += 25;
    }

    return res.json({
      success: true,
      estudiante,
      postulacion,
      progreso: Math.min(progreso, 100),
      checklist,
      documentos: docsMap
    });
  } catch (error) {
    console.error('>> Error en getValidacion:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener datos de validación.' });
  }
}

/**
 * Seguimiento de postulación en tiempo real (Línea de tiempo vertical Mockup 9.1)
 */
export async function getSeguimiento(req, res) {
  try {
    const estudianteId = req.user.estudianteId;
    const [postulaciones] = await pool.execute(
      `SELECT p.*, o.titulo AS oferta_titulo, o.modalidad, o.duracion_horas,
              e.nombre AS empresa_nombre, e.area AS empresa_area
       FROM postulaciones p
       JOIN ofertas_practica o ON p.oferta_practica_id = o.id
       JOIN empresas e ON o.empresa_id = e.id
       WHERE p.estudiante_id = ?
       ORDER BY p.id DESC`,
      [estudianteId]
    );

    const estadosTimeline = ['Postulado', 'En Selección', 'Validación Académica', 'Aprobado'];

    return res.json({
      success: true,
      postulaciones,
      timelineSteps: estadosTimeline
    });
  } catch (error) {
    console.error('>> Error en getSeguimiento:', error);
    return res.status(500).json({ success: false, message: 'Error al consultar seguimiento.' });
  }
}

/**
 * Perfil académico y configuración de privacidad Ley N° 19.628 (Mockup 9.1)
 */
export async function getPerfil(req, res) {
  try {
    const estudianteId = req.user.estudianteId;
    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.terminos_aceptados, u.creado_en AS cuenta_creada_en
       FROM estudiantes e
       JOIN usuarios u ON e.usuario_id = u.id
       WHERE e.id = ?`,
      [estudianteId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Perfil no encontrado.' });
    }

    return res.json({ success: true, perfil: rows[0] });
  } catch (error) {
    console.error('>> Error en getPerfil:', error);
    return res.status(500).json({ success: false, message: 'Error al cargar perfil.' });
  }
}

/**
 * Asistente Virtual AI con conocimiento normativo USM y chileno (Mockup 9.1)
 */
export async function asistenteAi(req, res) {
  try {
    const { pregunta } = req.body;
    const q = (pregunta || '').toLowerCase().trim();

    if (!q) {
      return res.json({
        respuesta: 'Hola, soy el Asistente Virtual de PRACNET. ¿En qué puedo orientarte hoy sobre tu práctica profesional en la USM?'
      });
    }

    let respuesta = '';

    if (q.includes('seguro') || q.includes('16.744') || q.includes('accidente')) {
      respuesta = 'El Seguro Escolar (Ley N° 16.744 y D.S. N° 313) otorga cobertura médica completa ante accidentes en el lugar de trabajo o en trayecto directo. Para activarlo válidamente, debes cargar en PRACNET tu Certificado de Alumno Regular vigente obtenido en SIGA.';
    } else if (q.includes('siga') || q.includes('convalid') || q.includes('tramite') || q.includes('pasos')) {
      respuesta = 'El flujo oficial consta de 4 etapas: 1) Postulación y selección con la empresa, 2) Revisión por Jefatura y emisión de Carta de Presentación, 3) Realización de las horas cronológicas reglamentarias, y 4) Carga del Formulario 6000 B junto al Informe Final para el ingreso de la calificación en SIGA.';
    } else if (q.includes('remuneraci') || q.includes('sueldo') || q.includes('pago') || q.includes('dinero')) {
      respuesta = 'Conforme al Artículo 8° del Código del Trabajo de Chile, la práctica universitaria tiene carácter formativo y no constituye contrato laboral. No exige sueldo mínimo por ley, pero las empresas en convenio suelen otorgar asignaciones voluntarias de movilización y colación ($220.000 a $320.000 CLP en promedio).';
    } else if (q.includes('horas') || q.includes('duracion') || q.includes('tiempo')) {
      respuesta = 'Para carreras de ingeniería en la USM, se exigen 180 horas cronológicas para la primera práctica (operaria/técnica) y 360 horas para la práctica profesional avanzada. Puedes consultar tu requisito exacto en tu perfil de PRACNET.';
    } else if (q.includes('formulario') || q.includes('6000') || q.includes('6000b')) {
      respuesta = 'El Formulario 6000 B es la pauta institucional de evaluación de la USM que tu supervisor de práctica en la empresa debe completar, calificar y timbrar al término de tu periodo de trabajo.';
    } else if (q.includes('rechaz') || q.includes('feedback') || q.includes('retroalimentacion')) {
      respuesta = 'En PRACNET, cuando una empresa toma una decisión sobre tu postulación, tiene la posibilidad de dejarte una retroalimentación constructiva sobre las competencias a reforzar para tus siguientes postulaciones en el Muro.';
    } else {
      respuesta = `Entiendo tu consulta sobre "${pregunta}". Te sugiero revisar tu estado en la pestaña "Documentación" o enviar un mensaje directo a tu Jefatura de Carrera a través del buzón interno de PRACNET.`;
    }

    return res.json({ success: true, respuesta });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error en el asistente virtual.' });
  }
}

/**
 * Mensajería con Coordinación Académica
 */
export async function getMensajes(req, res) {
  try {
    const estudianteId = req.user.estudianteId;
    const [mensajes] = await pool.execute(
      'SELECT * FROM mensajes WHERE estudiante_id = ? ORDER BY id ASC',
      [estudianteId]
    );
    // Marcar como leídos los mensajes docentes
    await pool.execute(
      "UPDATE mensajes SET leido = 1 WHERE estudiante_id = ? AND remitente_tipo = 'docente'",
      [estudianteId]
    );
    return res.json({ success: true, mensajes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al consultar mensajes.' });
  }
}

export async function enviarMensaje(req, res) {
  try {
    const estudianteId = req.user.estudianteId;
    const { asunto, cuerpo } = req.body;

    if (!asunto || !cuerpo) {
      return res.status(400).json({ success: false, message: 'Asunto y cuerpo del mensaje son requeridos.' });
    }

    await pool.execute(
      "INSERT INTO mensajes (estudiante_id, remitente_tipo, asunto, cuerpo, leido) VALUES (?, 'estudiante', ?, ?, 0)",
      [estudianteId, asunto.trim(), cuerpo.trim()]
    );

    await logAuditEvent(req.user.id, 'MENSAJE_ENVIADO', `Mensaje enviado a Coordinación: ${asunto}`, req);

    return res.status(201).json({ success: true, message: 'Mensaje enviado exitosamente a tu Jefatura de Carrera.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al enviar mensaje.' });
  }
}
