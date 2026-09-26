# SkillPath — Checklists

Pre-launch, per-feature, and ongoing operational checklists for every phase of development.

---

## 1. Project Bootstrap Checklist

Complete once before writing any feature code.

- [x] Initialise pnpm monorepo with Turborepo (`pnpm dlx create-turbo`)
- [x] Create `apps/web` (Next.js 14 with App Router + TypeScript)
- [x] Create `apps/workers` (Node.js + TypeScript worker process)
- [x] Create `packages/db` (Prisma schema)
- [x] Create `packages/types` (shared TypeScript types)
- [ ] Configure shared `tsconfig.json`, `eslint.config.js`, `prettier.config.js`
- [ ] Set up Tailwind CSS + shadcn/ui in `apps/web`
- [ ] Initialise PostgreSQL database (Neon or Supabase)
- [ ] Run `prisma migrate dev --name init` with full schema
- [ ] Set up Redis instance (Upstash)
- [ ] Configure Auth.js v5 with Google + GitHub providers
- [ ] Set up all environment variables (`.env.example` committed, `.env` git-ignored)
- [ ] Configure Resend email with verified domain
- [ ] Configure Cloudflare R2 bucket
- [ ] Set up Vercel project linked to GitHub repo
- [ ] Set up Railway/Render service for workers
- [x] Create `content/roadmaps/` directory with at least one complete roadmap JSON
- [ ] Configure GitHub Actions CI: lint → type-check → test → build
- [ ] Add `pnpm audit` step to CI
- [ ] Enable Dependabot for dependency updates
- [ ] Create GitHub issue templates (bug, feature, roadmap-contribution)
- [ ] Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE` to root

---

## 2. Phase 1A — Authentication & Onboarding

- [ ] Google OAuth sign-in working end-to-end
- [ ] GitHub OAuth sign-in working end-to-end
- [ ] New user → User record created in DB with LEARNER role
- [ ] Existing user → session restored correctly
- [ ] JWT stored in httpOnly + Secure + SameSite=Strict cookie
- [ ] Token refresh working
- [ ] `/onboarding` page shown only to new users
- [ ] Career role selection persisted to DB on onboarding submit
- [ ] Returning users redirected to `/dashboard`
- [ ] Auth middleware protecting all `/dashboard/*` and `/api/*` routes
- [ ] Unauthenticated users redirected to `/login` with `callbackUrl`
- [ ] Profile settings page: update name, bio, username, avatar
- [ ] Username uniqueness enforced (DB unique constraint + API check)
- [ ] Account deletion flow with data erasure (DPDPA compliance)
- [ ] Privacy settings page: toggle `isPublic`, `showReferralTab`
- [ ] Consent recorded at registration (see legal.md)

**Tests**
- [ ] Unit: Auth.js callback creates correct DB record
- [ ] Unit: Middleware blocks unauthenticated routes
- [ ] E2E: Full sign-in flow with Google (mock OAuth in CI)

---

## 3. Phase 1B — Career Roadmaps

- [x] Roadmap JSON schema defined and validated with Zod
- [x] All 5 roadmaps (Frontend, Backend, Data Analyst, Data Scientist, DevOps) authored and validated
- [ ] Roadmap seed script (`prisma/seed.ts`) inserts all roadmaps
- [x] `/roadmap/[slug]` page renders modules and steps
- [x] Step detail view: theory resources + practical exercises displayed
- [ ] `POST /api/roadmaps/[slug]/progress` marks a step complete
- [ ] Progress saved per user per step (`UserProgress`)
- [ ] Module completion % computed correctly
- [ ] Overall roadmap completion % computed correctly
- [ ] Progress bar component renders accurately
- [ ] Steps cannot be double-marked (idempotent endpoint)
- [ ] Roadmap contribution submission form working
- [ ] Contributions stored in DB with `OPEN` status
- [ ] Mentor+ can approve/reject contributions
- [ ] Approved contributions applied to roadmap content

**Tests**
- [ ] Unit: Completion % calculation edge cases (0%, 100%, partial)
- [ ] Unit: Contribution approval flow
- [ ] Integration: Progress endpoint persists correctly

---

## 4. Phase 1C — Skill Passport

- [x] `/u/[username]` route renders public profile
- [ ] 404 for non-existent username
- [ ] Profile hidden (401/blank) if `isPublic = false`
- [x] All profile sections render: skills, projects, scores, badges
- [ ] Learner can add/edit projects (title, description, repo URL, live URL)
- [ ] GitHub and LeetCode username fields linkable from profile
- [ ] Employability Score displayed with breakdown chart
- [ ] Roadmap completion % shown on passport
- [ ] Open Graph meta tags generated dynamically per profile
- [ ] Profile share link copies to clipboard
- [ ] `isPublic` toggle works from privacy settings
- [ ] Profile updates in real time (revalidation on mutation)

**Tests**
- [ ] Unit: OG image generation renders without crash
- [ ] E2E: Public profile accessible without auth
- [ ] E2E: Private profile returns 404 when not owner

---

## 5. Phase 1D — Skill Verification

- [ ] Verification request form: GitHub URL, LeetCode username, live URL inputs
- [ ] Validation: at least one evidence source required
- [ ] `POST /api/skills/[id]/verify` enqueues `ai-verification` job
- [ ] Worker: GitHub repo fetched via GitHub API
- [ ] Worker: Claude API called with repo data
- [ ] Worker: `aiReport` stored, status updated
- [ ] Worker: Learner notified (in-app + email) on AI review completion
- [ ] Mentor queue page lists all `AI_VERIFIED` requests for mentor's domain
- [ ] Mentor can accept a request from queue
- [ ] Mentor can view learner's full passport before accepting
- [ ] Mentor can issue a challenge with description + deadline
- [ ] Learner receives challenge notification
- [ ] Mentor can mark challenge as passed → status `COMPLETED`
- [ ] On `COMPLETED`: `UserSkill.verificationLevel` set to `MENTOR_VERIFIED`
- [ ] Score recompute job triggered on verification completion
- [ ] 7-day cooldown enforced on re-submission after rejection
- [ ] Mentor can leave qualitative feedback (not public)
- [ ] Senior Mentor override flow working with audit log

**Tests**
- [ ] Unit: AI verification job processes mock GitHub response correctly
- [ ] Unit: Cooldown enforcement logic
- [ ] Integration: Full verification flow from submission to MENTOR_VERIFIED
- [ ] Mock: Claude API response handling (success + failure)

---

## 6. Phase 1E — Gamification

- [ ] XP awarded on: step complete, project submit, skill verified, contribution approved
- [ ] XP totals stored and displayed on dashboard
- [ ] Daily streak: activity detected → streak incremented
- [ ] Streak resets at 00:00 IST if no activity previous day
- [ ] Streak displayed on profile and dashboard
- [ ] Badge engine: criteria evaluated after each XP event
- [ ] Badge "First Project" awarded on first project submission
- [ ] Badge "First Verification" awarded on first `MENTOR_VERIFIED` skill
- [ ] Badge "Mentor Approved" awarded on mentor challenge pass
- [ ] Badge "Open Source Contributor" awarded on first approved roadmap contribution
- [ ] Daily task suggestion generated by Claude API (scoped to current roadmap step)
- [ ] Daily tasks refresh daily (cached with IST date key)
- [ ] Opt-in leaderboard per roadmap showing top 10 by XP
- [ ] Leaderboard respects `isPublic` — private users excluded

**Tests**
- [ ] Unit: Badge criteria evaluator — all badge types
- [ ] Unit: Streak calculation across midnight boundary
- [ ] Unit: XP accumulation is additive, never negative

---

## 7. Phase 1F — Employability Score

- [ ] Score computation function unit-tested thoroughly
- [x] All 6 components normalised to 0–100 before weighting
- [x] Score capped at 100.0
- [ ] Score stored in `EmployabilityScore` table with `breakdown` JSON
- [ ] Score recomputed via background job (not on every request)
- [ ] Score displayed on dashboard with breakdown donut chart
- [ ] Score displayed on public passport
- [ ] Score shown on directory card (V2 dependency: stub now)
- [ ] `computedAt` timestamp shown ("Last updated X mins ago")

**Tests**
- [ ] Unit: Score computation — 20+ cases covering all input combinations
- [ ] Unit: Score stays between 0–100 with extreme inputs
- [ ] Integration: Score updates after verification completion

---

## 8. Phase 1G — Community & Mentor Dashboard

- [ ] Mentor dashboard: pending queue, completed reviews, stats
- [ ] Queue filterable by domain/skill
- [ ] "Pass" action returns request to global queue
- [ ] Mentor earns XP on completed reviews
- [ ] Roadmap contribution queue visible to Mentor+
- [ ] Admin panel: user role management, abuse reports
- [ ] Admin can promote user to Mentor tier

---

## 9. Phase 1H — Notifications & Sharing

- [ ] In-app notification bell with unread count
- [ ] Notifications for: verification status change, challenge issued, badge earned, contribution reviewed
- [ ] Email notification on verification status change
- [ ] Weekly digest email (opt-out in settings)
- [ ] Unsubscribe link in all marketing/digest emails (legal requirement)
- [ ] Open Graph image generated for profile sharing
- [ ] Profile URL is clean and shareable: `skillpath.dev/u/username`

---

## 10. V2 Checklist — Referral Circle

- [x] `WorkingProfessional` model in DB
- [ ] Professional registration page
- [ ] LinkedIn OAuth integrated (scoped to `r_basicprofile` + `r_emailaddress`)
- [ ] Employment verification logic: reject if no current employer in LinkedIn profile
- [ ] LinkedIn OAuth token encrypted before storage
- [ ] Professional dashboard: contact history, saved profiles
- [x] Public directory page `/directory` accessible without login
- [ ] Directory only shows `isPublic = true` learners
- [ ] Directory filter: target role, min employability score, skill, roadmap %
- [ ] Directory sort: employability score, completion, verified skill count
- [ ] Pagination: 20 cards per page
- [x] Learner card: name, role, score, top 5 skills, completion %, profile link
- [x] No email/contact info on directory cards
- [ ] Contact button on learner profile visible only to logged-in verified professionals
- [ ] Non-professionals see greyed-out button with explanation
- [ ] Contact form: pre-filled name/company, message (max 500 chars), referral intent flag
- [ ] Server-side email relay: learner email never in API response
- [ ] Email to learner includes professional's name, company, role, LinkedIn URL
- [ ] In-app notification to learner on new contact message
- [ ] Rate limit: 5 contact messages per professional per day
- [ ] Learner can block a professional
- [ ] Learner can report a message as spam
- [ ] 3 spam reports from different learners → admin review flag
- [ ] Admin can revoke professional status
- [ ] Referral Circle tab on learner profile (toggleable in settings)
- [ ] `showReferralTab = false` hides the tab while keeping rest of profile public

---

## 11. Pre-Launch Security Checklist

Run before every V1 and V2 release.

- [ ] `pnpm audit` — zero high/critical vulnerabilities
- [ ] OWASP Top 10 review completed
- [ ] All user inputs validated with Zod (API layer) — no raw unsanitised DB writes
- [ ] All user-generated content sanitised with DOMPurify before render
- [ ] SQL injection: Prisma parameterised queries used everywhere — no raw SQL with interpolation
- [ ] XSS: CSP headers configured; React escaping not bypassed (`dangerouslySetInnerHTML` grep passes)
- [ ] CSRF: SameSite=Strict cookie + CSRF token on state-mutating forms
- [ ] Rate limiting active on all public endpoints
- [ ] Auth middleware covers all protected routes (audit with route map)
- [ ] Learner email address: grep codebase — must not appear in any API response body
- [ ] GitHub OAuth tokens: confirmed encrypted at rest
- [ ] LinkedIn OAuth tokens: confirmed encrypted at rest
- [ ] `process.env` secrets: none hardcoded, all in `.env` (confirmed via `git grep`)
- [ ] HTTPS enforced: Vercel + worker service both redirect HTTP → HTTPS
- [ ] Dependency supply-chain: lockfile committed, `pnpm audit --audit-level=high` in CI
- [ ] Error messages: no stack traces exposed to client in production
- [ ] Logs: no PII (email, name, token) written to logs
- [ ] Breach notification plan documented (DPDPA requires notification without delay)

---

## 12. Pre-Launch Legal & Compliance Checklist

See `legal.md` for full details. Summary checklist:

- [ ] Privacy Policy published at `/privacy` (covers all DPDPA requirements)
- [ ] Terms of Service published at `/terms`
- [ ] Cookie consent banner implemented (opt-in, not pre-ticked)
- [ ] Consent recorded with timestamp + purpose in DB on registration
- [ ] Withdrawal of consent flow working (account deletion → data erasure)
- [ ] Data erasure: all personal data deleted within 72 hours of request
- [ ] Age declaration gate on registration
- [ ] Under-18 users: parental consent flow or hard block (see legal.md)
- [ ] Grievance Officer contact details published on platform
- [ ] Data breach response plan documented
- [ ] Contact form relay confirmed: learner email never exposed
- [ ] Professional contact rate limits enforced (anti-harassment)
- [ ] Terms prohibit: fake professional profiles, harassment, spam, impersonation
- [ ] IT Rules 2021 due-diligence requirements met (see legal.md)

---

## 13. Ongoing — Weekly Operations

- [ ] Check `pnpm audit` for new vulnerabilities
- [ ] Review BullMQ failed job queue — investigate and resolve failures
- [ ] Review spam report queue — action professional accounts flagged with 3+ reports
- [ ] Review pending roadmap contributions (target: < 5-day response time)
- [ ] Review mentor review queue depth — recruit more mentors if queue > 20 items
- [ ] Check Resend delivery dashboard — investigate bounced emails
- [ ] Review error logs (Vercel + Railway) for recurring 5xx errors
- [ ] Check database query performance — slow query log review

---

## 14. Ongoing — Monthly

- [ ] Dependency updates (Dependabot PRs review and merge)
- [ ] Review and rotate encryption keys (quarterly)
- [ ] Publish IT Rules 2021 compliance report (once > 5M users: monthly transparency report)
- [ ] Review community Code of Conduct reports
- [ ] Review and update roadmap content for any deprecated tools/versions
- [ ] Backup verification: confirm PostgreSQL automated backups restoring correctly
- [ ] Review employability score weights — adjust based on employer feedback

---

## 15. Open Source Community Checklist

- [ ] `README.md` with clear project description, screenshots, local setup in < 5 steps
- [ ] `CONTRIBUTING.md` with: code style, branch naming, PR template, review process
- [ ] `CODE_OF_CONDUCT.md` (Contributor Covenant recommended)
- [ ] `LICENSE` file (MIT or Apache 2.0)
- [ ] GitHub issue templates: Bug Report, Feature Request, Roadmap Contribution
- [ ] PR template with checklist (tests, docs, changelog)
- [ ] `CHANGELOG.md` updated on every release
- [ ] GitHub Discussions enabled for community Q&A
- [ ] GitHub Projects board for public roadmap visibility
- [ ] First-time contributor label + "good first issue" labels on suitable issues
- [ ] Local dev setup tested on macOS, Linux, and WSL2 Windows
- [x] `docker-compose.yml` for local PostgreSQL + Redis (no cloud signup needed to run locally)
- [ ] `prisma/seed.ts` with demo data so new contributors see a working app immediately
