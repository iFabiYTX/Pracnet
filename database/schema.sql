-- ====================================================================
-- PRACNET v2.0 - ESQUEMA DE BASE DE DATOS OFICIAL (MySQL 8.0.x)
-- Universidad Técnica Federico Santa María (USM)
-- Arquitectura: InnoDB, UTF8MB4, Claves Foráneas Estrictas e Índices Optimizados
-- Cumplimiento: Ley N° 19.628, Ley N° 16.744 y OWASP ASVS
-- ====================================================================

CREATE DATABASE IF NOT EXISTS pracnet_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE pracnet_db;

-- Desactivar temporalmente verificación de claves foráneas para reconstrucción segura
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS bitacora_auditoria;
DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS recuperacion_clave;
DROP TABLE IF EXISTS mensajes;
DROP TABLE IF EXISTS documentos_practica;
DROP TABLE IF EXISTS postulaciones;
DROP TABLE IF EXISTS ofertas_practica;
DROP TABLE IF EXISTS empresas;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. TABLA: usuarios (Autenticación Criptográfica y RBAC)
-- --------------------------------------------------------------------
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('estudiante', 'jefe_carrera', 'admin', 'empresa') NOT NULL DEFAULT 'estudiante',
    nombre VARCHAR(150) NOT NULL,
    rut VARCHAR(20) UNIQUE,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    terminos_aceptados TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Consentimiento expreso Ley N° 19.628',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario_email (email),
    INDEX idx_usuario_rol (rol),
    INDEX idx_usuario_rut (rut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. TABLA: estudiantes (Ficha Curricular y Académica USM)
-- --------------------------------------------------------------------
CREATE TABLE estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(20) NOT NULL UNIQUE,
    correo_institucional VARCHAR(191) NOT NULL,
    carrera VARCHAR(150) NOT NULL,
    universidad VARCHAR(150) NOT NULL DEFAULT 'Universidad Técnica Federico Santa María',
    sede VARCHAR(100) NOT NULL DEFAULT 'Campus San Joaquín',
    ano_ingreso INT NOT NULL DEFAULT 2022,
    semestre_actual INT NOT NULL DEFAULT 8,
    avance_malla INT NOT NULL DEFAULT 75 COMMENT 'Porcentaje de avance curricular (0-100)',
    creditos_totales INT NOT NULL DEFAULT 180,
    es_primera_practica TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Operaria/Técnica (180h), 0: Profesional (360h)',
    habilidades TEXT NULL COMMENT 'Habilidades técnicas normalizadas para el motor de matching',
    ubicacion VARCHAR(150) NOT NULL DEFAULT 'Santiago, Chile',
    telefono VARCHAR(30) NULL DEFAULT '+56 9 1234 5678',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_estudiante_carrera (carrera),
    INDEX idx_estudiante_avance (avance_malla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. TABLA: empresas (Convenios Institucionales y Métricas de Retención)
-- --------------------------------------------------------------------
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    area VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NULL,
    correo_contacto VARCHAR(191) NOT NULL,
    telefono_contacto VARCHAR(30) NULL,
    rut VARCHAR(20) UNIQUE,
    convenio_vigente TINYINT(1) NOT NULL DEFAULT 1,
    tasa_retencion DECIMAL(5,2) NOT NULL DEFAULT 35.00 COMMENT 'Porcentaje histórico de retención post-práctica',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_empresa_area (area),
    INDEX idx_empresa_convenio (convenio_vigente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. TABLA: ofertas_practica (Convocatorias y Tokens de Enlace Mágico)
-- --------------------------------------------------------------------
CREATE TABLE ofertas_practica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    requisito_academico VARCHAR(100) NOT NULL DEFAULT 'Min. 70% Malla',
    min_avance_malla INT NOT NULL DEFAULT 65,
    duracion_horas INT NOT NULL DEFAULT 360,
    duracion_meses INT NOT NULL DEFAULT 3,
    modalidad ENUM('Híbrido', 'Remoto', 'Presencial') NOT NULL DEFAULT 'Híbrido',
    remunerada TINYINT(1) NOT NULL DEFAULT 1,
    monto_remuneracion VARCHAR(50) NOT NULL DEFAULT '$250.000',
    cupos INT NOT NULL DEFAULT 2,
    habilidades_requeridas TEXT NULL,
    ubicacion VARCHAR(100) NOT NULL DEFAULT 'Santiago',
    area VARCHAR(100) NOT NULL DEFAULT 'Tecnología',
    estado ENUM('Activa', 'Borrador', 'Cerrada') NOT NULL DEFAULT 'Activa',
    token_acceso VARCHAR(64) NOT NULL UNIQUE COMMENT 'Token criptográfico seguro para acceso empresa sin clave',
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_oferta_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_oferta_estado (estado),
    INDEX idx_oferta_modalidad (modalidad),
    INDEX idx_oferta_token (token_acceso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. TABLA: postulaciones (Ciclo de Vida y Trazabilidad de Trámite)
-- --------------------------------------------------------------------
CREATE TABLE postulaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    oferta_practica_id INT NOT NULL,
    estado ENUM('Postulado', 'En Selección', 'Validación Académica', 'Aprobado', 'Rechazado') NOT NULL DEFAULT 'Postulado',
    fase_administrativa VARCHAR(100) NOT NULL DEFAULT 'Postulado' 
        COMMENT 'Fases: Postulado, Pendiente Seguro Escolar, Carta Presentación Emitida, Entrevista Técnica Realizada, Práctica Iniciada, Aprobado',
    fecha_postulacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nota_evaluacion DECIMAL(3,1) NULL,
    observaciones TEXT NULL COMMENT 'Retroalimentación constructiva de la empresa o jefatura',
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_postulacion_estudiante_oferta UNIQUE (estudiante_id, oferta_practica_id),
    CONSTRAINT fk_postulacion_estudiante FOREIGN KEY (estudiante_id) 
        REFERENCES estudiantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_postulacion_oferta FOREIGN KEY (oferta_practica_id) 
        REFERENCES ofertas_practica(id) ON DELETE CASCADE,
    INDEX idx_postulacion_estado (estado),
    INDEX idx_postulacion_fase (fase_administrativa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. TABLA: documentos_practica (Expediente Digital, Seguro y Formulario 6000 B)
-- --------------------------------------------------------------------
CREATE TABLE documentos_practica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    postulacion_id INT NULL,
    tipo_documento ENUM('curriculum', 'seguro_escolar', 'formulario_6000b', 'informe_final') NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL COMMENT 'Ruta local o clave S3 en AWS',
    tamano_bytes BIGINT NOT NULL DEFAULT 0,
    estado_validacion ENUM('Pendiente', 'En Revisión', 'Aprobado', 'Rechazado') NOT NULL DEFAULT 'Pendiente',
    observacion TEXT NULL,
    firmado_por VARCHAR(150) NULL COMMENT 'Identificador de la jefatura que aplicó firma digital institucional',
    fecha_firma DATETIME NULL,
    fecha_subida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documento_estudiante FOREIGN KEY (estudiante_id) 
        REFERENCES estudiantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_documento_postulacion FOREIGN KEY (postulacion_id) 
        REFERENCES postulaciones(id) ON DELETE SET NULL,
    INDEX idx_documento_tipo (tipo_documento),
    INDEX idx_documento_estado (estado_validacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. TABLA: mensajes (Comunicación Directa Estudiante <-> Jefatura/Docente)
-- --------------------------------------------------------------------
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    remitente_tipo ENUM('estudiante', 'docente') NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    cuerpo TEXT NOT NULL,
    leido TINYINT(1) NOT NULL DEFAULT 0,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mensaje_estudiante FOREIGN KEY (estudiante_id) 
        REFERENCES estudiantes(id) ON DELETE CASCADE,
    INDEX idx_mensaje_leido (estudiante_id, leido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. TABLA: bitacora_auditoria (Trazabilidad y Cumplimiento Ley N° 19.628)
-- --------------------------------------------------------------------
CREATE TABLE bitacora_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT NULL,
    ip_address VARCHAR(45) NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bitacora_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_bitacora_accion (accion),
    INDEX idx_bitacora_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. TABLA: notificaciones (Alertas Push y Sistema para Estudiantes y Staff)
-- --------------------------------------------------------------------
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida TINYINT(1) NOT NULL DEFAULT 0,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacion_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_notificacion_leida (usuario_id, leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 10. TABLA: recuperacion_clave (Tokens de Seguridad de Un Solo Uso)
-- --------------------------------------------------------------------
CREATE TABLE recuperacion_clave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    codigo_hash VARCHAR(255) NOT NULL,
    expira_en DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recuperacion_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_recuperacion_token (codigo_hash, usado, expira_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
