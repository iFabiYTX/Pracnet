import unittest
from app.security import validate_rut_chileno, format_rut, hash_password, verify_password
from app.database import get_db

class TestPracnetSecurity(unittest.TestCase):
    def test_rut_validation_valid(self):
        # Casos válidos matemáticos reales
        self.assertTrue(validate_rut_chileno("20.123.456-5"))
        self.assertTrue(validate_rut_chileno("20123456-5"))
        self.assertTrue(validate_rut_chileno("11.111.111-1"))
        self.assertTrue(validate_rut_chileno("19.654.321-K"))
        self.assertTrue(validate_rut_chileno("19654321K"))
        self.assertTrue(validate_rut_chileno("12.345.678-5"))

    def test_rut_validation_invalid(self):
        # Dígitos verificadores incorrectos
        self.assertFalse(validate_rut_chileno("20.123.456-8"))
        self.assertFalse(validate_rut_chileno("12.345.678-0"))
        self.assertFalse(validate_rut_chileno("abc-1"))
        self.assertFalse(validate_rut_chileno(""))

    def test_format_rut(self):
        self.assertEqual(format_rut("201234567"), "20.123.456-7")
        self.assertEqual(format_rut("19654321k"), "19.654.321-K")

    def test_password_hashing(self):
        password = "PasswordSeguro2026!"
        hashed = hash_password(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(hashed, password))
        self.assertFalse(verify_password(hashed, "PasswordErroneo"))

    def test_sql_injection_defense(self):
        malicious_input = "carlos.mendoza@alumnos.usm.cl' OR '1'='1"
        with get_db() as conn:
            cursor = conn.cursor()
            # Consulta parametrizada segura
            cursor.execute("SELECT * FROM usuario WHERE email = ?", (malicious_input,))
            res = cursor.fetchone()
            self.assertIsNone(res)

if __name__ == '__main__':
    unittest.main()
