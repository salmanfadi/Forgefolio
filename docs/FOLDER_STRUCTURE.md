# SkillPath — Complete Folder Structure

Every file and folder in the monorepo. Annotations explain the purpose of each.

---

```
skillpath/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # lint → typecheck → test → build on every PR
│   │   ├── preview.yml             # Vercel preview deploy on PR
│   │   └── release.yml             # Production deploy on main merge
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── roadmap_contribution.md
│   └── pull_request_template.md
│
├── apps/
│   │
│   ├── web/                        # Next.js 14 App Router application
│   │   │
│   │   ├── app/                    # Next.js app directory
│   │   │   │
│   │   │   ├── (auth)/             # Auth route group — no layout wrapper
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx    # Sign in page — Google + GitHub buttons
│   │   │   │   └── onboarding/
│   │   │   │       └── page.tsx    # Career role selection — first-time users only
│   │   │   │
│   │   │   ├── (app)/              # Authenticated app — wraps with AppLayout
│   │   │   │   ├── layout.tsx      # AppLayout: sidebar + topbar shell
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx    # Learner dashboard (primary screen)
│   │   │   │   ├── roadmap/
│   │   │   │   │   ├── page.tsx    # Roadmap selection list
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── page.tsx        # Full roadmap — modules + steps
│   │   │   │   │       └── [stepId]/
│   │   │   │   │           └── page.tsx    # Step detail — theory + practical
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx    # Project list
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx # Add project form
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx # Project detail + AI quality report
│   │   │   │   ├── verify/
│   │   │   │   │   ├── page.tsx    # Verification hub — pending + completed
│   │   │   │   │   └── [requestId]/
│   │   │   │   │       └── page.tsx # Verification status detail
│   │   │   │   ├── mentors/
│   │   │   │   │   ├── page.tsx    # Mentor queue (mentor+ only)
│   │   │   │   │   └── [requestId]/
│   │   │   │   │       └── page.tsx # Review a specific verification request
│   │   │   │   ├── contribute/
│   │   │   │   │   ├── page.tsx    # Roadmap contribution list
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx # Contribution detail + review
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx    # Account settings root
│   │   │   │       ├── privacy/
│   │   │   │       │   └── page.tsx # isPublic toggle, showReferralTab toggle
│   │   │   │       ├── notifications/
│   │   │   │       │   └── page.tsx # Email preferences + unsubscribe
│   │   │   │       └── danger/
│   │   │   │           └── page.tsx # Account deletion (data erasure)
│   │   │   │
│   │   │   ├── (public)/           # Public pages — no auth required
│   │   │   │   ├── layout.tsx      # PublicLayout: marketing nav + footer
│   │   │   │   ├── page.tsx        # Landing page (/)
│   │   │   │   ├── u/
│   │   │   │   │   └── [username]/
│   │   │   │   │       └── page.tsx # Skill Passport public profile
│   │   │   │   └── directory/
│   │   │   │       └── page.tsx    # Referral Circle public directory (V2)
│   │   │   │
│   │   │   ├── api/                # Next.js API routes
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth]/
│   │   │   │   │       └── route.ts  # Auth.js handler
│   │   │   │   ├── roadmaps/
│   │   │   │   │   ├── route.ts      # GET /api/roadmaps — list published
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── route.ts  # GET /api/roadmaps/[slug]
│   │   │   │   │       └── progress/
│   │   │   │   │           └── route.ts  # GET + POST progress
│   │   │   │   ├── skills/
│   │   │   │   │   ├── route.ts      # GET /api/skills
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── verify/
│   │   │   │   │           └── route.ts  # POST submit verification
│   │   │   │   ├── verification/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # GET status · PATCH mentor actions
│   │   │   │   ├── projects/
│   │   │   │   │   ├── route.ts      # GET list · POST create
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # GET · PATCH · DELETE
│   │   │   │   ├── score/
│   │   │   │   │   └── [userId]/
│   │   │   │   │       └── route.ts  # GET score + breakdown
│   │   │   │   ├── passport/
│   │   │   │   │   └── [username]/
│   │   │   │   │       └── route.ts  # GET public profile data
│   │   │   │   ├── gamification/
│   │   │   │   │   ├── streaks/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── badges/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── leaderboard/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── contributions/
│   │   │   │   │   ├── route.ts      # GET list · POST submit
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # PATCH review (mentor+)
│   │   │   │   ├── notifications/
│   │   │   │   │   └── route.ts      # GET list · PATCH mark-read
│   │   │   │   ├── ai/
│   │   │   │   │   ├── mentor/
│   │   │   │   │   │   └── route.ts  # POST AI mentor chat (step-scoped)
│   │   │   │   │   └── tasks/
│   │   │   │   │       └── route.ts  # GET daily AI task suggestions
│   │   │   │   ├── og/
│   │   │   │   │   └── [username]/
│   │   │   │   │       └── route.ts  # GET Open Graph image (passport sharing)
│   │   │   │   │
│   │   │   │   └── v2/             # V2 Referral Circle routes
│   │   │   │       ├── directory/
│   │   │   │       │   └── route.ts  # GET public learner directory (filters + pagination)
│   │   │   │       ├── professional/
│   │   │   │       │   ├── register/
│   │   │   │       │   │   └── route.ts  # POST register professional
│   │   │   │       │   └── verify/
│   │   │   │       │       └── route.ts  # GET LinkedIn OAuth callback
│   │   │   │       └── contact/
│   │   │   │           └── [learnerId]/
│   │   │   │               ├── route.ts  # POST contact form → email relay
│   │   │   │               ├── block/
│   │   │   │               │   └── route.ts  # POST learner blocks professional
│   │   │   │               └── spam/
│   │   │   │                   └── route.ts  # POST report spam
│   │   │   │
│   │   │   ├── layout.tsx          # Root layout — fonts, global CSS, providers
│   │   │   ├── not-found.tsx       # 404 page with empty state
│   │   │   └── error.tsx           # Global error boundary
│   │   │
│   │   ├── components/             # React components (atomic design)
│   │   │   │
│   │   │   ├── ui/                 # Atoms — base design system components
│   │   │   │   ├── Button.tsx      # Primary / Secondary / Ghost / Danger / Link
│   │   │   │   ├── Badge.tsx       # Tag / pill — theory, build, practice, v2
│   │   │   │   ├── Avatar.tsx      # Initials circle with role colour
│   │   │   │   ├── Input.tsx       # Text input with label, error, required
│   │   │   │   ├── Textarea.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── ProgressBar.tsx # Standard 8px / mini 4px / micro 3px
│   │   │   │   ├── Skeleton.tsx    # Skeleton loader — never use spinners
│   │   │   │   ├── Toast.tsx       # role=status (info/success) role=alert (error)
│   │   │   │   ├── Divider.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   └── EmptyState.tsx  # Icon + heading + body + optional CTA
│   │   │   │
│   │   │   ├── layout/             # Organisms — layout regions
│   │   │   │   ├── Sidebar.tsx     # Left nav: logo, nav groups, user button
│   │   │   │   ├── Topbar.tsx      # Page title, streak pill, theme toggle, icons
│   │   │   │   ├── AppLayout.tsx   # Sidebar + Topbar + main content area
│   │   │   │   ├── PublicLayout.tsx # Marketing nav + footer
│   │   │   │   └── ThemeToggle.tsx # Light/dark toggle — persists to localStorage
│   │   │   │
│   │   │   ├── dashboard/          # Dashboard-specific components
│   │   │   │   ├── StatCard.tsx    # Metric card (employability, roadmap %, XP)
│   │   │   │   ├── CtaBand.tsx     # "Continue learning" primary action band
│   │   │   │   ├── RoadmapCard.tsx # Roadmap modules overview with progress
│   │   │   │   ├── ModuleRow.tsx   # Single module row (done/active/locked states)
│   │   │   │   ├── TasksCard.tsx   # AI daily tasks with check states
│   │   │   │   ├── TaskRow.tsx     # Single task row (theory/build/practice tag)
│   │   │   │   └── ScoreCard.tsx   # Employability score ring + breakdown
│   │   │   │
│   │   │   ├── roadmap/
│   │   │   │   ├── ModuleAccordion.tsx
│   │   │   │   ├── StepRow.tsx
│   │   │   │   ├── ResourceCard.tsx    # Theory resource (YT/docs/article)
│   │   │   │   ├── ExerciseCard.tsx    # Practical exercise card
│   │   │   │   └── MarkDoneButton.tsx  # Primary action on step detail
│   │   │   │
│   │   │   ├── verification/
│   │   │   │   ├── VerificationStepper.tsx  # 5-step flow
│   │   │   │   ├── EvidenceForm.tsx          # GitHub URL + LeetCode + live URL
│   │   │   │   ├── AiReportCard.tsx          # AI analysis output display
│   │   │   │   ├── ChallengeCard.tsx         # Mentor-issued challenge
│   │   │   │   └── VerificationStatus.tsx    # Status badge with level indicator
│   │   │   │
│   │   │   ├── passport/
│   │   │   │   ├── PassportHero.tsx          # Avatar, name, role, score ring
│   │   │   │   ├── PassportTabs.tsx          # Overview/Projects/Skills/Referral
│   │   │   │   ├── SkillChip.tsx             # Verified skill chip (3 levels)
│   │   │   │   ├── ProjectCard.tsx           # Project thumbnail card
│   │   │   │   └── BadgeShelf.tsx            # Badge grid with locked slots
│   │   │   │
│   │   │   ├── gamification/
│   │   │   │   ├── StreakPill.tsx
│   │   │   │   ├── XpCounter.tsx
│   │   │   │   ├── BadgeEarnToast.tsx        # Slide-in badge notification
│   │   │   │   └── Leaderboard.tsx
│   │   │   │
│   │   │   ├── mentor/
│   │   │   │   ├── QueueItem.tsx
│   │   │   │   ├── ChallengeForm.tsx
│   │   │   │   └── FeedbackForm.tsx
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── AiMentorPanel.tsx         # Slide-in chat panel (Escape closes)
│   │   │   │   └── DailyTasksSkeleton.tsx
│   │   │   │
│   │   │   └── v2/                           # V2 Referral Circle components
│   │   │       ├── DirectoryCard.tsx          # Learner card in public directory
│   │   │       ├── DirectoryFilters.tsx       # Role/score/skill filter bar
│   │   │       ├── ContactForm.tsx            # Professional → learner message form
│   │   │       └── ReferralCircleTab.tsx      # Tab content on Skill Passport
│   │   │
│   │   ├── lib/                    # Server-side utilities
│   │   │   ├── db.ts               # Prisma client singleton — import this everywhere
│   │   │   ├── auth.ts             # Auth.js v5 config — Google + GitHub providers
│   │   │   ├── score.ts            # Employability score computation
│   │   │   ├── crypto.ts           # AES-256 encrypt/decrypt for OAuth tokens
│   │   │   ├── email.ts            # Resend wrapper — contact relay + notifications
│   │   │   ├── queue.ts            # BullMQ producers — enqueueJob() functions
│   │   │   ├── github.ts           # GitHub API client (repo fetch, commit stats)
│   │   │   ├── leetcode.ts         # LeetCode GraphQL client
│   │   │   ├── anthropic.ts        # Claude API client (ai verification, mentor, tasks)
│   │   │   ├── deletion.ts         # Account deletion + data anonymisation
│   │   │   ├── consent.ts          # ConsentRecord creation + validation
│   │   │   └── ratelimit.ts        # Upstash Redis sliding window rate limiter
│   │   │
│   │   ├── hooks/                  # Client-side React hooks
│   │   │   ├── useScore.ts         # React Query wrapper for employability score
│   │   │   ├── useRoadmapProgress.ts
│   │   │   ├── useStreak.ts
│   │   │   ├── useTheme.ts         # Read/write theme from localStorage
│   │   │   └── useNotifications.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css         # Base resets + font-face
│   │   │   └── tokens.css          # ALL design tokens — colours, spacing, radius, motion
│   │   │                           # Light mode in :root, dark mode in [data-theme="dark"]
│   │   │
│   │   ├── middleware.ts           # Auth middleware — protects all /dashboard/* routes
│   │   ├── next.config.ts          # Next.js config — CSP headers, image domains
│   │   ├── tailwind.config.ts      # Tailwind config — extends with token values
│   │   └── tsconfig.json
│   │
│   └── workers/                    # Standalone Node.js BullMQ worker process
│       ├── jobs/
│       │   ├── score-recompute.ts  # Fetch all inputs → compute → upsert score
│       │   ├── ai-verification.ts  # GitHub fetch → Claude API → store aiReport
│       │   ├── email-dispatch.ts   # Render template → Resend send → log delivery
│       │   └── github-sync.ts      # Daily cron: refresh GitHub activity cache
│       ├── index.ts                # Worker entry point — registers all consumers
│       └── tsconfig.json
│
├── packages/
│   │
│   ├── db/                         # Shared database package
│   │   ├── schema.prisma           # Single source of truth for all models
│   │   ├── migrations/             # Prisma migration history — never edit manually
│   │   │   └── ...
│   │   ├── seed.ts                 # Demo data seed — run with `pnpm db:seed`
│   │   └── package.json
│   │
│   ├── types/                      # Shared TypeScript types
│   │   ├── index.ts                # Re-exports all types
│   │   ├── user.ts                 # UserRole, UserPublic, UserSession
│   │   ├── roadmap.ts              # Roadmap, Module, Step, Resource, Exercise
│   │   ├── verification.ts         # VerificationStatus, VerificationRequest
│   │   ├── score.ts                # ScoreBreakdown, EmployabilityScore
│   │   ├── gamification.ts         # Badge, Streak, XpEvent
│   │   ├── api.ts                  # ApiResponse<T>, ApiError — response shapes
│   │   └── package.json
│   │
│   └── config/                     # Shared tooling config
│       ├── eslint.config.js        # ESLint rules shared by all apps
│       ├── tsconfig.base.json      # Base TypeScript config
│       └── package.json
│
├── content/                        # Roadmap content (mirrored from skillpath-content repo)
│   └── roadmaps/
│       ├── schema.json             # JSON schema for roadmap validation
│       ├── frontend-developer/
│       │   └── roadmap.json
│       ├── backend-developer/
│       │   └── roadmap.json
│       ├── data-analyst/
│       │   └── roadmap.json
│       ├── data-scientist/
│       │   └── roadmap.json
│       └── devops-engineer/
│           └── roadmap.json
│
├── docs/                           # All project documentation
│   ├── AGENTS.md                   ← READ FIRST — agent instructions
│   ├── FOLDER_STRUCTURE.md         ← This file
│   ├── SRS.md                      ← Software requirements specification
│   ├── architecture.md             ← System design, schema, API routes, queues
│   ├── ui-design.md                ← UI/UX design document (tokens, screens, WCAG)
│   ├── ui-revision-notes.md        ← WCAG violation log and fixes from v1→v2
│   ├── checklists.md               ← Per-phase and pre-launch checklists
│   ├── legal.md                    ← DPDPA 2023, IT Act, IT Rules 2021 compliance
│   └── opensource.md               ← Contributing guide, governance, content format
│
├── docker-compose.yml              # Local dev: PostgreSQL + Redis (no cloud needed)
├── pnpm-workspace.yaml             # pnpm monorepo workspace config
├── turbo.json                      # Turborepo pipeline config
├── package.json                    # Root package — shared dev dependencies
├── .env.example                    # All required env vars with descriptions — commit this
├── .env                            # Real secrets — NEVER commit
├── .gitignore
├── .npmrc                          # pnpm config
├── CONTRIBUTING.md                 # How to contribute (code + content)
├── CODE_OF_CONDUCT.md              # Contributor Covenant v2.1
├── LICENSE                         # MIT
├── LICENSE-CONTENT                 # CC BY 4.0 for roadmap content
├── README.md                       # Project overview + 5-step local setup
└── CHANGELOG.md                    # Version history
```

---

## Key architectural boundaries

These boundaries must never be crossed:

| From | To | Rule |
|---|---|---|
| `apps/web/app/` (client component) | Database | Never. All DB access via API routes or server components |
| `apps/web/app/api/` | `apps/workers/` | Never call worker code directly. Enqueue via `lib/queue.ts` |
| Any file | `user.email` in response | Never. Server-side only |
| Component | Hardcoded hex colour | Never. Use `var(--token-name)` |
| Component | Arbitrary spacing (e.g., `margin: 13px`) | Never. Use `var(--sp-N)` |

---

## Environment variables

All required variables are documented in `.env.example`. The groups are:

```
# Database
DATABASE_URL

# Auth (Auth.js v5)
AUTH_SECRET
AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
AUTH_GITHUB_ID / AUTH_GITHUB_SECRET

# AI
ANTHROPIC_API_KEY

# Email
RESEND_API_KEY
EMAIL_FROM

# Queue
REDIS_URL

# Storage
R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME

# External APIs
GITHUB_APP_TOKEN
LEETCODE_API_URL

# V2 only
LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET

# Security
ENCRYPTION_KEY    # 32-byte hex — for AES-256 token encryption

# App
NEXT_PUBLIC_APP_URL
NODE_ENV
```
