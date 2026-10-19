import unittest
import os
from app import create_app
from app.database import init_db
from app.seed_data import seed_database

class TestPracnetApp(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        seed_database()

    def test_homepage_redirects_to_login(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 302)
        self.assertTrue('/login' in res.location)

    def test_login_jefe_carrera(self):
        res = self.client.post('/login', data={
            'email': 'jefe@pracnet.cl',
            'password': 'jefe2026'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Panel de administraci', res.data)
        self.assertIn(b'PR\xc3\x81CTICAS ACTIVAS', res.data)

    def test_login_student(self):
        res = self.client.post('/login', data={
            'email': 'alumno@pracnet.cl',
            'password': 'alumno2026'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Oportunidades Disponibles', res.data)

    def test_rbac_student_blocked_from_admin(self):
        # Iniciar sesión como alumno
        self.client.post('/login', data={
            'email': 'alumno@pracnet.cl',
            'password': 'alumno2026'
        })
        # Intentar acceder a panel de administración
        res = self.client.get('/admin/dashboard', follow_redirects=True)
        self.assertIn(b'No tienes permisos suficientes', res.data)

    def test_ai_assistant_endpoint(self):
        # Iniciar sesión como alumno
        self.client.post('/login', data={
            'email': 'alumno@pracnet.cl',
            'password': 'alumno2026'
        })
        res = self.client.post('/estudiante/asistente-ai', json={'pregunta': '¿Cómo funciona el seguro escolar?'})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('Ley N° 16.744', data['respuesta'])

    def test_admin_matching_recommendation(self):
        self.client.post('/login', data={
            'email': 'jefe@pracnet.cl',
            'password': 'jefe2026'
        })
        res = self.client.get('/admin/recomendacion')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Motor de Recomendaci', res.data)
        self.assertIn(b'Match', res.data)
        self.assertIn(b'Banco Estado', res.data)

    def test_admin_reports_export_excel(self):
        self.client.post('/login', data={
            'email': 'jefe@pracnet.cl',
            'password': 'jefe2026'
        })
        res = self.client.get('/admin/reportes/exportar/excel')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers['Content-Type'], 'text/csv; charset=utf-8')
        self.assertIn(b'Folio;Estudiante;RUT;Carrera', res.data)

    def test_empresa_token_access_valid(self):
        # Acceso con token válido
        res = self.client.get('/empresa/portal/tWPPZe1XNrbGswiCchORWA')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Acceso Seguro por Token', res.data)
        self.assertIn(b'Tech Solutions', res.data)
        self.assertIn(b'Postulantes a esta Vacante', res.data)

    def test_empresa_token_access_invalid(self):
        # Acceso con token no existente
        res = self.client.get('/empresa/portal/token_falso_invalido_123')
        self.assertEqual(res.status_code, 404)
        self.assertIn(b'Token No V', res.data)

    def test_empresa_decision_aceptar_postulante(self):
        # Tomar decisión sobre postulación
        res = self.client.post(
            '/empresa/portal/tWPPZe1XNrbGswiCchORWA/postulante/2/decision',
            data={'decision': 'aceptar', 'observacion': 'Entrevista fijada para el viernes'},
            follow_redirects=True
        )
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'aceptado/a para proceso de entrevista', res.data)

    def test_login_docente_alias(self):
        res = self.client.post('/login', data={
            'email': 'docente@pracnet.cl',
            'password': 'docente2026'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Panel de administraci', res.data)

    def test_password_recovery_success(self):
        res = self.client.post('/recuperar-password', data={
            'email': 'alumno@pracnet.cl'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'clave temporal', res.data)

    def test_student_messaging(self):
        # Iniciar sesión como alumno
        self.client.post('/login', data={
            'email': 'alumno@pracnet.cl',
            'password': 'alumno2026'
        })
        # Ver bandeja
        res = self.client.get('/estudiante/mensajes')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Mensajer\xc3\xada Institucional', res.data)
        
        # Enviar mensaje
        res = self.client.post('/estudiante/mensajes', data={
            'asunto': 'Duda con timbraje Formulario 6000 B',
            'cuerpo': 'Estimada Coordinación, ¿el timbre puede ser digital o debe ser físico?'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Mensaje enviado exitosamente', res.data)

    def test_admin_document_signing(self):
        # Login como docente
        self.client.post('/login', data={
            'email': 'docente@pracnet.cl',
            'password': 'docente2026'
        })
        # Listar documentos
        res = self.client.get('/admin/documentos')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Revisi\xc3\xb3n y Firma de Documentos', res.data)

        # Firmar documento id 1
        res = self.client.post('/admin/documentos/1/firmar', follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'firmado digitalmente y aprobado', res.data)

    def test_admin_document_rejection(self):
        # Login como docente
        self.client.post('/login', data={
            'email': 'docente@pracnet.cl',
            'password': 'docente2026'
        })
        # Rechazar documento id 2
        res = self.client.post('/admin/documentos/2/rechazar', data={
            'motivo': 'Falta firma del tutor laboral'
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'rechazado con observaci', res.data)

    def test_student_download_template_6000b(self):
        self.client.post('/login', data={
            'email': 'alumno@pracnet.cl',
            'password': 'alumno2026'
        })
        res = self.client.get('/estudiante/plantilla/formulario-6000b')
        self.assertEqual(res.status_code, 200)
        self.assertTrue('application/pdf' in res.headers.get('Content-Type', ''))

if __name__ == '__main__':
    unittest.main()

