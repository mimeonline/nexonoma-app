
# Nexonoma API

NestJS API for the **Nexonoma web application**.

This package represents the **application API layer** of Nexonoma.
It is designed to be consumed by the Nexonoma frontend and is not intended to run as a standalone public service.

For overall context and architectural boundaries, see the repository root README.

---

## Development

```bash
pnpm --filter api start:dev
````

Starts the API in development mode using the local workspace setup.

---

## Build & Start (Production)

```bash
pnpm --filter api build
pnpm --filter api start:prod
```

These commands build and start the API **without** provisioning required external services
(e.g. databases, message brokers, or infrastructure).

---

## Linting

```bash
pnpm --filter api lint
```

---

## Tests

```bash
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api test:cov
```

---

## Configuration

Local configuration is provided via:

* `apps/api/.env`
* `apps/api/.env.local`

Concrete values are project-specific and are intentionally **not versioned** in this repository.
