import os

class Config:
    SECRET_KEY = os.environ.get('PRACNET_SECRET_KEY', 'pracnet_usm_innovation_secret_key_2026_secured')
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, 'pracnet.db')
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'png', 'jpg'}
    
    # Cookie & Session Security
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False  # Set to True when in HTTPS
    PERMANENT_SESSION_LIFETIME = 3600 * 8  # 8 hours
