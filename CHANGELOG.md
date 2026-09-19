Changelog — systemStar

Todos los cambios importantes del proyecto se registran en este documento.

El formato sigue una estructura cronológica para poder identificar rápidamente:

- qué se hizo;
- qué archivos fueron afectados;
- qué etapa se completó;
- qué pruebas fueron ejecutadas;
- cuál es el siguiente paso.

Para obtener el detalle técnico de cada avance, consultar:

docs/progreso-desarrollo.md

---

[0.1.0] — Desarrollo inicial

Estado

En desarrollo

Arquitectura base

- Se validó la estructura modular de "systemStar".
- Se confirmó el uso de CMake como sistema principal de compilación.
- Se estableció C++20 como estándar del proyecto.
- Se mantiene separación entre:
  - núcleo C++;
  - protocolos GPS;
  - modelos de dominio;
  - persistencia;
  - API;
  - seguridad;
  - servicios;
  - frontends.
- Se mantiene separación entre el núcleo de procesamiento GPS y el API web.
- Se establece aislamiento multi-tenant mediante "clientId".

---

Network — Packet

Añadido

backend/network/Packet.h
backend/network/Packet.cpp

Funcionalidad

Se creó el modelo básico "Packet" para representar datos recibidos como bytes.

Incluye:

- almacenamiento de bytes;
- acceso a bytes;
- tamaño del paquete;
- comprobación de paquete vacío.

Estado

COMPLETADO

---

Models — Position

Añadido

backend/models/Position.h
backend/models/Position.cpp

Funcionalidad

Se creó el modelo "Position" para representar una posición GPS normalizada.

Datos incluidos:

deviceId
imei
latitude
longitude
speed
heading
altitude
ignition
timestamp

Decisión

No se añadió "clientId" directamente al modelo básico "Position".

La asociación con el cliente corresponde al contexto de dominio, seguridad y persistencia.

Estado

COMPLETADO

---

Tests — Primera prueba

Añadido

tests/test_packet_position.cpp

Cobertura

Se creó la primera prueba automatizada para:

Packet
Position

Se verificaron:

- bytes;
- tamaño;
- estado vacío;
- deviceId;
- IMEI;
- latitud;
- longitud;
- velocidad;
- heading;
- altitud;
- ignición;
- timestamp.

Estado

COMPLETADO

---

CMake / CTest

Modificado

CMakeLists.txt

Cambios

Se añadió:

test_packet_position

como ejecutable independiente.

Se registró mediante:

add_test(
    NAME test_packet_position
    COMMAND test_packet_position
)

El sistema principal:

systemStar

permanece separado del sistema de pruebas.

Estado

COMPLETADO

---

Validación

Configuración

Comando:

cmake -S . -B build

Resultado:

Configuring done
Generating done

PASÓ

---

Compilación

Comando:

cmake --build build

Resultado:

Built target systemStar
Built target test_packet_position

PASÓ

---

Tests

Comando:

ctest --test-dir build --output-on-failure

Resultado:

1/1 Test #1: test_packet_position ............. Passed

100% tests passed, 0 tests failed out of 1

PASÓ

---

Archivos creados

backend/network/Packet.h
backend/network/Packet.cpp

backend/models/Position.h
backend/models/Position.cpp

tests/test_packet_position.cpp

Archivos modificados

CMakeLists.txt

---

Estado del desarrollo

Arquitectura base .............. ✅
CMake .......................... ✅
Packet ......................... ✅
Position ....................... ✅
CTest .......................... ✅
Primer test .................... ✅
Compilación .................... ✅
Validación ..................... ✅

---

Próximo cambio previsto

Models — Device

Se implementará:

backend/models/Device.h
backend/models/Device.cpp

Antes de escribir código se definirá:

- responsabilidad de "Device";
- identificador del dispositivo;
- IMEI;
- modelo;
- estado;
- conexión;
- relación con vehículo;
- información que debe quedar fuera del modelo.

También se añadirá una prueba automatizada correspondiente.

Estado: PENDIENTE

---

Reglas para futuras entradas

Cada nueva etapa importante deberá añadir una entrada indicando:

## [versión/etapa] — Nombre

### Añadido
Archivos nuevos.

### Modificado
Archivos modificados.

### Cambios
Descripción breve.

### Decisiones
Decisiones arquitectónicas relevantes.

### Tests
Pruebas realizadas.

### Resultado
PASÓ / FALLÓ / PENDIENTE

### Siguiente paso
Próxima tarea.

No se debe registrar una etapa como completada hasta que el código haya sido:

implementado
    ↓
compilado
    ↓
probado
    ↓
validado
    ↓
documentado

---

Documentos relacionados

README.md
    → Introducción y visión general

docs/arquitectura.md
    → Arquitectura del sistema

docs/decisiones.md
    → Decisiones técnicas

docs/database.md
    → Diseño de base de datos

docs/api.md
    → API

docs/roadmap.md
    → Plan de desarrollo

docs/progreso-desarrollo.md
    → Registro técnico detallado

CHANGELOG.md
    → Historial resumido de cambios

---

[0.1.0] — Logger

Añadido

backend/utils/Logger.h
backend/utils/Logger.cpp

tests/test_logger.cpp

Modificado

CMakeLists.txt
docs/modulos.md
docs/plan-fase-1.md
docs/progreso-desarrollo.md

Cambios

- Implementado Logger básico.
- Añadidos niveles INFO, WARNING y ERROR.
- Añadida salida por consola.
- Añadida salida a archivo.
- Añadida prueba automatizada.
- Integrado test_logger con CTest.
- Validada generación de build/test_logger.log.

Tests

Comando:

ctest --test-dir build --output-on-failure

Resultado:

2/2 tests passed
0 tests failed

Pendiente

- Implementar filtrado mediante minimumLevel.

Resultado

Logger básico implementado y validado.

Estado:

PARCIAL

[0.1.0] — Logger — Finalización

Cambios

- Implementado filtrado mediante minimumLevel.
- Definida prioridad INFO < WARNING < ERROR.
- Añadidas pruebas para los tres niveles mínimos.
- Validado el filtrado mediante CTest.

Tests

- test_packet_position: PASS
- test_logger: PASS
- 2/2 tests passed

Resultado

Logger [1.3] completado y validado.

Estado:

COMPLETADO

---

Siguiente paso

Completar Logger [1.3] implementando el filtrado mediante minimumLevel y añadir la prueba correspondiente.

---

[0.1.0] — Bootstrap

Añadido

backend/core/Bootstrap.h
backend/core/Bootstrap.cpp

tests/test_bootstrap.cpp

Modificado

CMakeLists.txt

Cambios

- Implementado Bootstrap [1.4].
- Bootstrap recibe Config y la ruta del archivo de log.
- Inicialización de Logger mediante la configuración existente.
- Añadido mensaje de inicialización.
- Integrado test_bootstrap con CTest.

Tests

- test_packet_position: PASS
- test_logger: PASS
- test_bootstrap: PASS
- 3/3 tests passed

Resultado

Bootstrap [1.4] completado y validado.

Estado:

COMPLETADO
