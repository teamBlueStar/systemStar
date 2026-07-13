[Fase 1] – Núcleo
Objetivo general: construir la infraestructura base sobre la que funcionará todo systemStar.

[1.1]  Estructura del proyecto
Objetivo
Crear la estructura inicial de carpetas.
Configurar CMake.
Agregar README y LICENSE.
Preparar el proyecto para compilar.
Resultado esperado
El proyecto compila correctamente aunque no haga nada.

[1.2] Config
Objetivo
Leer archivos de configuración.
Definir puerto del servidor.
Definir rutas de archivos.
Definir nivel de logs.
Resultado esperado
El sistema carga correctamente un archivo de configuración al iniciar.

[1.3] Logger
Objetivo
Registrar mensajes de información.
Registrar advertencias.
Registrar errores.
Guardar logs en consola y archivo.
Resultado esperado
Todo evento importante queda registrado.

[1.4] Bootstrap
Objetivo
Inicializar todos los módulos.
Verificar que la configuración sea válida.
Iniciar Logger.
Preparar Application.
Resultado esperado
El sistema inicia correctamente sin errores.

[1.5] Application
Objetivo
Crear la clase principal.
Controlar el ciclo de vida del servidor.
Ejecutar el bucle principal.
Gestionar el apagado seguro.
Resultado esperado
El programa permanece en ejecución correctamente.

[1.6] Manejo de errores
Objetivo
Crear excepciones propias.
Detectar errores de configuración.
Detectar errores de archivos.
Mostrar mensajes claros.
Resultado esperado
El sistema nunca termina de forma inesperada.

[1.7] Utilidades
Objetivo
Crear funciones auxiliares.
Manejar fechas y horas.
Manejar cadenas.
Manejar archivos.
Resultado esperado
El resto del proyecto reutiliza estas utilidades.

[1.8] Pruebas del núcleo
Objetivo
Verificar Config.
Verificar Logger.
Verificar Bootstrap.
Verificar Application.
Resultado esperado
El núcleo funciona correctamente antes de comenzar la red.
