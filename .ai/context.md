# ForgeForge — Project Context

Paste this entire file as your first message in every AI coding session.

---

## What this project is

**ForgeForge** is an open-source career acceleration platform for unemployed graduates in India.
Learners follow structured community-maintained roadmaps, build real projects, get skills
verified by mentors, and share a public Skill Passport to attract referrals from working professionals.

Core philosophy: employment based on demonstrated skills and projects, not certificates.
80% practical learning, 20% theory.

---

## Tech stack

- **Frontend + API:** Next.js 14 App Router, TypeScript strict mode
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Auth.js v5 — Google OAuth + GitHub OAuth only
- **Background jobs:** BullMQ + Redis
- **AI:** Anthropic Claude API (claude-sonnet-4-6)
- **Email:** Resend
- **Storage:** Cloudflare R2
- **Package manager:** pnpm monorepo with Turborepo
- **Testing:** Vitest (unit + integration), Playwright (e2e)

---

## Theme

Light mode primary, dark mode via toggle.
**Warm white (#F7F8F5) + Emerald green (#16A34A).**
All colours via CSS tokens in `apps/web/src/styles/tokens.css`.
Dark mode tokens under `[data-theme="dark"]`.

---

## User roles (in order of permission)

LEARNER → CONTRIBUTOR → MENTOR → SENIOR_MENTOR → DOMAIN_EXPERT → WORKING_PROFESSIONAL → ADMIN

---

## Current build phase

V1 Core Platform. V2 (Referral Circle) comes after V1 is complete.

---

## Key constraint

Always read `.ai/agents.md` and `.ai/folder-map.md` before writing any code.