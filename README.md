# PRACNET - Plataforma Digital para la Optimización del Acceso y Gestión de Prácticas Profesionales Universitarias

> **Universidad Técnica Federico Santa María (USM)**  
> **Asignatura:** Gestión de la Innovación  
> **Equipo de Desarrollo:** Fabian Acuña, Fernando Gutierrez, Fernando Dejaiffe, Francisco Tapia  
> **Versión:** 1.0.0 (Primer Borrador Funcional, Seguro y Auditado)

---

## 📌 1. Visión General
**PRACNET** es una solución tecnológica multiplataforma diseñada para democratizar el acceso a prácticas profesionales en la educación superior chilena, eliminando la dependencia del "pituto" o redes de contacto informales, y optimizando los procesos administrativos de validación, seguimiento y trazabilidad institucional (SIGA / Formulario 6000 B / Seguro Escolar Ley N° 16.744).

---

## 🛡️ 2. Arquitectura de Seguridad y Confianza (OWASP & Marco Chileno)

Siguiendo las directrices de la **Factibilidad Técnica**, este primer borrador prioriza **funcionalidad, seguridad, confiabilidad y trazabilidad**:

1. **Autenticación Criptográfica:**
   - Contraseñas almacenadas mediante hashing robusto (`pbkdf2:sha256` con salt aleatorio de 16 bytes).
   - Prevención de ataques de fuerza bruta y almacenamiento seguro de credenciales.
2. **Validación Formal de Identidad (Algoritmo Módulo 11):**
   - Validación matemática estricta del RUT chileno y formateo estandarizado `XX.XXX.XXX-X` para prevenir registros fraudulentos.
3. **Control de Acceso Basado en Roles (RBAC):**
   - Segregación estricta entre `estudiante`, `jefe_carrera`, `admin` y `empresa` mediante decoradores `@login_required` y `@role_required`.
   - Protección contra navegación forzada o escalamiento de privilegios.
4. **Protección contra Inyecciones SQL:**
   - 100% de las consultas a base de datos están parametrizadas (`prepared statements`), mitigando inyecciones maliciosas.
5. **Cabeceras de Seguridad HTTP (OWASP):**
   - Inyección automática de `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection` y `Referrer-Policy`.
   - Cookies de sesión con atributos `HttpOnly` y `SameSite=Lax`.
6. **Gestión Documental Segura:**
   - Whitelist estricta de extensiones permitidas (`.pdf`, `.doc`, `.docx`).
   - Normalización de nombres de archivo mediante `secure_filename` y prefijos únicos para mitigar ataques de *Path Traversal*.
7. **Trazabilidad y Bitácora de Auditoría:**
   - Registro automático de cada inicio de sesión, cambio de estado de postulación y carga de documentos con marca de tiempo e IP.
8. **Cumplimiento Legal y Privacidad (Ley N° 19.628):**
   - Consentimiento informado explícito en el registro para el tratamiento de antecedentes académicos y resguardo de datos personales.

---

## 🚀 3. Instrucciones de Ejecución Rápida

### Requisitos Previos
- Python 3.10+ (ya instalado en el entorno)
- Dependencias estándar (Flask, Werkzeug, Jinja2 ya presentes en el sistema)

### Iniciar la Plataforma
En la terminal PowerShell de la carpeta del proyecto:
```powershell
python run.py
```
El servidor se iniciará en:
👉 **`http://127.0.0.1:5000`**

### Ejecutar Pruebas Automatizadas de Seguridad y Funcionalidad
```powershell
python test_security.py
python test_app.py
```
*(Ambas suites verifican integridad matemática de RUTs, hashing, defensas SQL, sesiones y endpoints).*

---

## 🔑 4. Cuentas de Acceso Preconfiguradas (Demostración)

La barra superior de la aplicación incluye accesos directos (*Quick Login*) con 1 solo clic para evaluar cada vista:

| Rol | Correo Electrónico | Contraseña | Perfil / Vista |
| :--- | :--- | :--- | :--- |
| **Jefe de Carrera (Informática)** | `jefe.informatica@usm.cl` | `usm2026` | Panel Web de Jefatura (Monitor, Ofertas, Matching, Reportes) |
| **Jefa de Carrera (Prevención)** | `jefe.prevencion@usm.cl` | `usm2026` | Panel Web de Jefatura |
| **Jefe de Carrera (Manufactura)** | `jefe.manufactura@usm.cl` | `usm2026` | Panel Web de Jefatura |
| **Estudiante Demo** | `carlos.mendoza@alumnos.usm.cl` | `alumno2026` | Portal Móvil (Muro, Postulaciones, Validación, Asistente AI) |
| **Empresa (Acceso por Token Copec)** | *Sin usuario/clave* | *Token Único* | [Portal Empresa](http://127.0.0.1:5000/empresa/portal/tWPPZe1XNrbGswiCchORWA) (Gestión de postulantes, Aceptar/Rechazar con feedback) |
| **Administrador Central** | `admin@pracnet.cl` | `admin2026` | Gestión Integral del Sistema |

---

## 🔑 5. Sistema de Tokens Seguros para Empresas (Estilo Magic Link / Copec)

Para evitar que las empresas tengan que crear y recordar usuarios/claves para cada práctica, PRACNET implementa un sistema de **Tokens Criptográficos Únicos por Oferta** (`secrets.token_urlsafe(16)`):

1. **Acceso sin Fricción:** La empresa recibe un enlace seguro por correo institucional (ej: `/empresa/portal/tWPPZe1XNrbGswiCchORWA`).
2. **Visualización de Postulantes:** Ve únicamente los estudiantes que postularon a esa vacante, con su avance de malla, habilidades y CV.
3. **Decisión con 1 Clic:**
   - **✓ Aceptar / Agendar Entrevista:** Avanza al estudiante a la fase *En Selección / Entrevista Técnica Realizada* y le envía las instrucciones.
   - **✗ Rechazar con Retroalimentación:** Permite dejar una nota constructiva al estudiante (ej: *brechas técnicas detectadas*), resolviendo directamente el dolor planteado por los tres jefes de carrera en el informe de investigación.
4. **Notificación en Tiempo Real:** El estudiante recibe la notificación en su aplicación móvil al instante.

---

## 📱 5. Módulos Desarrollados (Alineados con Mockups)

### A. Vista Administrativa / Jefatura de Carrera (Mockup Web 9.2)
1. **Panel de Administración (Dashboard):** 4 tarjetas KPI con monitor en tiempo real (Prácticas activas, Alumnos habilitados +70%, Postulaciones hoy, Convenios empresas) y bitácora de actividad reciente.
2. **Gestión de Ofertas de Prácticas:** Catálogo interactivo de ofertas, estados (*Activa*, *Borrador*), acciones de edición/pausa y modal para publicar nuevas convocatorias.
3. **Motor de Recomendación Inteligente:** Algoritmo que cruza habilidades declaradas del estudiante y avance de malla contra los requerimientos de la oferta, calculando el `% Match` (ej: 95% Match con Tech Solutions) y botón para *Notificar Alumno*.
4. **Seguimiento de Postulaciones:** Tabla de expedientes con avance curricular, fases administrativas (*Pendiente Seguro Escolar*, *Carta Presentación Emitida*, *Entrevista Realizada*, *Práctica Iniciada*) y modal para auditar documentos y actualizar estados.
5. **Generación de Reportes e Indicadores:** Gráficos analíticos con Chart.js (distribución por área, embudo de estados, top empresas contratantes, tasa de retención post-práctica del 38%) y exportación descargable a **Excel (CSV compatible)** e **impresión PDF**.

### B. Portal del Estudiante (Mockup Móvil 9.1)
1. **Muro de Oportunidades:** Tarjetas de vacantes con filtros dinámicos (ubicación, área, modalidad Híbrido/Remoto/Presencial, remuneración) y botón directo de postulación que valida avance curricular mínimo.
2. **Validación de la Práctica:** Barra de progreso porcentual, guía paso a paso con checklist (*Inscripción*, *Seguro Escolar Ley 16.744*, *Validación de Horas*, *Informe Final*) y módulo de subida segura de expedientes.
3. **Asistente AI Interactivo:** Modal de chatbot que responde dudas frecuentes sobre requisitos de convalidación institucional en SIGA, el seguro de accidentes de trabajo y normativas laborales.
4. **Seguimiento en Tiempo Real:** Línea de tiempo vertical que muestra el avance de la postulación (*Postulado* ➔ *En Selección* ➔ *Validación Académica* ➔ *Aprobado*).
5. **Perfil del Estudiante:** Ficha académica con RUT verificado, semestre, avance de malla y módulo de privacidad y derechos ARCO (Ley N° 19.628).
