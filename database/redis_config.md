# Arquitectura y Especificación de Redis 7.2 para PRACNET

> **Objetivo:** Desacoplar sesiones, acelerar validaciones de tokens de empresa (Magic Links), gestionar límites de peticiones (Rate Limiting) y habilitar notificaciones push instantáneas para la aplicación móvil.

---

## 1. Patrones de Llaves y Estructuras en Redis

### A. Gestión de Sesiones y Autenticación Criptográfica
* **Llave:** `pracnet:session:<user_id>:<session_token>`
* **Tipo:** `STRING (JSON Serializado)`
* **TTL:** `28800` (8 horas)
* **Estructura del Payload:**
  ```json
  {
    "user_id": 5,
    "email": "alumno@pracnet.cl",
    "rol": "estudiante",
    "nombre": "Carlos Mendoza",
    "estudiante_id": 1,
    "rut": "20.123.456-7",
    "ip_origen": "190.161.45.12",
    "login_time": 1728921600
  }
  ```
* **Ventaja:** Permite autenticación sin sobrecargar la base de datos MySQL con consultas repetitivas en cada navegación.

---

### B. Enlaces Mágicos de Empresa (Portal de Reclutamiento sin Clave)
* **Llave:** `pracnet:magiclink:<token_acceso>`
* **Tipo:** `HASH`
* **TTL:** `2592000` (30 días)
* **Campos:**
  * `oferta_id`: `1`
  * `empresa_id`: `1`
  * `empresa_nombre`: `"Tech Solutions"`
  * `creado_en`: `"2026-10-14 09:00:00"`
  * `activo`: `"1"`
* **Ventaja:** Acceso de lectura y decisión inmediata para empleadores con respuesta en sub-milisegundos.

---

### C. Rate Limiting (Defensa contra Fuerza Bruta & DoS - OWASP)
* **Llave:** `pracnet:ratelimit:<ip>:<endpoint>`
* **Tipo:** `STRING (Contador incremental)`
* **TTL:** `60` segundos
* **Lógica:**
  * Máximo 10 intentos por minuto en `/api/auth/login`.
  * Máximo 5 intentos por minuto en `/api/auth/recuperar-password`.
  * Si el valor supera el umbral, se retorna código HTTP `429 Too Many Requests`.

---

### D. Caché del Motor de Recomendación Inteligente (% Match)
* **Llave:** `pracnet:recommendations:student:<estudiante_id>`
* **Tipo:** `STRING (JSON)`
* **TTL:** `7200` (2 horas)
* **Payload:**
  ```json
  [
    {
      "oferta_id": 1,
      "empresa": "Tech Solutions",
      "titulo": "Práctica Desarrollo Backend",
      "match_score": 95,
      "habilidades_comunes": ["Python", "SQL", "Git"]
    }
  ]
  ```

---

### E. Canal Pub/Sub de Notificaciones Push Móviles
* **Canal:** `pracnet:notifications:push`
* **Mensaje:**
  ```json
  {
    "target_user_id": 5,
    "tipo": "CAMBIO_ESTADO",
    "titulo": "Actualización de tu Postulación",
    "cuerpo": "Tech Solutions te ha seleccionado para entrevista técnica.",
    "fecha": "2026-10-14T17:00:00Z"
  }
  ```
* **Consumidor:** Servicio Node.js que transmite mediante Firebase Cloud Messaging (FCM) a los dispositivos Android.
