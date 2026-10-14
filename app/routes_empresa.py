from flask import Blueprint, render_template, request, redirect, url_for, flash, abort
from app.database import get_db

empresa_bp = Blueprint('empresa', __name__, url_prefix='/empresa')

@empresa_bp.route('/portal/<token>')
def portal(token):
    """
    Acceso seguro y simplificado mediante Token Único (estilo Magic Link / Copec).
    La empresa accede directamente a su oferta y postulantes sin requerir registro previo.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Buscar la oferta asociada al token seguro
        cursor.execute("""
            SELECT o.*, e.nombre as empresa_nombre, e.area as empresa_area, e.correo_contacto
            FROM oferta_practica o
            JOIN empresa e ON o.empresa_id = e.id
            WHERE o.token_acceso = ?
        """, (token,))
        oferta = cursor.fetchone()
        
        if not oferta:
            flash('El enlace o token de acceso no es válido o ha expirado.', 'danger')
            return render_template('empresa/token_invalido.html'), 404
            
        # Obtener los postulantes a esta vacante
        cursor.execute("""
            SELECT p.*, 
                   e.id as estudiante_id, e.nombre as est_nombre, e.apellido as est_apellido, 
                   e.carrera, e.avance_malla, e.semestre_actual, e.habilidades, e.correo_institucional, e.telefono,
                   (SELECT nombre_archivo FROM documento_practica WHERE estudiante_id = e.id AND tipo_documento = 'curriculum' LIMIT 1) as cv_archivo
            FROM postulacion p
            JOIN estudiante e ON p.estudiante_id = e.id
            WHERE p.oferta_practica_id = ?
            ORDER BY p.id DESC
        """, (oferta['id'],))
        postulantes = cursor.fetchall()
        
    return render_template('empresa/portal.html', oferta=oferta, postulantes=postulantes, token=token)

@empresa_bp.route('/portal/<token>/postulante/<int:postulacion_id>/decision', methods=['POST'])
def tomar_decision(token, postulacion_id):
    decision = request.form.get('decision')  # 'aceptar' o 'rechazar'
    observacion = request.form.get('observacion', '').strip()
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Verificar pertenencia del token a la oferta
        cursor.execute("SELECT id, titulo FROM oferta_practica WHERE token_acceso = ?", (token,))
        oferta = cursor.fetchone()
        if not oferta:
            abort(403)
            
        # Verificar que la postulación corresponda a esta oferta
        cursor.execute("""
            SELECT p.*, e.usuario_id, e.nombre as est_nombre 
            FROM postulacion p
            JOIN estudiante e ON p.estudiante_id = e.id
            WHERE p.id = ? AND p.oferta_practica_id = ?
        """, (postulacion_id, oferta['id']))
        postulacion = cursor.fetchone()
        
        if not postulacion:
            flash('Postulación no encontrada para esta oferta.', 'danger')
            return redirect(url_for('empresa.portal', token=token))
            
        if decision == 'aceptar':
            nuevo_estado = 'En Seleccion'
            nueva_fase = 'Entrevista Técnica Realizada'
            msg_notif = f"¡Buenas noticias! La empresa ha seleccionado tu postulación para '{oferta['titulo']}'. Nota de la empresa: {observacion or 'Te contactaremos a la brevedad para coordinar la entrevista.'}"
            flash_msg = f"Postulante {postulacion['est_nombre']} aceptado/a para proceso de entrevista."
        else:
            nuevo_estado = 'Rechazado'
            nueva_fase = 'Postulación Desestimada'
            msg_notif = f"Tu postulación a '{oferta['titulo']}' no ha sido seleccionada en esta oportunidad. Retroalimentación de la empresa: {observacion or 'El perfil no coincide con los requerimientos actuales del cargo.'}"
            flash_msg = f"Postulante {postulacion['est_nombre']} rechazado/a. Se notificó la retroalimentación constructiva."
            
        cursor.execute("""
            UPDATE postulacion 
            SET estado = ?, fase_administrativa = ?, observaciones = ? 
            WHERE id = ?
        """, (nuevo_estado, nueva_fase, observacion, postulacion_id))
        
        # Enviar notificación automática al alumno
        cursor.execute("""
            INSERT INTO notificacion (usuario_id, titulo, mensaje)
            VALUES (?, 'Actualización de tu Postulación', ?)
        """, (postulacion['usuario_id'], msg_notif))
        
        # Registrar en bitácora de auditoría
        cursor.execute("""
            INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address)
            VALUES (NULL, 'DECISION_EMPRESA_TOKEN', ?, ?)
        """, (f"Empresa evaluó postulación #{postulacion_id} con resultado: {decision.upper()}", request.remote_addr or '127.0.0.1'))
        
        flash(flash_msg, 'success')
        
    return redirect(url_for('empresa.portal', token=token))
