# API y contrato de datos

La API web compartida se encuentra en `bluestar-platform/artifacts/api-server`.
El contrato formal está en `bluestar-platform/lib/api-spec/openapi.yaml`.

Endpoints principales:

- `/api/auth/*`: sesión y usuario autenticado.
- `/api/fleet/vehicles`: flota, con aislamiento por cliente.
- `/api/fleet/devices`: dispositivos GPS.
- `/api/fleet/clients`: clientes y configuración de módulos.
- `/api/fleet/users`: usuarios operativos.
- `/api/fleet/homologations`: homologaciones.
- `/api/fleet/installation-requests`: citas técnicas.
- `/api/fleet/reports/export`: CSV, JSON y PDF.

Los roles son `admin`, `tech` y `cliente`. Las reglas deben validarse en el
servidor; ocultar botones en el frontend no es una medida de seguridad.