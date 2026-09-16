# Importación a GitHub

El ZIP contiene dos carpetas:

- `bluestar-platform/`: aplicación web actual, API, esquema de base de datos y
  configuraciones del monorepo.
- `systemStar/`: base C++/CMake para protocolos y procesamiento nativo.

## Pasos recomendados

1. Crea un repositorio vacío en GitHub.
2. Extrae el ZIP en una carpeta local.
3. Usa `bluestar-platform` como raíz si quieres continuar primero con las
   aplicaciones web.
4. Copia `systemStar/` al mismo repositorio o mantenlo como repositorio
   independiente si el equipo C++ tendrá ciclos de despliegue distintos.
5. No subas `node_modules`, `dist`, `build`, `.cache`, `.local`, `.git` ni
   archivos `.env`.
6. Configura `DATABASE_URL` y `SESSION_SECRET` en los secretos del entorno,
   nunca en GitHub.

## Primer commit

```bash
git init
git add .
git commit -m "chore: initial BlueStar and systemStar architecture"
git branch -M main
git remote add origin <URL_DEL_REPOSITORIO>
git push -u origin main
```

## Validaciones

```bash
cmake -S systemStar -B systemStar/build
cmake --build systemStar/build
pnpm install
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

No mezcles credenciales de desarrollo con producción y no uses datos simulados
como fuente de verdad para clientes reales.