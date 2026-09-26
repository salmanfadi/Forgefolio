# SkillPath — Agent Instructions

> Read this file completely before writing a single line of code, editing any file, or running any command.

---

## What this project is

SkillPath is an open-source career acceleration platform for unemployed graduates in India. It helps learners follow structured roadmaps, build verified portfolios, and get discovered by working professionals for referrals.

**Tech stack:** Next.js 14 (App Router) · Node.js · PostgreSQL · Prisma · BullMQ · Redis · Anthropic Claude API  
**Auth:** Google OAuth + GitHub OAuth via Auth.js v5  
**Theme:** Warm white + emerald green, light-first, dark mode via toggle  
**Language:** TypeScript everywhere. Strict mode on.

---

## Absolute rules — never break these

1. **Never expose user email addresses** in any API response, console log, or client-side code. Email is server-side only. The contact form relay is the only email send path.
2. **Never store OAuth tokens in plaintext.** GitHub and LinkedIn tokens must be encrypted with AES-256 before writing to the database. Use `lib/crypto.ts` for this.
3. **Never use `any` in TypeScript.** Use `unknown` and narrow, or define a proper type in `packages/types`.
4. **Never hardcode colours or spacing.** All CSS must use tokens from `apps/web/styles/tokens.css`. See the Design Token Reference below.
5. **Never write raw SQL with string interpolation.** Use Prisma's parameterised queries only.
6. **Never skip Zod validation on API inputs.** Every API route handler must validate request body/params with a Zod schema before touching the database.
7. **Never use `localStorage` for auth tokens.** Tokens live in httpOnly cookies only (handled by Auth.js).
8. **All interactive elements must meet WCAG 2.5.5 (min 44×44px touch target).** Check before marking UI work done.
9. **All transitions must be wrapped in `@media (prefers-reduced-motion: no-preference)`.** Never apply transitions unconditionally.
10. **One filled primary button per screen.** If you add a button, check that no other filled primary button exists on the same page.

---

## Project structure

```
skillpath/                          ← monorepo root
├── apps/
│   ├── web/                        ← Next.js 14 app (frontend + API routes)
│   └── workers/                    ← Standalone Node.js background worker
├── packages/
│   ├── db/                         ← Prisma schema + migrations (shared)
│   ├── types/                      ← Shared TypeScript types
│   └── config/                     ← Shared ESLint, Tailwind, TS config
├── content/
│   └── roadmaps/                   ← JSON roadmap content (separate git repo mirror)
└── docs/                           ← All project documentation
    ├── AGENTS.md                   ← THIS FILE — read first
    ├── architecture.md             ← System design, DB schema, API routes, job queues
    ├── checklists.md               ← Pre-launch and per-phase checklists
    ├── legal.md                    ← Indian cyber law (DPDPA 2023, IT Act, IT Rules 2021)
    ├── opensource.md               ← Contributing guide, governance, content format
    ├── SRS.md                      ← Full software requirements specification
    ├── ui-design.md                ← UI/UX design document (tokens, components, screens)
    └── ui-revision-notes.md        ← WCAG violation log and fixes
```

Full expanded folder structure is in `docs/FOLDER_STRUCTURE.md`.

---

## Key file locations — find things fast

| What you need | Where it lives |
|---|---|
| Database schema | `packages/db/schema.prisma` |
| All API routes | `apps/web/app/api/` |
| Prisma client singleton | `apps/web/lib/db.ts` |
| Auth config | `apps/web/lib/auth.ts` |
| CSS design tokens | `apps/web/styles/tokens.css` |
| Shared TypeScript types | `packages/types/index.ts` |
| Score computation | `apps/web/lib/score.ts` |
| Encryption utilities | `apps/web/lib/crypto.ts` |
| Email relay | `apps/web/lib/email.ts` |
| BullMQ queue producers | `apps/web/lib/queue.ts` |
| BullMQ job workers | `apps/workers/jobs/` |
| Roadmap JSON schema | `content/roadmaps/schema.json` |
| Environment variables | `.env` (never commit) · `.env.example` (commit this) |

---

## Design token reference (use these, never hardcode)

### Colours
```css
/* Primary emerald */
--tok-primary: #16A34A          /* main action colour */
--tok-primary-dark: #15803D     /* hover state */
--tok-primary-border: rgba(22,163,74,0.25)

/* Backgrounds */
--bg-base: #F7F8F5              /* page shell */
--bg-surface: #FFFFFF           /* sidebar, topbar */
--bg-raised: #FFFFFF            /* cards */
--bg-overlay: #F0F4EE           /* hover fills */
--bg-primary: rgba(22,163,74,0.08)   /* tinted areas */

/* Text */
--txt-primary: #111827          /* headings, values */
--txt-secondary: #4B5563        /* body text */
--txt-tertiary: #9CA3AF         /* metadata only */
--txt-accent: #16A34A           /* active state text */

/* Dark mode — applied via [data-theme="dark"] on <html> */
/* See apps/web/styles/tokens.css for full dark token set */
```

### Spacing (8-point only)
```css
--sp-4: 4px   --sp-8: 8px   --sp-16: 16px  --sp-24: 24px
--sp-32: 32px --sp-40: 40px --sp-48: 48px  --sp-64: 64px
```

### Typography
```
12px / 14px / 16px / 20px / 24px / 32px / 40px — only these sizes
Font weights: 400 and 500 only. Never 600 or 700.
```

### Focus ring
```css
:focus-visible { outline: none; box-shadow: var(--border-focus); }
--border-focus: 0 0 0 3px rgba(22,163,74,0.40);
```

---

## Authentication rules

- Auth is handled entirely by Auth.js v5 (`apps/web/lib/auth.ts`)
- Session is accessed via `auth()` in server components and `useSession()` in client components
- Protected routes check session in middleware (`apps/web/middleware.ts`)
- New users default to `LEARNER` role — never assign higher roles without explicit admin action
- GitHub OAuth token from the learner is used for skill verification — store encrypted, retrieve with `crypto.decryptToken()`

---

## API conventions

Every API route must follow this pattern:

```typescript
// 1. Validate input with Zod — before anything else
const body = RequestSchema.safeParse(await req.json())
if (!body.success) return Response.json({ error: { code: 'INVALID_INPUT', message: body.error.message } }, { status: 400 })

// 2. Check auth
const session = await auth()
if (!session) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

// 3. Check role/permission
if (session.user.role !== 'MENTOR') return Response.json({ error: { code: 'FORBIDDEN' } }, { status: 403 })

// 4. Do the work inside a try/catch
// 5. Return consistent shape: { data: ... } on success, { error: { code, message } } on failure
// 6. Never include user.email in any response body
```

---

## Background jobs

Job queues use BullMQ + Redis. Producers live in `apps/web/lib/queue.ts`. Consumers live in `apps/workers/jobs/`.

| Queue name | Trigger | What it does |
|---|---|---|
| `score-recompute` | Step complete, new verified skill | Recomputes employability score, updates DB |
| `ai-verification` | Verification request submitted | Calls GitHub API → Claude API → stores aiReport |
| `email-dispatch` | Verification status change, contact form | Sends via Resend, never exposes learner email |
| `github-sync` | Daily cron | Refreshes GitHub activity for active learners |

Never do heavy work in an API route. Enqueue a job instead.

---

## Employability score formula

```typescript
// apps/web/lib/score.ts
const weights = {
  roadmapCompletion: 0.20,   // steps completed / total steps
  verifiedSkills:    0.25,   // mentor-verified skill count × 12.5, capped at 100
  githubActivity:    0.15,   // log-normalised commit count + streak bonus
  leetcodeStats:     0.10,   // (easy×1 + medium×2 + hard×3) / target × 100
  mentorRatings:     0.20,   // avg mentor rating / 5 × 100
  projectQuality:    0.10,   // avg(aiQualityScore + mentorScore) / 2
}
// Each component normalised 0–100 before weighting. Total capped at 100.
```

---

## Legal constraints — read before building any data feature

Full details in `docs/legal.md`. Summary of hard rules:

- **DPDPA 2023**: Consent must be recorded in `ConsentRecord` table before processing personal data. See schema.
- **Children**: Platform is 18+. Hard gate on registration. Under-18 users must not have data processed.
- **Data erasure**: Account deletion must erase all personal data within 72 hours. See `lib/deletion.ts`.
- **Contact relay**: Professional's message is emailed to learner server-side. Learner email never returned in any API response.
- **IT Rules 2021**: Grievance Officer contact must be published. Content removal within 36 hours of valid order.

---

## Common mistakes to avoid

- Adding `console.log(user.email)` anywhere — never log PII
- Returning the full Prisma user object from an API — always `select` only needed fields
- Using `Math.random()` for anything security-related — use `crypto.randomBytes()`
- Forgetting `aria-label` on icon-only buttons
- Setting font-size below 12px
- Using `position: fixed` in any component (breaks layout in certain render contexts)
- Adding a spinner instead of a skeleton loader
- Writing `font-weight: 600` or `700`
- Using `useEffect` to fetch data — use React Query or server components instead
- Creating a new Prisma client per request — always import from `lib/db.ts`
