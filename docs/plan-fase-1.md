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
Estado: PENDIENTE

- Inicializar módulos.
- Validar configuración.
- Inicializar Logger.
- Preparar Application.

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
- Config pendiente de prueba.
- Bootstrap pendiente de prueba.
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
2/2 pruebas pasadas

- test_packet_position: PASS
- test_logger: PASS

## Próximo objetivo

Cerrar Logger [1.3].

Pendiente:

- Implementar filtrado mediante minimumLevel.
- Añadir prueba específica para el filtrado de niveles.
- Volver a ejecutar CMake y CTest.
- Documentar la finalización de Logger.

Después continuar con:

1.6 Manejo de errores
1.4 Bootstrap
1.5 Application
1.7 Utilidades
1.8 Pruebas del núcleo

Después comenzar Network.
