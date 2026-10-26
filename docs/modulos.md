# Módulos

- `core`: ciclo de vida, eventos y registro de servicios.
- `network`: transporte TCP, sockets, servidor TCP, sesiones, gestión de conexiones y acumulación acotada de bytes. Actualmente incluye `Packet`, `PacketBuffer`, `Socket`, `TCPServer`, `Session` y `ConnectionManager`. `PacketBuffer` todavía no está integrado en `Session` ni extrae tramas de protocolos.
- `protocols`: adaptadores de fabricantes.
- `models`: modelos de dominio.
- `repositories`: persistencia.
- `security`: autenticación y autorización.
- `api`: gateway para consumidores.
- `services/notifications`: notificaciones desacopladas.
- `utils`: utilidades compartidas del núcleo, incluyendo configuración y logging.
