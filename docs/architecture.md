# SkillPath — Architecture

> Stack: Next.js 14 · Node.js · PostgreSQL · Prisma · BullMQ · Redis · Anthropic API

---

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│   Next.js 14 App Router (SSR + RSC + Client Components)        │
│   Tailwind CSS  ·  shadcn/ui  ·  React Query                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│                         API LAYER                               │
│   Next.js API Routes  +  Standalone Node/Express services       │
│   Auth.js v5 (NextAuth)  ·  Zod validation  ·  Rate limiting   │
└──────┬────────────────────────────────────┬──────────────────────┘
       │                                    │
┌──────▼──────────┐              ┌──────────▼──────────────────────┐
│   PostgreSQL    │              │        Redis + BullMQ            │
│   (Prisma ORM)  │              │  Job queues: score, email, AI    │
└──────┬──────────┘              └──────────┬──────────────────────┘
       │                                    │
┌──────▼────────────────────────────────────▼──────────────────────┐
│                     EXTERNAL SERVICES                            │
│  GitHub API · LeetCode GraphQL · LinkedIn OAuth · Resend Email  │
│  Anthropic Claude API · Cloudflare R2 (files) · CDN             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Repository Structure

```
skillpath/
├── apps/
│   ├── web/                        # Next.js 14 frontend + API routes
│   │   ├── app/
│   │   │   ├── (auth)/             # Login, signup, onboarding
│   │   │   ├── (dashboard)/        # Learner dashboard, roadmap view
│   │   │   ├── (mentor)/           # Mentor queue, review UI
│   │   │   ├── (admin)/            # Admin panel
│   │   │   ├── u/[username]/       # Public Skill Passport
│   │   │   ├── directory/          # Referral Circle public directory (V2)
│   │   │   └── api/
│   │   │       ├── auth/           # Auth.js handlers
│   │   │       ├── roadmaps/
│   │   │       ├── skills/
│   │   │       ├── verification/
│   │   │       ├── score/
│   │   │       ├── directory/      # V2
│   │   │       └── contact/        # V2 contact form relay
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui base components
│   │   │   ├── roadmap/
│   │   │   ├── passport/
│   │   │   ├── verification/
│   │   │   └── gamification/
│   │   └── lib/
│   │       ├── db.ts               # Prisma client singleton
│   │       ├── auth.ts             # Auth.js config
│   │       ├── queue.ts            # BullMQ producers
│   │       └── score.ts            # Score computation logic
│   └── workers/                    # Standalone Node.js worker process
│       ├── jobs/
│       │   ├── score-recompute.ts
│       │   ├── ai-verification.ts
│       │   ├── email-dispatch.ts
│       │   └── github-sync.ts
│       └── index.ts
├── packages/
│   ├── db/                         # Prisma schema + migrations (shared)
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── types/                      # Shared TypeScript types
│   └── config/                     # Shared ESLint, Tailwind, TS config
├── content/
│   └── roadmaps/                   # Public git repo — roadmap JSON/MD
│       ├── frontend-developer/
│       ├── backend-developer/
│       ├── data-analyst/
│       ├── data-scientist/
│       └── devops-engineer/
└── docs/                           # This folder
```

Managed as a **pnpm monorepo** using Turborepo.

---

## 3. Database Schema (Prisma)

```prisma
// packages/db/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS & AUTH ──────────────────────────────────────────────

enum UserRole {
  LEARNER
  CONTRIBUTOR
  MENTOR
  SENIOR_MENTOR
  DOMAIN_EXPERT
  WORKING_PROFESSIONAL  // V2
  ADMIN
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  username      String   @unique
  avatarUrl     String?
  bio           String?
  role          UserRole @default(LEARNER)
  githubId      String?  @unique
  googleId      String?  @unique
  githubToken   String?  // encrypted at rest
  isPublic      Boolean  @default(false)
  showReferralTab Boolean @default(true)  // V2
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  progress              UserProgress[]
  skills                UserSkill[]
  projects              Project[]
  verificationRequests  VerificationRequest[]  @relation("LearnerRequests")
  mentorReviews         VerificationRequest[]  @relation("MentorReviews")
  employabilityScore    EmployabilityScore?
  badges                UserBadge[]
  contributions         RoadmapContribution[]
  streaks               Streak[]
  professional          WorkingProfessional?   // V2

  @@index([role])
  @@index([isPublic])
}

// ─── ROADMAPS ─────────────────────────────────────────────────

model Roadmap {
  id          String   @id @default(cuid())
  slug        String   @unique  // e.g. "frontend-developer"
  title       String
  domain      String
  description String
  version     String   @default("1.0.0")
  isPublished Boolean  @default(false)
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  modules       Module[]
  contributions RoadmapContribution[]

  @@index([slug])
  @@index([isPublished])
}

model Module {
  id         String  @id @default(cuid())
  roadmapId  String
  title      String
  orderIndex Int
  roadmap    Roadmap @relation(fields: [roadmapId], references: [id])
  steps      Step[]

  @@index([roadmapId])
}

model Step {
  id               String  @id @default(cuid())
  moduleId         String
  title            String
  theoryContent    Json    // Array of { type, title, url, description }
  practicalContent Json    // Array of { type, title, description, difficulty }
  orderIndex       Int
  module           Module  @relation(fields: [moduleId], references: [id])
  progress         UserProgress[]

  @@index([moduleId])
}

model UserProgress {
  userId      String
  stepId      String
  completedAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  step        Step     @relation(fields: [stepId], references: [id])

  @@id([userId, stepId])
  @@index([userId])
}

// ─── SKILLS & VERIFICATION ────────────────────────────────────

enum VerificationLevel {
  NONE
  AI_VERIFIED
  MENTOR_VERIFIED
}

model Skill {
  id          String @id @default(cuid())
  name        String @unique
  domain      String
  description String

  userSkills            UserSkill[]
  verificationRequests  VerificationRequest[]

  @@index([domain])
}

model UserSkill {
  id                String            @id @default(cuid())
  userId            String
  skillId           String
  verificationLevel VerificationLevel @default(NONE)
  verifiedAt        DateTime?
  verifiedById      String?
  user              User              @relation(fields: [userId], references: [id])
  skill             Skill             @relation(fields: [skillId], references: [id])

  @@unique([userId, skillId])
  @@index([userId])
  @@index([verificationLevel])
}

enum VerificationStatus {
  PENDING
  AI_REVIEW
  MENTOR_ASSIGNED
  CHALLENGE_ISSUED
  COMPLETED
  REJECTED
}

model VerificationRequest {
  id                   String             @id @default(cuid())
  learnerId            String
  skillId              String
  mentorId             String?
  status               VerificationStatus @default(PENDING)
  githubRepoUrl        String?
  liveProjectUrl       String?
  leetcodeUsername     String?
  aiReport             Json?              // AI analysis output
  challengeDescription String?
  challengeDeadline    DateTime?
  submittedAt          DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  learner              User               @relation("LearnerRequests", fields: [learnerId], references: [id])
  mentor               User?              @relation("MentorReviews", fields: [mentorId], references: [id])
  skill                Skill              @relation(fields: [skillId], references: [id])
  feedback             MentorFeedback[]

  @@index([learnerId])
  @@index([mentorId])
  @@index([status])
}

model MentorFeedback {
  id                    String              @id @default(cuid())
  verificationRequestId String
  comment               String
  rating                Int?                // 1–5
  createdAt             DateTime            @default(now())
  request               VerificationRequest @relation(fields: [verificationRequestId], references: [id])
}

// ─── PROJECTS ─────────────────────────────────────────────────

model Project {
  id             String   @id @default(cuid())
  userId         String
  title          String
  description    String
  repoUrl        String?
  liveUrl        String?
  aiQualityScore Float?
  aiReport       Json?
  screenshotUrl  String?
  createdAt      DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id])

  @@index([userId])
}

// ─── EMPLOYABILITY SCORE ──────────────────────────────────────

model EmployabilityScore {
  id             String   @id @default(cuid())
  userId         String   @unique
  totalScore     Float    @default(0)
  breakdown      Json     // { roadmapCompletion, verifiedSkills, githubActivity, leetcode, mentorRatings, projectQuality }
  computedAt     DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id])

  @@index([totalScore])
}

// ─── GAMIFICATION ─────────────────────────────────────────────

model Badge {
  id          String      @id @default(cuid())
  name        String      @unique
  description String
  iconUrl     String
  criteria    Json        // Machine-readable trigger conditions
  userBadges  UserBadge[]
}

model UserBadge {
  userId    String
  badgeId   String
  earnedAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  badge     Badge    @relation(fields: [badgeId], references: [id])

  @@id([userId, badgeId])
}

model Streak {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime @db.Date
  activity  String   // step_complete | project_submit | review_done
  user      User     @relation(fields: [userId], references: [id])

  @@unique([userId, date])
  @@index([userId])
}

// ─── COMMUNITY CONTRIBUTIONS ──────────────────────────────────

enum ContributionStatus {
  OPEN
  APPROVED
  REJECTED
}

model RoadmapContribution {
  id          String             @id @default(cuid())
  userId      String
  roadmapId   String
  type        String             // add_resource | edit_step | new_module
  contentDiff Json
  status      ContributionStatus @default(OPEN)
  reviewedById String?
  reviewNote  String?
  createdAt   DateTime           @default(now())
  user        User               @relation(fields: [userId], references: [id])
  roadmap     Roadmap            @relation(fields: [roadmapId], references: [id])

  @@index([roadmapId, status])
}

// ─── V2: REFERRAL CIRCLE ──────────────────────────────────────

model WorkingProfessional {
  id              String    @id @default(cuid())
  userId          String    @unique
  linkedinUrl     String
  company         String
  designation     String
  domain          String
  verifiedAt      DateTime  @default(now())
  isActive        Boolean   @default(true)
  user            User      @relation(fields: [userId], references: [id])
  contactMessages ContactMessage[]

  @@index([isActive])
}

model ContactMessage {
  id               String              @id @default(cuid())
  professionalId   String
  learnerId        String
  message          String
  isReferralIntent Boolean             @default(false)
  sentAt           DateTime            @default(now())
  isSpam           Boolean             @default(false)
  spamReportCount  Int                 @default(0)
  professional     WorkingProfessional @relation(fields: [professionalId], references: [id])

  @@index([professionalId])
  @@index([learnerId])
}
```

---

## 4. API Route Structure

```
/api/auth/[...nextauth]     Auth.js — Google + GitHub OAuth

/api/roadmaps               GET  list published roadmaps
/api/roadmaps/[slug]        GET  full roadmap with modules/steps
/api/roadmaps/[slug]/progress  GET/POST learner progress

/api/skills                 GET  list skills by domain
/api/skills/[id]/verify     POST submit verification request
/api/verification/[id]      GET  status · PATCH mentor actions

/api/projects               GET list · POST create
/api/projects/[id]          GET · PATCH · DELETE

/api/score/[userId]         GET  employability score + breakdown
/api/score/[userId]/recompute  POST  trigger manual recompute (admin)

/api/passport/[username]    GET  public profile data

/api/contributions          GET list · POST submit
/api/contributions/[id]     PATCH review (mentor+)

/api/gamification/streaks   GET current streak
/api/gamification/badges    GET earned badges
/api/gamification/leaderboard  GET  roadmap leaderboard

# V2 Referral Circle
/api/directory              GET  public learner directory (filters, pagination)
/api/professional/register  POST register + trigger LinkedIn OAuth
/api/professional/verify    GET  LinkedIn OAuth callback
/api/contact/[learnerId]    POST submit contact form → email relay
/api/contact/[learnerId]/block  POST learner blocks professional
/api/contact/[messageId]/spam   POST report spam
```

---

## 5. Background Job Queues (BullMQ)

```typescript
// apps/workers/jobs/

// Queue: score-recompute
// Triggers: step completion, new verified skill, GitHub push webhook
// Process: fetch all score inputs → compute weighted score → upsert EmployabilityScore

// Queue: ai-verification
// Triggers: verification request submitted with GitHub repo URL
// Process: call GitHub API → analyze repo structure → call Claude API → store aiReport → update status to AI_VERIFIED or PENDING_MENTOR

// Queue: email-dispatch
// Triggers: verification status change, contact form submission, weekly digest
// Process: render email template → send via Resend → log delivery

// Queue: github-sync
// Triggers: daily cron for active learners with connected GitHub
// Process: fetch latest commit count, contribution graph → update cached github_activity score component
```

Each queue runs in the standalone `apps/workers` process, keeping the Next.js server stateless.

---

## 6. Authentication Flow

```
User clicks "Sign in with Google/GitHub"
        ↓
Auth.js initiates OAuth
        ↓
Provider returns token + profile
        ↓
Auth.js callback:
  - Look up user by provider ID
  - If new: create User record with LEARNER role
  - If existing: update last login
        ↓
JWT issued → stored in httpOnly cookie
        ↓
First-time users → /onboarding (select career role)
        ↓
Subsequent logins → /dashboard
```

---

## 7. Employability Score Computation

```typescript
// apps/web/lib/score.ts

interface ScoreBreakdown {
  roadmapCompletion: number   // weight: 0.20
  verifiedSkills: number      // weight: 0.25
  githubActivity: number      // weight: 0.15
  leetcodeStats: number       // weight: 0.10
  mentorRatings: number       // weight: 0.20
  projectQuality: number      // weight: 0.10
}

function computeScore(breakdown: ScoreBreakdown): number {
  const weights = {
    roadmapCompletion: 0.20,
    verifiedSkills:    0.25,
    githubActivity:    0.15,
    leetcodeStats:     0.10,
    mentorRatings:     0.20,
    projectQuality:    0.10,
  }
  return Object.entries(weights).reduce(
    (total, [key, weight]) => total + breakdown[key as keyof ScoreBreakdown] * weight,
    0
  )
}

// Each component is normalised to 0–100 before weighting.
// roadmapCompletion   = (stepsCompleted / totalSteps) * 100
// verifiedSkills      = min(mentorVerifiedCount * 12.5, 100)
// githubActivity      = log-normalised commits + streak bonus
// leetcodeStats       = (easySolved*1 + mediumSolved*2 + hardSolved*3) / target * 100
// mentorRatings       = avg(mentorRating) / 5 * 100
// projectQuality      = avg(aiQualityScore + mentorScore) / 2
```

---

## 8. AI Verification Pipeline

```
Learner submits GitHub repo URL
        ↓
Job enqueued: ai-verification
        ↓
Worker: fetch repo metadata via GitHub API
  - README exists?
  - Has > 5 commits?
  - Folder structure present?
  - Has package.json / requirements.txt / etc.?
  - Last commit within 90 days?
        ↓
Worker: call Claude API (claude-sonnet-4-6)
  System: "You are a senior code reviewer. Evaluate this GitHub repository..."
  User: { repoData, readmeContent, fileTree, commitHistory }
  Response: { score: 0-100, strengths: [], weaknesses: [], recommendation: string }
        ↓
Store aiReport on VerificationRequest
Update status → AI_VERIFIED (score ≥ 60) or PENDING_MENTOR (score < 60)
Notify learner
        ↓
If AI_VERIFIED: add to mentor review queue for Level 2
```

---

## 9. V2 Contact Form Email Relay

```
Professional fills contact form (message + referral intent flag)
        ↓
POST /api/contact/[learnerId]
  - Verify professional's JWT + LinkedIn verification status
  - Check daily rate limit (5 messages/day per professional)
  - Check learner has not blocked this professional
        ↓
Server-side:
  - Fetch learner's email from DB (never exposed to client)
  - Render email template with professional's name, company, message, LinkedIn URL
  - Dispatch via Resend to learner's email
  - Log ContactMessage record (no email stored in log)
        ↓
Send in-app notification to learner
        ↓
Return 200 to professional (no confirmation of delivery details)
```

The learner's email address exists **only on the server** and is never present in any API response.

---

## 10. Deployment Architecture

```
Vercel (Frontend + API Routes)
  └── Next.js app
  └── Edge middleware: rate limiting, auth checks

Railway / Render (Workers)
  └── apps/workers Node.js process
  └── BullMQ consumers

Upstash (Redis)
  └── BullMQ job queues
  └── Rate limit counters

Neon / Supabase (PostgreSQL)
  └── Primary database
  └── Connection pooling via PgBouncer

Cloudflare R2
  └── Profile images
  └── Project screenshots

Resend
  └── Transactional email
```

---

## 11. Security Decisions

| Concern | Decision |
|---|---|
| Auth tokens | httpOnly + Secure + SameSite=Strict cookies via Auth.js |
| Learner email privacy | Email fetched server-side only; never in API responses |
| GitHub OAuth tokens | Encrypted at rest using AES-256 before DB storage |
| LinkedIn OAuth tokens | Encrypted at rest; only used for one-time verification |
| Rate limiting | Upstash Redis-based sliding window per IP and per user |
| Input sanitisation | Zod on all API inputs; DOMPurify on all user-generated content rendered in browser |
| Content Security Policy | Strict CSP headers via Next.js middleware |
| OWASP Top 10 | Reviewed pre-launch; dependency audit in CI via `pnpm audit` |
| Age verification | On registration, users declare age; under-18 users trigger parental consent flow per DPDPA 2023 Section 9 |

---

## 12. Environment Variables

```bash
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# AI
ANTHROPIC_API_KEY=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@skillpath.dev

# Redis
REDIS_URL=

# Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# External APIs
GITHUB_APP_TOKEN=           # For public repo scanning (no user auth required)
LEETCODE_API_URL=https://leetcode.com/graphql

# V2 Referral Circle
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Crypto (for token encryption at rest)
ENCRYPTION_KEY=             # 32-byte hex key

# App
NEXT_PUBLIC_APP_URL=https://skillpath.dev
NODE_ENV=production
```
