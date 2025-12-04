# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed via `pnpm-workspace.yaml`.
- Apps: Next.js frontend in `apps/frontend`, NestJS API in `apps/api`.
- Shared domain types in `packages/nexonoma-types`; JSON schemas in `packages/nexonoma-schema`.
- Public assets live in `apps/frontend/public`; routes/components under `apps/frontend/app`.
- Keep data JSON-only under `content/json/`; schemas stay unchanged unless explicitly approved.

## Build, Test, and Development Commands
- Install all deps: `pnpm install`.
- Frontend: `pnpm --filter frontend dev` (http://localhost:3000), `pnpm --filter frontend build`, `pnpm --filter frontend start`.
- API: `pnpm --filter api start:dev` for hot reload, `pnpm --filter api build`, `pnpm --filter api start:prod`.
- Lint: `pnpm --filter frontend lint` (ESLint 9 + Next), API lint via `pnpm --filter api lint`.

## Coding Style & Naming Conventions
- TypeScript-first, ES modules. Prefer React Server Components unless client hooks needed.
- TailwindCSS v4 utility-first; avoid ad-hoc inline styles when utilities exist.
- File naming: kebab-case for routes, PascalCase for React components, camelCase for vars/functions.
- Formatting: Prettier 3 with Tailwind plugin; run `pnpm exec prettier --write` as needed.

## Testing Guidelines
- API uses Jest (`pnpm --filter api test`, coverage via `pnpm --filter api test:cov`).
- Frontend has no formal suite yet; add Vitest/RTL near features when logic grows (`__tests__` co-located).
- Keep tests deterministic; name test files `*.spec.ts` or `*.test.ts`.

## Commit & Pull Request Guidelines
- Commit format: `<type>(<scope>): <summary>` e.g., `feat(frontend): add matrix legend`.
- Scope examples: docs, data, frontend, api, infra, schemas, config.
- PRs: state purpose, link issue, include screenshots for UI changes (desktop + mobile) and note tests run.

## Security & Configuration Tips
- Never commit secrets; use local `.env` (not tracked). Mirror required keys in docs, not in code.
- Respect schema IDs/keys; no breaking changes to data models without explicit approval.
- Do not delete fields; prefer additive changes and document architecture shifts in `docs/adr/` when applicable.

## Agent-Specific Notes
- Preserve existing folder structure; avoid sweeping refactors unless requested.
- Favor minimal, reversible changes; ask when data is missing rather than guessing.
