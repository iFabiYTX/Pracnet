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
            cursor.execute("SELECT * FROM usuario WHERE email = ? AND activo = 1", (email,))
            user = cursor.fetchone()
            
            if user and verify_password(user['password_hash'], password):
                # Iniciar sesión segura
                session.clear()
                session['user_id'] = user['id']
                session['rol'] = user['rol']
                session['nombre'] = user['nombre']
                session['email'] = user['email']
                
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
                flash('Credenciales incorrectas o cuenta inactiva.', 'danger')
                
    return render_template('login.html')

@auth_bp.route('/quick-login/<role>')
def quick_login(role):
    """Acceso rápido para demostraciones de la defensa y pruebas de evaluación."""
    email_map = {
        'jefe': 'jefe.informatica@usm.cl',
        'estudiante': 'carlos.mendoza@alumnos.usm.cl',
        'admin': 'admin@pracnet.cl'
    }
    target_email = email_map.get(role, 'jefe.informatica@usm.cl')
    
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
            
            flash(f'Sesión iniciada en modo demostración como: {user["nombre"]}', 'info')
            if user['rol'] in ('admin', 'jefe_carrera'):
                return redirect(url_for('admin.dashboard'))
            else:
                return redirect(url_for('student.muro'))
                
    flash('Usuario no encontrado.', 'danger')
    return redirect(url_for('auth.login'))

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
