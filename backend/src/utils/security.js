import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pracnet_usm_jwt_super_secret_key_2026_secured';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Valida un RUT chileno mediante el algoritmo matemático del Módulo 11.
 * Maneja de forma segura cualquier entrada no válida sin arrojar excepciones.
 */
export function validateRutChileno(rut) {
  if (!rut || typeof rut !== 'string') return false;

  // Limpiar caracteres no alfanuméricos
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 8 || clean.length > 9) return false;

  const cuerpo = clean.slice(0, -1);
  const dvIngresado = clean.slice(-1);

  // El cuerpo debe estar compuesto EXCLUSIVAMENTE por dígitos numéricos
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvEsperado = 11 - resto;

  let dvCalculado;
  if (dvEsperado === 11) dvCalculado = '0';
  else if (dvEsperado === 10) dvCalculado = 'K';
  else dvCalculado = dvEsperado.toString();

  return dvCalculado === dvIngresado;
}

/**
 * Normaliza el RUT al formato canónico estándar chileno: XX.XXX.XXX-X
 */
export function formatRut(rut) {
  if (!rut || typeof rut !== 'string') return '';
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;

  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);

  // Formato con puntos cada 3 dígitos
  const cuerpoRev = cuerpo.split('').reverse().join('');
  const partes = [];
  for (let i = 0; i < cuerpoRev.length; i += 3) {
    partes.push(cuerpoRev.slice(i, i + 3));
  }
  const cuerpoFormateado = partes.join('.').split('').reverse().join('');
  return `${cuerpoFormateado}-${dv}`;
}

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
