# Nexonoma API

NestJS-API der Nexonoma-App.

## Entwicklung

```bash
pnpm --filter api start:dev
```

## Build & Start (Production)

```bash
pnpm --filter api build
pnpm --filter api start:prod
```

## Linting

```bash
pnpm --filter api lint
```

## Tests

```bash
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api test:cov
```

## Konfiguration

- `apps/api/.env`
- `apps/api/.env.local`

Die Werte sind projektspezifisch und werden nicht im Repo versioniert.
