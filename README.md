# PRACNET v2.0 - Plataforma Digital para la Optimización del Acceso y Gestión de Prácticas Profesionales Universitarias

> **Universidad Técnica Federico Santa María (USM)**  
> **Asignatura:** Gestión de la Innovación  
> **Equipo de Desarrollo:** Fabian Acuña, Fernando Gutierrez, Fernando Dejaiffe, Francisco Tapia  
> **Versión:** 2.0.0 (Arquitectura Oficial: Node.js v22 + MySQL 8.0 + Redis 7.2 + Docker + AWS EC2)

---

## 📌 1. Visión General
**PRACNET** es una solución tecnológica multiplataforma diseñada para democratizar el acceso a prácticas profesionales en la educación superior chilena, eliminando la dependencia del "pituto" o redes de contacto informales, y optimizando los procesos administrativos de validación, seguimiento y trazabilidad institucional (SIGA / Formulario 6000 B / Seguro Escolar Ley N° 16.744).

---

## 🛡️ 2. Arquitectura de Software (Sección 5 del Informe)

* **Backend API RESTful:** Node.js v22.x (Express, Helmet OWASP, JWT, bcrypt, Pool MySQL2 con Promises).
* **Base de Datos Relacional:** MySQL 8.0.x (Motor InnoDB, codificación `utf8mb4_unicode_ci`, claves foráneas estrictas y restricciones UNIQUE).
* **Memoria y Caché de Alto Rendimiento:** Redis 7.2 (Gestión de sesiones distribuidas, tokens de enlaces mágicos y limitación de tasa).
* **Frontends:**
  * **Portal Móvil Estudiante:** React Native v0.76+ / Android App con soporte de subida de expedientes y notificaciones push.
  * **Portal Web Administrativo / Jefatura:** React v19.x con tableros interactivos y reportes.
* **Infraestructura y Nube:** Contenedores Docker orquestados con Docker Compose, Nginx Reverse Proxy y script automatizado para AWS EC2 (Ubuntu 24.04 LTS).

---

## 🗄️ 3. Estructura del Repositorio

```text
Pracnet/
├── backend/                     # API RESTful en Node.js v22.x
│   ├── src/
│   │   ├── config/              # Pool MySQL 8.0 y cliente Redis 7.2
│   │   ├── controllers/         # Lógica de negocio (Auth, Estudiante, Admin, Empresa)
│   │   ├── middlewares/         # JWT, RBAC, auditoría Ley N° 19.628
│   │   ├── routes/              # Endpoints modulares
│   │   ├── utils/               # Algoritmo Módulo 11 (RUT chileno sin fallas) y hashing
│   │   └── server.js            # Punto de entrada Express
│   ├── Dockerfile
│   └── package.json
│
├── database/                    # Capa de Persistencia Oficial
│   ├── schema.sql               # Esquema DDL normalizado para MySQL 8.0.x
│   ├── seed.sql                 # Datos iniciales (Mockups 9.1 y 9.2, alumnos y convenios USM)
│   └── redis_config.md          # Especificación de llaves, TTL y caché en Redis 7.2
│
├── deployment/                  # Infraestructura para AWS EC2
│   ├── docker-compose.yml       # Orquestación de MySQL 8, Redis 7 y Backend API
│   ├── nginx.conf               # Proxy inverso con cabeceras de seguridad OWASP
│   └── deploy_aws_ec2.sh        # Despliegue en 1 clic para Ubuntu 24.04 LTS
│
└── android-app/                 # Aplicación móvil para estudiantes
```

---

## 🚀 4. Puesta en Marcha Local con Docker (Recomendada)

Dentro de la carpeta `deployment/`:

```bash
cd deployment
docker compose up -d --build
```

Esto levantará automáticamente:
1. **MySQL 8.0** en el puerto `3306`, ejecutando automáticamente el esquema (`schema.sql`) y la semilla (`seed.sql`).
2. **Redis 7.2** en el puerto `6379`.
3. **Backend API Node.js** en el puerto `5000`.

Para probar el estado del sistema:
```bash
curl http://127.0.0.1:5000/api/health
```

---

## 🔑 5. Cuentas Preconfiguradas para Demostración

| Rol | Correo Electrónico | Contraseña | Perfil / Vista |
| :--- | :--- | :--- | :--- |
| **Jefe de Carrera (Informática)** | `jefe@pracnet.cl` | `jefe2026` | Panel Web de Jefatura (Monitor, Ofertas, Matching, Reportes) |
| **Jefatura de Carrera (Prevención / Industrias)** | `docente@pracnet.cl` | `docente2026` | Panel Web de Jefatura |
| **Administrador Central** | `admin@pracnet.cl` | `admin2026` | Gestión Integral del Sistema |
| **Estudiante Demo** | `alumno@pracnet.cl` | `alumno2026` | Portal Móvil (Muro, Postulaciones, Validación, Asistente AI) |
| **Empresa (Acceso por Enlace Mágico)** | *Sin usuario/clave* | *Token Único* | `/api/empresa/portal/tWPPZe1XNrbGswiCchORWA` (Decisión con retroalimentación) |

---

## ☁️ 6. Despliegue Automatizado en AWS EC2 (Ubuntu 24.04 LTS)

En una instancia limpia de Ubuntu Server 24.04 LTS en AWS EC2:

```bash
git clone https://github.com/iFabiYTX/Pracnet.git
cd Pracnet/deployment
chmod +x deploy_aws_ec2.sh
./deploy_aws_ec2.sh
```

El script configurará automáticamente Docker, Docker Compose, Nginx, UFW y levantará todos los servicios de la plataforma.
