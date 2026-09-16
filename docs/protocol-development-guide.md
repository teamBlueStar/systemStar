# Guía de desarrollo de protocolos GPS

## Flujo obligatorio

1. Recibir bytes sin asumir que cada lectura TCP contiene un paquete completo.
2. Aplicar un buffer por conexión y respetar `max_packet_size`.
3. Identificar el protocolo por puerto, framing o handshake, nunca solo por una
   cadena que pueda aparecer dentro del payload.
4. Validar longitud, checksum/CRC, IMEI y campos obligatorios.
5. Convertir a un modelo común: dispositivo, timestamp UTC, latitud,
   longitud, velocidad, rumbo, entradas y salidas.
6. Rechazar paquetes inválidos sin tumbar la conexión ni registrar secretos.
7. Persistir de forma idempotente para evitar posiciones duplicadas.
8. Enviar ACK únicamente después de validar el paquete.

## Seguridad

- Autentica el dispositivo antes de asociarlo a un `clientId`.
- Aplica límites por IP, IMEI y conexión.
- No aceptes comandos de control sin autorización explícita.
- Guarda auditoría de comandos y cambios de configuración.
- Usa pruebas con payloads truncados, sobredimensionados y maliciosos.

## Definition of Done

Un protocolo no está listo hasta tener parser, encoder de ACK, checksum,
timeouts, documentación de modelos soportados, fixtures de paquetes reales y
pruebas unitarias de éxito y error.