# Base de datos

La implementación actual utiliza PostgreSQL con Drizzle ORM en
`bluestar-platform/lib/db/src/schema/index.ts`.

Reglas:

- Cada vehículo, dispositivo, homologación y solicitud debe tener alcance de
  cliente cuando corresponda.
- Las migraciones deben ser idempotentes y no borrar datos existentes.
- Las posiciones históricas deben tener política de retención.
- Los respaldos deben estar fuera del repositorio y cifrados.