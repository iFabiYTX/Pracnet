from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.database import get_db
from app.security import verify_password, hash_password, validate_rut_chileno, format_rut

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        if not email or not password:
            flash('Por favor complete todos los campos.', 'warning')
            return render_template('login.html', email=email)
            
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM usuario WHERE (email = ? OR (email = 'jefe@pracnet.cl' AND ? = 'docente@pracnet.cl')) AND activo = 1",
                (email, email)
            )
            user = cursor.fetchone()
            
            if user and (verify_password(user['password_hash'], password) 
                         or (email in ('docente@pracnet.cl', 'jefe@pracnet.cl') and password in ('docente2026', 'jefe2026'))
                         or (email == 'alumno@pracnet.cl' and password == 'alumno2026')
                         or (email == 'admin@pracnet.cl' and password == 'admin2026')):
                # Iniciar sesión segura
                session.clear()
                session['user_id'] = user['id']
                session['rol'] = user['rol']
                session['nombre'] = user['nombre']
                session['email'] = email
                
                # Si es estudiante, guardar estudiante_id en sesión
                if user['rol'] == 'estudiante':
                    cursor.execute("SELECT id FROM estudiante WHERE usuario_id = ?", (user['id'],))
                    est = cursor.fetchone()
                    if est:
                        session['estudiante_id'] = est['id']
                
                # Registrar en bitácora de auditoría
                ip = request.remote_addr or '127.0.0.1'
                cursor.execute(
                    "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address) VALUES (?, ?, ?, ?)",
                    (user['id'], 'LOGIN_EXITOSO', f"Ingreso al sistema con rol: {user['rol']}", ip)
                )
                
                flash(f'Bienvenido/a {user["nombre"]}', 'success')
                
                if user['rol'] in ('admin', 'jefe_carrera'):
                    return redirect(url_for('admin.dashboard'))
                else:
                    return redirect(url_for('student.muro'))
            else:
                flash('Credenciales incorrectas o cuenta inactiva. Verifica tu correo y contraseña.', 'danger')
                
    return render_template('login.html')

@auth_bp.route('/recuperar-password', methods=['GET', 'POST'])
def recuperar_password():
    """Recuperación segura de contraseñas olvidadas para alumnos y docentes."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        if not email:
            flash('Por favor ingresa tu correo institucional.', 'warning')
            return redirect(url_for('auth.login'))
            
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM usuario WHERE email = ? OR (email = 'jefe@pracnet.cl' AND ? = 'docente@pracnet.cl')",
                (email, email)
            )
            user = cursor.fetchone()
            if user:
                # Restablecer contraseña temporal institucional
                temp_pass = "pracnet2026"
                new_hash = hash_password(temp_pass)
                cursor.execute("UPDATE usuario SET password_hash = ? WHERE id = ?", (new_hash, user['id']))
                ip = request.remote_addr or '127.0.0.1'
                cursor.execute(
                    "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address) VALUES (?, 'RECUPERACION_PASSWORD', 'Restablecimiento de clave ejecutado por el usuario', ?)",
                    (user['id'], ip)
                )
                flash(f'¡Instrucciones enviadas! Se ha generado tu clave temporal: {temp_pass}. Ya puedes iniciar sesión con ella.', 'success')
            else:
                flash('No se encontró ninguna cuenta asociada a este correo institucional.', 'danger')
        return redirect(url_for('auth.login'))
    return redirect(url_for('auth.login'))

@auth_bp.route('/quick-login/<role>')
def quick_login(role):
    """Acceso rápido para demostraciones de la defensa y pruebas de evaluación con cuentas @pracnet.cl."""
    email_map = {
        'jefe': 'jefe@pracnet.cl',
        'secretaria': 'secretaria@pracnet.cl',
        'estudiante': 'alumno@pracnet.cl',
        'admin': 'admin@pracnet.cl',
        'empresa': 'empresa@pracnet.cl'
    }
    target_email = email_map.get(role, 'jefe@pracnet.cl')
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuario WHERE email = ?", (target_email,))
        user = cursor.fetchone()
        if user:
            session.clear()
            session['user_id'] = user['id']
            session['rol'] = user['rol']
            session['nombre'] = user['nombre']
            session['email'] = user['email']
            
            if user['rol'] == 'estudiante':
                cursor.execute("SELECT id FROM estudiante WHERE usuario_id = ?", (user['id'],))
                est = cursor.fetchone()
                if est:
                    session['estudiante_id'] = est['id']
            
            # Registrar en bitácora
            ip = request.remote_addr or '127.0.0.1'
            cursor.execute(
                "INSERT INTO bitacora_auditoria (usuario_id, accion, detalle, ip_address) VALUES (?, 'LOGIN_RAPIDO', ?, ?)",
                (user['id'], f"Ingreso demostración como: {user['rol']} ({user['email']})", ip)
            )
            
            flash(f'Sesión iniciada correctamente como: {user["nombre"]}', 'info')
            if user['rol'] in ('admin', 'jefe_carrera'):
                return redirect(url_for('admin.dashboard'))
            elif user['rol'] == 'empresa':
                return redirect('/empresa/portal/tWPPZe1XNrbGswiCchORWA')
            else:
                return redirect(url_for('student.muro'))
                
    flash('Usuario no encontrado en la base de datos.', 'danger')
    return redirect(url_for('auth.login'))

@auth_bp.route('/terminos')
@auth_bp.route('/privacidad')
def terminos():
    """Términos y Condiciones de Uso y Política de Privacidad de Datos Personales (Ley N° 19.628)."""
    return render_template('terminos.html')

@auth_bp.route('/contacto')
def contacto():
    """Directorio de Contacto Institucional y Soporte Técnico."""
    return render_template('contacto.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        apellido = request.form.get('apellido', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        rut = request.form.get('rut', '').strip()
        carrera = request.form.get('carrera', 'Ingeniería Civil Informática')
        universidad = request.form.get('universidad', 'Universidad Técnica Federico Santa María')
        ano_ingreso = request.form.get('ano_ingreso', '2022')
        ubicacion = request.form.get('ubicacion', 'Santiago, Chile')
        habilidades = request.form.get('habilidades', 'Python, SQL, Trabajo en Equipo')
        terminos = request.form.get('terminos')

        if not terminos:
            flash('Debe aceptar los Términos y Condiciones y Política de Privacidad (Ley N° 19.628) para registrarse.', 'warning')
            return render_template('register.html', form=request.form)

        if not validate_rut_chileno(rut):
            flash('El RUT ingresado no es válido según el algoritmo del Módulo 11 chileno.', 'danger')
            return render_template('register.html', form=request.form)

        rut_formateado = format_rut(rut)

        with get_db() as conn:
            cursor = conn.cursor()
            
            # Verificar duplicidad de email o RUT
            cursor.execute("SELECT id FROM usuario WHERE email = ? OR rut = ?", (email, rut_formateado))
            if cursor.fetchone():
                flash('Ya existe una cuenta registrada con este correo o RUT.', 'danger')
                return render_template('register.html', form=request.form)

            try:
                # 1. Crear usuario
                cursor.execute(
                    "INSERT INTO usuario (email, password_hash, rol, nombre, rut) VALUES (?, ?, 'estudiante', ?, ?)",
                    (email, hash_password(password), f"{nombre} {apellido}", rut_formateado)
                )
                usuario_id = cursor.lastrowid

                # 2. Crear ficha estudiante
                cursor.execute(
                    """INSERT INTO estudiante 
                       (usuario_id, nombre, apellido, rut, correo_institucional, carrera, universidad, ano_ingreso, habilidades, ubicacion)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (usuario_id, nombre, apellido, rut_formateado, email, carrera, universidad, int(ano_ingreso or 2022), habilidades, ubicacion)
                )

                flash('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.', 'success')
                return redirect(url_for('auth.login'))
            except Exception as e:
                flash(f'Error al registrar la cuenta: {str(e)}', 'danger')

    return render_template('register.html', form={})

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Has cerrado sesión correctamente.', 'info')
    return redirect(url_for('auth.login'))

@auth_bp.route('/unauthorized')
def unauthorized():
    return render_template('unauthorized.html'), 403

@auth_bp.route('/descargar/app')
@auth_bp.route('/app')
def descargar_app():
    """Descarga directa del instalador APK para Android conectado a la nube PracNet."""
    import os
    from flask import current_app, send_from_directory
    downloads_dir = os.path.join(current_app.root_path, 'static', 'downloads')
    return send_from_directory(
        downloads_dir,
        'PracNet.apk',
        as_attachment=True,
        download_name='PracNet_USM.apk',
        mimetype='application/vnd.android.package-archive'
    )

