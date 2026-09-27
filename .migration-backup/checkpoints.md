# SkillPath (Forgefolio) — Feature Checkpoints & Implementation Roadmap

> **Status Tracking Document**  
> **Last Updated:** September 26, 2026  
> **Database:** PostgreSQL (Supabase Connected) & Prisma ORM  

---

## 📊 Overall Progress Summary

| Phase | Module / Domain | Status | Completed | Total |
| :--- | :--- | :---: | :---: | :---: |
| **Phase 0** | Project Bootstrap & Database Setup | 🟡 In Progress | 12 | 16 |
| **Phase 1A** | Auth & Onboarding | 🟡 In Progress | 7 | 15 |
| **Phase 1B** | Career Roadmaps | 🟡 In Progress | 9 | 15 |
| **Phase 1C** | Skill Passport (`/u/[username]`) | 🟡 In Progress | 8 | 12 |
| **Phase 1D** | Skill Verification & AI Review | 🟡 In Progress | 6 | 18 |
| **Phase 1E** | Gamification (XP, Badges, Streaks) | 🟡 In Progress | 5 | 14 |
| **Phase 1F** | Employability Score Engine | 🟡 In Progress | 4 | 9 |
| **Phase 1G** | Community & Mentor Dashboard | 🟡 In Progress | 4 | 7 |
| **Phase 1H** | Notifications & Dynamic Sharing | 🟡 In Progress | 3 | 7 |
| **Phase 2** | Referral Circle (V2) | 🟡 In Progress | 5 | 23 |

---

## 🛠️ Detailed Checkpoints Breakdown

### 1. Phase 0 — Bootstrap & Core Infrastructure
- [x] Monorepo initialization with Turborepo (`pnpm`)
- [x] Web client set up with Next.js 14 App Router & TypeScript (`apps/web`)
- [x] Worker process set up (`apps/workers`)
- [x] Shared database package with Prisma schema (`packages/db`)
- [x] Database connected to Supabase PostgreSQL instance
- [x] Prisma initial schema migration created (`20260926143325_init`)
- [x] Design token system & CSS variables established (`apps/web/src/styles/tokens.css`)
- [x] Shared UI component library created (Buttons, Cards, Badges, Inputs, Modals, Progress Bars)
- [x] All 5 domain roadmap JSON contents authored (`content/roadmaps/`)
- [ ] Database seed script execution with initial domain roadmaps, default skills, badges, and demo users
- [ ] Redis / Upstash client configured for background worker queues (`BullMQ`)
- [ ] Auth.js v5 Google & GitHub OAuth provider runtime keys active
- [ ] Resend email dispatch integration configured
- [ ] Cloudflare R2 / S3 storage handler for avatars & project screenshots
- [ ] Continuous Integration (CI) pipeline setup with GitHub Actions
- [ ] Environmental credentials populated in `.env` for production parity

---

### 2. Phase 1A — Authentication & Onboarding
- [x] Login page layout & UI components (`/login`)
- [x] Onboarding flow UI layout (`/onboarding`)
- [x] Role selection & career goal configuration
- [x] Auth API routes (`/api/auth/*`)
- [x] User database model with roles (`LEARNER`, `MENTOR`, `WORKING_PROFESSIONAL`, etc.)
- [x] Cryptographic utilities for sensitive field encryption (`lib/crypto.ts`)
- [x] Profile settings UI (`/settings`)
- [ ] Google OAuth sign-in active callback & session handler
- [ ] GitHub OAuth sign-in active callback & session handler
- [ ] Next.js Auth Middleware protecting `/dashboard/*` & `/api/*`
- [ ] Automatic onboarding redirect for first-time signups
- [ ] Account deletion flow & data erasure handler (DPDPA compliance)
- [ ] User privacy settings toggle (`isPublic`, `showReferralTab`)
- [ ] Username availability live validation API
- [ ] Session refresh & secure httpOnly cookie enforcement

---

### 3. Phase 1B — Career Roadmaps
- [x] Roadmap overview page (`/roadmap`)
- [x] Single roadmap view with modules and steps (`/roadmap/[slug]`)
- [x] Step detail view with theory & practical exercises (`/roadmap/[slug]/[stepId]`)
- [x] Progress bar components and status tags
- [x] Roadmap JSON schemas and domain structure (Frontend, Backend, Data Analyst, Data Scientist, DevOps)
- [x] Roadmap content loader utility (`lib/roadmaps.ts`)
- [x] Roadmap contribution form UI (`/contribute`)
- [x] Roadmap DB models (`Roadmap`, `Module`, `Step`, `UserProgress`)
- [x] Progress calculation logic (Module & Overall roadmap completion)
- [ ] Real-time database progress persistence (`POST /api/roadmaps/[slug]/progress`)
- [ ] Step completion idempotency & streak increment trigger
- [ ] Roadmap contribution submission API (`POST /api/roadmaps/contribute`)
- [ ] Mentor roadmap contribution review UI & approval workflow
- [ ] Auto-apply approved contributions to roadmap modules
- [ ] Interactive step completion toggle with instant UI feedback

---

### 4. Phase 1C — Skill Passport (`/u/[username]`)
- [x] Public profile layout (`/u/[username]`)
- [x] Profile header with avatar, bio, username, and career target
- [x] Employability score summary widget & breakdown chart
- [x] Verified skills list & level badges (`AI_VERIFIED`, `MENTOR_VERIFIED`)
- [x] Portfolio projects grid view
- [x] Roadmap progress summary card
- [x] Profile share modal & link copying UI
- [x] DB user queries for public profile generation
- [ ] 404 fallback for non-existent usernames
- [ ] Privacy check enforcement (`isPublic = false` returns 401/private page)
- [ ] Dynamic Open Graph image generation (`/api/og/u/[username]`)
- [ ] Projects management UI: Add / Edit / Delete projects with repo & live URL validation
- [ ] Public vs Owner view mode toggle (Edit button visible only to profile owner)

---

### 5. Phase 1D — Skill Verification & AI Review
- [x] Verification request page (`/verify`)
- [x] Submission form with GitHub URL, LeetCode username, and live project link
- [x] AI analysis report schema & visualization component
- [x] Verification request status pipeline (`PENDING`, `AI_REVIEW`, `MENTOR_ASSIGNED`, `CHALLENGE_ISSUED`, `COMPLETED`, `REJECTED`)
- [x] Verification DB models (`Skill`, `UserSkill`, `VerificationRequest`, `MentorFeedback`)
- [x] Verification API route handlers
- [ ] `ai-verification` background worker job implementation
- [ ] GitHub repository metadata & commit analysis fetcher
- [ ] Anthropic Claude API prompt integration for automated code review
- [ ] Notification dispatch upon AI review completion
- [ ] Mentor domain verification queue page (`/mentors`)
- [ ] Mentor claim & challenge issuance interface
- [ ] Learner challenge submission & response portal
- [ ] Mentor final approval / rejection with feedback
- [ ] Automatic status upgrade to `MENTOR_VERIFIED` on pass
- [ ] 7-day cooldown guard logic before re-submitting rejected skills
- [ ] Score recomputation event trigger after skill verification
- [ ] Senior Mentor override flow & audit logger

---

### 6. Phase 1E — Gamification (XP, Badges & Streaks)
- [x] XP display badges & user levels on dashboard
- [x] Streak counter UI & fire icon widget
- [x] Badges gallery view & earned badge highlights
- [x] DB models for Gamification (`Badge`, `UserBadge`, `Streak`)
- [x] XP reward configuration map per activity
- [ ] Event-driven XP allocation service (`awardXP(userId, eventType)`)
- [ ] Daily activity detection & streak calculation logic
- [ ] Midnight IST streak reset background cron task
- [ ] Automated badge evaluator engine on event completion:
  - [ ] *"First Project"* (awarded on project creation)
  - [ ] *"First Verification"* (awarded on first `MENTOR_VERIFIED` skill)
  - [ ] *"Mentor Approved"* (awarded on challenge pass)
  - [ ] *"Open Source Contributor"* (awarded on contribution approval)
- [ ] Claude-powered daily task generator tailored to user's roadmap progress
- [ ] Domain-specific leaderboard UI (Top 10 learners by XP)
- [ ] Privacy filter on leaderboard (respects `isPublic` setting)

---

### 7. Phase 1F — Employability Score Engine
- [x] Employability score donut chart & breakdown UI
- [x] Employability score DB model (`EmployabilityScore`)
- [x] Score calculation formula definition (`lib/score.ts`):
  - Roadmap Completion (25%)
  - Verified Skills (25%)
  - GitHub Activity & Code Quality (20%)
  - LeetCode / Algorithmic Problem Solving (10%)
  - Mentor Feedback Ratings (10%)
  - Project Complexity & AI Assessment (10%)
- [x] Score computation utility with 0–100 normalization
- [ ] Automated background job for periodic score recomputation
- [ ] Real-time score recomputation trigger on verification / progress updates
- [ ] Score breakdown history & progression timeline
- [ ] Detailed performance breakdown modal for learners
- [ ] Employability score display on directory candidate cards

---

### 8. Phase 1G — Community & Mentor Dashboard
- [x] Mentor portal layout (`/mentors`)
- [x] Review queue listing UI
- [x] Contribution review interface (`/contribute/review`)
- [x] Admin user management page (`/admin/users`)
- [ ] Queue domain filtering (Frontend, Backend, Data, DevOps)
- [ ] Mentor XP reward system on completed reviews
- [ ] Admin role elevation flow (`LEARNER` → `MENTOR` / `SENIOR_MENTOR`)

---

### 9. Phase 1H — Notifications & Dynamic Sharing
- [x] In-app notification bell UI & drawer
- [x] Notification database model / types
- [x] Share link generator & clipboard helper
- [ ] Real-time notification dispatch service (In-app alerts)
- [ ] Email notification trigger via Resend (Status updates, challenges)
- [ ] Dynamic Open Graph image generation per learner profile
- [ ] Weekly progress digest background email generator

---

### 10. Phase 2 — Referral Circle (V2)
- [x] Public Candidate Directory (`/directory`)
- [x] Candidate filter sidebar (Target role, min score, top skills, completion %)
- [x] Candidate card components
- [x] Referral contact request modal UI
- [x] DB models for Referral Circle (`WorkingProfessional`, `ContactMessage`)
- [ ] Working Professional registration & verification route
- [ ] LinkedIn OAuth integration for current employer verification
- [ ] Encrypted OAuth token storage at rest
- [ ] Learner profile contact button visibility rules (Visible only to verified professionals)
- [ ] Secure email relay system (Learner's email address is NEVER exposed)
- [ ] Anti-spam rate limiting (Max 5 contact messages per professional / day)
- [ ] Learner block & spam report functionality
- [ ] Referral Circle tab toggle (`showReferralTab` setting support)

---

## 🎯 Immediate Priority Action Items

1. **Database Seeding (`packages/db/seed.ts`)**:
   - Seed database with all 5 domain roadmaps from JSON content.
   - Seed initial skill catalog (`React`, `TypeScript`, `Node.js`, `Python`, `Docker`, `SQL`, etc.).
   - Seed system badges (*First Project*, *First Verification*, *Open Source Contributor*, *Streak Master*).
   - Seed demo admin, mentor, and learner user accounts.

2. **Database Connection & Verification**:
   - Run `pnpm db:generate` to generate Prisma client.
   - Run `pnpm db:migrate` or `pnpm db:push` to ensure Supabase schema is completely synced.
   - Execute `pnpm db:seed` to populate Supabase DB.

3. **API & Dynamic Data Wiring**:
   - Connect `/api/roadmaps` to Prisma DB for real dynamic fetching.
   - Connect `/api/roadmaps/[slug]/progress` to toggle user progress and recalculate completion %.
   - Connect `/api/skills` and `/api/skills/verify` to record verification requests in Supabase.
   - Connect `/api/score` to compute & store real employability scores in Supabase.

4. **Authentication & Session Bridge**:
   - Ensure Auth.js v5 route handlers interact seamlessly with Prisma user records.
   - Enforce route middleware on protected pages.

5. **Gamification & XP Engine**:
   - Integrate XP awards into step completion, verification, and project creation.
