# SkillPath — Open Source Guide

Everything contributors need to understand how the project works as an open source community.

---

## 1. Licence

SkillPath is licensed under the **MIT Licence**.

- The codebase (`apps/`, `packages/`) is MIT.
- Roadmap content (`content/roadmaps/`) is licensed under **CC BY 4.0** (Creative Commons Attribution 4.0 International) to allow maximum reuse and adaptation.
- Contributions to either are accepted under the same licence.

A `LICENSE` file lives in the repository root. A `LICENSE-CONTENT` file lives in `content/`.

---

## 2. Repository Layout

```
skillpath/               ← Main monorepo (code + infra)
skillpath-content/       ← Separate public repo for roadmap JSON/MD
```

Keeping content in a separate repository means:
- Non-technical contributors (educators, domain experts) can submit roadmap improvements without needing to understand Node.js.
- Content PRs are smaller and faster to review.
- The content repo can be mirrored/forked by others wanting to build on top of SkillPath's roadmaps.

---

## 3. Ways to Contribute

### 3a. Code Contributions

Suitable for developers comfortable with the tech stack (Next.js, Node.js, TypeScript, PostgreSQL).

**Types of code contributions:**
- Bug fixes
- Performance improvements
- New UI components
- New API endpoints
- Test coverage
- Documentation improvements
- Accessibility improvements
- Internationalisation (future)

**Not accepted as code contributions (these require core team decision):**
- Breaking schema changes without RFC
- New external service dependencies without prior discussion
- Changes to the scoring algorithm without community discussion
- Anything requiring a new environment variable without documentation

### 3b. Roadmap Content Contributions

No coding required. Contributions go to the `skillpath-content` repository.

**Types of content contributions:**
- Adding a new learning resource to a step (YouTube video, documentation link, free course)
- Fixing a broken or outdated resource link
- Improving step descriptions or practical exercise instructions
- Proposing a new module within an existing roadmap
- Proposing an entirely new career roadmap
- Flagging resources that are now paywalled or outdated

### 3c. Mentorship

Not a code contribution — you volunteer to review learner skill verification requests on the platform itself. See the Mentor section of the SRS for how the review hierarchy works.

### 3d. Bug Reports and Feature Requests

All welcome via GitHub Issues. Templates are provided for both.

---

## 4. Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker (for local PostgreSQL + Redis via docker-compose)

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/skillpath.git
cd skillpath

# 2. Install dependencies
pnpm install

# 3. Start local services
docker-compose up -d   # starts PostgreSQL on :5432 and Redis on :6379

# 4. Set up environment
cp .env.example .env
# Edit .env — only DATABASE_URL and REDIS_URL are required for local dev.
# AUTH_GITHUB_ID/SECRET and AUTH_GOOGLE_ID/SECRET needed for auth flows.

# 5. Push schema and seed demo data
pnpm db:migrate
pnpm db:seed

# 6. Start development servers
pnpm dev
# web: http://localhost:3000
# workers: http://localhost:3001 (health check)
```

The `pnpm db:seed` command inserts:
- 3 demo learner accounts (no real OAuth needed — use magic link in dev mode)
- All 5 career roadmaps with full content
- Sample skills, badges, and a demo employability score

### Useful Scripts

```bash
pnpm dev              # Start all apps in watch mode
pnpm build            # Full production build
pnpm lint             # ESLint across all packages
pnpm typecheck        # TypeScript check across all packages
pnpm test             # Vitest unit tests
pnpm test:e2e         # Playwright end-to-end tests
pnpm db:migrate       # Apply pending Prisma migrations
pnpm db:seed          # Seed demo data
pnpm db:studio        # Open Prisma Studio (visual DB browser)
pnpm db:reset         # Drop + recreate + seed (dev only)
```

---

## 5. Branching and PR Workflow

### Branch Naming

```
feat/short-description        New feature
fix/short-description         Bug fix
chore/short-description       Tooling, CI, dependencies
docs/short-description        Documentation only
content/short-description     Roadmap content changes (skillpath-content repo)
```

### PR Process

1. Branch off `main`.
2. Keep PRs focused — one logical change per PR.
3. Fill in the PR template fully (checklist, description, screenshots for UI changes).
4. All CI checks must pass before review.
5. One approving review required from a maintainer.
6. Squash merge preferred to keep history clean.

### Commit Messages

Follow Conventional Commits:

```
feat(verification): add mentor challenge deadline notification
fix(score): prevent division by zero when no projects submitted
docs(contributing): clarify environment variable setup
chore(deps): update prisma to 5.14.0
```

---

## 6. Code Standards

### TypeScript

- Strict mode enabled (`"strict": true` in tsconfig).
- No `any` types — use `unknown` and narrow, or define proper types in `packages/types`.
- All API request/response bodies validated with Zod schemas.

### File Conventions

```
PascalCase      React components  (UserCard.tsx)
camelCase       Utilities         (computeScore.ts)
kebab-case      Route segments    (skill-passport/page.tsx)
SCREAMING_SNAKE Constants         (MAX_CONTACT_MESSAGES_PER_DAY)
```

### API Layer Rules

- Every API route handler must validate input with Zod before touching the database.
- Every mutation must be wrapped in a Prisma transaction if it touches more than one table.
- Error responses must use a consistent shape: `{ error: { code: string, message: string } }`.
- Never return a full user object from an API — always select only the fields needed.

### Database Rules

- Every migration must be reversible (`down` migration included).
- Never use raw SQL with string interpolation — Prisma parameterised queries only.
- New tables must include appropriate indexes (see `architecture.md` section 3 for patterns).
- Never store plaintext secrets or tokens — use the encryption utility in `packages/crypto`.

### Frontend Rules

- All pages must be accessible: keyboard navigable, screen-reader tested, WCAG 2.1 AA target.
- No `dangerouslySetInnerHTML` without explicit DOMPurify sanitisation.
- All images need `alt` text.
- Mobile-first responsive — test at 375px, 768px, 1280px.

---

## 7. Testing Expectations

### What to Test

| Type | Tool | Required For |
|---|---|---|
| Unit | Vitest | All utility functions (score computation, badge criteria, validation) |
| Integration | Vitest + Prisma test DB | API route handlers |
| End-to-end | Playwright | Critical user flows (sign-in, complete step, submit verification) |

### Coverage Targets

- Utility functions: 90%+ branch coverage
- API handlers: happy path + main error cases
- E2E: sign-in flow, roadmap progress, skill verification submit

New features should come with tests. Bug fixes should come with a regression test.

---

## 8. Roadmap Content Format

Roadmap content lives in `skillpath-content/` as structured JSON with this shape:

```json
{
  "slug": "frontend-developer",
  "title": "Frontend Developer",
  "domain": "web",
  "version": "1.2.0",
  "description": "...",
  "modules": [
    {
      "title": "HTML Fundamentals",
      "order": 1,
      "steps": [
        {
          "title": "Document Structure",
          "order": 1,
          "theory": [
            {
              "type": "video",
              "title": "HTML Full Course",
              "url": "https://...",
              "durationMins": 120,
              "provider": "youtube",
              "isFree": true
            },
            {
              "type": "docs",
              "title": "MDN: HTML basics",
              "url": "https://developer.mozilla.org/..."
            }
          ],
          "practical": [
            {
              "type": "exercise",
              "title": "Build a personal homepage",
              "description": "Create a valid HTML5 page with nav, main, and footer sections.",
              "difficulty": "beginner"
            }
          ]
        }
      ]
    }
  ]
}
```

**Content contribution rules:**
- All resources must be free and publicly accessible.
- No affiliate links.
- YouTube videos must be from official channels or well-known educators (not random tutorials with < 10k views).
- Resources must be in English (until multi-language support is added).
- Outdated resources (content > 3 years old for fast-moving tech) should be flagged or replaced.
- No courses from platforms that require signup just to view content.

---

## 9. Contributor Recognition

Contributors are recognised in the following ways:

- `CONTRIBUTORS.md` in the root of the repo lists all contributors by name.
- Code contributors are credited in release notes.
- Roadmap content contributors are listed at the bottom of each roadmap page on the platform.
- Long-term contributors may be invited to join the **core maintainer team** with merge access.
- Exceptional contributors may be promoted to **Domain Expert** mentor tier on the platform itself.

---

## 10. Governance

SkillPath is maintained by a small core team. Decisions are made as follows:

| Decision Type | Process |
|---|---|
| Bug fix | Any maintainer can merge after CI + one review |
| New feature (small) | RFC in GitHub Discussions → 1 week comment period → maintainer decision |
| Breaking change | RFC in GitHub Discussions → 2 week comment period → core team vote |
| New career roadmap | Community proposal → Domain Expert review → core team approval |
| Scoring algorithm change | RFC required → data-backed justification → community discussion → core team decision |
| Licence change | Never without unanimous core team vote + community notice period |

---

## 11. Community Health

The project uses the **Contributor Covenant v2.1** as its Code of Conduct.

Key expectations:
- Respectful and constructive feedback on PRs and issues.
- No harassment, discrimination, or personal attacks.
- Criticism of code and ideas is welcome; criticism of people is not.
- Maintainers have the right to close issues or block contributors who violate the CoC.

To report a CoC violation: email `conduct@skillpath.dev`. Reports are handled confidentially.

---

## 12. Security Disclosures

Do **not** open a public GitHub issue for security vulnerabilities.

Email `security@skillpath.dev` with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Your name/handle (for credit, optional)

We commit to acknowledging reports within 48 hours and providing a fix timeline within 7 days for critical issues.

After a fix is deployed, we will publicly credit the reporter (unless they prefer anonymity) in the security advisory.
