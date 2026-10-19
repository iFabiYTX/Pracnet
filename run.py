import os
from app import create_app
from app.seed_data import seed_database

app = create_app()

if __name__ == '__main__':
    # Poblar base de datos inicial si está vacía
    seed_database()
    
    port = int(os.environ.get('PORT', 5000))
    print("=" * 65)
    print(">> PRACNET - Plataforma de Gestion de Practicas Profesionales")
    print("   Universidad Tecnica Federico Santa Maria")
    print(f"   Servidor corriendo en: http://127.0.0.1:{port}")
    print("=" * 65)
    print("   Cuentas Oficiales @pracnet.cl:")
    print("   - Estudiante (Móvil):   alumno@pracnet.cl / alumno2026")
    print("   - Jefatura de Carrera:  jefe@pracnet.cl / jefe2026")
    print("   - Secretaría Docente:   secretaria@pracnet.cl / secre2026")
    print("   - Administrador Central: admin@pracnet.cl / admin2026")
    print("   - Enlace Mágico Empresa: http://127.0.0.1:5000/empresa/portal/tWPPZe1XNrbGswiCchORWA")
    print("=" * 65)
    
    app.run(host='127.0.0.1', port=port, debug=True)
