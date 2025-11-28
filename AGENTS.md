# Repository Guidelines

## Project Structure & Ownership
- Frontend lives in `apps/frontend` (Next.js 16 + React 19). Public assets in `apps/frontend/public`, routes/components under `apps/frontend/app`.
- Domain data is JSON-only in `content/json/` (`clusters.json`, `segments.json`, `items.json`); schemas in `schemas/`. Never rename or drop IDs/keys without explicit approval.
- Docs and decisions: `docs/` (PRD, design guide, ADRs). Infrastructure assets under `infra/` (docker, traefik, scripts).

## Build, Test, and Development Commands
- Install deps once: `cd apps/frontend && npm install`.
- Dev server with hot reload: `npm run dev` (http://localhost:3000).
- Production bundle: `npm run build`; serve locally: `npm run start`.
- Lint all code: `npm run lint` (ESLint 9 via `eslint.config.mjs`).

## Coding Style & Naming Conventions
- TypeScript-first, ES modules. Prefer React Server Components unless client hooks required.
- TailwindCSS v4; keep utility-first styling, avoid ad-hoc inline styles when utilities exist.
- File naming: kebab-case for routes, PascalCase for React components, camelCase for functions/vars. Keep co-located styles/assets beside components.
- No inline comments in JSON/YAML/TOML; keep structures stable and additive.

## Testing Guidelines
- No automated suite yet; add tests alongside code when introducing logic-heavy modules. Use Next.js testing-compatible tools (e.g., Vitest/RTL) if added; place under `__tests__/` near source.
- For data changes, validate against `schemas/` before commit; ensure sample data still renders key views (Landing, Grid, Matrix, City).

## Commit & Pull Request Guidelines
- Commit style: `<type>: <summary>` (e.g., `feat: add matrix legend`, `fix: lint warnings`). Keep commits scoped and reversible.
- PRs should include: purpose, linked issue/reference, screenshots for UI changes (desktop + mobile), and test/QA notes (what you ran).
- Avoid breaking changes to data schemas or IDs; prefer additive migrations and document decisions in `docs/adr/` when architecture shifts.

## Security & Configuration Tips
- Never commit secrets. Environment variables belong in local `.env` files (not in git); mirror any required keys in docs instead of sample values.
- Scripts in `infra/scripts/` may assume local Docker; verify commands before running and avoid destructive operations unless requested.

## Agent-Specific Notes
- Respect existing structure; do not restructure folders without approval.
- When uncertain about data or behavior, ask rather than invent placeholders. Prefer minimal, deterministic changes over sweeping refactors.
