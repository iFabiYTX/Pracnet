import os
from app.database import get_db, init_db
from app.security import hash_password

def seed_database():
    init_db()
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Verificar si ya existen usuarios
        cursor.execute("SELECT COUNT(*) as cnt FROM usuario")
        if cursor.fetchone()['cnt'] > 0:
            print("La base de datos ya contiene datos. Saltando seeder.")
            return

        print("Poblando base de datos con datos de prueba de PRACNET...")
        
        # 1. Crear Usuarios Institucionales (Jefatura y Coordinación)
        usuarios_staff = [
            ("docente@pracnet.cl", hash_password("docente2026"), "jefe_carrera", "Coordinación Académica de Prácticas", "11.111.111-1"),
            ("jefe@pracnet.cl", hash_password("jefe2026"), "jefe_carrera", "Coordinación Académica de Prácticas", "11.111.111-2"),
            ("admin@pracnet.cl", hash_password("admin2026"), "admin", "Administración del Sistema", "14.444.444-4"),
            ("empresa@pracnet.cl", hash_password("empresa2026"), "empresa", "Tech Solutions (Reclutamiento)", "76.999.888-2"),
        ]
        
        for email, p_hash, rol, nom, rut in usuarios_staff:
            cursor.execute(
                "INSERT INTO usuario (email, password_hash, rol, nombre, rut) VALUES (?, ?, ?, ?, ?)",
                (email, p_hash, rol, nom, rut)
            )

        # 2. Crear Empresas
        empresas = [
            ("Tech Solutions", "Tecnología y Software", "Av. Providencia 1200, Santiago", "contacto@techsolutions.cl", "76.123.456-7", 1, 42),
            ("Banco Estado", "Banca y Finanzas", "Alameda 1111, Santiago", "practicas@bancoestado.cl", "97.001.000-1", 1, 38),
            ("Latam Airlines", "Transporte y Aeronáutica", "Av. Américo Vespucio 901, Pudahuel", "talento@latam.com", "89.123.456-0", 1, 35),
            ("CMPC Automotriz", "Manufactura e Industria", "Agustinas 1343, Santiago", "rrhh@cmpc.com", "90.234.567-8", 1, 30),
            ("Entel", "Telecomunicaciones", "Av. Andrés Bello 2711, Las Condes", "empleabilidad@entel.cl", "96.543.210-9", 1, 40),
        ]
        
        empresa_ids = {}
        for nom, area, dir_, mail, rut, conv, ret in empresas:
            cursor.execute(
                "INSERT INTO empresa (nombre, area, direccion, correo_contacto, rut, convenio_vigente, tasa_retencion) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (nom, area, dir_, mail, rut, conv, ret)
            )
            empresa_ids[nom] = cursor.lastrowid

        # 3. Crear Estudiantes y sus Cuentas de Usuario
        estudiantes = [
            ("Carlos", "Mendoza", "alumno@pracnet.cl", "20.123.456-7", "Ingeniería Civil Informática", 2022, 8, 85, 185, "Python, SQL, Git, FastAPI, Docker", "Santiago"),
            ("Ana", "Rojas", "ana.rojas@alumnos.usm.cl", "19.876.543-2", "Ingeniería Comercial", 2021, 9, 72, 170, "PowerBI, Excel, Finanzas, Análisis de Datos", "Valparaíso"),
            ("María", "Soto L.", "maria.soto@alumnos.usm.cl", "20.456.789-0", "Ingeniería en Manufactura Industrial", 2022, 8, 82, 180, "Mantenimiento, AutoCAD, Lean Manufacturing", "Concepción"),
            ("Juan", "Pérez G.", "juan.perez@alumnos.usm.cl", "20.321.654-8", "Ingeniería Civil Informática", 2022, 7, 75, 160, "Node.js, React, APIs REST, PostgreSQL", "Santiago"),
            ("Diego", "Tapia R.", "diego.tapia@alumnos.usm.cl", "19.654.321-K", "Ingeniería Civil Informática", 2021, 7, 68, 150, "Redes, Cisco CCNA, Linux, Seguridad", "Santiago"),
            ("Valentina", "Ríos", "valentina.rios@alumnos.usm.cl", "21.012.345-6", "Ingeniería en Diseño / Informática", 2023, 9, 90, 200, "Figma, UX/UI, CSS, Accesibilidad Web, React", "Santiago"),
        ]

        estudiante_ids = {}
        for nom, ape, email, rut, carrera, ingreso, sem, avance, cred, habs, ciudad in estudiantes:
            # Crear usuario
            cursor.execute(
                "INSERT INTO usuario (email, password_hash, rol, nombre, rut) VALUES (?, ?, 'estudiante', ?, ?)",
                (email, hash_password("alumno2026"), f"{nom} {ape}", rut)
            )
            u_id = cursor.lastrowid
            
            # Crear estudiante
            cursor.execute(
                """INSERT INTO estudiante 
                   (usuario_id, nombre, apellido, rut, correo_institucional, carrera, ano_ingreso, semestre_actual, avance_malla, creditos_totales, habilidades, ubicacion)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (u_id, nom, ape, rut, email, carrera, ingreso, sem, avance, cred, habs, ciudad)
            )
            estudiante_ids[f"{nom} {ape}"] = cursor.lastrowid

        # 4. Crear Ofertas de Práctica (Directas del Mockup)
        ofertas = [
            ("Tech Solutions", "Práctica Desarrollo Backend", 
             "Buscamos estudiante motivado para integración de microservicios y APIs REST. Mentoría personalizada y proyectos reales.", 
             "Min. 6to Semestre", 70, 360, 3, "Híbrido", 1, "$300.000", 3, "Python, SQL, Git, APIs REST", "Santiago", "Software", "Activa"),
             
            ("Banco Estado", "Analista de Datos Jr.", 
             "Apoyo en el análisis de grandes volúmenes de datos transaccionales, generación de tableros de control y automatización de reportes.", 
             "Min. 70% Malla", 70, 180, 2, "Remoto", 1, "$260.000", 2, "PowerBI, Excel, SQL, Finanzas", "Santiago", "Datos", "Activa"),
             
            ("Latam Airlines", "Práctica UX/UI", 
             "Diseño y testeo de flujos de interacción para aplicaciones de pasajeros. Trabajo con Design Systems y entrevistas con usuarios.", 
             "Min. 4to Semestre", 60, 180, 2, "Híbrido", 1, "$220.000", 2, "Figma, UX/UI, Prototipado, Accesibilidad", "Santiago", "Diseño", "Activa"),
             
            ("CMPC Automotriz", "Práctica Mantenimiento Industrial", 
             "Participación en programas de confiabilidad operacional y mantenimiento preventivo de plantas continuas.", 
             "Min. 80% Malla", 80, 360, 3, "Presencial", 1, "$280.000", 1, "Mantenimiento, AutoCAD, Lean", "Santiago", "Industria", "Borrador"),
             
            ("Entel", "Soporte Redes y Telecomunicaciones", 
             "Monitorización de infraestructura de telecomunicaciones, enlaces de fibra y soporte a equipos de operaciones de red.", 
             "Min. 60% Malla", 60, 180, 2, "Híbrido", 1, "$240.000", 2, "Redes, Cisco, Linux, Soporte", "Santiago", "Redes", "Activa"),
        ]

        oferta_ids = {}
        for emp_nom, tit, desc, req, min_av, horas, meses, mod, rem, monto, cupos, habs, ubi, area, est in ofertas:
            emp_id = empresa_ids[emp_nom]
            cursor.execute(
                """INSERT INTO oferta_practica 
                   (empresa_id, titulo, descripcion, requisito_academico, min_avance_malla, duracion_horas, duracion_meses, modalidad, remunerada, monto_remuneracion, cupos, habilidades_requeridas, ubicacion, area, estado)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (emp_id, tit, desc, req, min_av, horas, meses, mod, rem, monto, cupos, habs, ubi, area, est)
            )
            oferta_ids[tit] = cursor.lastrowid

        # 5. Crear Postulaciones (Fases del Mockup 9.2)
        postulaciones_mockup = [
            ("María Soto L.", "Práctica Mantenimiento Industrial", "En Selección", "Pendiente Seguro Escolar"),
            ("Juan Pérez G.", "Práctica Desarrollo Backend", "Validacion Academica", "Carta Presentación Emitida"),
            ("Diego Tapia R.", "Soporte Redes y Telecomunicaciones", "En Selección", "Entrevista Técnica Realizada"),
            ("Valentina Ríos", "Práctica UX/UI", "Aprobado", "Práctica Iniciada"),
            ("Carlos Mendoza", "Práctica Desarrollo Backend", "Postulado", "Postulado"),
        ]

        for est_nom, of_tit, est_post, fase in postulaciones_mockup:
            est_id = estudiante_ids[est_nom]
            of_id = oferta_ids[of_tit]
            cursor.execute(
                """INSERT INTO postulacion 
                   (estudiante_id, oferta_practica_id, estado, fase_administrativa)
                   VALUES (?, ?, ?, ?)""",
                (est_id, of_id, est_post, fase)
            )
            post_id = cursor.lastrowid
            
            # Agregar documentos de prueba correspondientes
            cursor.execute(
                """INSERT INTO documento_practica 
                   (estudiante_id, postulacion_id, tipo_documento, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion)
                   VALUES (?, ?, 'curriculum', 'Curriculum_Vitae.pdf', 'uploads/cv_demo.pdf', 245000, 'Aprobado')""",
                (est_id, post_id)
            )
            if fase != "Pendiente Seguro Escolar":
                cursor.execute(
                    """INSERT INTO documento_practica 
                       (estudiante_id, postulacion_id, tipo_documento, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion)
                       VALUES (?, ?, 'seguro_escolar', 'Seguro_Escolar_2026.pdf', 'uploads/seguro_demo.pdf', 312000, 'Aprobado')""",
                    (est_id, post_id)
                )

        # 6. Bitácora de Auditoría inicial
        cursor.execute(
            """INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address)
               VALUES (1, 'SISTEMA_INICIALIZADO', 'Carga de datos inicial y verificación de integridad criptográfica', '127.0.0.1')"""
        )

        print("¡Base de datos poblada exitosamente con usuarios, empresas, ofertas y postulaciones!")

if __name__ == '__main__':
    seed_database()
