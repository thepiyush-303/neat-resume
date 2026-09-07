# NeatResume — Feature Approach Document

> **Status:** Awaiting user review before implementation begins.

---

## Feature 1 — Dashboard: Clickable Resume Cards (Direct Edit Navigation)

### Problem
Resume cards on the Dashboard have no direct click-to-edit behaviour. Editing requires opening the `DropdownMenu` → clicking "Edit". The card body is not interactive.

### Root Cause
`ResumeCard` in `Dashboard.tsx` wraps content in a plain `<div>`. The card thumbnail area and body are not wrapped with any navigation handler. Only the `DropdownMenu` items trigger `onEdit`.

### Proposed Changes

#### `frontend/src/pages/Dashboard.tsx` — `ResumeCard` component
1. Make the entire card thumbnail + title row clickable by wrapping them in a `button` (or adding an `onClick` directly on the outer `<div>`).
2. Add a visible **"Open Editor"** `<Button>` overlay on hover (absolute-positioned inside the thumbnail area), similar to the PRD's template card hover overlay — this gives a clear affordance.
3. Keep the `DropdownMenu` (⋮) for secondary actions (Duplicate, Delete) so it doesn't clutter the primary interaction.
4. Pass `onEdit` to the `onClick` handler of the card body / overlay button.

**Concrete UI change:**
```
Card thumbnail hover state:
  ┌─────────────────────────────┐
  │  [gradient bg]              │
  │                             │
  │   ┌──────────────────┐      │
  │   │  Open in Editor  │  ←  absolute overlay button (appears on hover)
  │   └──────────────────┘      │
  │                    [ATS ring]│
  └─────────────────────────────┘
```

The `group-hover` Tailwind class already exists on the outer div — use it to toggle `opacity-0 group-hover:opacity-100` on the overlay button.

**Files changed:**
- `frontend/src/pages/Dashboard.tsx` — `ResumeCard` component only (~15 line change)

---

## Feature 2 — Auth: Persist Session Across App Restarts (Verified User Check)

### Problem
When the browser is refreshed/restarted, `AuthContext` initialises `loading = true` and runs `initializeAuth()` which calls `POST /api/auth/refresh`. If the refresh attempt fails (network error, expired cookie, backend down) the app sets `user = null` and `loading = false`. `ProtectedRoute` then redirects to `/auth?mode=login` immediately — even if the user was verified and had a valid session.

The issue is that `loading` becomes `false` too quickly and `ProtectedRoute` makes the redirect decision before the silent refresh resolves.

### Root Cause (in `AuthContext.tsx`)
```ts
// initializeAuth sets loading=false in finally{}
// ProtectedRoute watches: !user && !loading → redirect
```
There is no intermediate "checking auth" state to prevent a flash-redirect. The current implementation is technically correct per PRD § 2.4, but the UX bug manifests because:
- The `ProtectedRoute` logic may be missing or incomplete — it should show a skeleton loader while `loading === true`.

### Proposed Changes

#### `frontend/src/context/AuthContext.tsx`
- Add an `isInitialized` flag (boolean state) that starts `false` and is set to `true` only after `initializeAuth()` completes (in the `finally` block). This prevents route guards from acting on stale state.
- Expose `isInitialized` on the context alongside `loading`.

#### `frontend/src/components/ProtectedRoute.tsx`
- While `loading === true` OR `!isInitialized`, render a full-page skeleton/spinner instead of redirecting.  
- Only redirect to `/auth` when `!loading && isInitialized && !isAuthenticated`.

This ensures the app waits for the refresh token check to complete before making any routing decision.

#### Optional backend check
If the backend's `POST /api/auth/refresh` endpoint doesn't verify whether the user's email is verified (if you have an `isVerified` field), add a check there. But based on the current Prisma schema in the PRD (no `isVerified` field), this is a pure frontend timing fix.

**Files changed:**
- `frontend/src/context/AuthContext.tsx` (~10 line change)  
- `frontend/src/components/ProtectedRoute.tsx` (~15 line change)

---

## Feature 3 — Cleanup: Remove `.agents`, `.claude`, `.windsurf` Directories

### Investigation Results
These directories are AI tool config folders left by different AI coding assistants. Their locations:

| Path | Contents | Safe to Delete? |
|------|----------|-----------------|
| `backend/.agents/skills/` | 9 Prisma skill folders (prisma-cli, prisma-client-api, etc.) — reference docs for AI agents | ✅ Yes — no runtime code |
| `backend/.claude/skills/` | Same Prisma skill folders (duplicated) | ✅ Yes |
| `backend/.windsurf/skills/` | Same Prisma skill folders (duplicated) | ✅ Yes |
| `backend/skills-lock.json` | Lock file for AI skill resolution | ✅ Yes |
| `CLAUDE.md` (root) | Claude AI instruction file | ✅ Yes (unless you want to keep for Antigravity/Claude) |

`frontend/`, `parser-service/`, and the root have no such directories.

### Proposed Changes
Delete the following (simple `rm -rf`):
```
backend/.agents/
backend/.claude/
backend/.windsurf/
backend/skills-lock.json
```

Optionally delete `CLAUDE.md` from root if you no longer want Claude-specific instructions. Keep it if you may use Claude.

> **No code changes required** — these are purely documentation/config files for AI tooling. Runtime behaviour is unaffected.

---

## Feature 4 (Major) — GitHub Portfolio Deployment via OAuth + GitHub Pages/Vercel (MCP Architecture)

### Overview
This is the largest and most architecturally significant feature. The goal: a user clicks **"Deploy Portfolio"** on a `ResumeCard` or in the Editor, authenticates via GitHub OAuth, and their resume is automatically converted to a portfolio site and deployed to GitHub Pages (or Vercel).

The approach uses an **MCP (Model-agnostic Control Protocol / micro-service orchestration)** pattern where distinct services handle each concern: OAuth handshake, portfolio generation, Git operations, and deployment.

---

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                   │
│                                                     │
│  ResumeCard / Editor                                │
│       │                                             │
│       ▼                                             │
│  "Deploy Portfolio" button                          │
│       │                                             │
│       │  1. Check if GitHub token exists in backend │
│       │  2. If not → redirect to GitHub OAuth        │
│       │  3. If yes → trigger deploy flow             │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Express + Prisma)              │
│                                                     │
│  /api/github/auth         - OAuth initiation        │
│  /api/github/callback     - OAuth token exchange    │
│  /api/github/status       - Check if connected      │
│  /api/portfolio/deploy    - Deploy trigger endpoint  │
│       │                                             │
│       │  Orchestrates:                              │
│       │  a) Portfolio Generator Service             │
│       │  b) GitHub Pages deployer (Octokit)         │
│       │  c) Vercel deployer (optional fallback)     │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│         PORTFOLIO GENERATOR (Python / Node)          │
│                                                     │
│  Input:  ResumeSchema JSON                           │
│  Output: Static HTML/CSS portfolio site files        │
│                                                     │
│  Template: A beautiful single-page portfolio         │
│  tailored from the resume's sections                 │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│              GitHub Pages Deployer (Octokit)         │
│                                                     │
│  1. Create repo "{username}/portfolio" if not exist  │
│  2. Commit generated files to `gh-pages` branch      │
│  3. Enable GitHub Pages on the repo                 │
│  4. Return live URL: {username}.github.io/portfolio  │
└─────────────────────────────────────────────────────┘
```

---

### Step-by-Step Implementation Plan

#### Step 4.1 — GitHub OAuth App Setup (Manual, one-time)
- Create a GitHub OAuth App in GitHub Developer Settings.
- Callback URL: `https://your-backend.com/api/github/callback` (or `localhost:5000/api/github/callback` in dev).
- Get `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
- Add to `.env`.
- Required OAuth scopes: `repo`, `user:email` (to create/push to repos and enable Pages).

#### Step 4.2 — Backend: GitHub OAuth Routes (`backend/src/routes/githubRoutes.ts`)

```ts
// GET /api/github/auth
// Redirect user to GitHub OAuth consent screen
// Attach our NeatResume userId as state param (for CSRF protection)

// GET /api/github/callback?code=...&state=...
// Exchange code for GitHub access token
// Store encrypted token in DB linked to NeatResume user
// Redirect back to frontend: /dashboard?github=connected

// GET /api/github/status
// Returns { connected: boolean, githubUsername?: string }

// POST /api/portfolio/deploy  { resumeId, templateStyle? }
// 1. Fetch resume data from DB
// 2. Call Portfolio Generator
// 3. Push to GitHub Pages via Octokit
// 4. Return { url: "https://username.github.io/portfolio" }
// 5. Store deployed URL on the Resume record
```

#### Step 4.3 — Prisma Schema Updates

```prisma
model User {
  // ... existing fields ...
  githubAccessToken   String?   // Encrypted at rest (use AES-256)
  githubUsername      String?
  githubConnectedAt   DateTime?
}

model Resume {
  // ... existing fields ...
  portfolioUrl     String?   // e.g., "https://username.github.io/portfolio"
  portfolioStatus  String?   // "deploying" | "deployed" | "failed"
  deployedAt       DateTime?
}
```

#### Step 4.4 — Portfolio Generator (extend `parser-service` or create `portfolio-service/`)

Since the app is frontend-only after deployment (static HTML/CSS), generate using a **Jinja2/Handlebars HTML template** filled with resume data.

**Output structure (what gets pushed to GitHub):**
```
portfolio/
├── index.html      ← Generated from Jinja2 template + resume data
├── style.css       ← Pre-written beautiful CSS (dark/light)
└── favicon.ico
```

The template reads `ResumeSchema` fields and generates:
- Hero section (name, title, summary)
- Work experience timeline
- Projects grid with tech badges
- Skills section
- Education
- Contact links (GitHub, LinkedIn, email)

New endpoint in `parser-service`:
```
POST /generate-portfolio
Body: { resumeData: ResumeSchema, style: "dark" | "light" }
Response: { files: { "index.html": "...", "style.css": "..." } }
```

#### Step 4.5 — GitHub Pages Deployer (Octokit in Backend)

```ts
import { Octokit } from '@octokit/rest';

// 1. Init Octokit with user's decrypted GitHub token
// 2. Create repo "portfolio" (if it doesn't exist)
// 3. Enable GitHub Pages on "main" branch / docs folder or "gh-pages" branch
// 4. Commit portfolio files (upsert via tree + commit API)
// 5. Return the Pages URL
```

> **Why GitHub Pages over Vercel?**  
> GitHub Pages requires ONLY a GitHub token (which we already collect via OAuth). Vercel requires a separate API token and is tied to a Vercel account. For a purely-static frontend portfolio, GitHub Pages is simpler and zero-extra-account.  
> We include Vercel as a **fallback** if GitHub Pages fails or the user explicitly prefers Vercel (future enhancement).

#### Step 4.6 — Frontend: "Deploy Portfolio" Button

**In `ResumeCard` (Dashboard):**
```tsx
<Button variant="outline" size="sm" onClick={() => handleDeployPortfolio(resume.id)}>
  <Globe className="h-3.5 w-3.5 mr-1" /> Deploy Portfolio
</Button>
```

**In `Editor.tsx` (top action bar):**
```tsx
<Button onClick={() => handleDeployPortfolio(resumeId)}>
  <Github className="h-4 w-4 mr-2" /> Deploy to GitHub Pages
</Button>
```

**`handleDeployPortfolio` flow:**
1. `GET /api/github/status` → if not connected, redirect to `GET /api/github/auth`
2. If connected, show a confirm dialog (repo name, style choice)
3. `POST /api/portfolio/deploy { resumeId }` → poll status or use optimistic UI
4. On success, show a toast with the live URL + a "Visit Portfolio" button

**`PortfolioContext` (or inline state):** Tracks deploy status (`idle | deploying | deployed | failed`) and the deployed URL for each resume, stored in a `portfolioStatus: Map<resumeId, DeployState>`.

---

### MCP (Micro-service Control Protocol) Approach

The "MCP" in this context is implemented as a simple **orchestration pattern** inside `POST /api/portfolio/deploy`:

```
1. Validate → 2. Generate → 3. Deploy → 4. Store → 5. Return
     │               │            │           │
  Prisma DB    parser-service  Octokit    Prisma DB
```

Each step is isolated, has its own error handling, and can be swapped independently (e.g., swap GitHub Pages for Vercel without touching the generator).

**If using a proper MCP server (future):** The backend can expose an MCP-compliant tool server that Claude/Gemini agents call to deploy portfolios on behalf of the user — this is a natural extension once the OAuth plumbing is in place.

---

### New Files Summary

| File | Purpose |
|------|---------|
| `backend/src/routes/githubRoutes.ts` | GitHub OAuth + deploy endpoints |
| `backend/src/services/GitHubPagesDeployer.ts` | Octokit logic for repo creation + push |
| `backend/src/services/PortfolioOrchestrator.ts` | Orchestrates generate → deploy → store |
| `parser-service/portfolio_generator.py` | Jinja2 portfolio HTML generator |
| `parser-service/templates/portfolio.html` | Jinja2 HTML template |
| `parser-service/templates/portfolio.css` | Pre-built portfolio CSS |
| `frontend/src/components/DeployPortfolioButton.tsx` | Reusable deploy button + modal |
| `frontend/src/hooks/usePortfolioDeploy.ts` | Hook encapsulating deploy state/logic |

---

### Dependencies to Add

**Backend:**
```
@octokit/rest          # GitHub API client
node-fetch             # HTTP calls to parser-service
crypto / node:crypto   # For encrypting GitHub tokens at rest
```

**Parser service:**
```
jinja2                 # HTML templating
```

**Frontend:**
```
# No new deps — use existing lucide-react (Github, Globe icons) + shadcn Dialog
```

---

## Implementation Order (Recommended)

```
Feature 3 (Cleanup)       → 5 minutes, zero risk
Feature 2 (Auth fix)      → 30 minutes, low risk
Feature 1 (Dashboard UX)  → 1 hour, low risk
Feature 4 (GitHub Deploy) → 3–5 hours, high complexity
```

Feature 4 should be tackled last and in sub-phases:
1. GitHub OAuth plumbing (backend routes + DB schema)
2. Portfolio generator (parser-service endpoint + template)
3. GitHub Pages deployer (Octokit service)
4. Frontend button + modal + status tracking

---

## Open Questions (review before coding)

1. **GitHub token encryption:** Store the GitHub OAuth token encrypted in the DB using `AES-256-GCM` with a `GITHUB_TOKEN_ENCRYPTION_KEY` env var, or store it in the `HttpOnly` session cookie? (Recommendation: encrypted in DB, decrypted on demand)

2. **Portfolio repo name:** Default to `portfolio`? Or let the user choose in the deploy modal?

3. **`CLAUDE.md` at root:** Delete or keep? It's the Claude-specific instruction file. If you're using Antigravity/Claude regularly, keeping it is useful.

4. **Vercel fallback:** Implement GitHub Pages only (simpler) or also support Vercel deploy in the same PR?
