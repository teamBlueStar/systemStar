systemStar
v0.1

systemStar es una plataforma modular para la gestión, monitoreo y rastreo de dispositivos GPS en tiempo real. Su arquitectura está diseñada para ser escalable, mantenible y preparada para soportar múltiples fabricantes de rastreadores, diferentes canales de notificación y futuras integraciones.

---

Objetivos

- Construir un servidor GPS de alto rendimiento.
- Soportar múltiples protocolos GPS.
- Proporcionar una API para aplicaciones y servicios.
- Integrarse con BlueTrack.
- Ofrecer un sistema de notificaciones multicanal.
- Facilitar pruebas mediante simuladores.
- Mantener una arquitectura limpia y extensible.

---

Arquitectura

systemStar
│
├── assets/
├── backend/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── network/
│   ├── protocols/
│   ├── repositories/
│   ├── security/
│   ├── services/
│   └── utils/
├── config/
├── database/
├── docs/
├── frontend/
├── integrations/
├── mobile/
├── scripts/
├── tests/
└── tools/

---

Componentes

Core

Controla el ciclo de vida de la aplicación.

- Application
- Bootstrap
- EventBus
- ModuleManager
- ServiceRegistry

---

Network

Responsable de la comunicación TCP.

- TCPServer
- TCPClient
- Session
- Socket
- Packet
- ConnectionManager

---

Protocols

Implementación de protocolos GPS.

Actualmente preparados para:

- TK103
- TK116
- Teltonika
- Concox
- Ruptela

---

Models

Representación de las entidades principales.

- Vehicle
- Device
- Driver
- Position
- Alert
- Geofence
- Command
- User

---

Repositories

Acceso a la base de datos mediante un patrón de repositorios.

---

API

Exposición de servicios REST para clientes y aplicaciones.

---

Security

Gestión de autenticación, permisos y seguridad.

---

Notification Center

Sistema de notificaciones desacoplado del resto del servidor.

Canales previstos:

- Discord
- Telegram
- WhatsApp
- Push Notifications
- Email
- SMS

Cada cliente podrá seleccionar uno o varios canales según sus necesidades.

---

BlueTrack

BlueTrack será el cliente principal de la plataforma para:

- Visualización en tiempo real.
- Administración de vehículos.
- Reportes.
- Configuración.

Las notificaciones podrán recibirse tanto en BlueTrack como mediante servicios externos.

---

Herramientas

car-gps

Simulador de dispositivos GPS utilizado para pruebas.

Objetivos:

- Simular vehículos.
- Simular recorridos.
- Enviar paquetes TCP.
- Probar protocolos.
- Generar eventos.

---

Documentación

Toda la documentación técnica se encuentra en la carpeta docs/.

Incluye:

- Arquitectura.
- Roadmap.
- Módulos.
- Base de datos.
- API.
- Sistema de notificaciones.
- Decisiones de diseño.
- Estándares de desarrollo.

---

Filosofía del proyecto

systemStar está diseñado bajo los siguientes principios:

- Arquitectura modular.
- Separación de responsabilidades.
- Código mantenible.
- Alta escalabilidad.
- Fácil incorporación de nuevos protocolos.
- Fácil integración con aplicaciones externas.

---

Estado del proyecto

Versión: 1.0.0-alpha

Arquitectura: Congelada (v1)

Actualmente el desarrollo se encuentra enfocado en la implementación del núcleo del sistema y del servidor TCP.

---

Roadmap

1. Núcleo de la aplicación.
2. Servidor TCP.
3. Simulador car-gps.
4. Protocolo TK103.
5. Base de datos.
6. API REST.
7. Notification Center.
8. BlueTrack.
9. Protocolos adicionales.
10. Plataforma comercial.

---

Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo LICENSE.