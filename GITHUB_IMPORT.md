# Paquete BlueStar + systemStar

Este paquete contiene:

- `bluestar-platform/`: el proyecto actual completo sin `node_modules`,
  `dist`, builds ni secretos.
- `systemStar/`: la base C++20/CMake para continuar el núcleo de protocolos
  GPS y telemetría.

Empieza por leer `systemStar/docs/documentos-por-modificar.md` y
`systemStar/docs/github-import.md`.

Importante: `systemStar` es una base compilable y documentada; los protocolos
incluyen puntos de extensión y reglas de validación, pero todavía necesitan
fixtures y pruebas con paquetes reales de cada fabricante antes de producción.