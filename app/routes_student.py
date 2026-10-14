import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, send_from_directory, jsonify
from app.database import get_db
from app.security import role_required, login_required, allowed_file, sanitize_safe_filename
from app.config import Config

student_bp = Blueprint('student', __name__, url_prefix='/estudiante')

@student_bp.before_request
@role_required(['estudiante'])
def restrict_student():
    pass

@student_bp.route('/muro')
def muro():
    area_filtro = request.args.get('area', '')
    modalidad_filtro = request.args.get('modalidad', '')
    ubicacion_filtro = request.args.get('ubicacion', '')
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Obtener datos del estudiante actual
        estudiante_id = session.get('estudiante_id')
        cursor.execute("SELECT * FROM estudiante WHERE id = ?", (estudiante_id,))
        estudiante = cursor.fetchone()
        
        # Consulta de ofertas con filtros
        query = """
            SELECT o.*, e.nombre as empresa_nombre, e.area as empresa_area,
                   (SELECT id FROM postulacion WHERE estudiante_id = ? AND oferta_practica_id = o.id) as mi_postulacion_id
            FROM oferta_practica o
            JOIN empresa e ON o.empresa_id = e.id
            WHERE o.estado = 'Activa'
        """
        params = [estudiante_id]
        
        if area_filtro:
            query += " AND o.area = ?"
            params.append(area_filtro)
        if modalidad_filtro:
            query += " AND o.modalidad = ?"
            params.append(modalidad_filtro)
        if ubicacion_filtro:
            query += " AND o.ubicacion LIKE ?"
            params.append(f"%{ubicacion_filtro}%")
            
        query += " ORDER BY o.id DESC"
        cursor.execute(query, tuple(params))
        ofertas = cursor.fetchall()
        
        cursor.execute("SELECT DISTINCT area FROM oferta_practica WHERE estado = 'Activa'")
        areas = [r['area'] for r in cursor.fetchall()]
        
    return render_template(
        'student/muro.html',
        ofertas=ofertas,
        estudiante=estudiante,
        areas=areas,
        area_filtro=area_filtro,
        modalidad_filtro=modalidad_filtro,
        ubicacion_filtro=ubicacion_filtro
    )

@student_bp.route('/postular/<int:oferta_id>', methods=['POST'])
def postular(oferta_id):
    estudiante_id = session.get('estudiante_id')
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Verificar si ya postuló
        cursor.execute("SELECT id FROM postulacion WHERE estudiante_id = ? AND oferta_practica_id = ?", (estudiante_id, oferta_id))
        if cursor.fetchone():
            flash('Ya has postulado a esta vacante de práctica anteriormente.', 'info')
            return redirect(url_for('student.muro'))
            
        # Obtener oferta y estudiante para verificar requisitos
        cursor.execute("SELECT * FROM oferta_practica WHERE id = ?", (oferta_id,))
        oferta = cursor.fetchone()
        cursor.execute("SELECT * FROM estudiante WHERE id = ?", (estudiante_id,))
        estudiante = cursor.fetchone()
        
        if estudiante['avance_malla'] < oferta['min_avance_malla']:
            flash(f"Requisito curricular no cumplido: Esta oferta requiere al menos {oferta['min_avance_malla']}% de avance de malla (tu avance actual es {estudiante['avance_malla']}%).", 'warning')
            return redirect(url_for('student.muro'))
            
        cursor.execute("""
            INSERT INTO postulacion (estudiante_id, oferta_practica_id, estado, fase_administrativa)
            VALUES (?, ?, 'Postulado', 'Postulado')
        """, (estudiante_id, oferta_id))
        
        cursor.execute(
            "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'POSTULACION_CREADA', ?)",
            (session.get('user_id'), f"Postulación a oferta #{oferta_id}: {oferta['titulo']}")
        )
        
        flash('¡Postulación enviada con éxito! Ya puedes hacer seguimiento en tu panel.', 'success')
        
    return redirect(url_for('student.seguimiento'))

@student_bp.route('/validacion')
def validacion():
    estudiante_id = session.get('estudiante_id')
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM estudiante WHERE id = ?", (estudiante_id,))
        estudiante = cursor.fetchone()
        
        # Obtener última postulación activa
        cursor.execute("""
            SELECT p.*, o.titulo as oferta_titulo, e.nombre as empresa_nombre
            FROM postulacion p
            JOIN oferta_practica o ON p.oferta_practica_id = o.id
            JOIN empresa e ON o.empresa_id = e.id
            WHERE p.estudiante_id = ?
            ORDER BY p.id DESC LIMIT 1
        """, (estudiante_id,))
        postulacion = cursor.fetchone()
        
        # Obtener documentos del estudiante
        cursor.execute("SELECT * FROM documento_practica WHERE estudiante_id = ?", (estudiante_id,))
        docs = cursor.fetchall()
        docs_map = {d['tipo_documento']: d for d in docs}
        
        # Calcular porcentaje de validación (base de 25% por etapa)
        progreso = 25  # Inscripción hecha
        if 'seguro_escolar' in docs_map:
            progreso += 25
        if postulacion and postulacion['fase_administrativa'] in ('Entrevista Técnica Realizada', 'Carta Presentación Emitida', 'Práctica Iniciada', 'Aprobado'):
            progreso += 25
        if 'informe_final' in docs_map:
            progreso += 25
            
    return render_template(
        'student/validacion.html',
        estudiante=estudiante,
        postulacion=postulacion,
        docs_map=docs_map,
        progreso=progreso
    )

@student_bp.route('/subir-documento', methods=['POST'])
def subir_documento():
    estudiante_id = session.get('estudiante_id')
    tipo_documento = request.form.get('tipo_documento')
    postulacion_id = request.form.get('postulacion_id')
    
    if 'archivo' not in request.files:
        flash('No se seleccionó ningún archivo.', 'warning')
        return redirect(url_for('student.validacion'))
        
    file = request.files['archivo']
    if file.filename == '':
        flash('Nombre de archivo inválido.', 'warning')
        return redirect(url_for('student.validacion'))
        
    if file and allowed_file(file.filename):
        safe_name = sanitize_safe_filename(file.filename)
        # Prefijo único para evitar sobreescritura accidental
        saved_filename = f"est_{estudiante_id}_{tipo_documento}_{safe_name}"
        file_path = os.path.join(Config.UPLOAD_FOLDER, saved_filename)
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        
        with get_db() as conn:
            cursor = conn.cursor()
            # Eliminar registro anterior del mismo tipo si existe
            cursor.execute("DELETE FROM documento_practica WHERE estudiante_id = ? AND tipo_documento = ?", (estudiante_id, tipo_documento))
            cursor.execute("""
                INSERT INTO documento_practica 
                (estudiante_id, postulacion_id, tipo_documento, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion)
                VALUES (?, ?, ?, ?, ?, ?, 'Aprobado')
            """, (estudiante_id, postulacion_id or None, tipo_documento, safe_name, saved_filename, file_size))
            
            cursor.execute(
                "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'DOCUMENTO_SUBIDO', ?)",
                (session.get('user_id'), f"Subido documento {tipo_documento}: {safe_name}")
            )
            
        flash(f'Documento {safe_name} subido y validado exitosamente.', 'success')
    else:
        flash('Formato de archivo no permitido. Solo se aceptan PDF, DOC y DOCX.', 'danger')
        
    return redirect(url_for('student.validacion'))

@student_bp.route('/seguimiento')
def seguimiento():
    estudiante_id = session.get('estudiante_id')
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM estudiante WHERE id = ?", (estudiante_id,))
        estudiante = cursor.fetchone()
        
        cursor.execute("""
            SELECT p.*, o.titulo as oferta_titulo, o.modalidad, o.duracion_horas,
                   e.nombre as empresa_nombre, e.area as empresa_area
            FROM postulacion p
            JOIN oferta_practica o ON p.oferta_practica_id = o.id
            JOIN empresa e ON o.empresa_id = e.id
            WHERE p.estudiante_id = ?
            ORDER BY p.id DESC
        """, (estudiante_id,))
        postulaciones = cursor.fetchall()
        
    return render_template('student/seguimiento.html', estudiante=estudiante, postulaciones=postulaciones)

@student_bp.route('/perfil')
def perfil():
    estudiante_id = session.get('estudiante_id')
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM estudiante WHERE id = ?", (estudiante_id,))
        estudiante = cursor.fetchone()
    return render_template('student/perfil.html', estudiante=estudiante)

@student_bp.route('/asistente-ai', methods=['POST'])
def asistente_ai():
    """Asistente Virtual interactivo para resolver consultas sobre prácticas y Ley 16.744."""
    data = request.get_json() or {}
    pregunta = data.get('pregunta', '').lower().strip()
    
    if not pregunta:
        return jsonify({'respuesta': 'Hola, soy el Asistente Virtual de PRACNET. ¿En qué puedo orientarte hoy sobre tu práctica profesional?'})
        
    if 'seguro' in pregunta or '16.744' in pregunta:
        respuesta = "El Seguro Escolar (Ley N° 16.744) cubre accidentes de trayecto y durante la jornada laboral en tu centro de práctica. Debes descargar el certificado de alumno regular en SIGA USM y subirlo a la pestaña 'Documentos' para que tu práctica quede legalmente cubierta."
    elif 'siga' in pregunta or 'convalid' in pregunta or 'validar' in pregunta:
        respuesta = "Para validar tu práctica en SIGA: 1) Registra la empresa en PRACNET, 2) Espera la aprobación de tu jefe de carrera, 3) Descarga la Carta de Presentación oficial, y 4) Al finalizar, sube el informe final para que la jefatura ingrese la nota formal."
    elif 'remuneraci' in pregunta or 'sueldo' in pregunta or 'pago' in pregunta:
        respuesta = "Según el Artículo 8 del Código del Trabajo, las prácticas no constituyen contrato de trabajo remunerado obligatorio. Sin embargo, las empresas en PRACNET suelen otorgar asignaciones de movilización y colación (en promedio $200.000 a $300.000 CLP)."
    elif 'horas' in pregunta or 'duracion' in pregunta:
        respuesta = "Las prácticas profesionales estándar en la USM requieren generalmente 180 horas (primera práctica) o 360 horas (práctica industrial/profesional completa). Verifica el requisito específico de tu carrera en tu perfil académico."
    else:
        respuesta = f"Respecto a tu consulta: '{pregunta}', recuerda que puedes revisar el estado de tu expediente en la sección 'Validación' o consultar directamente a la secretaría de tu carrera mediante la opción de contacto de PRACNET."
        
    return jsonify({'respuesta': respuesta})
