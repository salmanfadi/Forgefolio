# Forgefolio — SkillPath

Forgefolio is a skill-passport platform where learners follow curated career roadmaps, verify their skills through AI + mentor review, and share a public, score-backed profile that employers and referrers can trust.

## Features

- **Career roadmaps** — 5 structured roadmaps (Frontend, Backend, Data Analyst, Data Scientist, DevOps) with per-step theory and practical content, per-user progress, and completion tracking.
- **Skill passport** — a public profile page (`/u/[username]`) with skills, projects, badges, and roadmap completion.
- **Skill verification** — submit evidence (GitHub repo, LeetCode username, live URL), AI review, then mentor challenge flow.
- **Employability score** — weighted 6-component score (roadmap completion, verified skills, GitHub activity, LeetCode stats, mentor ratings, project quality).
- **Gamification** — XP, daily streaks, and badges.
- **Referral circle** (V2) — verified professionals can contact learners through a privacy-preserving relay.

## Tech stack

| Layer      | Tech                                                        |
| ---------- | ----------------------------------------------------------- |
| Web app    | Next.js 14 (App Router), TypeScript, Tailwind CSS            |
| Workers    | Node.js + BullMQ (Redis)                                     |
| Database   | PostgreSQL (Supabase) via Prisma                             |
| Monorepo   | pnpm workspaces + Turborepo                                  |
| Validation | Zod                                                          |

## Local setup (< 5 steps)

1. **Install dependencies** — requires Node.js 20+ and pnpm 9:
   ```bash
   corepack enable pnpm
   pnpm install
   ```
2. **Start PostgreSQL + Redis locally** (no cloud signup needed):
   ```bash
   docker compose up -d
   ```
   Or point `DATABASE_URL` at your own Supabase project.
3. **Configure environment**:
   ```bash
   cp .env.example .env   # then fill in the values you need
   ```
4. **Run migrations and seed demo data**:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```
5. **Start the dev server**:
   ```bash
   pnpm dev   # web app on http://localhost:3000
   ```

## Project structure

```
apps/
  web/        Next.js app (App Router) — UI + API routes
  workers/    BullMQ workers (AI verification, email, score recompute, GitHub sync)
packages/
  db/         Prisma schema, migrations, seed
  types/      Shared TypeScript types
  config/     Shared tsconfig base
content/
  roadmaps/   Roadmap JSON content (validated with Zod at runtime)
docs/         SRS, architecture, design notes, checklists
```

## Development

```bash
pnpm dev          # run the web app
pnpm build        # build all workspaces
pnpm lint         # eslint across workspaces
pnpm type-check   # tsc --noEmit across workspaces
pnpm test         # unit tests
```

See [`docs/checklists.md`](docs/checklists.md) for the per-phase implementation status and [`docs/architecture.md`](docs/architecture.md) for system design.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and open a PR against `main`. Roadmap content contributions have a dedicated issue template.

## License

[MIT](LICENSE)
