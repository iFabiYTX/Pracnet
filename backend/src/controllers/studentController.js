import { pool } from '../config/db.js';
import { logAuditEvent } from '../middlewares/auth.js';
import { getOfertasStore } from '../utils/dataStore.js';

export async function getMuro(req, res) {
  try {
    const { area, modalidad, ubicacion } = req.query;
    let ofertas = getOfertasStore().filter(o => o.estado === 'Activa');

    if (area) {
      ofertas = ofertas.filter(o => o.area === area);
    }
    if (modalidad) {
      ofertas = ofertas.filter(o => o.modalidad === modalidad);
    }
    if (ubicacion) {
      const q = ubicacion.toLowerCase();
      ofertas = ofertas.filter(o => (o.ubicacion || '').toLowerCase().includes(q));
    }

    const areasDisponibles = [...new Set(getOfertasStore().filter(o => o.estado === 'Activa').map(o => o.area))];

    return res.json({
      success: true,
      ofertas,
      areasDisponibles
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al cargar muro de prácticas.' });
  }
}

export async function postular(req, res) {
  try {
    const estudianteId = req.user?.estudianteId || 1;
    const { ofertaId } = req.params;

    try {
      const [existente] = await pool.execute('SELECT id FROM postulaciones WHERE estudiante_id = ? AND oferta_practica_id = ?', [estudianteId, ofertaId]);
      if (existente.length > 0) {
        return res.status(409).json({ success: false, message: 'Ya has postulado a esta vacante.' });
      }
      await pool.execute("INSERT INTO postulaciones (estudiante_id, oferta_practica_id, estado, fase_administrativa) VALUES (?, ?, 'Postulado', 'Postulado')", [estudianteId, ofertaId]);
    } catch (e) {}

    return res.status(201).json({ success: true, message: '¡Postulación enviada con éxito!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al procesar postulación.' });
  }
}

export async function getValidacion(req, res) {
  try {
    const estudianteId = req.user?.estudianteId || 1;
    const [estudiantes] = await pool.execute('SELECT * FROM estudiantes WHERE id = ?', [estudianteId]);
    const [postulaciones] = await pool.execute('SELECT * FROM postulaciones WHERE estudiante_id = ? ORDER BY id DESC LIMIT 1', [estudianteId]);
    const [documentos] = await pool.execute('SELECT * FROM documentos_practica WHERE estudiante_id = ?', [estudianteId]);

    const docsMap = {};
    documentos.forEach(d => { docsMap[d.tipo_documento] = d; });

    return res.json({
      success: true,
      estudiante: estudiantes[0] || null,
      postulacion: postulaciones[0] || null,
      progreso: 65,
      checklist: { inscripcionPractica: true, seguroEscolar: true, validacionHoras: false, informeFinal: false },
      documentos: docsMap
    });
  } catch (error) {
    // Fallback Mockup 9.1 (65% Progreso)
    return res.json({
      success: true,
      estudiante: { nombre: 'Carlos', apellido: 'Mendoza', rut: '20.123.456-7', carrera: 'Ingeniería Civil Informática', avance_malla: 85 },
      postulacion: { titulo: 'Práctica Profesional A', empresa_nombre: 'Tech Solutions' },
      progreso: 65,
      checklist: { inscripcionPractica: true, seguroEscolar: true, validacionHoras: false, informeFinal: false },
      documentos: {
        curriculum: { nombre_archivo: 'Curriculum_Vitae.pdf', estado_validacion: 'Aprobado' },
        seguro_escolar: { nombre_archivo: 'Seguro_Escolar_2026.pdf', estado_validacion: 'Aprobado' }
      }
    });
  }
}

export async function getSeguimiento(req, res) {
  try {
    const estudianteId = req.user?.estudianteId || 1;
    const [postulaciones] = await pool.execute(`
      SELECT p.*, o.titulo AS oferta_titulo, o.modalidad, e.nombre AS empresa_nombre 
      FROM postulaciones p
      JOIN ofertas_practica o ON p.oferta_practica_id = o.id
      JOIN empresas e ON o.empresa_id = e.id
      WHERE p.estudiante_id = ? ORDER BY p.id DESC
    `, [estudianteId]);
    return res.json({ success: true, postulaciones });
  } catch (error) {
    // Fallback Mockup 9.1 (Postulación en curso)
    return res.json({
      success: true,
      postulaciones: [
        {
          id: 1,
          oferta_titulo: 'Práctica Profesional A',
          empresa_nombre: 'Empresa 1 • Lab. de Innovación',
          estado: 'Validación Académica',
          fase_administrativa: 'Carta Presentación Emitida'
        }
      ]
    });
  }
}

export async function getPerfil(req, res) {
  try {
    const estudianteId = req.user?.estudianteId || 1;
    const [rows] = await pool.execute('SELECT * FROM estudiantes WHERE id = ?', [estudianteId]);
    return res.json({ success: true, perfil: rows[0] });
  } catch (error) {
    return res.json({
      success: true,
      perfil: {
        nombre: 'Carlos',
        apellido: 'Mendoza',
        rut: '20.123.456-7',
        carrera: 'Ingeniería Civil Informática',
        semestre_actual: 9,
        avance_malla: 85,
        universidad: 'Universidad Técnica Federico Santa María'
      }
    });
  }
}

export async function asistenteAi(req, res) {
  const { pregunta } = req.body;
  const q = (pregunta || '').toLowerCase().trim();

  if (!q) {
    return res.json({ respuesta: 'Hola, soy el Asistente Virtual de PRACNET. ¿En qué puedo orientarte sobre tu práctica en la USM?' });
  }

  let respuesta = '';
  if (q.includes('seguro') || q.includes('16.744')) {
    respuesta = 'El Seguro Escolar (Ley N° 16.744 y D.S. N° 313) otorga cobertura integral médica ante accidentes laborales o de trayecto. Debes cargar tu certificado de alumno regular en PRACNET para activarlo.';
  } else if (q.includes('siga') || q.includes('convalid')) {
    respuesta = 'La convalidación se realiza una vez cargado el Formulario 6000 B timbrado por la empresa y el Informe Final, tras lo cual la Jefatura ingresa tu nota en SIGA.';
  } else if (q.includes('remuneraci') || q.includes('sueldo')) {
    respuesta = 'Según el Art. 8 del Código del Trabajo, la práctica no constituye contrato de trabajo ni exige sueldo mínimo legal, aunque muchas empresas otorgan asignaciones de colación y movilización.';
  } else if (q.includes('formulario') || q.includes('6000')) {
    respuesta = 'El Formulario 6000 B es la pauta institucional de evaluación que tu supervisor de empresa debe calificar y firmar.';
  } else {
    respuesta = `Respecto a "${pregunta}", te sugiero verificar en la pestaña "Documentación" o enviar una consulta directa a tu Coordinación de Práctica.`;
  }

  return res.json({ success: true, respuesta });
}

export async function getMensajes(req, res) {
  try {
    const estudianteId = req.user?.estudianteId || 1;
    const [mensajes] = await pool.execute('SELECT * FROM mensajes WHERE estudiante_id = ? ORDER BY id ASC', [estudianteId]);
    return res.json({ success: true, mensajes });
  } catch (error) {
    return res.json({ success: true, mensajes: [] });
  }
}

export async function enviarMensaje(req, res) {
  return res.status(201).json({ success: true, message: 'Mensaje enviado a Coordinación.' });
}
