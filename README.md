# Nexonoma App

Monorepo fuer die Nexonoma-Webanwendung mit Next.js-Frontend und NestJS-API.

## Struktur

- `apps/frontend/`: Next.js App Router (UI)
- `apps/api/`: NestJS API
- `content/`: JSON-Inhalte
- `mocks/` und `sandbox/`: lokale Fixtures/Experimente
- `pnpm-workspace.yaml`: Workspace-Definition

## Schnellstart

```bash
pnpm install

# Frontend (separates Terminal)
pnpm --filter frontend dev

# API (separates Terminal)
pnpm --filter api start:dev
```

## Wichtige Scripts

```bash
# Frontend
pnpm --filter frontend dev
pnpm --filter frontend build
pnpm --filter frontend start
pnpm --filter frontend lint

# API
pnpm --filter api start:dev
pnpm --filter api build
pnpm --filter api start:prod
pnpm --filter api lint

# Tests (API)
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api test:cov
```

## Docker

```bash
pnpm run docker:build:app
pnpm run docker:build:api
pnpm run docker:build:db
pnpm run docker:build:all
```

## Konfiguration

- `apps/api/.env` und `apps/api/.env.local`
- `apps/frontend/.env`

Die konkreten Werte sind projektspezifisch und werden nicht im Repo hinterlegt.
