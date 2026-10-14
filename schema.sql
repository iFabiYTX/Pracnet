-- ====================================================================
-- ESQUEMA DE BASE DE DATOS PRACNET v1.0.0
-- Compatible con SQLite, MySQL 8.0.x y PostgreSQL
-- ====================================================================

-- 1. Tabla Usuario (Autenticación Criptográfica y RBAC)
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK(rol IN ('estudiante', 'jefe_carrera', 'admin', 'empresa')),
    nombre VARCHAR(120) NOT NULL,
    rut VARCHAR(20) UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo INTEGER DEFAULT 1
);

-- 2. Tabla Estudiante
CREATE TABLE IF NOT EXISTS estudiante (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    rut VARCHAR(20) UNIQUE NOT NULL,
    correo_institucional VARCHAR(120) NOT NULL,
    carrera VARCHAR(120) NOT NULL,
    universidad VARCHAR(120) DEFAULT 'Universidad Técnica Federico Santa María',
    sede VARCHAR(80) DEFAULT 'Campus San Joaquín',
    ano_ingreso INTEGER DEFAULT 2022,
    semestre_actual INTEGER DEFAULT 8,
    avance_malla INTEGER DEFAULT 75,
    creditos_totales INTEGER DEFAULT 180,
    es_primera_practica INTEGER DEFAULT 1,
    habilidades TEXT,
    ubicacion VARCHAR(150) DEFAULT 'Santiago, Chile',
    telefono VARCHAR(30) DEFAULT '+56 9 1234 5678'
);

-- 3. Tabla Empresa
CREATE TABLE IF NOT EXISTS empresa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
    nombre VARCHAR(120) NOT NULL,
    area VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    correo_contacto VARCHAR(120),
    rut VARCHAR(20) UNIQUE,
    convenio_vigente INTEGER DEFAULT 1,
    tasa_retencion INTEGER DEFAULT 35
);

-- 4. Tabla Oferta de Práctica
CREATE TABLE IF NOT EXISTS oferta_practica (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    requisito_academico VARCHAR(100) DEFAULT 'Min. 70% Malla',
    min_avance_malla INTEGER DEFAULT 65,
    duracion_horas INTEGER DEFAULT 360,
    duracion_meses INTEGER DEFAULT 3,
    modalidad VARCHAR(30) DEFAULT 'Híbrido' CHECK(modalidad IN ('Híbrido', 'Remoto', 'Presencial')),
    remunerada INTEGER DEFAULT 1,
    monto_remuneracion VARCHAR(50) DEFAULT '$250.000',
    cupos INTEGER DEFAULT 2,
    habilidades_requeridas TEXT,
    ubicacion VARCHAR(100) DEFAULT 'Santiago',
    area VARCHAR(80) DEFAULT 'Tecnología',
    estado VARCHAR(20) DEFAULT 'Activa' CHECK(estado IN ('Activa', 'Borrador', 'Cerrada')),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla Postulación
CREATE TABLE IF NOT EXISTS postulacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
    oferta_practica_id INTEGER NOT NULL REFERENCES oferta_practica(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'Postulado',
    fase_administrativa VARCHAR(80) DEFAULT 'Postulado',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nota_evaluacion REAL,
    observaciones TEXT,
    UNIQUE(estudiante_id, oferta_practica_id)
);

-- 6. Tabla Documentos de Práctica (Gestión Documental y Seguro Escolar)
CREATE TABLE IF NOT EXISTS documento_practica (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
    postulacion_id INTEGER REFERENCES postulacion(id) ON DELETE SET NULL,
    tipo_documento VARCHAR(50) NOT NULL, -- 'curriculum', 'seguro_escolar', 'formulario_6000b', 'informe_final'
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    tamano_bytes INTEGER,
    estado_validacion VARCHAR(30) DEFAULT 'Pendiente',
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla Bitácora de Auditoría (Trazabilidad y Seguridad de Información)
CREATE TABLE IF NOT EXISTS bitacora_auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT,
    ip_address VARCHAR(45),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla Notificaciones
CREATE TABLE IF NOT EXISTS notificacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leida INTEGER DEFAULT 0,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
