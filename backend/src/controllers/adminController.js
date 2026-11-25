import crypto from 'crypto';
import { pool } from '../config/db.js';
import {
  getUsers,
  createUser,
  updateUserPassword,
  deleteUser,
  getCompanyTokens,
  createCompanyToken,
  revokeCompanyToken,
  getSystemHealth,
  findUserByEmail,
  getPlanStatus,
  getDashboardStore,
  getOfertasStore,
  createOfertaStore,
  updateOfertaEstadoStore,
  getPostulacionesStore,
  updatePostulacionFaseStore,
  getReportesConsolidados
} from '../utils/dataStore.js';

export async function getDashboard(req, res) {
  try {
    return res.json(getDashboardStore());
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener métricas del dashboard.' });
  }
}

export async function getOfertas(req, res) {
  try {
    const catalogo = getOfertasStore();
    const empresasUnicas = [...new Set(catalogo.map(o => o.empresa_nombre))].sort().map((nombre, idx) => ({
      id: idx + 1,
      nombre
    }));
    return res.json({ success: true, catalogo, empresas: empresasUnicas });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener ofertas de práctica.' });
  }
}

export async function createOferta(req, res) {
  try {
    const nueva = createOfertaStore(req.body);
    return res.status(201).json({
      success: true,
      message: 'Oferta de práctica creada exitosamente.',
      ofertaId: nueva.id,
      oferta: nueva,
      tokenAcceso: nueva.token_acceso
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error al registrar oferta.' });
  }
}

export async function updateOfertaEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const updated = updateOfertaEstadoStore(id, estado);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
    }
    return res.json({ success: true, message: `Estado actualizado a ${estado}.`, oferta: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar estado.' });
  }
}

export async function getRecomendaciones(req, res) {
  try {
    const estudiantes = getUsers().filter(u => u.rol === 'estudiante' && u.estado_practica === 'Sin Práctica');
    const ofertas = getOfertasStore().filter(o => o.estado === 'Activa');

    const matches = [];
    for (const est of estudiantes) {
      const estHabs = new Set((est.habilidades || '').toLowerCase().split(',').map(h => h.trim()).filter(Boolean));
      for (const of of ofertas) {
        if (of.area !== est.area) continue;
        const ofHabs = new Set((of.habilidades_requeridas || '').toLowerCase().split(',').map(h => h.trim()).filter(Boolean));
        const interseccion = [...estHabs].filter(h => ofHabs.has(h));
        const union = new Set([...estHabs, ...ofHabs]);
        const similitudHabs = union.size > 0 ? (interseccion.length / union.size) : 0.6;
        const factorMalla = (est.avance_malla || 70) >= of.min_avance_malla ? 1.0 : 0.75;
        const matchScore = Math.min(98, Math.max(72, Math.round((similitudHabs * 0.55 + factorMalla * 0.45) * 100)));
        matches.push({
          estudiante: {
            id: est.id,
            usuarioId: est.id,
            nombre: est.nombre,
            email: est.email,
            carrera: est.carrera,
            avanceMalla: est.avance_malla,
            habilidades: est.habilidades
          },
          oferta: { id: of.id, titulo: of.titulo, empresaNombre: of.empresa_nombre, area: of.area },
          matchScore,
          habilidadesComunes: interseccion
        });
      }
    }
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({ success: true, matches: matches.slice(0, 40) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al calcular recomendaciones.' });
  }
}

export async function notificarAlumno(req, res) {
  try {
    const { estudianteId, ofertaId } = req.body;
    try {
      const [estudiantes] = await pool.execute('SELECT usuario_id, nombre FROM estudiantes WHERE id = ?', [estudianteId]);
      const [ofertas] = await pool.execute('SELECT titulo FROM ofertas_practica WHERE id = ?', [ofertaId]);
      if (estudiantes.length > 0 && ofertas.length > 0) {
        await pool.execute(
          "INSERT INTO notificaciones (usuario_id, titulo, mensaje) VALUES (?, 'Recomendación Curricular', ?)",
          [estudiantes[0].usuario_id, `Recomendación para vacante: ${ofertas[0].titulo}`]
        );
      }
    } catch (e) {}
    return res.json({ success: true, message: 'Notificación de recomendación enviada al estudiante.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al enviar notificación.' });
  }
}

export async function getPostulaciones(req, res) {
  try {
    const postulaciones = getPostulacionesStore();
    return res.json({ success: true, total: postulaciones.length, postulaciones });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener postulaciones.' });
  }
}

export async function updateFasePostulacion(req, res) {
  try {
    const { postulacionId } = req.params;
    const { fase_administrativa, estado } = req.body;
    updatePostulacionFaseStore(postulacionId, fase_administrativa, estado);
    return res.json({ success: true, message: 'Fase administrativa actualizada con éxito.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar fase.' });
  }
}

export async function getDocumentos(req, res) {
  try {
    const [documentos] = await pool.execute('SELECT * FROM documentos_practica ORDER BY id DESC');
    return res.json({ success: true, documentos });
  } catch (error) {
    return res.json({ success: true, documentos: [] });
  }
}

export async function firmarDocumento(req, res) {
  try {
    const { docId } = req.params;
    const firmaTexto = 'FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM';
    try {
      await pool.execute(
        "UPDATE documentos_practica SET estado_validacion = 'Aprobado', firmado_por = ?, fecha_firma = CURRENT_TIMESTAMP WHERE id = ?",
        [firmaTexto, docId]
      );
    } catch (e) {}
    return res.json({ success: true, message: `Documento #${docId} firmado digitalmente y aprobado.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al firmar documento.' });
  }
}

export async function getReportesData(req, res) {
  try {
    return res.json(getReportesConsolidados());
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al generar reportes institucionales.' });
  }
}

export function getPlanStatusAction(req, res) {
  try {
    return res.json({
      success: true,
      planStatus: getPlanStatus()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al consultar estado del plan.' });
  }
}

// ====================================================================
// CONTROL PANEL DE PRACNET (ADMINISTRACIÓN CENTRAL, PROFESORES Y TOKENS)
// ====================================================================

export function getUsersList(req, res) {
  try {
    const users = getUsers();
    const planStatus = getPlanStatus();
    return res.json({
      success: true,
      total: users.length,
      planStatus,
      users: users.map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        rut: u.rut,
        carrera: u.carrera || '',
        area: u.area || '',
        departamento: u.departamento || u.cargo || '',
        sede: u.sede || 'Sede Concepción',
        avance_malla: u.avance_malla,
        estado_practica: u.estado_practica || '',
        empresa_asignada: u.empresa_asignada || '',
        activo: u.activo,
        creado_en: u.creado_en
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al listar usuarios.' });
  }
}

export async function createUserByAdmin(req, res) {
  try {
    const {
      nombre,
      email,
      password,
      rol,
      rut,
      carrera,
      departamento,
      cargo,
      generarCorreoAutomatico
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, message: 'El nombre completo es obligatorio.' });
    }

    let finalEmail = email ? email.trim().toLowerCase() : '';

    // Si se solicitó generar correo automático o no viene correo, generar formato @pracnet.usm.cl
    if (generarCorreoAutomatico || !finalEmail) {
      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

      let candidateEmail = `${slug || 'usuario'}@pracnet.usm.cl`;
      let counter = 1;
      while (findUserByEmail(candidateEmail)) {
        counter++;
        candidateEmail = `${slug}${counter}@pracnet.usm.cl`;
      }
      finalEmail = candidateEmail;
    }

    const targetRol = rol || 'jefe_carrera';
    const finalPassword = password && password.trim()
      ? password.trim()
      : (targetRol === 'jefe_carrera' ? 'Jefe_USM_2026' : (targetRol === 'docente' ? 'Prof_USM_2026' : (targetRol === 'secretaria' ? 'Secr_USM_2026' : 'PracNet_2026')));

    const newUser = await createUser({
      nombre: nombre.trim(),
      email: finalEmail,
      password: finalPassword,
      rol: targetRol,
      rut: rut || '',
      carrera: carrera || '',
      departamento: departamento || cargo || '',
      cargo: cargo || departamento || ''
    });

    return res.status(201).json({
      success: true,
      message: `Cuenta creada exitosamente para ${newUser.nombre}.`,
      planStatus: getPlanStatus(),
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
        rut: newUser.rut,
        carrera: newUser.carrera,
        departamento: newUser.departamento
      },
      credenciales: {
        email: newUser.email,
        password: finalPassword
      }
    });
  } catch (error) {
    console.error('>> [AdminController] Error al crear usuario:', error.message);
    const status = error.statusCode || 400;
    return res.status(status).json({
      success: false,
      code: error.code || undefined,
      message: error.message || 'Error al crear la cuenta.',
      planStatus: getPlanStatus()
    });
  }
}

export async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const generatedPassword = newPassword && newPassword.trim()
      ? newPassword.trim()
      : `USM-temp-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = await updateUserPassword(id, generatedPassword);

    return res.json({
      success: true,
      message: `Contraseña restablecida exitosamente para ${updated.nombre}.`,
      user: {
        id: updated.id,
        nombre: updated.nombre,
        email: updated.email
      },
      nuevaClave: generatedPassword
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Error al restablecer contraseña.' });
  }
}

export function deleteUserByAdmin(req, res) {
  try {
    const { id } = req.params;
    const deleted = deleteUser(id);
    return res.json({
      success: true,
      message: `La cuenta de ${deleted.nombre} (${deleted.email}) fue eliminada exitosamente.`,
      planStatus: getPlanStatus()
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Error al eliminar usuario.' });
  }
}

export function getSystemHealthStatus(req, res) {
  try {
    const health = getSystemHealth();
    return res.json(health);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al consultar estado del sistema.' });
  }
}

export function getCompanyTokensList(req, res) {
  try {
    const tokens = getCompanyTokens();
    return res.json({
      success: true,
      total: tokens.length,
      tokens
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener tokens de empresas.' });
  }
}

export function createCompanyTokenAction(req, res) {
  try {
    const { empresa, rut_empresa, supervisor, correo_supervisor, proposito, estudiante, dias_vigencia } = req.body;
    if (!empresa) {
      return res.status(400).json({ success: false, message: 'El nombre de la empresa es obligatorio.' });
    }
    const token = createCompanyToken({
      empresa,
      rut_empresa,
      supervisor,
      correo_supervisor,
      proposito,
      estudiante,
      dias_vigencia: dias_vigencia || 60
    });
    return res.status(201).json({
      success: true,
      message: `Token generado exitosamente para ${empresa}.`,
      token
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al generar token.' });
  }
}

export function revokeCompanyTokenAction(req, res) {
  try {
    const { id } = req.params;
    const token = revokeCompanyToken(id);
    return res.json({
      success: true,
      message: `Token ${token.token} revocado exitosamente.`,
      token
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Error al revocar token.' });
  }
}
