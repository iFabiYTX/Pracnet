import os
from flask import Flask, redirect, url_for, render_template
from app.config import Config
from app.database import init_db
from app.security import add_security_headers

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Asegurar que la carpeta de subidas existe
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Inicializar Base de Datos
    init_db()
    
    # Registrar Blueprints
    from app.auth import auth_bp
    from app.routes_admin import admin_bp
    from app.routes_student import student_bp
    from app.routes_empresa import empresa_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(empresa_bp)
    
    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))
        
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('500.html'), 500

    # Inyección de headers de seguridad HTTP OWASP en cada respuesta
    @app.after_request
    def apply_security_headers(response):
        return add_security_headers(response)
        
    return app
