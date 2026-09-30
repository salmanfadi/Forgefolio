# Contributing to Forgefolio

Thanks for your interest in contributing! This document covers the workflow and standards for this repository.

## Getting started

1. Fork the repo (or ask to be added as a collaborator) and clone your fork.
2. Enable pnpm and install dependencies:
   ```bash
   corepack enable pnpm
   pnpm install
   ```
3. Copy `.env.example` to `.env` and fill in the values you need. Never commit `.env`.
4. Bring up local PostgreSQL + Redis with `docker compose up -d`, then run `pnpm db:migrate && pnpm db:seed`.

## Code style

- **TypeScript everywhere** — strict mode; no `any` (enforced by ESLint).
- **Formatting** — Prettier (`prettier.config.js`): no semicolons, single quotes, 100-char width. Run `npx prettier --write .` before committing.
- **Validation** — all API request bodies are validated with Zod. No raw unsanitised writes to the database.
- **Types** — shared API types live in `packages/types`. If you add a Prisma model or API response shape, add the matching TS type in the same PR.

## Branch naming

- `feat/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `docs/<short-description>` — documentation only
- `chore/<short-description>` — tooling, CI, dependencies

## Commit messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) style:

```
feat(roadmaps): persist step progress in UserProgress table
fix(dashboard): correct streak display across midnight boundary
docs: mark Phase 1B checklist items complete
```

## PR process

1. Open a PR against `main` using the PR template (tests, docs, changelog).
2. CI must pass: lint → type-check → test → build.
3. At least one maintainer review is required for merge.
4. PRs that add or change API routes should include the matching updates in `packages/types` and tests where practical.

## Roadmap content contributions

Roadmap content lives in `content/roadmaps/<slug>/roadmap.json` and is validated with Zod at runtime. Use the **Roadmap Contribution** issue template to propose new resources, steps, or modules before opening a PR — maintainer approval on the issue keeps content reviews fast.

## Reporting issues

Use the issue templates (Bug Report / Feature Request / Roadmap Contribution). For security vulnerabilities, see `SECURITY` contact in `CODE_OF_CONDUCT.md` — do not open a public issue.
