from app.database import get_db, init_db
from app.security import hash_password

def sync_pracnet_users():
    init_db()
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Alumno oficial: alumno@pracnet.cl / alumno2026
        cursor.execute("UPDATE usuario SET email = 'alumno@pracnet.cl', password_hash = ?, nombre = 'Carlos Mendoza' WHERE id = 5 OR email = 'alumno@pracnet.cl'", (hash_password('alumno2026'),))
        cursor.execute("UPDATE estudiante SET correo_institucional = 'alumno@pracnet.cl' WHERE rut = '20.123.456-7'")

        # 2. Coordinación Docente Institucional
        cursor.execute("UPDATE usuario SET nombre = 'Coordinación Académica de Prácticas', password_hash = ? WHERE id = 1", (hash_password('docente2026'),))
        cursor.execute("UPDATE usuario SET nombre = 'Coordinación de Prácticas (Prevención)' WHERE id = 2")
        cursor.execute("UPDATE usuario SET nombre = 'Coordinación de Prácticas (Industrias)' WHERE id = 3")
        cursor.execute("UPDATE usuario SET nombre = 'Secretaría Docente' WHERE id = 12")
        cursor.execute("UPDATE usuario SET nombre = 'Administración del Sistema' WHERE id = 4")

        # 3. Limpiar bitácora de nombres reales anteriores
        cursor.execute("UPDATE bitacora_auditoria SET detalle = REPLACE(detalle, 'Prof. José Carrasco (Jefe Informática)', 'Coordinación Académica') WHERE detalle LIKE '%Carrasco%'")
        cursor.execute("UPDATE bitacora_auditoria SET detalle = REPLACE(detalle, 'Prof. José Carrasco', 'Coordinación Académica') WHERE detalle LIKE '%Carrasco%'")
        cursor.execute("UPDATE bitacora_auditoria SET detalle = REPLACE(detalle, 'Prof. Claudia Grandon', 'Coordinación Académica') WHERE detalle LIKE '%Grandon%'")
        cursor.execute("UPDATE bitacora_auditoria SET detalle = REPLACE(detalle, 'Prof. Marcelo Quiroz', 'Coordinación Académica') WHERE detalle LIKE '%Quiroz%'")

        # 4. Mensajes iniciales de prueba si no existen
        cursor.execute("SELECT COUNT(*) as cnt FROM mensaje")
        if cursor.fetchone()['cnt'] == 0:
            cursor.execute("SELECT id FROM estudiante LIMIT 1")
            est_row = cursor.fetchone()
            if est_row:
                e_id = est_row['id']
                cursor.execute(
                    "INSERT INTO mensaje (estudiante_id, remitente_tipo, asunto, cuerpo, leido) VALUES (?, 'docente', 'Bienvenido a PRACNET - Proceso de Práctica', 'Estimado estudiante, bienvenido al sistema de gestión de prácticas. Recuerda que antes de iniciar tus actividades debes subir tu certificado de Seguro Escolar y Formulario 6000 B para validación institucional.', 1)",
                    (e_id,)
                )
                cursor.execute(
                    "INSERT INTO mensaje (estudiante_id, remitente_tipo, asunto, cuerpo, leido) VALUES (?, 'estudiante', 'Consulta sobre Seguro Escolar Ley 16.744', 'Estimada Coordinación, ya cargué mi certificado de seguro emitido por la Dirección de Asuntos Estudiantiles. ¿Cuánto demora la firma digital?', 0)",
                    (e_id,)
                )

        print(">> Nombres sanitizados y usuarios @pracnet.cl sincronizados.")

if __name__ == '__main__':
    sync_pracnet_users()
