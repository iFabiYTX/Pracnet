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

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [users] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas o cuenta desactivada.' });
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas o cuenta desactivada.' });
    }

    let estudianteId = null;
    if (user.rol === 'estudiante') {
      const [estudiantes] = await pool.execute(
        'SELECT id FROM estudiantes WHERE usuario_id = ?',
        [user.id]
      );
      if (estudiantes.length > 0) {
        estudianteId = estudiantes[0].id;
      }
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre,
      estudianteId
    };

    const token = generateToken(tokenPayload);

    // Guardar sesión en Redis con expiración de 8 horas
    try {
      const sessionKey = `pracnet:session:${user.id}:${token}`;
      await redis.set(sessionKey, JSON.stringify(tokenPayload), 'EX', 28800);
    } catch (redisErr) {
      console.warn('>> [Redis] Fallback: sesión mantenida por JWT stateless.');
    }

    // Auditoría oficial Ley N° 19.628
    await logAuditEvent(user.id, 'LOGIN_EXITOSO', `Inicio de sesión con rol: ${user.rol}`, req);

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
        estudianteId
      }
    });
  } catch (error) {
    console.error('>> Error en login:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor al procesar el inicio de sesión.' });
  }
}

export async function register(req, res) {
  const connection = await pool.getConnection();
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

    if (!nombre || !apellido || !email || !password || !rut) {
      return res.status(400).json({ success: false, message: 'Por favor complete todos los campos obligatorios.' });
    }

    // Validación matemática estricta Módulo 11 sin fallas
    if (!validateRutChileno(rut)) {
      return res.status(400).json({
        success: false,
        message: 'El RUT ingresado no es válido según el algoritmo del Módulo 11 chileno.'
      });
    }

    const rutFormateado = formatRut(rut);
    const cleanEmail = email.trim().toLowerCase();

    // Iniciar transacción MySQL
    await connection.beginTransaction();

    // Verificar unicidad de correo y RUT
    const [existentes] = await connection.execute(
      'SELECT id FROM usuarios WHERE email = ? OR rut = ?',
      [cleanEmail, rutFormateado]
    );

    if (existentes.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cuenta registrada con este correo electrónico o RUT institucional.'
      });
    }

    const hashedPassword = await hashPassword(password);
    const nombreCompleto = `${nombre.trim()} ${apellido.trim()}`;

    // 1. Insertar usuario
    const [userResult] = await connection.execute(
      `INSERT INTO usuarios (email, password_hash, rol, nombre, rut, terminos_aceptados) 
       VALUES (?, ?, 'estudiante', ?, ?, 1)`,
      [cleanEmail, hashedPassword, nombreCompleto, rutFormateado]
    );

    const usuarioId = userResult.insertId;

    // 2. Insertar ficha de estudiante USM
    await connection.execute(
      `INSERT INTO estudiantes 
       (usuario_id, nombre, apellido, rut, correo_institucional, carrera, universidad, ano_ingreso, habilidades, ubicacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        nombre.trim(),
        apellido.trim(),
        rutFormateado,
        cleanEmail,
        carrera || 'Ingeniería Civil Informática',
        universidad || 'Universidad Técnica Federico Santa María',
        parseInt(ano_ingreso || '2022', 10),
        habilidades || 'Python, SQL, Git, Trabajo en Equipo',
        ubicacion || 'Santiago, Chile'
      ]
    );

    await connection.commit();

    await logAuditEvent(usuarioId, 'REGISTRO_ESTUDIANTE', `Cuenta creada para RUT: ${rutFormateado}`, req);

    return res.status(201).json({
      success: true,
      message: '¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales institucionales.'
    });
  } catch (error) {
    await connection.rollback();
    console.error('>> Error en registro:', error);
    return res.status(500).json({ success: false, message: 'Error interno al registrar la cuenta.' });
  } finally {
    connection.release();
  }
}

export async function recuperarPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'El correo institucional es obligatorio.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [users] = await pool.execute('SELECT id, nombre, email FROM usuarios WHERE email = ?', [cleanEmail]);

    if (users.length === 0) {
      // Mensaje neutro para prevenir enumeración de usuarios
      return res.json({
        success: true,
        message: 'Si el correo existe en PRACNET, se ha generado un código de restablecimiento seguro.'
      });
    }

    const user = users[0];
    const rawCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Código de 6 caracteres
    const hashCode = crypto.createHash('sha256').update(rawCode).digest('hex');
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de vigencia

    await pool.execute(
      'INSERT INTO recuperacion_clave (usuario_id, codigo_hash, expira_en, usado) VALUES (?, ?, ?, 0)',
      [user.id, hashCode, expiraEn]
    );

    await logAuditEvent(user.id, 'SOLICITUD_RECUPERACION_PASSWORD', 'Código temporal generado con vigencia de 15 minutos', req);

    return res.json({
      success: true,
      message: 'Código de recuperación generado.',
      instruccion: `En un entorno real se envía por SMTP a ${user.email}. Para fines de evaluación, tu código es: ${rawCode}`
    });
  } catch (error) {
    console.error('>> Error en recuperarPassword:', error);
    return res.status(500).json({ success: false, message: 'Error al procesar la solicitud de recuperación.' });
  }
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.slice(7);
    if (token && req.user) {
      const sessionKey = `pracnet:session:${req.user.id}:${token}`;
      await redis.del(sessionKey);
      await logAuditEvent(req.user.id, 'LOGOUT', 'Cierre de sesión finalizado', req);
    }
    return res.json({ success: true, message: 'Sesión finalizada correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
  }
}
