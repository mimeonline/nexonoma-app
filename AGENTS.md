# Repository Guidelines

## Project Structure & Modules

- `apps/frontend/`: Next.js 16 app router; UI lives in `app/` with Tailwind CSS v4 in `globals.css`.
- `content/json/`: source data (`clusters.json`, `segments.json`, `items.json`). Keep schemas stable; add fields instead of renaming/removing.
- `docs/app/`: product/architecture references (`PROJECT.md`, `DATA_MODEL.md`, `DESIGN_GUIDE.md`, `PRD-MVP.md`). Consult before UX or data changes.
- `infra/`: deployment and tooling stubs (docker, traefik). Extend cautiously.

## Build, Run, and Lint

- Install deps: `cd apps/frontend && npm install`.
- Local dev: `npm run dev` (<http://localhost:3000>).
- Production build: `npm run build`; run `npm run start` to verify the compiled app.
- Lint: `npm run lint` (ESLint with Next core‑web‑vitals + TypeScript rules). Fix or justify any warning before pushing.

## Coding Style & Naming

- Language: TypeScript with strict mode; prefer server components unless client state is required (`"use client"`).
- Styling: Tailwind utility classes; keep spacing/typography consistent with `DESIGN_GUIDE.md` (marine navy base palette). Avoid inline styles when a utility exists.
- Components: PascalCase filenames; colocate small components under their usage; export clear props interfaces.
- Data: Do not mutate IDs/keys in JSON. Append new fields rather than deleting or renaming existing ones.

## Testing Guidelines

- No automated suite is wired yet; add targeted checks when introducing logic (e.g., React Testing Library for UI, Playwright for flows). Keep tests alongside code in `__tests__` or `*.test.tsx`.
- Manual smoke check after changes: `npm run build` then `npm run start` and load main views.

## Commit & Pull Request Practices

- Commits: short, imperative English (`Add grid view layout`, `Fix lint warnings`). Keep related changes together.
- PRs: include purpose, linked issue/reference, and screenshots/GIFs for UI changes. Note data/schema impacts explicitly and point reviewers to updated JSON files.

## Security & Configuration

- No secrets in the repo; use local `.env` for credentials if ever introduced and add to `.gitignore`.
- Validate third‑party assets/licences before committing to `public/`.
