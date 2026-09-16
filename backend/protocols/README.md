# Adaptadores de protocolos GPS

Cada carpeta contiene una implementación independiente de `Protocol`. La
detección es deliberadamente conservadora y el parser de producción debe
completarse con fixtures aprobados por cada fabricante.

| Adaptador | Detección inicial | Estado |
|---|---|---|
| Teltonika | framing binario + Codec ID | base lista |
| Concox | prefijo de trama ASCII | base lista |
| Ruptela | framing binario | base lista |
| TK103 | mensajes ASCII con IMEI/tracker | base lista |
| TK116 | mensajes ASCII con identificador TK116 | base lista |

No habilites un adaptador en producción hasta validar checksum, autenticación,
ACK y campos GPS con paquetes reales.