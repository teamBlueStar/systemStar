# Coding standards

- C++20, RAII y ownership explícito.
- Headers autocontenidos y nombres `PascalCase` para tipos.
- No usar estado global mutable para servicios.
- Validar entradas externas en los límites del sistema.
- Cada parser debe tener pruebas de casos válidos y corruptos.
- Registrar errores con contexto, sin credenciales ni payloads completos.