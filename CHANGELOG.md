# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Missing workspace plumbing: `apps/web/package.json`, `next.config.mjs`, `postcss.config.js`, root `eslint.config.js` and `prettier.config.js`
- `.env.example` with all service placeholders (Supabase, Upstash Redis, Auth.js, Resend, Cloudflare R2, Anthropic, LinkedIn)
- GitHub Actions CI (lint → type-check → test → build) with a `pnpm audit` step
- Dependabot config (npm + GitHub Actions, weekly)
- Issue templates (bug report, feature request, roadmap contribution) and PR template
- `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `CHANGELOG.md`
- DB-backed roadmap progress: step completion persists to `UserProgress` (idempotent upsert), replacing the in-memory store
- DB-backed roadmap contributions: submissions are stored with `OPEN` status in `RoadmapContribution`
- `Step.contentId` column linking DB step rows to roadmap JSON step IDs
- DB-backed project portfolio: `/projects` page with add form; `GET`/`POST /api/projects` persist to the `Project` table
- Contribution submission form on `/contribute` (roadmap + type + summary) posting to the DB-backed API
- `resolveActorUser` helper: unauthenticated requests act on the seeded demo learner until Phase 1A auth lands

### Fixed

- Roadmap seed script could not find `content/roadmaps` when run from `packages/db` (path now resolved from the monorepo root)
- `apps/web` client bundle broke the production build (`fs` import) — roadmap content loading moved to a server-only module
- Invalid route export (`DailyTaskSchema`) rejected by Next.js route type-checking
- ~26 unused imports/variables flagged by ESLint; useless escape in settings username regex
