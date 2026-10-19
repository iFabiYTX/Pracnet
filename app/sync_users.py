from app.database import get_db, init_db
from app.security import hash_password

def sync_pracnet_users():
    init_db()
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Alumno oficial: alumno@pracnet.cl / alumno2026
        cursor.execute("UPDATE usuario SET email = 'alumno@pracnet.cl', password_hash = ? WHERE email = 'carlos.mendoza@alumnos.usm.cl'", (hash_password('alumno2026'),))
        cursor.execute("UPDATE estudiante SET correo_institucional = 'alumno@pracnet.cl' WHERE rut = '20.123.456-7'")

        # 2. Jefe de Carrera: jefe@pracnet.cl / jefe2026
        cursor.execute("UPDATE usuario SET email = 'jefe@pracnet.cl', password_hash = ? WHERE email = 'jefe.informatica@usm.cl'", (hash_password('jefe2026'),))

        # 3. Admin Central: admin@pracnet.cl / admin2026
        cursor.execute("UPDATE usuario SET email = 'admin@pracnet.cl', password_hash = ? WHERE email = 'admin@pracnet.cl'", (hash_password('admin2026'),))

        # 4. Crear secretaria@pracnet.cl si no existe
        cursor.execute("SELECT id FROM usuario WHERE email = 'secretaria@pracnet.cl'")
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO usuario (email, password_hash, rol, nombre, rut) VALUES (?, ?, 'jefe_carrera', ?, ?)",
                ('secretaria@pracnet.cl', hash_password('secre2026'), 'Secretaría Docente Depto. Informática', '16.666.666-6')
            )

        # 5. Crear empresa@pracnet.cl si no existe
        cursor.execute("SELECT id FROM usuario WHERE email = 'empresa@pracnet.cl'")
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO usuario (email, password_hash, rol, nombre, rut) VALUES (?, ?, 'empresa', ?, ?)",
                ('empresa@pracnet.cl', hash_password('empresa2026'), 'Tech Solutions (Reclutamiento)', '76.999.888-2')
            )
            u_emp_id = cursor.lastrowid
            cursor.execute("UPDATE empresa SET usuario_id = ? WHERE id = 1", (u_emp_id,))

        print(">> Usuarios @pracnet.cl actualizados exitosamente en la base de datos.")

if __name__ == '__main__':
    sync_pracnet_users()
