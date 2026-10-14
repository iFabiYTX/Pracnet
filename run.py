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
    print("   Cuentas de Acceso Demostracion:")
    print("   - Jefe de Carrera: jefe.informatica@usm.cl / usm2026")
    print("   - Estudiante Demo: carlos.mendoza@alumnos.usm.cl / alumno2026")
    print("   - Administrador:   admin@pracnet.cl / admin2026")
    print("=" * 65)
    
    app.run(host='127.0.0.1', port=port, debug=True)
