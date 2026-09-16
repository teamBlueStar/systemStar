# systemStar architecture v1

La versión inicial prioriza una base pequeña y compilable: bootstrap,
event-bus, service-registry, module-manager, modelos de dominio, paquetes de
red y una interfaz de protocolo. Las funcionalidades de producción se agregan
por módulos con pruebas, sin convertir `main.cpp` en un contenedor de lógica.