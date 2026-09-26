# ForgeForge — Coding Rules

Paste this before every task. These rules override any default behaviour.

---

## Hard rules — never break these

### Security
- NEVER put `user.email` in any API response, log, or client-side variable
- NEVER create `new PrismaClient()` — always import from `lib/server/db.ts`
- NEVER store auth tokens in localStorage — Auth.js uses httpOnly cookies
- NEVER write raw SQL with string interpolation — Prisma parameterised queries only
- NEVER store GitHub or LinkedIn OAuth tokens in plaintext — use `lib/server/crypto.ts`
- NEVER use `Math.random()` for anything security-related — use `crypto.randomBytes()`

### API routes
- ALWAYS validate input with Zod before touching the database
- ALWAYS check session with `auth()` before any data operation
- ALWAYS return `{ data: ... }` on success and `{ error: { code, message } }` on failure
- NEVER do heavy work in an API route — enqueue a BullMQ job via `lib/server/queue.ts`

### TypeScript
- NEVER use `any` — use `unknown` and narrow, or define a type in `packages/types`
- ALWAYS use strict mode — it is already on in `tsconfig.json`

### CSS and design
- NEVER hardcode a colour — always `var(--token-name)` from `tokens.css`
- NEVER use arbitrary spacing — only `var(--sp-4/8/16/24/32/40/48/64)`
- NEVER use font-size outside the scale: 12/14/16/20/24/32/40px
- NEVER use font-weight 600 or 700 — only 400 and 500
- NEVER put transitions outside `@media (prefers-reduced-motion: no-preference)`
- NEVER add a second filled primary button to a screen — one per page maximum

### Accessibility
- ALL interactive elements must be min 44×44px (WCAG 2.5.5)
- ALL icon-only buttons must have `aria-label`
- ALL decorative icons must have `aria-hidden="true"`
- ALL form inputs must have a visible label — never placeholder-only
- ALWAYS use `:focus-visible` for focus rings — never `:focus`

### Loading and empty states
- ALWAYS use skeleton loaders for async content — never use spinners
- ALWAYS provide an empty state when a list or data section can be empty
- Empty state must show: what happened + why + what to do next

---

## Quick token reference

```css
/* Colours */
--tok-primary: #16A34A        /* emerald — buttons, active states */
--tok-primary-dark: #15803D   /* hover state */
--bg-base: #F7F8F5            /* page shell */
--bg-surface: #FFFFFF         /* sidebar, topbar */
--bg-raised: #FFFFFF          /* cards */
--bg-overlay: #F0F4EE         /* hover fills */
--txt-primary: #111827        /* headings */
--txt-secondary: #4B5563      /* body text */
--txt-tertiary: #9CA3AF       /* metadata only */
--border-subtle: #E5E7EB      /* card borders */
--border-focus: 0 0 0 3px rgba(22,163,74,0.40)  /* focus ring */

/* Spacing */
--sp-4 --sp-8 --sp-16 --sp-24 --sp-32 --sp-40 --sp-48 --sp-64

/* Radius */
--radius-sm: 6px  --radius-md: 8px  --radius-lg: 12px  --radius-full: 9999px
```

---

## Self-audit — check before submitting any code

```
[ ] No hardcoded hex colours
[ ] No arbitrary spacing values (no 10px, 13px, 22px etc.)
[ ] No font-weight 600 or 700
[ ] No font-size outside 12/14/16/20/24/32/40px
[ ] No user.email in any response or log
[ ] Zod schema validates the API input
[ ] All interactive elements are ≥ 44px
[ ] No more than one filled primary button on this screen
[ ] Transitions are inside prefers-reduced-motion media query
[ ] Skeleton loader used for async content (no spinner)
[ ] Empty state exists for any list that can be empty
[ ] New file is in the correct location per folder-map.md
```