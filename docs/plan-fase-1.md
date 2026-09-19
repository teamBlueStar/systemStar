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
Estado: PARCIAL

- Clase Config creada.
- Puerto del servidor definido.
- Nivel de logs definido.
- Ruta de datos definida.
- Falta implementar lectura real del archivo de configuración.

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
Estado: PENDIENTE

- Controlar ciclo de vida.
- Ejecutar bucle principal.
- Gestionar apagado seguro.

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
- Config pendiente de prueba.
- Application pendiente de prueba.

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
3/3 pruebas pasadas

- test_packet_position: PASS
- test_logger: PASS
- test_bootstrap: PASS

## Próximo objetivo

La implementación de Bootstrap [1.4] ha sido completada y validada.

Componentes pendientes de Fase 1:

1.2 Config
1.5 Application
1.6 Manejo de errores
1.7 Utilidades
1.8 Pruebas del núcleo

El siguiente componente será seleccionado antes de continuar el desarrollo.
