# Documentos y archivos que debes modificar

## Obligatorios al crear el repositorio

1. `README.md`: cambia el nombre, descripción, comandos de despliegue y
   responsables del repositorio.
2. `company.md`: completa información legal y de contacto de tu empresa.
3. `LICENSE`: revisa el titular del copyright.
4. `CMakeLists.txt`: agrega librerías reales, tests y flags de tu entorno.
5. `config/systemstar.conf.example`: agrega solo nombres de variables; nunca
   valores secretos.
6. `docs/api.md`: documenta cualquier endpoint nuevo y su autorización.
7. `docs/arquitectura.md`: registra cambios que afecten al flujo de telemetría.
8. `docs/database.md`: documenta migraciones y retención de posiciones.
9. `docs/decisiones.md`: registra decisiones de arquitectura no obvias.
10. `docs/roadmap.md`: reemplaza el roadmap inicial por prioridades reales.

## Por cada protocolo GPS

- `backend/protocols/<protocolo>/README.md`
- `docs/protocol-development-guide.md`
- pruebas de paquetes válidos, inválidos, duplicados y checksum
- tabla de modelos soportados y versión de firmware
- estrategia de ACK, timeout, reintento y autenticación

## En el proyecto web actual

- `lib/api-spec/openapi.yaml` es el contrato de endpoints.
- `lib/db/src/schema/index.ts` es la fuente de verdad del esquema TypeScript.
- `artifacts/api-server/src/routes/fleet.ts` contiene las reglas de permisos.
- `artifacts/bluetrack/src/` contiene el cliente BlueTrack.
- `artifacts/bluestar-admin/src/` contiene el panel administrativo.

Después de modificar OpenAPI ejecuta:

```bash
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```