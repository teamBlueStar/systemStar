[Fase 1] – Núcleo

Objetivo general:
Construir la infraestructura base sobre la que funcionará todo systemStar.

[1.1] Estructura del proyecto
Estado: COMPLETADO

- Estructura inicial creada.
- CMake configurado.
- README y LICENSE presentes.
- El proyecto compila correctamente.

[1.2] Config
Estado: COMPLETADO

- Clase Config implementada.
- Valores por defecto definidos.
- Lectura del archivo de configuración implementada.
- Parser INI propio implementado.
- Lectura de [server] tcp_port implementada.
- Validación del puerto entre 1 y 65535.
- Los errores de carga conservan la configuración anterior.
- Prueba automatizada implementada.
- CTest verificó correctamente Config.

[1.3] Logger
Estado: COMPLETADO

- Clase Logger implementada.
- Nivel INFO implementado.
- Nivel WARNING implementado.
- Nivel ERROR implementado.
- Salida por consola implementada.
- Salida a archivo implementada.
- Filtrado mediante minimumLevel implementado.
- Niveles ordenados por severidad: INFO < WARNING < ERROR.
- Nivel desconocido tratado como ERROR.
- Prueba automatizada implementada.
- Pruebas de filtrado verificadas correctamente con CTest.

[1.4] Bootstrap
Estado: COMPLETADO

- Clase Bootstrap implementada.
- Recibe una referencia a Config.
- Recibe externamente la ruta del archivo de log.
- Inicializa Logger utilizando el nivel definido por Config.
- No realiza lectura de archivos de configuración.
- No inicializa Application, EventBus, ModuleManager ni ServiceRegistry.
- Prueba automatizada implementada.
- Prueba de inicialización y escritura del log verificada correctamente con CTest.

[1.5] Application
Estado: COMPLETADO

- Se implementó el ciclo de vida.
- run() mantiene el ciclo activo.
- stop() solicita el cierre.
- Se evita un busy loop mediante una espera controlada.
- Existe prueba automatizada.
- CTest verificó correctamente Application.

[1.6] Manejo de errores
Estado: PENDIENTE

- Crear excepciones propias.
- Detectar errores de configuración.
- Detectar errores de archivos.
- Mensajes claros.

[1.7] Utilidades
Estado: PARCIAL

- Estructura de utilidades creada.
- Implementación pendiente.

[1.8] Pruebas del núcleo
Estado: EN PROGRESO

- CTest configurado.
- Test de Packet completado.
- Test de Position completado.
- Test de Logger completado.
- Test de Bootstrap completado.
- Test de Application completado.
- Test de Config completado.

## Trabajo completado adicional

### Network / Packet
Estado: COMPLETADO

- Packet implementado.
- Almacenamiento de bytes.
- Consulta de tamaño.
- Consulta de estado vacío.
- Acceso seguro a los bytes.

### Models / Position
Estado: COMPLETADO

- Position implementado.
- Device ID.
- IMEI.
- Latitud.
- Longitud.
- Velocidad.
- Dirección.
- Altitud.
- Ignición.
- Timestamp.


## Validación actual

CMake:
OK

Compilación:
OK

CTest:
4/4 pruebas pasadas

- test_packet_position: PASS
- test_logger: PASS
- test_bootstrap: PASS
- test_application: PASS

## Próximo objetivo

La implementación de Application [1.5] ha sido completada y validada.

Componentes pendientes de Fase 1:

1.6 Manejo de errores
1.7 Utilidades
1.8 Pruebas del núcleo

El siguiente componente será seleccionado antes de continuar el desarrollo.

29. Implementación de Socket

Fecha:
2026-10-02

Componente:
Network / Socket

Estado:
COMPLETADO

Objetivo:

Implementar una abstracción mínima y segura sobre sockets TCP para proporcionar la base de las siguientes capas de red de systemStar.

Responsabilidad:

Socket encapsula las operaciones básicas del socket TCP sin conocer protocolos GPS, framing, sesiones, persistencia, API ni lógica de dominio.

Funcionalidades implementadas:

- creación del socket;
- bind a dirección y puerto;
- listen;
- accept;
- connect;
- envío de bytes;
- recepción de bytes;
- validación del estado del socket;
- cierre controlado;
- acceso al descriptor nativo cuando es necesario;
- consulta del puerto local.

Manejo de resultados:

Las operaciones de envío y recepción utilizan "SocketResult", evitando depender únicamente de valores booleanos para representar el resultado de una operación de E/S.

Archivos:

- "backend/network/Socket.h"
- "backend/network/Socket.cpp"
- "tests/test_socket.cpp"
- "CMakeLists.txt"

Pruebas:

Se implementó una prueba de comunicación TCP entre cliente y servidor.

La prueba verifica el establecimiento de la conexión, intercambio de datos y respuesta entre ambos extremos.

Validación:

cmake -S . -B build       PASS
cmake --build build       PASS
ctest --test-dir build    PASS
git diff --check          PASS

Resultado CTest:

6/6 tests passed
0 tests failed
100% tests passed

La compilación posterior a la corrección del test no presentó los warnings inicialmente detectados.

Decisión arquitectónica:

Socket permanece deliberadamente limitado a transporte TCP.

No contiene:

- framing de protocolos;
- detección de protocolo;
- parsers GPS;
- Position;
- Device;
- clientId;
- persistencia;
- autenticación de usuarios;
- lógica comercial.

Esto permite que las siguientes capas utilicen Socket sin acoplar la infraestructura de red al dominio GPS.

Conclusión:

Socket queda cerrado como primer componente funcional de la capa Network.

Siguiente componente:

"TCPServer"

Objetivo inmediato:

Demostrar que systemStar puede crear un servidor TCP, escuchar en un puerto configurado, aceptar conexiones y entregar dichas conexiones a la siguiente capa sin introducir todavía lógica de protocolos GPS.

## TCPServer — Completado

El objetivo definido para `TCPServer` fue cumplido.

`TCPServer` permite crear un servidor TCP, escuchar en un puerto, aceptar conexiones y entregar las conexiones aceptadas mediante la abstracción `Socket`, sin introducir lógica de protocolos GPS.

Validación:
- comunicación TCP cliente → servidor;
- recepción de datos;
- cierre correcto de la conexión;
- test `test_tcp_server`;
- suite CTest: 7/7 tests PASS.

TCPServer queda cerrado como componente funcional de la capa Network.

El siguiente componente de esta capa permanece pendiente y no se implementa en esta etapa.

## Session — Completado

### Objetivo
Establecer una abstracción mínima y segura para representar una conexión TCP individual entre `TCPServer` y las futuras capas de procesamiento.

### Implementado
- Ownership exclusivo del `Socket`.
- Semántica move-only.
- Recepción de bytes.
- Envío de bytes.
- Validación del estado de la sesión.
- Cierre seguro de la conexión.
- Integración con CMake.
- Test de integración TCP cliente → servidor → Session → ACK.

### Validación
- Build correcto.
- Sin warnings.
- CTest: 8/8 PASS.
- `git diff --check`: limpio.

### Alcance
`Session` permanece independiente de protocolos GPS, modelos de dominio, persistencia, API, autenticación comercial y alertas.

El framing y buffering necesario para TCP stream se implementará en la etapa correspondiente, sin introducir lógica de protocolo dentro de `Session`.

### Estado
🟢 Completado

### Siguiente
`ConnectionManager` permanece ⚪ Planificado.
