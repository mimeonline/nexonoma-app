# Repository Guidelines

## Project Structure & Module Organization
- `apps/frontend/`: Next.js app (App Router) with `app/`, `components/`, `features/`, `services/`, `utils/`, and `public/` assets.
- `apps/api/`: NestJS API with `src/` for application code and `test/` for e2e tests; `api.http` and `bruno/` hold API request definitions.
- `content/`: JSON content data.
- `mocks/` and `sandbox/`: local fixtures/experiments.
- Workspace layout is defined in `pnpm-workspace.yaml`.

## Build, Test, and Development Commands
- `pnpm install`: install workspace dependencies.
- `pnpm --filter frontend dev`: run the frontend locally (Next.js dev server).
- `pnpm --filter api start:dev`: run the API with hot reload (NestJS).
- `pnpm --filter frontend build` / `pnpm --filter api build`: production builds.
- `pnpm --filter frontend lint`: ESLint for the frontend.
- `pnpm --filter api lint`: ESLint (with `--fix`) for the API.
- `pnpm --filter api test` / `pnpm --filter api test:e2e`: Jest unit/e2e tests.
- `pnpm docker:build:app|api|db` (root): build and push Docker images.

## Coding Style & Naming Conventions
- Primary languages are TypeScript/React (frontend) and TypeScript/NestJS (API).
- Formatting is handled via Prettier in both apps; prefer running the provided `lint`/`format` scripts instead of manual formatting.
- Follow existing file naming patterns: `*.spec.ts` for tests, React components in PascalCase, utilities in camelCase.

## Testing Guidelines
- API tests use Jest; unit tests live in `apps/api/src/**/**.spec.ts` and e2e tests in `apps/api/test/`.
- Run `pnpm --filter api test:cov` to generate coverage when needed.
- The frontend currently exposes linting only; add tests in a way that aligns with existing structure.

## Commit & Pull Request Guidelines
- Commit history follows Conventional Commits with scopes, e.g. `feat(frontend): ...`, `fix(api): ...`, `chore(ui): ...`.
- Keep commits focused and scoped; include a brief, imperative summary.
- PRs should describe intent, note user-facing changes, and include screenshots for UI changes when relevant.

## Security & Configuration
- Environment files exist at `apps/api/.env`, `apps/api/.env.local`, and `apps/frontend/.env`.
- Do not add or rotate secrets without explicit instruction; treat config changes as coordinated updates.
