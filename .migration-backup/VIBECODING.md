# SkillPath — Vibe Coding Guide

How to work with AI agents (Cursor, Windsurf, GitHub Copilot, Claude) to build this app without losing control of quality, architecture, or compliance.

---

## Before every session — mandatory context drops

Paste these into the AI chat at the start of every session. They stop the agent from guessing.

### Drop 1 — Project identity (paste once per session)
```
I am building SkillPath — an open-source career acceleration platform.
Stack: Next.js 14 App Router, Node.js, PostgreSQL, Prisma, BullMQ, Redis, Auth.js v5, Anthropic Claude API.
Theme: warm white + emerald green, light-first. Tokens in apps/web/styles/tokens.css.
All docs are in /docs. Always read docs/AGENTS.md before generating code.
TypeScript strict mode. No any. Font weights 400 and 500 only. 8-point spacing grid only.
```

### Drop 2 — Current task context (paste at start of each task)
```
Current file: [paste the file path you are working in]
Current phase: [e.g. Phase 1B — Roadmaps]
Relevant requirements: [e.g. ROAD-01, ROAD-04, ROAD-05 from docs/SRS.md]
Do not touch: [list files you don't want changed]
```

### Drop 3 — After any AI generation (paste before accepting code)
```
Before I accept this, check:
1. Are any colours hardcoded? (must use var(--token))
2. Are any spacing values arbitrary? (must use var(--sp-N))
3. Is user.email in any response object?
4. Is there a Zod schema validating the API input?
5. Are all interactive elements ≥ 44px?
6. Is there more than one filled primary button on this screen?
7. Are all transitions inside prefers-reduced-motion media query?
```

---

## Prompt templates by task type

Copy, fill the brackets, paste into your AI tool.

---

### New API route

```
Create a Next.js 14 App Router API route at [path].

It should [describe what it does].

Requirements from SRS: [e.g. VER-01, VER-03]

Rules:
- Validate input with Zod before anything else
- Check session with auth() from lib/auth.ts
- Check user role: [required role]
- Use Prisma from lib/db.ts — never create a new PrismaClient
- Never return user.email in any response
- Return { data: ... } on success, { error: { code, message } } on failure
- Wrap DB calls in try/catch
- If this triggers a background job, use lib/queue.ts to enqueue — never do heavy work in the route
```

---

### New React component

```
Create a React component: [ComponentName]

Location: apps/web/components/[folder]/[ComponentName].tsx

It should [describe what it does and what props it receives].

Rules:
- TypeScript — no any, define props interface
- All colours: var(--token-name) from tokens.css — no hardcoded hex
- All spacing: var(--sp-4/8/16/24/32) — no arbitrary px values
- Font sizes: 12/14/16/20/24px only. Weights: 400 or 500 only.
- All interactive elements: min-height and min-width 44px (WCAG 2.5.5)
- All icon-only buttons: aria-label describing the action
- All decorative icons: aria-hidden="true"
- Focus ring: :focus-visible { box-shadow: var(--border-focus) }
- If this has transitions: wrap in @media (prefers-reduced-motion: no-preference)
- One filled primary button maximum — use ghost/outline for others
- Skeleton loader for async content — no spinners

Atomic level: [Atom / Molecule / Organism]
```

---

### New page

```
Create a Next.js page at [route path].

It is [public / protected — requires auth / mentor-only].

The page renders: [describe main content sections]

Visual hierarchy order:
1. Primary action: [what is the ONE primary CTA?]
2. Important info: [key data to show]
3. Secondary actions: [supporting interactions]
4. Supporting content: [contextual/supplemental]

Empty state: [what to show when there's no data]
Loading state: [use skeleton loaders, no spinners]
Error state: [what to show if fetch fails — must explain problem + recovery]

Requirements: [SRS IDs]
```

---

### Prisma migration

```
Add a Prisma migration for [describe change].

Current schema is in packages/db/schema.prisma.

The change is: [describe new model, field, or relation]

Rules:
- Migration must be reversible
- Add appropriate @@index() for any field used in WHERE clauses or sorting
- If storing sensitive data (tokens, emails): note that application-level encryption is required via lib/crypto.ts
- If this is a new table that stores personal data: add it to the deletion flow in lib/deletion.ts
- Run: pnpm db:migrate to apply
```

---

### Background job

```
Create a BullMQ job worker at apps/workers/jobs/[job-name].ts.

Job name: [name]
Queue name: [queue-name] (must match producer in lib/queue.ts)

What it does:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Rules:
- Import Prisma from packages/db (not a new client)
- Catch all errors — a crashed job must not crash the worker process
- Never log user.email or other PII
- If calling external APIs (GitHub, Claude, LeetCode): handle rate limit errors with exponential backoff
- On success: update the relevant DB record and enqueue any follow-up jobs
- Job must be idempotent — safe to run twice with same data
```

---

### Fixing a WCAG violation

```
Fix this WCAG violation in [file path]:

Violation: [describe the issue, e.g. "Icon button has no aria-label"]
WCAG criterion: [e.g. 4.1.2 Name, Role, Value]

Fix requirements:
- [specific fix]
- Do not change any visual styling or layout
- Do not change any other functionality
- Verify fix does not introduce new violations
```

---

### Writing a test

```
Write a [unit / integration / e2e] test for [what to test].

Test file location: [path]
Test runner: Vitest (unit/integration) | Playwright (e2e)

Cases to cover:
1. Happy path: [describe]
2. Error: [e.g. invalid input, no auth, wrong role]
3. Edge case: [e.g. empty array, zero score, first-time user]

Rules:
- Mock all external APIs (GitHub, Claude, LeetCode, Resend)
- Do not use real database in unit tests — mock Prisma
- Integration tests use a test database — see test setup in packages/db
- Never use real credentials in tests
```

---

## Red flags — stop and review if you see these

If the AI generates code containing any of the following, **do not accept it**. Fix first.

```
user.email             → never in response/log
console.log(user)      → never log full user objects
new PrismaClient()     → always import from lib/db.ts
font-weight: 600       → only 400 and 500
font-weight: 700       → only 400 and 500
font-size: 13px        → not on the allowed scale
margin: 13px           → not in the 8-point grid
padding: 10px          → not in the 8-point grid
#3B82F6               → old blue — replace with var(--tok-primary)
#0B1220               → old navy — replace with var(--bg-base)
localStorage.setItem('token')  → auth tokens never in localStorage
Math.random()          → use crypto.randomBytes() for security
position: fixed        → breaks layout in some render contexts
<div onClick          → use <button> for interactive elements
spinner               → use skeleton loaders instead
```

---

## Phase-by-phase build order

Build in this order. Don't skip phases.

### Phase 0 — Bootstrap (before any feature code)
- [ ] `pnpm create turbo` → init monorepo
- [ ] Set up `packages/db` with full Prisma schema
- [ ] Run `pnpm db:migrate`
- [ ] Run `pnpm db:seed` (demo data)
- [ ] Set up `apps/web` with Next.js 14 App Router
- [ ] Add `apps/web/styles/tokens.css` with full token set
- [ ] Set up Auth.js v5 with Google + GitHub
- [ ] Set up `apps/workers` with BullMQ
- [ ] Set up docker-compose.yml (PostgreSQL + Redis)
- [ ] Verify: `pnpm dev` runs without errors

### Phase 1A — Auth & Onboarding
Use prompt template: **New page** + **New API route**
Requirements: AUTH-01 through AUTH-06

### Phase 1B — Roadmaps
Use prompt template: **New page** (×3: roadmap list, roadmap detail, step detail)
Requirements: ROAD-01 through ROAD-07

### Phase 1C — Skill Passport
Use prompt template: **New page** (public /u/[username])
Requirements: PASS-01 through PASS-09

### Phase 1D — Skill Verification
Use prompt template: **New page** + **New API route** + **Background job**
Requirements: VER-01 through VER-09, AI-01, AI-02

### Phase 1E — Gamification
Use prompt template: **New API route** (×3: streaks, badges, XP events)
Requirements: GAME-01 through GAME-04

### Phase 1F — Employability Score
Use prompt template: **Background job** (score-recompute)
Requirements: Score formula in docs/AGENTS.md

### Phase 1G — Community & Mentor Dashboard
Use prompt template: **New page** (mentor queue + contribution review)
Requirements: MENT-01 through MENT-09

### Phase 1H — Notifications & Sharing
Use prompt template: **Background job** (email-dispatch) + **New API route** (og/)
Requirements: VER-06, PASS-07

### Phase 2 — Referral Circle (V2)
Requirements: REF-01 through REF-07, DIR-01 through DIR-08, CONT-01 through CONT-10

---

## Debugging prompts

### When the build fails
```
The build is failing with this error: [paste error]
File: [path]
Do not change any other files. Only fix this specific error.
The fix must not introduce any TypeScript errors or ESLint warnings.
```

### When a test fails
```
This test is failing: [test name]
Error: [paste error]
Test file: [path]
The implementation is in: [path]
Fix only the implementation — do not modify the test unless the test itself is wrong.
Explain what was wrong before changing anything.
```

### When layout looks wrong
```
The component at [path] has a layout issue: [describe what's wrong]
Do not change any logic or data fetching.
Do not change any token values.
Only adjust the CSS layout properties.
After fixing, verify: does every interactive element still meet 44px minimum?
```

---

## What to never ask the AI to do

- **"Generate the entire app"** — always break into one component or one route at a time
- **"Just make it work"** — always specify the requirements and constraints
- **"Add a spinner"** — it's a skeleton loader. Always.
- **"Use any colour that looks good"** — token names only
- **"Skip the Zod validation for now"** — never skip it
- **"Store the token in localStorage"** — never for auth tokens
- **"Just hardcode the email"** — emails are server-side only, always
