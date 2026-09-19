# Sistema Hospitalario Integrado — Módulo de Citas

Proyecto de la Serie II: gestión de citas médicas con calendario interactivo (FullCalendar), API REST en Node/Express y persistencia en MySQL vía Docker.

## Arquitectura por capas

```
public/            -> presentación (FullCalendar + JS cliente)
api/src/routes/         -> definición de endpoints (Express Router)
api/src/controllers/    -> adaptan HTTP <-> lógica de negocio
api/src/services/       -> lógica de negocio (validaciones, reglas de conflicto/estado)
api/src/repositories/   -> acceso a datos (SQL contra MySQL)
api/src/middlewares/    -> validación de entrada, manejo de errores
db/                 -> schema.sql y seed.sql
```

## Levantar el entorno

```bash
docker compose up -d
cd api && npm install && npm start
```

La API queda en `http://localhost:3000`, la UI estática se sirve desde `public/` (abrir `public/index.html` o servirla con la misma app Express).

## Backlog cubierto

Ver `EVIDENCIA.md` para trazabilidad completa de RQF/RQNF, commits y PRs.
