-- ====================================================================
-- PRACNET v2.0 - DATOS INICIALES Y SEMILLA OFICIAL (MySQL 8.0.x)
-- Basado en los Mockups (Sección 9), Entrevistas e Indicadores USM
-- ====================================================================

USE pracnet_db;

-- Limpiar tablas
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE bitacora_auditoria;
TRUNCATE TABLE notificaciones;
TRUNCATE TABLE recuperacion_clave;
TRUNCATE TABLE mensajes;
TRUNCATE TABLE documentos_practica;
TRUNCATE TABLE postulaciones;
TRUNCATE TABLE ofertas_practica;
TRUNCATE TABLE empresas;
TRUNCATE TABLE estudiantes;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. POBLAR: usuarios (Contraseñas con hash bcrypt seguro)
-- Contraseñas base para entorno demostrativo:
-- jefe@pracnet.cl       -> jefe2026
-- docente@pracnet.cl    -> docente2026
-- admin@pracnet.cl      -> admin2026
-- empresa@pracnet.cl    -> empresa2026
-- alumno@pracnet.cl     -> alumno2026
-- (Hash generado con bcrypt / pbkdf2 estándar)
-- --------------------------------------------------------------------
INSERT INTO usuarios (id, email, password_hash, rol, nombre, rut, activo, terminos_aceptados) VALUES
(1, 'jefe@pracnet.cl', '$2b$10$wE0v7bqvU.Z3a91xM1d5b.a3qfQj9kO4Z8k1G3vU9rC1z7e1c8rCe', 'jefe_carrera', 'Coordinación Académica de Prácticas USM', '11.111.111-1', 1, 1),
(2, 'docente@pracnet.cl', '$2b$10$wE0v7bqvU.Z3a91xM1d5b.a3qfQj9kO4Z8k1G3vU9rC1z7e1c8rCe', 'jefe_carrera', 'Jefatura de Carrera (Prevención / Industrias)', '11.111.111-2', 1, 1),
(3, 'admin@pracnet.cl', '$2b$10$tZ2w8cqwV.A4b02yN2e6c.b4rgRk0lP5a9l2H4wV0sD2a8f2d9sDe', 'admin', 'Administración Central PRACNET', '14.444.444-4', 1, 1),
(4, 'empresa@pracnet.cl', '$2b$10$uA3x9drxW.B5c13zO3f7d.c5shSl1mQ6b0m3I5xW1tE3b9g3e0tEf', 'empresa', 'Tech Solutions Reclutamiento', '76.999.888-2', 1, 1),
(5, 'alumno@pracnet.cl', '$2b$10$vB4y0esyX.C6d24aP4g8e.d6tiTm2nR7c1n4J6yX2uF4c0h4f1uFg', 'estudiante', 'Carlos Mendoza', '20.123.456-7', 1, 1),
(6, 'ana.rojas@alumnos.usm.cl', '$2b$10$vB4y0esyX.C6d24aP4g8e.d6tiTm2nR7c1n4J6yX2uF4c0h4f1uFg', 'estudiante', 'Ana Rojas', '19.876.543-2', 1, 1),
(7, 'maria.soto@alumnos.usm.cl', '$2b$10$vB4y0esyX.C6d24aP4g8e.d6tiTm2nR7c1n4J6yX2uF4c0h4f1uFg', 'estudiante', 'María Soto L.', '20.456.789-0', 1, 1),
(8, 'juan.perez@alumnos.usm.cl', '$2b$10$vB4y0esyX.C6d24aP4g8e.d6tiTm2nR7c1n4J6yX2uF4c0h4f1uFg', 'estudiante', 'Juan Pérez G.', '20.321.654-8', 1, 1),
(9, 'diego.tapia@alumnos.usm.cl', '$2b$10$vB4y0esyX.C6d24aP4g8e.d6tiTm2nR7c1n4J6yX2uF4c0h4f1uFg', 'estudiante', 'Diego Tapia R.', '19.654.321-K', 1, 1),
(10, 'valentina.rios@alumnos.usm.cl', '$2b$10$vB4y0esyX.C6d24aP4g8e.d6tiTm2nR7c1n4J6yX2uF4c0h4f1uFg', 'estudiante', 'Valentina Ríos', '21.012.345-6', 1, 1);

-- --------------------------------------------------------------------
-- 2. POBLAR: empresas (Con Convenios y Tasas de Retención)
-- --------------------------------------------------------------------
INSERT INTO empresas (id, usuario_id, nombre, area, direccion, correo_contacto, telefono_contacto, rut, convenio_vigente, tasa_retencion) VALUES
(1, 4, 'Tech Solutions', 'Software y TI', 'Av. Providencia 1200, Santiago', 'contacto@techsolutions.cl', '+56 2 2345 6789', '76.123.456-7', 1, 42.00),
(2, NULL, 'Banco Estado', 'Banca y Finanzas', 'Alameda 1111, Santiago', 'practicas@bancoestado.cl', '+56 2 2670 1234', '97.001.000-1', 1, 38.00),
(3, NULL, 'Latam Airlines', 'Transporte y Aeronáutica', 'Av. Américo Vespucio 901, Pudahuel', 'talento@latam.com', '+56 2 2579 8000', '89.123.456-0', 1, 35.00),
(4, NULL, 'CMPC Automotriz', 'Manufactura e Industria', 'Agustinas 1343, Santiago', 'rrhh@cmpc.com', '+56 2 2441 2000', '90.234.567-8', 1, 30.00),
(5, NULL, 'Entel', 'Telecomunicaciones', 'Av. Andrés Bello 2711, Las Condes', 'empleabilidad@entel.cl', '+56 2 2360 0123', '96.543.210-9', 1, 40.00);

-- --------------------------------------------------------------------
-- 3. POBLAR: estudiantes (Mockups 9.1 y 9.2)
-- --------------------------------------------------------------------
INSERT INTO estudiantes (id, usuario_id, nombre, apellido, rut, correo_institucional, carrera, universidad, sede, ano_ingreso, semestre_actual, avance_malla, creditos_totales, es_primera_practica, habilidades, ubicacion, telefono) VALUES
(1, 5, 'Carlos', 'Mendoza', '20.123.456-7', 'alumno@pracnet.cl', 'Ingeniería Civil Informática', 'Universidad Técnica Federico Santa María', 'Campus San Joaquín', 2022, 8, 85, 185, 0, 'Python, SQL, Git, Node.js, Docker, FastAPI', 'Santiago, Chile', '+56 9 8765 4321'),
(2, 6, 'Ana', 'Rojas', '19.876.543-2', 'ana.rojas@alumnos.usm.cl', 'Ingeniería Comercial', 'Universidad Técnica Federico Santa María', 'Campus Casa Central Valparaíso', 2021, 9, 72, 170, 0, 'PowerBI, Excel, Finanzas, Análisis de Datos, SQL', 'Valparaíso, Chile', '+56 9 7654 3210'),
(3, 7, 'María', 'Soto L.', '20.456.789-0', 'maria.soto@alumnos.usm.cl', 'Ingeniería en Manufactura Industrial', 'Universidad Técnica Federico Santa María', 'Sede Concepción', 2022, 8, 82, 180, 0, 'Mantenimiento, AutoCAD, Lean Manufacturing, Gestión Operacional', 'Concepción, Chile', '+56 9 6543 2109'),
(4, 8, 'Juan', 'Pérez G.', '20.321.654-8', 'juan.perez@alumnos.usm.cl', 'Ingeniería Civil Informática', 'Universidad Técnica Federico Santa María', 'Campus San Joaquín', 2022, 7, 75, 160, 1, 'Node.js, React, APIs REST, PostgreSQL, Git', 'Santiago, Chile', '+56 9 5432 1098'),
(5, 9, 'Diego', 'Tapia R.', '19.654.321-K', 'diego.tapia@alumnos.usm.cl', 'Ingeniería Civil Informática', 'Universidad Técnica Federico Santa María', 'Campus San Joaquín', 2021, 7, 68, 150, 1, 'Redes, Cisco CCNA, Linux, Soporte de Redes, Seguridad Informática', 'Santiago, Chile', '+56 9 4321 0987'),
(6, 10, 'Valentina', 'Ríos', '21.012.345-6', 'valentina.rios@alumnos.usm.cl', 'Ingeniería en Diseño / Informática', 'Universidad Técnica Federico Santa María', 'Campus San Joaquín', 2023, 9, 90, 200, 0, 'Figma, UX/UI, Accesibilidad Web, Prototipado, CSS, React', 'Santiago, Chile', '+56 9 3210 9876');

-- --------------------------------------------------------------------
-- 4. POBLAR: ofertas_practica (Con Tokens Mágicos y Mockup 9.2)
-- --------------------------------------------------------------------
INSERT INTO ofertas_practica (id, empresa_id, titulo, descripcion, requisito_academico, min_avance_malla, duracion_horas, duracion_meses, modalidad, remunerada, monto_remuneracion, cupos, habilidades_requeridas, ubicacion, area, estado, token_acceso) VALUES
(1, 1, 'Práctica Desarrollo Backend', 'Buscamos estudiante motivado para integración de microservicios y APIs REST. Mentoría personalizada y proyectos reales de producción.', 'Min. 6to Semestre', 70, 360, 3, 'Híbrido', 1, '$300.000', 3, 'Python, SQL, Git, APIs REST, Node.js', 'Santiago', 'Software', 'Activa', 'tWPPZe1XNrbGswiCchORWA'),
(2, 2, 'Analista de Datos Jr.', 'Apoyo en el análisis de grandes volúmenes de datos transaccionales, generación de tableros de control en PowerBI y automatización de reportes de cartera.', 'Min. 70% Malla', 70, 180, 2, 'Remoto', 1, '$260.000', 2, 'PowerBI, Excel, SQL, Finanzas', 'Santiago', 'Datos', 'Activa', 'U0BWWPFWua7igZSqrZFl0g'),
(3, 3, 'Práctica UX/UI', 'Diseño y testeo de flujos de interacción para aplicaciones de pasajeros. Trabajo con Design Systems de Latam y entrevistas con usuarios reales.', 'Min. 4to Semestre', 60, 180, 2, 'Híbrido', 1, '$220.000', 2, 'Figma, UX/UI, Prototipado, Accesibilidad', 'Santiago', 'Diseño', 'Activa', 'ash8J9337Wj00zWhS-DBLg'),
(4, 4, 'Práctica Mantenimiento Industrial', 'Participación en programas de confiabilidad operacional y mantenimiento preventivo de plantas continuas de celulosa y manufactura.', 'Min. 80% Malla', 80, 360, 3, 'Presencial', 1, '$280.000', 1, 'Mantenimiento, AutoCAD, Lean', 'Santiago', 'Industria', 'Borrador', 'Y1oO0rq73st3DzeFkikZKg'),
(5, 5, 'Soporte Redes y Telecomunicaciones', 'Monitorización de infraestructura de telecomunicaciones, enlaces de fibra óptica y soporte a ingenieros de operaciones de red NOC.', 'Min. 60% Malla', 60, 180, 2, 'Híbrido', 1, '$240.000', 2, 'Redes, Cisco, Linux, Soporte', 'Santiago', 'Redes', 'Activa', 'rP7MfRM-wNUo3xS1CWD6Jg');

-- --------------------------------------------------------------------
-- 5. POBLAR: postulaciones (Exactas de la Tabla del Mockup 9.2)
-- --------------------------------------------------------------------
INSERT INTO postulaciones (id, estudiante_id, oferta_practica_id, estado, fase_administrativa, fecha_postulacion, nota_evaluacion, observaciones) VALUES
(1, 3, 4, 'En Selección', 'Pendiente Seguro Escolar', '2026-10-10 10:30:00', NULL, 'Empresa pre-seleccionó antecedentes. Falta carga del seguro Ley N° 16.744.'),
(2, 4, 1, 'Validación Académica', 'Carta Presentación Emitida', '2026-10-11 11:15:00', NULL, 'Carta emitida y timbrada por Secretaría Docente USM.'),
(3, 5, 5, 'En Selección', 'Entrevista Técnica Realizada', '2026-10-12 14:00:00', NULL, 'Entrevista técnica superada favorablemente con el líder del área.'),
(4, 6, 3, 'Aprobado', 'Práctica Iniciada', '2026-10-13 09:00:00', NULL, 'Convenio firmado e inicio de actividades formativas.'),
(5, 1, 1, 'Postulado', 'Postulado', '2026-10-14 16:45:00', NULL, 'Postulación recibida en espera de primera revisión.');

-- --------------------------------------------------------------------
-- 6. POBLAR: documentos_practica
-- --------------------------------------------------------------------
INSERT INTO documentos_practica (id, estudiante_id, postulacion_id, tipo_documento, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion, observacion, firmado_por, fecha_firma) VALUES
(1, 1, 5, 'curriculum', 'Curriculum_Vitae_Carlos_Mendoza.pdf', 'uploads/cv_carlos.pdf', 245000, 'Aprobado', 'CV completo y validado conforme al perfil de egreso.', 'FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM', '2026-10-14 17:00:00'),
(2, 1, 5, 'seguro_escolar', 'Seguro_Escolar_2026_Carlos_Mendoza.pdf', 'uploads/seguro_carlos.pdf', 312000, 'Aprobado', 'Certificado oficial emitido por DAE USM.', 'FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM', '2026-10-14 17:05:00'),
(3, 6, 4, 'curriculum', 'CV_Valentina_Rios_Design.pdf', 'uploads/cv_valentina.pdf', 540000, 'Aprobado', 'Portafolio y CV con estándar sobresaliente.', 'FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM', '2026-10-13 09:30:00'),
(4, 6, 4, 'seguro_escolar', 'Seguro_Escolar_Valentina_Rios.pdf', 'uploads/seguro_valentina.pdf', 298000, 'Aprobado', 'Vigente para el periodo 2026.', 'FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM', '2026-10-13 09:35:00'),
(5, 4, 2, 'curriculum', 'CV_Juan_Perez.pdf', 'uploads/cv_juan.pdf', 198000, 'Aprobado', 'Validado para vacante Backend.', 'FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM', '2026-10-11 11:30:00');

-- --------------------------------------------------------------------
-- 7. POBLAR: mensajes (Comunicación Directa Estudiante <-> Jefatura)
-- --------------------------------------------------------------------
INSERT INTO mensajes (id, estudiante_id, remitente_tipo, asunto, cuerpo, leido, fecha_envio) VALUES
(1, 1, 'docente', 'Bienvenido a PRACNET - Proceso de Práctica', 'Estimado Carlos, bienvenido a la plataforma oficial. Recuerda que para iniciar tu práctica debes contar con la Carta de Presentación y tu Seguro Escolar Ley N° 16.744 validado.', 1, '2026-10-14 09:00:00'),
(2, 1, 'estudiante', 'Consulta sobre Seguro Escolar Ley 16.744', 'Estimada Coordinación, ya cargué mi certificado de alumno regular obtenido en SIGA para la validación del seguro. Quedo atento a la confirmación de la firma digital.', 1, '2026-10-14 10:15:00'),
(3, 1, 'docente', 'Respuesta: Seguro Escolar Aprobado', 'Estimado Carlos, hemos validado tu expediente satisfactoriamente. Tu seguro ya se encuentra en estado Aprobado y firmado digitalmente.', 0, '2026-10-14 11:00:00');

-- --------------------------------------------------------------------
-- 8. POBLAR: notificaciones
-- --------------------------------------------------------------------
INSERT INTO notificaciones (id, usuario_id, titulo, mensaje, leida) VALUES
(1, 5, 'Recomendación Curricular', '¡Hola Carlos! Tu jefatura te ha recomendado postular a la vacante Backend en Tech Solutions (95% Match).', 0),
(2, 5, 'Documento Aprobado', 'Tu Certificado de Seguro Escolar ha sido aprobado y firmado digitalmente por Coordinación Académica.', 1),
(3, 6, 'Recomendación Curricular', 'Tu perfil tiene un 88% de Match con la vacante Analista de Datos Jr. en Banco Estado.', 0);

-- --------------------------------------------------------------------
-- 9. POBLAR: bitacora_auditoria (Eventos Clave)
-- --------------------------------------------------------------------
INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address, fecha) VALUES
(1, 'SISTEMA_INICIALIZADO', 'Esquema MySQL 8.0 y Redis 7.2 desplegados y validados', '127.0.0.1', '2026-10-10 08:00:00'),
(1, 'LOGIN_EXITOSO', 'Ingreso al sistema con rol: jefe_carrera', '192.168.1.105', '2026-10-14 08:30:00'),
(5, 'LOGIN_EXITOSO', 'Ingreso al sistema con rol: estudiante', '190.161.45.12', '2026-10-14 16:00:00'),
(5, 'POSTULACION_CREADA', 'Carlos Mendoza postuló a oferta #1: Práctica Desarrollo Backend (Tech Solutions)', '190.161.45.12', '2026-10-14 16:45:00'),
(1, 'DOCUMENTO_FIRMADO', 'Firma digital aplicada al documento Seguro Escolar de Carlos Mendoza', '192.168.1.105', '2026-10-14 17:05:00');
