import sqlite3
import os
from contextlib import contextmanager
from app.config import Config

def get_db_connection():
    """Retorna una conexión a la base de datos SQLite con soporte para diccionarios y FKs."""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@contextmanager
def get_db():
    """Context manager para operaciones seguras con la base de datos."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def init_db():
    """Inicializa la base de datos ejecutando el esquema DDL si no existe."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Tabla Usuario (Autenticación y RBAC)
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            rol TEXT NOT NULL CHECK(rol IN ('estudiante', 'jefe_carrera', 'admin', 'empresa')),
            nombre TEXT NOT NULL,
            rut TEXT UNIQUE,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            activo INTEGER DEFAULT 1
        );
        ''')
        
        # 2. Tabla Estudiante
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS estudiante (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
            nombre TEXT NOT NULL,
            apellido TEXT,
            rut TEXT UNIQUE NOT NULL,
            correo_institucional TEXT NOT NULL,
            carrera TEXT NOT NULL,
            universidad TEXT DEFAULT 'Universidad Técnica Federico Santa María',
            sede TEXT DEFAULT 'Campus San Joaquín',
            ano_ingreso INTEGER DEFAULT 2022,
            semestre_actual INTEGER DEFAULT 8,
            avance_malla INTEGER DEFAULT 75,
            creditos_totales INTEGER DEFAULT 180,
            es_primera_practica INTEGER DEFAULT 1,
            habilidades TEXT,
            ubicacion TEXT DEFAULT 'Santiago, Chile',
            telefono TEXT DEFAULT '+56 9 1234 5678'
        );
        ''')

        # 3. Tabla Empresa
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS empresa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
            nombre TEXT NOT NULL,
            area TEXT NOT NULL,
            direccion TEXT,
            correo_contacto TEXT,
            rut TEXT UNIQUE,
            convenio_vigente INTEGER DEFAULT 1,
            tasa_retencion INTEGER DEFAULT 35
        );
        ''')

        # 4. Tabla Oferta de Práctica
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS oferta_practica (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empresa_id INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
            titulo TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            requisito_academico TEXT DEFAULT 'Min. 70% Malla',
            min_avance_malla INTEGER DEFAULT 65,
            duracion_horas INTEGER DEFAULT 360,
            duracion_meses INTEGER DEFAULT 3,
            modalidad TEXT DEFAULT 'Híbrido' CHECK(modalidad IN ('Híbrido', 'Remoto', 'Presencial')),
            remunerada INTEGER DEFAULT 1,
            monto_remuneracion TEXT DEFAULT '$250.000',
            cupos INTEGER DEFAULT 2,
            habilidades_requeridas TEXT,
            ubicacion TEXT DEFAULT 'Santiago',
            area TEXT DEFAULT 'Tecnología',
            estado TEXT DEFAULT 'Activa' CHECK(estado IN ('Activa', 'Borrador', 'Cerrada')),
            token_acceso TEXT UNIQUE,
            fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')

        # Migración automática de columna token_acceso si no existía previamente
        cursor.execute("PRAGMA table_info(oferta_practica)")
        cols = [r['name'] for r in cursor.fetchall()]
        if 'token_acceso' not in cols:
            cursor.execute("ALTER TABLE oferta_practica ADD COLUMN token_acceso TEXT")
            cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_oferta_token ON oferta_practica(token_acceso)")

        # 5. Tabla Postulación
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS postulacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estudiante_id INTEGER NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
            oferta_practica_id INTEGER NOT NULL REFERENCES oferta_practica(id) ON DELETE CASCADE,
            estado TEXT DEFAULT 'Postulado',
            fase_administrativa TEXT DEFAULT 'Postulado',
            fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            nota_evaluacion REAL,
            observaciones TEXT,
            UNIQUE(estudiante_id, oferta_practica_id)
        );
        ''')

        # 6. Tabla Documentos de Práctica
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS documento_practica (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estudiante_id INTEGER NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
            postulacion_id INTEGER REFERENCES postulacion(id) ON DELETE SET NULL,
            tipo_documento TEXT NOT NULL,
            nombre_archivo TEXT NOT NULL,
            ruta_archivo TEXT NOT NULL,
            tamano_bytes INTEGER,
            estado_validacion TEXT DEFAULT 'Pendiente',
            observacion TEXT,
            firmado_por TEXT,
            fecha_firma TIMESTAMP,
            fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')

        # Migración automática de columnas para firma y observaciones si no existen
        cursor.execute("PRAGMA table_info(documento_practica)")
        doc_cols = [r['name'] for r in cursor.fetchall()]
        if 'observacion' not in doc_cols:
            cursor.execute("ALTER TABLE documento_practica ADD COLUMN observacion TEXT")
        if 'firmado_por' not in doc_cols:
            cursor.execute("ALTER TABLE documento_practica ADD COLUMN firmado_por TEXT")
        if 'fecha_firma' not in doc_cols:
            cursor.execute("ALTER TABLE documento_practica ADD COLUMN fecha_firma TIMESTAMP")

        # 7. Tabla Bitácora de Auditoría (Trazabilidad y Seguridad)
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS bitacora_auditoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
            accion TEXT NOT NULL,
            detalle TEXT,
            ip_address TEXT,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')

        # 8. Notificaciones de Usuario
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS notificacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
            titulo TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            leida INTEGER DEFAULT 0,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')

        # 9. Mensajería Directa Alumno <-> Docente/Jefatura
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS mensaje (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estudiante_id INTEGER NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
            remitente_tipo TEXT NOT NULL CHECK(remitente_tipo IN ('estudiante', 'docente')),
            asunto TEXT NOT NULL,
            cuerpo TEXT NOT NULL,
            leido INTEGER DEFAULT 0,
            fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')

        # 10. Recuperación de Contraseñas
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS recuperacion_clave (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
            codigo TEXT NOT NULL,
            expira_en TIMESTAMP NOT NULL,
            usado INTEGER DEFAULT 0
        );
        ''')
