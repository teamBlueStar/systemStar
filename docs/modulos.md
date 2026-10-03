# Módulos

- `core`: ciclo de vida, eventos y registro de servicios.
- `network`: transporte TCP, sockets, servidor TCP y sesiones de conexión. Actualmente incluye `Socket`, `TCPServer` y `Session`; `ConnectionManager` permanece planificado.
- `protocols`: adaptadores de fabricantes.
- `models`: modelos de dominio.
- `repositories`: persistencia.
- `security`: autenticación y autorización.
- `api`: gateway para consumidores.
- `services/notifications`: notificaciones desacopladas.
- `utils`: utilidades compartidas del núcleo, incluyendo configuración y logging.
