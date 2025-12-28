# Nexonoma App

Monorepo for the **Nexonoma web application**, consisting of a **Next.js frontend** and a **NestJS API**.

**Nexonoma** is a system-oriented knowledge and navigation platform for software architecture, engineering practices, and complex systems.
It focuses on making structures, relationships, and decision spaces explicit rather than hiding them behind abstractions.

- Website: <https://nexonoma.de>
- App: <https://app.nexonoma.de>

This repository represents the **application layer** of Nexonoma and is intentionally published as a **public reference**.

---

## Purpose & Scope

This repository is **not** a complete, standalone system.

Its purpose is to provide insight into:

- application architecture and structure
- monorepo setup using pnpm workspaces
- separation of frontend, API, and content
- code organization and build discipline

The focus is on **clarity, structure, and reasoning**, not on feature completeness or turnkey execution.

---

## Repository Structure

- `apps/frontend/` – Next.js App Router (UI)
- `apps/api/` – NestJS API
- `content/` – JSON-based content
- `sandbox/` – local experiments
- `pnpm-workspace.yaml` – workspace definition

---

## Local Development

### Install dependencies

```bash
pnpm install
````

### Frontend (separate terminal)

```bash
pnpm --filter frontend dev
```

### API (separate terminal)

```bash
pnpm --filter api start:dev
```

---

## Common Scripts

### Frontend

```bash
pnpm --filter frontend dev
pnpm --filter frontend build
pnpm --filter frontend start
pnpm --filter frontend lint
```

### API

```bash
pnpm --filter api start:dev
pnpm --filter api build
pnpm --filter api start:prod
pnpm --filter api lint
```

### Tests (API)

```bash
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api test:cov
```

---

## Configuration

Local configuration is provided via:

- `apps/api/.env`
- `apps/api/.env.local`
- `apps/frontend/.env`

Concrete values are **project-specific** and are intentionally **not committed** to this repository.

---

## What this is / What this is not

**This is:**

- a public reference for application architecture and structure
- an example of how Nexonoma is organized at the app level
- a codebase meant to be read and understood

**This is not:**

- a full open-source product
- a self-contained demo with data
- a deployment or infrastructure repository

---

## Status

Active development.
The overall structure is stable; details evolve iteratively.
