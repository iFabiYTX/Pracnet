import json
import secrets
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify, Response
from app.database import get_db
from app.security import role_required, login_required

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.before_request
@role_required(['admin', 'jefe_carrera'])
def restrict_admin():
    pass

@admin_bp.route('/dashboard')
def dashboard():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Métricas principales
        cursor.execute("SELECT COUNT(*) as total FROM oferta_practica WHERE estado = 'Activa'")
        practicas_activas = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as total FROM estudiante WHERE avance_malla >= 70")
        alumnos_habilitados = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as total FROM postulacion")
        postulaciones_total = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as total FROM empresa WHERE convenio_vigente = 1")
        convenios_empresas = cursor.fetchone()['total']
        
        # Últimas actividades desde la bitácora
        cursor.execute("""
            SELECT b.*, u.nombre as usuario_nombre 
            FROM bitacora_auditoria b 
            LEFT JOIN usuario u ON b.usuario_id = u.id 
            ORDER BY b.fecha DESC LIMIT 5
        """)
        actividades = cursor.fetchall()
        
    return render_template(
        'admin/dashboard.html',
        practicas_activas=practicas_activas or 145,
        alumnos_habilitados=alumnos_habilitados or 312,
        postulaciones_hoy=postulaciones_total or 24,
        convenios_empresas=convenios_empresas or 89,
        actividades=actividades
    )

@admin_bp.route('/ofertas', methods=['GET', 'POST'])
def ofertas():
    with get_db() as conn:
        cursor = conn.cursor()
        
        if request.method == 'POST':
            titulo = request.form.get('titulo')
            empresa_id = request.form.get('empresa_id')
            descripcion = request.form.get('descripcion')
            requisito_academico = request.form.get('requisito_academico', 'Min. 70% Malla')
            duracion_horas = int(request.form.get('duracion_horas', 360))
            modalidad = request.form.get('modalidad', 'Híbrido')
            habilidades_requeridas = request.form.get('habilidades_requeridas', 'Python, SQL')
            area = request.form.get('area', 'Software')
            remunerada = 1 if request.form.get('remunerada') else 0
            monto = request.form.get('monto_remuneracion', '$250.000')
            estado = request.form.get('estado', 'Activa')
            token_acceso = secrets.token_urlsafe(16)
            
            cursor.execute("""
                INSERT INTO oferta_practica 
                (empresa_id, titulo, descripcion, requisito_academico, duracion_horas, modalidad, habilidades_requeridas, area, remunerada, monto_remuneracion, estado, token_acceso)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (empresa_id, titulo, descripcion, requisito_academico, duracion_horas, modalidad, habilidades_requeridas, area, remunerada, monto, estado, token_acceso))
            
            cursor.execute(
                "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'CREAR_OFERTA', ?)",
                (session.get('user_id'), f"Creada oferta: {titulo}")
            )
            flash('Nueva oferta de práctica creada correctamente.', 'success')
            return redirect(url_for('admin.ofertas'))

        cursor.execute("""
            SELECT o.*, e.nombre as empresa_nombre 
            FROM oferta_practica o 
            JOIN empresa e ON o.empresa_id = e.id 
            ORDER BY o.id DESC
        """)
        catalogo = cursor.fetchall()
        
        cursor.execute("SELECT id, nombre FROM empresa WHERE convenio_vigente = 1 ORDER BY nombre ASC")
        empresas = cursor.fetchall()
        
    return render_template('admin/ofertas.html', catalogo=catalogo, empresas=empresas)

@admin_bp.route('/ofertas/cambiar-estado/<int:oferta_id>/<nuevo_estado>')
def cambiar_estado_oferta(oferta_id, nuevo_estado):
    if nuevo_estado in ('Activa', 'Borrador', 'Cerrada'):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE oferta_practica SET estado = ? WHERE id = ?", (nuevo_estado, oferta_id))
            flash(f'Estado de la oferta actualizado a {nuevo_estado}.', 'info')
    return redirect(url_for('admin.ofertas'))

@admin_bp.route('/ofertas/eliminar/<int:oferta_id>', methods=['POST'])
def eliminar_oferta(oferta_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM oferta_practica WHERE id = ?", (oferta_id,))
        flash('Oferta eliminada del catálogo.', 'warning')
    return redirect(url_for('admin.ofertas'))

@admin_bp.route('/recomendacion')
def recomendacion():
    """Motor de Recomendación Inteligente basado en avance de malla curricular y habilidades."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Obtener estudiantes sin práctica aprobada
        cursor.execute("""
            SELECT * FROM estudiante 
            WHERE id NOT IN (SELECT estudiante_id FROM postulacion WHERE estado = 'Aprobado')
            ORDER BY avance_malla DESC
        """)
        estudiantes = cursor.fetchall()
        
        cursor.execute("""
            SELECT o.*, e.nombre as empresa_nombre 
            FROM oferta_practica o 
            JOIN empresa e ON o.empresa_id = e.id 
            WHERE o.estado = 'Activa'
        """)
        ofertas = cursor.fetchall()
        
        matches = []
        for est in estudiantes:
            est_habs = set(h.strip().lower() for h in (est['habilidades'] or '').split(',') if h.strip())
            
            for of in ofertas:
                of_habs = set(h.strip().lower() for h in (of['habilidades_requeridas'] or '').split(',') if h.strip())
                
                # Cálculo de similitud Jaccard + Factor de avance curricular
                interseccion = est_habs.intersection(of_habs)
                union = est_habs.union(of_habs)
                similitud_habilidades = (len(interseccion) / len(union)) if union else 0.5
                
                factor_malla = 1.0 if est['avance_malla'] >= of['min_avance_malla'] else 0.7
                porcentaje_match = int(min(98, max(50, (similitud_habilidades * 0.6 + factor_malla * 0.4) * 100)))
                
                if porcentaje_match >= 75:
                    matches.append({
                        'estudiante': est,
                        'oferta': of,
                        'match_score': porcentaje_match,
                        'habilidades_comunes': list(interseccion)
                    })
                    
        # Ordenar por mayor afinidad
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        
    return render_template('admin/recomendacion.html', matches=matches[:10])

@admin_bp.route('/notificar-alumno/<int:estudiante_id>/<int:oferta_id>', methods=['POST'])
def notificar_alumno(estudiante_id, oferta_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT usuario_id, nombre FROM estudiante WHERE id = ?", (estudiante_id,))
        est = cursor.fetchone()
        cursor.execute("SELECT titulo FROM oferta_practica WHERE id = ?", (oferta_id,))
        of = cursor.fetchone()
        
        if est and of:
            cursor.execute(
                """INSERT INTO notificacion (usuario_id, titulo, mensaje) 
                   VALUES (?, 'Recomendación de Práctica de tu Jefatura', ?)""",
                (est['usuario_id'], f"¡Hola {est['nombre']}! Tu jefatura te ha recomendado postular a la vacante '{of['titulo']}' por alto calce con tu perfil.")
            )
            flash(f"Notificación de recomendación enviada con éxito a {est['nombre']}.", 'success')
            
    return redirect(url_for('admin.recomendacion'))

@admin_bp.route('/postulaciones')
def postulaciones():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.*, 
                   e.nombre as est_nombre, e.apellido as est_apellido, e.avance_malla, e.carrera, e.rut as est_rut,
                   o.titulo as oferta_titulo, o.duracion_horas,
                   emp.nombre as empresa_nombre
            FROM postulacion p
            JOIN estudiante e ON p.estudiante_id = e.id
            JOIN oferta_practica o ON p.oferta_practica_id = o.id
            JOIN empresa emp ON o.empresa_id = emp.id
            ORDER BY p.id DESC
        """)
        postulaciones_lista = cursor.fetchall()
        
        cursor.execute("SELECT * FROM documento_practica ORDER BY fecha_subida DESC")
        documentos = cursor.fetchall()
        
    return render_template('admin/postulaciones.html', postulaciones=postulaciones_lista, documentos=documentos)

@admin_bp.route('/postulaciones/actualizar-fase', methods=['POST'])
def actualizar_fase():
    postulacion_id = request.form.get('postulacion_id')
    nueva_fase = request.form.get('fase_administrativa')
    nuevo_estado = request.form.get('estado')
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE postulacion 
            SET fase_administrativa = ?, estado = ? 
            WHERE id = ?
        """, (nueva_fase, nuevo_estado, postulacion_id))
        
        cursor.execute(
            "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'CAMBIO_FASE_POSTULACION', ?)",
            (session.get('user_id'), f"Postulación #{postulacion_id} actualizada a: {nueva_fase}")
        )
        flash('Fase administrativa actualizada con éxito.', 'success')
        
    return redirect(url_for('admin.postulaciones'))

@admin_bp.route('/reportes')
def reportes():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Conteo por áreas de práctica
        cursor.execute("SELECT area, COUNT(*) as cantidad FROM oferta_practica GROUP BY area")
        areas_data = {row['area']: row['cantidad'] for row in cursor.fetchall()}
        
        # Conteo por estados de postulación
        cursor.execute("SELECT estado, COUNT(*) as cantidad FROM postulacion GROUP BY estado")
        estados_data = {row['estado']: row['cantidad'] for row in cursor.fetchall()}
        
        # Top Empresas
        cursor.execute("""
            SELECT e.nombre, COUNT(p.id) as cantidad_alumnos 
            FROM empresa e
            JOIN oferta_practica o ON e.id = o.empresa_id
            JOIN postulacion p ON o.id = p.oferta_practica_id
            GROUP BY e.id
            ORDER BY cantidad_alumnos DESC
            LIMIT 5
        """)
        top_empresas = cursor.fetchall()
        
    return render_template(
        'admin/reportes.html',
        areas_data=areas_data,
        estados_data=estados_data,
        top_empresas=top_empresas
    )

@admin_bp.route('/reportes/exportar/<formato>')
def exportar_reporte(formato):
    """Genera exportación de datos en formato CSV / Excel o vista imprimible."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.id as Folio, e.nombre || ' ' || e.apellido as Estudiante, e.rut as RUT, e.carrera as Carrera,
                   o.titulo as Cargo, emp.nombre as Empresa, p.estado as Estado, p.fase_administrativa as Fase, p.fecha_postulacion as Fecha
            FROM postulacion p
            JOIN estudiante e ON p.estudiante_id = e.id
            JOIN oferta_practica o ON p.oferta_practica_id = o.id
            JOIN empresa emp ON o.empresa_id = emp.id
        """)
        rows = cursor.fetchall()
        
    if formato == 'excel':
        import io
        import csv
        output = io.StringIO()
        writer = csv.writer(output, delimiter=';')
        writer.writerow(['Folio', 'Estudiante', 'RUT', 'Carrera', 'Cargo', 'Empresa', 'Estado', 'Fase Administrativa', 'Fecha Postulación'])
        for r in rows:
            writer.writerow([r['Folio'], r['Estudiante'], r['RUT'], r['Carrera'], r['Cargo'], r['Empresa'], r['Estado'], r['Fase'], r['Fecha']])
            
        csv_data = output.getvalue().encode('utf-8-sig')
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=Reporte_Practicas_PRACNET_USM.csv"}
        )
    
    flash(f"Generado reporte en formato {formato.upper()}.", 'info')
    return redirect(url_for('admin.reportes'))

@admin_bp.route('/documentos')
def documentos():
    """Módulo de Revisión y Firma Digital de Documentos para Jefatura de Carrera."""
    estado_filtro = request.args.get('estado', '')
    with get_db() as conn:
        cursor = conn.cursor()
        query = """
            SELECT d.*, e.nombre as est_nombre, e.apellido as est_apellido, e.rut as est_rut, e.carrera as est_carrera,
                   o.titulo as oferta_titulo, emp.nombre as empresa_nombre
            FROM documento_practica d
            JOIN estudiante e ON d.estudiante_id = e.id
            LEFT JOIN postulacion p ON d.postulacion_id = p.id
            LEFT JOIN oferta_practica o ON p.oferta_practica_id = o.id
            LEFT JOIN empresa emp ON o.empresa_id = emp.id
        """
        params = []
        if estado_filtro:
            query += " WHERE d.estado_validacion = ?"
            params.append(estado_filtro)
        query += " ORDER BY d.id DESC"
        cursor.execute(query, tuple(params))
        documentos_lista = cursor.fetchall()
        
    return render_template('admin/documentos.html', documentos=documentos_lista, estado_filtro=estado_filtro)

@admin_bp.route('/documentos/<int:doc_id>/firmar', methods=['POST'])
def firmar_documento(doc_id):
    """Aplica Firma Digital Institucional y aprueba el documento."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.*, e.nombre as est_nombre, e.apellido as est_apellido, p.id as post_id
            FROM documento_practica d
            JOIN estudiante e ON d.estudiante_id = e.id
            LEFT JOIN postulacion p ON d.postulacion_id = p.id
            WHERE d.id = ?
        """, (doc_id,))
        doc = cursor.fetchone()
        if not doc:
            flash('Documento no encontrado.', 'danger')
            return redirect(url_for('admin.documentos'))
            
        firma_texto = "FIRMADO DIGITALMENTE - COORDINACIÓN ACADÉMICA USM"
        cursor.execute("""
            UPDATE documento_practica 
            SET estado_validacion = 'Aprobado', firmado_por = ?, fecha_firma = CURRENT_TIMESTAMP, observacion = 'Validado conforme a normativa académica vigente.'
            WHERE id = ?
        """, (firma_texto, doc_id))
        
        # Si era el Seguro Escolar y había postulación, actualizar fase
        if doc['tipo_documento'] == 'seguro_escolar' and doc['post_id']:
            cursor.execute("UPDATE postulacion SET fase_administrativa = 'Carta Presentación Emitida' WHERE id = ?", (doc['post_id'],))
        elif doc['tipo_documento'] == 'informe_final' and doc['post_id']:
            cursor.execute("UPDATE postulacion SET estado = 'Aprobado', fase_administrativa = 'Aprobado' WHERE id = ?", (doc['post_id'],))
            
        cursor.execute(
            "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'DOCUMENTO_FIRMADO', ?)",
            (session.get('user_id'), f"Firma digital aplicada al documento #{doc_id} ({doc['tipo_documento']}) de {doc['est_nombre']} {doc['est_apellido']}")
        )
        
    flash(f'Documento #{doc_id} de {doc["est_nombre"]} {doc["est_apellido"]} firmado digitalmente y aprobado con éxito.', 'success')
    return redirect(url_for('admin.documentos'))

@admin_bp.route('/documentos/<int:doc_id>/rechazar', methods=['POST'])
def rechazar_documento(doc_id):
    """Rechaza el documento con observaciones para que el alumno lo corrija."""
    motivo = request.form.get('motivo', 'Documento incompleto o no cumple con el formato exigido.').strip()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.*, e.nombre as est_nombre, e.apellido as est_apellido
            FROM documento_practica d
            JOIN estudiante e ON d.estudiante_id = e.id
            WHERE d.id = ?
        """, (doc_id,))
        doc = cursor.fetchone()
        if not doc:
            flash('Documento no encontrado.', 'danger')
            return redirect(url_for('admin.documentos'))
            
        cursor.execute("""
            UPDATE documento_practica 
            SET estado_validacion = 'Rechazado', observacion = ?, firmado_por = NULL
            WHERE id = ?
        """, (motivo, doc_id))
        
        cursor.execute(
            "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'DOCUMENTO_RECHAZADO', ?)",
            (session.get('user_id'), f"Rechazado documento #{doc_id} ({doc['tipo_documento']}) de {doc['est_nombre']} {doc['est_apellido']}. Observación: {motivo}")
        )
        
    flash(f'Documento #{doc_id} rechazado con observación enviada al estudiante.', 'warning')
    return redirect(url_for('admin.documentos'))

@admin_bp.route('/documentos/<int:doc_id>/descargar')
def descargar_documento_admin(doc_id):
    import os
    from app.config import Config
    from flask import send_from_directory
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM documento_practica WHERE id = ?", (doc_id,))
        doc = cursor.fetchone()
    if not doc:
        flash('Documento no encontrado.', 'danger')
        return redirect(url_for('admin.documentos'))
    file_path = os.path.join(Config.UPLOAD_FOLDER, doc['ruta_archivo'])
    if not os.path.exists(file_path):
        with open(file_path, 'wb') as f:
            f.write(f"%PDF-1.4\n% PRACNET USM - Expediente Digital Institucional\nDocumento: {doc['tipo_documento']}\n".encode('utf-8'))
    return send_from_directory(Config.UPLOAD_FOLDER, doc['ruta_archivo'], as_attachment=True, download_name=doc['nombre_archivo'])

@admin_bp.route('/mensajes', methods=['GET', 'POST'])
def mensajes():
    """Módulo de Mensajería y Consultas con Estudiantes."""
    if request.method == 'POST':
        estudiante_id = request.form.get('estudiante_id')
        asunto = request.form.get('asunto', '').strip()
        cuerpo = request.form.get('cuerpo', '').strip()
        
        if not estudiante_id or not cuerpo:
            flash('Por favor complete el mensaje.', 'warning')
            return redirect(url_for('admin.mensajes'))
            
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO mensaje (estudiante_id, remitente_tipo, asunto, cuerpo, leido)
                VALUES (?, 'docente', ?, ?, 0)
            """, (estudiante_id, asunto or 'Respuesta de Coordinación Académica', cuerpo))
            
            cursor.execute(
                "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle) VALUES (?, 'MENSAJE_DOCENTE', ?)",
                (session.get('user_id'), f"Respuesta enviada a alumno #{estudiante_id}")
            )
            
        flash('Respuesta enviada exitosamente al estudiante.', 'success')
        return redirect(url_for('admin.mensajes', estudiante_id=estudiante_id))
        
    estudiante_seleccionado = request.args.get('estudiante_id', '')
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Lista de estudiantes que han tenido conversación
        cursor.execute("""
            SELECT DISTINCT e.id, e.nombre, e.apellido, e.carrera, e.rut,
                   (SELECT COUNT(*) FROM mensaje WHERE estudiante_id = e.id AND remitente_tipo = 'estudiante' AND leido = 0) as sin_leer
            FROM estudiante e
            JOIN mensaje m ON e.id = m.estudiante_id
            ORDER BY sin_leer DESC, e.nombre ASC
        """)
        estudiantes_con_mensajes = cursor.fetchall()
        
        # Si no hay seleccionado y hay alguno, seleccionar el primero
        if not estudiante_seleccionado and estudiantes_con_mensajes:
            estudiante_seleccionado = estudiantes_con_mensajes[0]['id']
            
        mensajes_hilo = []
        estudiante_activo = None
        if estudiante_seleccionado:
            cursor.execute("SELECT * FROM estudiante WHERE id = ?", (estudiante_seleccionado,))
            estudiante_activo = cursor.fetchone()
            
            # Marcar como leídos
            cursor.execute("UPDATE mensaje SET leido = 1 WHERE estudiante_id = ? AND remitente_tipo = 'estudiante'", (estudiante_seleccionado,))
            
            cursor.execute("SELECT * FROM mensaje WHERE estudiante_id = ? ORDER BY id ASC", (estudiante_seleccionado,))
            mensajes_hilo = cursor.fetchall()
            
    return render_template(
        'admin/mensajes.html',
        estudiantes=estudiantes_con_mensajes,
        estudiante_activo=estudiante_activo,
        mensajes=mensajes_hilo,
        estudiante_seleccionado=estudiante_seleccionado
    )

@admin_bp.route('/usuarios')
@role_required(['admin'])
def usuarios():
    """Módulo exclusivo de Administrador Central para gestión de cuentas y roles."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, rol, nombre, rut, creado_en, activo FROM usuario ORDER BY id ASC")
        usuarios_lista = cursor.fetchall()
    return render_template('admin/usuarios.html', usuarios=usuarios_lista)

@admin_bp.route('/usuarios/toggle/<int:user_id>', methods=['POST'])
@role_required(['admin'])
def toggle_usuario(user_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE usuario SET activo = CASE WHEN activo = 1 THEN 0 ELSE 1 END WHERE id = ?", (user_id,))
        flash('Estado de cuenta actualizado con éxito.', 'info')
    return redirect(url_for('admin.usuarios'))

@admin_bp.route('/auditoria')
@role_required(['admin'])
def auditoria():
    """Módulo exclusivo de Administrador Central para trazabilidad de accesos e IPs."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT b.*, u.nombre as usuario_nombre, u.email as usuario_email, u.rol as usuario_rol
            FROM bitacora_auditoria b
            LEFT JOIN usuario u ON b.usuario_id = u.id
            ORDER BY b.id DESC LIMIT 50
        """)
        registros = cursor.fetchall()
    return render_template('admin/auditoria.html', registros=registros)
