# Arquitectura

## Capas

1. Ingesta: sockets TCP/HTTP y framing por protocolo.
2. Protocolos: adaptadores independientes que producen un modelo común.
3. Dominio: dispositivos, vehículos, posiciones, alertas y comandos.
4. Persistencia: repositorios con alcance por `clientId`.
5. API: endpoints para las aplicaciones y clientes externos.
6. Frontends: BlueTrack para clientes y BlueStar Admin para operación.

El C++ de `systemStar` debe concentrarse en ingesta y procesamiento de alto
volumen. La autenticación de usuarios y la configuración comercial permanecen
en el API compartido hasta que exista una razón operativa para migrarlas.