import re
from functools import wraps
from flask import session, redirect, url_for, flash, abort, request
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from app.config import Config

def hash_password(password: str) -> str:
    """Hash password using Werkzeug's secure hash algorithm."""
    return generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

def verify_password(hashed_password: str, password: str) -> bool:
    """Verify password against hash."""
    return check_password_hash(hashed_password, password)

def validate_rut_chileno(rut: str) -> bool:
    """
    Valida un RUT chileno utilizando el algoritmo del Módulo 11.
    Acepta formatos como 12.345.678-9, 12345678-9, 123456789.
    """
    if not rut or not isinstance(rut, str):
        return False
    
    # Limpiar puntos y guiones
    clean_rut = re.sub(r'[^0-9kK]', '', rut).upper()
    if len(clean_rut) < 8 or len(clean_rut) > 9:
        return False
    
    cuerpo = clean_rut[:-1]
    dv_ingresado = clean_rut[-1]
    
    # Algoritmo Módulo 11
    suma = 0
    multiplicador = 2
    for d in reversed(cuerpo):
        suma += int(d) * multiplicador
        multiplicador = 2 if multiplicador == 7 else multiplicador + 1
        
    resto = suma % 11
    dv_esperado = 11 - resto
    
    if dv_esperado == 11:
        dv_calculado = '0'
    elif dv_esperado == 10:
        dv_calculado = 'K'
    else:
        dv_calculado = str(dv_esperado)
        
    return dv_calculado == dv_ingresado

def format_rut(rut: str) -> str:
    """Formatea un RUT a formato estándar XX.XXX.XXX-X."""
    clean = re.sub(r'[^0-9kK]', '', rut).upper()
    if len(clean) < 2:
        return clean
    cuerpo = clean[:-1]
    dv = clean[-1]
    # Invertir y agregar puntos cada 3 dígitos
    cuerpo_rev = cuerpo[::-1]
    partes = [cuerpo_rev[i:i+3] for i in range(0, len(cuerpo_rev), 3)]
    cuerpo_formateado = '.'.join(partes)[::-1]
    return f"{cuerpo_formateado}-{dv}"

def allowed_file(filename: str) -> bool:
    """Verifica si la extensión del archivo está permitida."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def sanitize_safe_filename(filename: str) -> str:
    """Retorna un nombre de archivo seguro y normalizado."""
    return secure_filename(filename)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Por favor inicia sesión para acceder a esta sección.', 'warning')
            return redirect(url_for('auth.login', next=request.path))
        return f(*args, **kwargs)
    return decorated_function

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                flash('Por favor inicia sesión.', 'warning')
                return redirect(url_for('auth.login'))
            if session.get('rol') not in allowed_roles:
                flash('No tienes permisos suficientes para acceder a este módulo.', 'danger')
                return redirect(url_for('auth.unauthorized'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def add_security_headers(response):
    """Agrega cabeceras de seguridad HTTP recomendadas para OWASP."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response
