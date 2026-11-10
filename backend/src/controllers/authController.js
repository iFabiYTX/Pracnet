import crypto from 'crypto';
import { pool, redis } from '../config/db.js';
import { 
  validateRutChileno, 
  formatRut, 
  hashPassword, 
  comparePassword, 
  generateToken 
} from '../utils/security.js';
import { logAuditEvent } from '../middlewares/auth.js';
import { findUserByEmail, createUser } from '../utils/dataStore.js';

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Buscar en el almacén de datos persistente (dataStore)
    let user = findUserByEmail(cleanEmail);

    // 2. Si no se encuentra en el archivo local, consultar MySQL si está conectado
    if (!user) {
      try {
        const [mysqlUsers] = await pool.execute(
          'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
          [cleanEmail]
        );
        if (mysqlUsers.length > 0) {
          user = mysqlUsers[0];
        }
      } catch (dbErr) {
        // MySQL no disponible
      }
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'No existe una cuenta registrada con este correo. Solicita tu acceso al Administrador.' 
      });
    }

    // 3. Validar contraseña (acepta tanto hash bcrypt como coincidencia directa para contraseñas de admin/iniciales)
    let isPasswordValid = false;
    if (user.password_hash === password) {
      isPasswordValid = true;
    } else {
      try {
        isPasswordValid = await comparePassword(password, user.password_hash);
      } catch {
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta. Por favor verifica tus credenciales.' 
      });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre,
      estudianteId: user.estudianteId || null
    };

    const token = generateToken(tokenPayload);

    // Guardar sesión en Redis con expiración de 8 horas si está disponible
    try {
      const sessionKey = `pracnet:session:${user.id}:${token}`;
      await redis.set(sessionKey, JSON.stringify(tokenPayload), 'EX', 28800);
    } catch {}

    // Auditoría oficial Ley N° 19.628
    try {
      await logAuditEvent(user.id, 'LOGIN_EXITOSO', `Inicio de sesión con rol: ${user.rol}`, req);
    } catch {}

    return res.json({
      success: true,
      message: `Bienvenido/a ${user.nombre}`,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        rut: user.rut,
        carrera: user.carrera || '',
        departamento: user.departamento || user.cargo || '',
        estudianteId: user.estudianteId || null
      }
    });
  } catch (error) {
    console.error('>> Error en login:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor al procesar el inicio de sesión.' });
  }
}

export async function register(req, res) {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      rut,
      carrera,
      universidad,
      ano_ingreso,
      ubicacion,
      habilidades,
      terminos
    } = req.body;

    // Consentimiento Ley N° 19.628
    if (!terminos) {
      return res.status(400).json({
        success: false,
        message: 'Debe aceptar los Términos y Condiciones y Política de Privacidad de Datos (Ley N° 19.628).'
      });
    }

    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor complete todos los campos obligatorios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const nombreCompleto = apellido ? `${nombre.trim()} ${apellido.trim()}` : nombre.trim();
    const rutFormateado = rut ? formatRut(rut) : '';

    // Validar unicidad
    const existente = findUserByEmail(cleanEmail);
    if (existente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cuenta registrada con este correo electrónico.'
      });
    }

    // Crear en almacén persistente
    const nuevoUsuario = await createUser({
      nombre: nombreCompleto,
      email: cleanEmail,
      password,
      rol: 'estudiante',
      rut: rutFormateado,
      carrera: carrera || 'Ingeniería Civil Informática',
      departamento: universidad || 'Universidad Técnica Federico Santa María'
    });

    try {
      await logAuditEvent(nuevoUsuario.id, 'REGISTRO_ESTUDIANTE', `Cuenta creada para RUT: ${rutFormateado}`, req);
    } catch {}

    return res.status(201).json({
      success: true,
      message: '¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales de estudiante.',
      user: nuevoUsuario
    });
  } catch (error) {
    console.error('>> Error en registro:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error interno al registrar la cuenta.' });
  }
}

export async function recuperarPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'El correo institucional es obligatorio.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'No se encontró una cuenta con el correo indicado.' });
    }

    const rawCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    return res.json({
      success: true,
      message: 'Solicitud de recuperación generada. Contacta al Administrador de PRACNET si requieres restablecimiento de emergencia.',
      instruccion: `Código temporal de verificación: ${rawCode}`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al procesar recuperación.' });
  }
}

export async function pingSession(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '190.161.45.12';
  const cleanIp = Array.isArray(ip) ? ip[0] : (typeof ip === 'string' ? ip.split(',')[0].trim() : '190.161.45.12');
  return res.json({
    success: true,
    ip: cleanIp,
    inactivityLimitSeconds: 7200,
    timestamp: new Date().toISOString()
  });
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.slice(7);
    if (token && req.user) {
      try {
        const sessionKey = `pracnet:session:${req.user.id}:${token}`;
        await redis.del(sessionKey);
      } catch (e) {}
    }
    return res.json({ success: true, message: 'Sesión finalizada correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
  }
}
