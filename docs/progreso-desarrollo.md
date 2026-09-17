systemStar — Registro de Progreso de Desarrollo

Información del documento

Proyecto: systemStar
Organización: BlueStar
Propósito: Plataforma central para gestión y control de flotas GPS
Documento: Registro de progreso técnico
Ubicación recomendada: "docs/progreso-desarrollo.md"

---

1. Propósito del documento

Este documento registra los avances técnicos realizados en "systemStar".

Su objetivo es permitir que cualquier etapa futura del desarrollo pueda consultar:

- qué se modificó;
- qué archivos fueron creados o modificados;
- por qué se realizó cada cambio;
- qué decisiones arquitectónicas se tomaron;
- cómo se validó el código;
- qué queda pendiente;
- cuál es el siguiente paso.

Este documento debe actualizarse después de completar cada etapa importante.

---

2. Arquitectura base

"systemStar" está diseñado como una plataforma modular para gestión de flotas GPS.

La arquitectura separa las siguientes responsabilidades:

1. Ingesta de datos GPS.
2. Protocolos de fabricantes.
3. Modelos de dominio.
4. Persistencia.
5. API.
6. Seguridad.
7. Servicios.
8. Frontends.

El núcleo C++ debe concentrarse principalmente en la ingesta y procesamiento de datos GPS.

La autenticación, configuración comercial y funcionalidades relacionadas con clientes permanecen inicialmente en el API compartido.

---

3. Estructura principal actual

systemStar/
├── CMakeLists.txt
├── README.md
├── backend/
├── bluestar-platform/
│   ├── artifacts/
│   │   ├── api-server/
│   │   ├── bluetrack/
│   │   ├── bluestar-admin/
│   │   ├── bluestar-website/
│   │   └── mockup-sandbox/
│   └── lib/
│       ├── api-client-react/
│       ├── api-spec/
│       ├── api-zod/
│       └── db/
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

4. CMake

Estado

El proyecto utiliza CMake como sistema principal de compilación.

Configuración actual:

- CMake mínimo: 3.20
- Lenguaje: C++
- Estándar: C++20
- Warnings activados
- Tests mediante CTest
- Herramientas opcionales

El proyecto principal se genera como:

systemStar

Los tests se generan como ejecutables independientes.

---

5. Decisiones arquitectónicas importantes

5.1 Separación del núcleo y API

El núcleo C++ no debe duplicar las responsabilidades del API web.

El API compartido maneja inicialmente:

- autenticación;
- usuarios;
- clientes;
- configuración comercial;
- operaciones administrativas.

El núcleo C++ se concentra en:

- conexiones;
- paquetes;
- protocolos GPS;
- procesamiento;
- eventos;
- posteriormente servicios de dominio.

---

5.2 Protocolos independientes

Los protocolos GPS deben implementarse detrás de una interfaz común.

Protocolos previstos:

TK103
TK116
Teltonika
Concox
Ruptela

Los parsers no deben:

- acceder directamente a la base de datos;
- conocer la interfaz web;
- depender de rutas HTTP.

Los parsers deben convertir paquetes de fabricantes a modelos comunes del sistema.

---

5.3 Multi-tenant

La plataforma debe mantener aislamiento entre clientes mediante "clientId".

Los recursos pertenecientes a clientes deben mantener su alcance correspondiente.

No se debe asociar arbitrariamente "clientId" a datos de bajo nivel cuando esa asociación pertenece a una capa superior.

---

6. Estado inicial de los tests

Durante la auditoría se comprobó que:

tests/

estaba vacío.

El "CMakeLists.txt" ya tenía:

option(SYSTEMSTAR_BUILD_TESTS "Build systemStar tests" ON)

y:

enable_testing()

Sin embargo, todavía no existía:

add_executable(...)

ni:

add_test(...)

Por lo tanto, se decidió crear la infraestructura de pruebas antes de continuar con componentes más complejos.

---

7. Implementación de Packet

Archivos creados

backend/network/Packet.h
backend/network/Packet.cpp

Responsabilidad

"Packet" representa los bytes recibidos desde una conexión de red.

No contiene lógica de protocolos ni lógica de persistencia.

Funcionalidades actuales

Permite:

- almacenar bytes;
- consultar los bytes;
- obtener el tamaño;
- comprobar si está vacío.

Interfaz principal:

const std::vector<std::uint8_t>& bytes() const noexcept;

std::size_t size() const noexcept;

bool empty() const noexcept;

Decisión

"Packet" representa datos crudos.

La interpretación del contenido pertenece a los protocolos.

---

8. Implementación de Position

Archivos creados

backend/models/Position.h
backend/models/Position.cpp

Responsabilidad

"Position" representa una posición GPS normalizada dentro del dominio de "systemStar".

Datos actuales

deviceId
imei
latitude
longitude
speed
heading
altitude
ignition
timestamp

Decisión arquitectónica

"clientId" no fue añadido directamente a "Position".

La asociación entre dispositivo/vehículo y cliente pertenece al contexto de dominio, seguridad y persistencia.

Esto evita duplicar responsabilidades en el modelo básico de posición.

---

9. Primera prueba automatizada

Archivo creado

tests/test_packet_position.cpp

La prueba verifica "Packet" y "Position".

Packet probado

Se verifica:

Packet no vacío
tamaño correcto
primer byte
segundo byte
tercer byte

Position probado

Se verifica:

deviceId
IMEI
latitud
longitud
velocidad
heading
altitud
ignición
timestamp

---

10. Integración de tests con CMake

Se añadió al "CMakeLists.txt" un ejecutable independiente:

test_packet_position

Este utiliza:

tests/test_packet_position.cpp
backend/network/Packet.cpp
backend/models/Position.cpp

También se registró mediante:

add_test(
    NAME test_packet_position
    COMMAND test_packet_position
)

De esta manera:

systemStar

y:

test_packet_position

son ejecutables independientes.

Esto evita utilizar "main.cpp" como sistema de pruebas.

---

11. Primera compilación del proyecto

Se ejecutó:

cmake -S . -B build

Resultado:

-- systemStar 0.1.0
-- Build tests: ON
-- Build tools: OFF
-- Configuring done
-- Generating done

Configuración correcta.

---

12. Compilación

Se ejecutó:

cmake --build build

Resultado:

[100%] Built target test_packet_position

También se confirmó:

[92%] Built target systemStar

Por lo tanto, tanto el programa principal como el test compilan correctamente.

---

13. Ejecución de CTest

Se ejecutó:

ctest --test-dir build --output-on-failure

Resultado:

Test project /data/data/com.termux/files/home/proyectos/systemStar/build

Start 1: test_packet_position
1/1 Test #1: test_packet_position ............. Passed

100% tests passed, 0 tests failed out of 1

Total Test time (real) = 0.05 sec

Resultado

Tests ejecutados: 1
Tests aprobados: 1
Tests fallidos: 0
Porcentaje: 100%

Primer test oficial de "systemStar" validado correctamente.

---

14. Archivos modificados/creados hasta este punto

Código

backend/network/Packet.h
backend/network/Packet.cpp

backend/models/Position.h
backend/models/Position.cpp

Tests

tests/test_packet_position.cpp

Configuración

CMakeLists.txt

---

15. Componentes todavía pendientes

Modelos de dominio previstos:

Vehicle
Device
Driver
Alert
Geofence
Command
User

Componentes de red:

Socket
TCPClient
TCPServer
Session
ConnectionManager

Protocolos:

TK103
TK116
Teltonika
Concox
Ruptela

Persistencia:

Repositories
Position storage
Alerts
Historical positions

Servicios:

Domain services
Notification Center

API:

API integration
OpenAPI
Endpoints

BlueTrack:

Eliminar simulaciones
Conectar posiciones reales
Historial real
Alertas reales

---

16. Siguiente paso definido

El siguiente componente a implementar es:

backend/models/Device

Antes de escribir el código de "Device" se debe definir:

1. responsabilidad del modelo;
2. datos que debe contener;
3. relación con vehículo;
4. relación con IMEI;
5. estado de conexión;
6. información del dispositivo;
7. qué información NO debe pertenecer al modelo.

Después se creará:

backend/models/Device.h
backend/models/Device.cpp

y su correspondiente prueba automatizada.

---

17. Regla para futuras actualizaciones

Cada avance importante debe registrar:

Fecha
Etapa
Objetivo
Archivos creados
Archivos modificados
Decisiones arquitectónicas
Pruebas realizadas
Resultado
Problemas encontrados
Siguiente paso

No se debe considerar una etapa terminada hasta que:

Código implementado
        ↓
Compilación correcta
        ↓
Pruebas ejecutadas
        ↓
Resultado registrado
        ↓
Avance documentado

---

18. Estado actual del proyecto

systemStar
│
├── Arquitectura base .............. ✅
├── CMake .......................... ✅
├── Packet ......................... ✅
├── Position ....................... ✅
├── Infraestructura CTest .......... ✅
├── Primer test .................... ✅
├── Compilación .................... ✅
├── CTest .......................... ✅ 1/1
│
├── Device ......................... ⏳
├── Vehicle ........................ ⏳
├── Driver ......................... ⏳
├── Alert .......................... ⏳
├── Geofence ....................... ⏳
├── Command ........................ ⏳
├── User ........................... ⏳
├── Network ........................ ⏳
├── Protocolos GPS ................. ⏳
├── Persistencia ................... ⏳
├── Servicios ...................... ⏳
├── API ............................ ⏳
└── BlueTrack integración .......... ⏳

---

19. Historial de cambios

Etapa 1 — Base de pruebas

Completado

Se creó la primera infraestructura de pruebas del proyecto.

Cambios

Packet
Position
test_packet_position
CMake / CTest

Validación

100% tests passed
0 tests failed

Estado

COMPLETADO

---

Etapa siguiente

Device

Estado:

PENDIENTE

Objetivo:

Definir e implementar el modelo de dispositivo GPS y crear sus pruebas antes de continuar con los demás modelos de dominio.

---

20. Nota de mantenimiento

Este archivo es un registro técnico vivo.

No debe utilizarse como sustituto de:

arquitectura.md
decisiones.md
database.md
api.md
roadmap.md

Cada documento mantiene una responsabilidad diferente:

arquitectura.md
    → cómo está diseñado el sistema

decisiones.md
    → por qué se tomaron determinadas decisiones

database.md
    → diseño de persistencia

api.md
    → contrato y funcionamiento del API

roadmap.md
    → hacia dónde va el proyecto

progreso-desarrollo.md
    → qué hemos hecho realmente y qué fue validado

---

21. Implementación de Logger

Componente

backend/utils/Logger

Estado

PARCIAL

Responsabilidad

Logger registra eventos del sistema en:

- consola;
- archivo de log.

Niveles implementados

INFO
WARNING
ERROR

Archivos creados

backend/utils/Logger.h
backend/utils/Logger.cpp

Tests

tests/test_logger.cpp

API actual

Logger(
    const std::string& logFile,
    const std::string& minimumLevel
);

Métodos:

info()
warning()
error()

Implementación

El Logger recibe la ruta del archivo de log y el nivel mínimo configurado.

Los mensajes se formatean como:

[INFO] mensaje
[WARNING] mensaje
[ERROR] mensaje

Cada mensaje se envía a la consola.

Cuando el archivo de log está disponible, también se escribe en él.

El archivo se abre en modo append para conservar registros anteriores.

Pendiente

El valor minimumLevel actualmente se almacena, pero todavía no se utiliza para filtrar mensajes.

Por ejemplo, un Logger configurado con nivel WARNING todavía permite registrar mensajes INFO.

Esta funcionalidad queda pendiente para completar el componente.

---

22. Prueba automatizada de Logger

Archivo

tests/test_logger.cpp

La prueba verifica:

- creación del Logger;
- registro INFO;
- registro WARNING;
- registro ERROR;
- generación del archivo de log;
- contenido de los mensajes registrados.

Integración CMake

Se añadió el ejecutable:

test_logger

utilizando:

tests/test_logger.cpp
backend/utils/Logger.cpp

También se registró mediante CTest:

add_test(
    NAME test_logger
    COMMAND test_logger
)

Validación

Comando:

ctest --test-dir build --output-on-failure

Resultado:

2/2 tests passed
0 tests failed

Pruebas:

test_packet_position: PASS
test_logger: PASS

Archivo generado:

build/test_logger.log

Contenido validado:

[INFO] Mensaje de información
[WARNING] Mensaje de advertencia
[ERROR] Mensaje de error

Resultado

La implementación básica de Logger funciona correctamente.

Estado:

PARCIAL

Motivo:

Queda pendiente implementar el filtrado mediante minimumLevel.

---

23. Estado actualizado del proyecto

Arquitectura base .............. ✅
CMake .......................... ✅
Packet ......................... ✅
Position ....................... ✅
Logger ......................... 🟡
Infraestructura CTest .......... ✅
Tests Packet/Position .......... ✅
Test Logger .................... ✅
Compilación .................... ✅
Validación ..................... ✅ 2/2

Config ......................... 🟡
Bootstrap ...................... ⏳
Application .................... ⏳
Manejo de errores .............. ⏳
Utilidades ..................... 🟡

Network ........................ ⏳
Protocolos GPS ................. ⏳
Persistencia ................... ⏳
Servicios ...................... ⏳
API ............................ ⏳
BlueTrack integración .......... ⏳

---

24. Siguiente paso

Completar Logger [1.3].

Pendiente:

- implementar filtrado mediante minimumLevel;
- añadir prueba específica del filtrado;
- recompilar;
- ejecutar CTest;
- revisar nuevamente el componente;
- actualizar documentación;
- realizar commit.

Después de cerrar Logger se continuará con el siguiente componente definido en la planificación de Fase 1.

---

## 25. Finalización de Logger

Fecha:
2026-09-16

Componente:
Logger [1.3]

Estado:
COMPLETADO

Cambios:

- Implementado filtrado mediante minimumLevel.
- Definida prioridad INFO < WARNING < ERROR.
- Los mensajes inferiores al nivel mínimo son descartados.
- Los mensajes aceptados continúan registrándose en consola y archivo.
- Los niveles desconocidos se tratan como ERROR.

Comportamiento:

minimumLevel INFO:
- INFO registrado.
- WARNING registrado.
- ERROR registrado.

minimumLevel WARNING:
- INFO filtrado.
- WARNING registrado.
- ERROR registrado.

minimumLevel ERROR:
- INFO filtrado.
- WARNING filtrado.
- ERROR registrado.

Pruebas:

test_logger:
PASS

test_packet_position:
PASS

Resultado CTest:

2/2 tests passed
0 tests failed

Compilación:

cmake -S . -B build
PASS

cmake --build build
PASS

Conclusión:

Logger [1.3] queda completado y validado.

Siguiente estado:

1.3 Logger → 🟢 COMPLETADO
