# Nexonoma Frontend

Next.js App Router frontend for the **Nexonoma web application**.

This package represents the **UI layer** of Nexonoma and is part of a larger system.
It is intentionally focused on application structure and composition, not on standalone execution.

For overall context, see the repository root README.

---

## Development

```bash
pnpm --filter frontend dev
````

Runs the frontend in development mode using the local workspace setup.

---

## Build & Start (Production)

```bash
pnpm --filter frontend build
pnpm --filter frontend start
```

These commands build and start the frontend **without** provisioning external services
(e.g. APIs, databases, or infrastructure).

---

## Linting

```bash
pnpm --filter frontend lint
```

---

## Configuration

Local configuration is provided via:

* `apps/frontend/.env`

Concrete values are project-specific and are intentionally **not versioned**.
