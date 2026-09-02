# NeatResume — Master PRD & Implementation Roadmap

> **Product Vision:** NeatResume is a modern AI-powered resume builder that lets users upload raw resumes (PDF/DOCX), parses them into a structured schema, and presents them through beautiful, ATS-optimized templates — all deployable on a personal GitHub + Vercel stack.

---

## Phase Status Overview

| Phase | Title | Status |
|---|---|---|
| **Phase 1** | Complete Modern Frontend UI Revamp | 🟡 IN PROGRESS |
| **Phase 2** | Authentication Layer (Clean Rebuild) | ⬜ PENDING |
| **Phase 3** | Persistent Structured Resume Parsing & Storage | ⬜ PENDING |
| **Phase 4** | Deployment (GitHub + Vercel) | ⬜ PENDING |

---

## AI Agent Rules (Global)

> These rules apply to **all phases** and must be respected at all times.

1. **Phase isolation:** Do not bleed work from a future phase into an in-progress phase. If Phase 1 is active, do not touch auth logic or the parser. Keep concerns strictly separated.
2. **No breaking changes to existing APIs:** When modifying backend routes, never remove a field from an existing response contract without updating all callers simultaneously.
3. **Type-safety first:** All new code (frontend & backend) must be fully typed — no `any` types unless absolutely unavoidable and explicitly commented.
4. **Mock-first in Phase 1:** All data during Phase 1 is mock/static. No real API calls from the frontend until Phase 2 is complete.
5. **Commit discipline:** Each phase should be committed as a clearly labeled Git commit or PR before moving to the next.

---

## Phase 1: Complete Modern Frontend UI Revamp *(IN PROGRESS)*

### Goal
Deliver a polished, production-quality React frontend with all key views — Landing Page, Auth, Dashboard, and Template Selection — using purely mock/static data. No real API calls. Backend is untouched.

---

### 1.1 Foundation & Design System

| Item | Detail |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v3 |
| **Component Library** | shadcn/ui (Radix UI primitives) |
| **Icons** | Lucide React |
| **Routing** | React Router v6 |

**Design Tokens:**
- **Base palette:** `zinc-50` → `zinc-950` (neutral grays)
- **Primary accent:** `indigo-600` / `indigo-500` (interactive elements, CTAs)
- **Success:** `emerald-500` | **Warning:** `amber-500` | **Danger:** `red-500`
- **Font:** Inter (loaded via Google Fonts)
- **Border radius:** `rounded-xl` for cards, `rounded-lg` for buttons/inputs
- **Shadow system:** `shadow-sm` (default), `shadow-md` (elevated cards), `shadow-lg` (modals/dropdowns)

**shadcn/ui Components to Install:**
`Button`, `Card`, `Badge`, `Dialog`, `DropdownMenu`, `Avatar`, `Skeleton`, `Tabs`, `Input`, `Separator`, `Tooltip`, `ScrollArea`, `Select`, `Sheet` (for mobile nav)

---

### 1.2 App Shell & Layout (`/src/layouts/AppLayout.tsx`)

This is the persistent shell that wraps all authenticated views (Dashboard, Templates, Editor, Settings).

**Sidebar (Desktop — collapsible):**
- Logo + app name at the top.
- Navigation items with icons:
  - 📊 Dashboard (`/dashboard`)
  - 📄 My Resumes (`/resumes`)
  - 🎨 Templates (`/templates`)
  - ⚙️ Settings (`/settings`)
- Collapse/expand toggle button at the bottom of the sidebar.
- Active route highlighted with `indigo` background pill.
- User avatar + name at the bottom with a logout option.

**Top Navbar:**
- Global search input (`⌘K` shortcut placeholder).
- Quick-action button: `+ New Resume` → opens a modal/dialog.
- Theme toggle (Light / Dark).
- Notification bell (UI placeholder, not functional in Phase 1).
- User avatar with dropdown: Profile, Settings, Logout.

**Mobile Behavior:**
- Sidebar collapses to a hamburger menu.
- Navigation opens as a `Sheet` (drawer) from the left.
- Top navbar remains always visible.

---

### 1.3 Landing Page (`/src/pages/LandingPage.tsx`)

The public-facing marketing page.

**Sections:**
1. **Hero:** Bold headline ("Build resumes that get interviews"), sub-headline, two CTAs — "Get Started Free" (→ `/auth?mode=signup`) and "See Templates" (→ `/templates`). Include a hero illustration or mockup screenshot.
2. **Features Row:** 3–4 feature cards with icons — "AI-Powered Parsing", "ATS-Optimized Templates", "One-Click PDF Export", "GitHub Deployment".
3. **Template Preview Carousel:** Static screenshots of 2–3 templates.
4. **How It Works:** 3-step visual flow — Upload → Parse → Download.
5. **CTA Banner:** Full-width call to action at the bottom.
6. **Footer:** Links to GitHub, Privacy Policy placeholder, Terms placeholder.

---

### 1.4 Auth Page (`/src/pages/AuthPage.tsx`)

Shared Login / Sign-Up page (tab-switched or URL-param driven `?mode=login|signup`).

**Login Form:**
- Email input + Password input.
- "Remember me" checkbox.
- "Forgot password?" link (non-functional placeholder in Phase 1).
- Submit button → Currently just redirects to `/dashboard` with mock state.

**Sign-Up Form:**
- Full Name + Email + Password + Confirm Password.
- Password strength indicator.
- Terms of service checkbox.
- Submit → Same mock redirect.

**Design Notes:**
- Split-screen layout (form on left, hero illustration on right) on desktop.
- Full-width card on mobile.

---

### 1.5 Dashboard View (`/src/pages/Dashboard.tsx`)

The main authenticated home screen.

**Header Section:**
- Greeting: "Good morning, {name} 👋"
- Two quick-action buttons: `Upload Resume` (opens file picker dialog) and `Start from Scratch` (→ Template Selection).

**Metric Cards (3x):**
1. **Total Resumes** — count of user's resumes.
2. **Average ATS Score** — average score across all resumes (mock: 78%).
3. **Last Updated** — relative timestamp of the most recently modified resume.

**Recent Resumes Grid:**
- Resume cards in a responsive 3-column grid (2 on tablet, 1 on mobile).
- Each card shows:
  - Template thumbnail / color-coded preview.
  - Resume title (e.g., "Software Engineer - Google").
  - ATS Score badge (color-coded: `green` ≥ 80, `yellow` 60–79, `red` < 60).
  - Last modified timestamp.
  - 3-dot `DropdownMenu`: Edit, Duplicate, Download PDF, Delete.
- Cards have hover lift animation (`shadow-lg`, slight `translateY`).

**Empty State:**
- Illustrated SVG + message: "No resumes yet. Upload your first one!"
- Single prominent CTA button.

**Upload Dialog:**
- Modal triggered by "Upload Resume" button.
- Drag-and-drop zone accepting `.pdf` and `.docx`.
- File size limit: 5MB.
- Shows upload progress bar (simulated in Phase 1).
- On "confirm", adds a mock resume card to the grid.

---

### 1.6 Template Selection View (`/src/pages/TemplateSelection.tsx`)

Gallery for browsing and selecting resume templates.

**Filter Bar:**
- Category filters (pill buttons): All, Minimal, Tech, Modern, Executive.
- Search input for template names.

**Template Cards Grid:**
- Responsive grid (3 columns desktop, 2 tablet, 1 mobile).
- Each card:
  - Large preview thumbnail.
  - Template name + category badge.
  - "Use Template" button on hover (overlaid).
  - Star/favorite icon (UI-only in Phase 1).
- Hover state: thumbnail zooms slightly, overlay appears.

**Template Preview Modal:**
- Clicking a card opens a full-screen preview dialog.
- Shows a larger render of the template.
- "Use This Template" CTA → navigates to editor (placeholder in Phase 1).

**Available Templates (Phase 1 — Static):**
1. `Minimal Clean` — white, lots of whitespace, single column.
2. `Tech Pro` — dark sidebar, two-column, code/icon accents.
3. `Modern Executive` — bold header, professional serif font.
4. `Creative` — colorful accent bar, icon-rich.

---

### 1.7 Resume Editor (Placeholder — Phase 1 Stub)

A stub page at `/editor/:id` that shows:
- "Editor coming in Phase 3" message.
- Link back to Dashboard.

This page exists purely so routing doesn't break when template cards link to it.

---

### 1.8 Phase 1 Completion Criteria

- [ ] All pages render without console errors.
- [ ] Routing works correctly (no 404s on direct URL access).
- [ ] Fully responsive at 375px, 768px, 1280px, 1440px.
- [ ] Dark mode works correctly across all views.
- [ ] All interactive elements (buttons, dropdowns, modals) function as expected with mock data.
- [ ] No real API calls are made (all data is local mock state).
- [ ] Lighthouse score: Performance ≥ 90, Accessibility ≥ 85.

---

## Phase 2: Authentication Layer (Clean Rebuild) *(PENDING)*

### Goal
Replace any existing legacy or placeholder auth with a production-grade, secure authentication system. The frontend will make real API calls to real auth endpoints. Protected routes will properly guard authenticated pages.

---

### 2.1 Backend Auth — Database Schema

**Prisma Models (`/backend/prisma/schema.prisma`):**

```prisma
model User {
  id            String         @id @default(cuid())
  name          String
  email         String         @unique
  passwordHash  String
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  sessions      Session[]
  refreshTokens RefreshToken[]
  resumes       Resume[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  expiresAt DateTime
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  expiresAt DateTime
  revoked   Boolean  @default(false)
}
```

---

### 2.2 Backend Auth — API Routes (`/backend/src/routes/authRoutes.ts`)

All routes validated with `zod`. Passwords hashed with `argon2`. Tokens are JWTs signed with a secret from `.env`.

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user. Returns `accessToken` + sets `refreshToken` HttpOnly cookie. |
| `POST` | `/api/auth/login` | Authenticate user. Returns `accessToken` + sets `refreshToken` HttpOnly cookie. |
| `POST` | `/api/auth/refresh` | Uses `refreshToken` cookie to issue new `accessToken`. |
| `POST` | `/api/auth/logout` | Revokes the `refreshToken`. Clears cookie. |
| `GET` | `/api/auth/me` | Returns authenticated user's profile. Requires `Authorization: Bearer <token>`. |

**Security Requirements:**
- `accessToken`: short-lived (15 minutes), stored in memory (React state).
- `refreshToken`: long-lived (7 days), stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie — never accessible to JavaScript.
- Rate limiting on `/signup` and `/login` (max 10 requests/15min per IP using `express-rate-limit`).
- Input sanitization on all fields.

---

### 2.3 Backend Auth — Middleware (`/backend/src/middlewares/authMiddleware.ts`)

- `authenticate`: Verifies the JWT `accessToken` from the `Authorization` header. Attaches `req.user` to the request. Returns `401` if invalid or expired.
- Used to protect all routes under `/api/resumes`, `/api/formats`, etc.

---

### 2.4 Frontend Auth Integration

**`AuthContext` (`/src/context/AuthContext.tsx`):**
- Provides: `user`, `accessToken`, `login(email, password)`, `signup(name, email, password)`, `logout()`, `refreshToken()`.
- On app mount, calls `/api/auth/refresh` silently to restore session if a valid refresh token cookie exists.
- Sets up an Axios interceptor to automatically refresh the `accessToken` on `401` responses and retry the original request.

**`ProtectedRoute` (`/src/components/ProtectedRoute.tsx`):**
- Wraps authenticated pages in React Router.
- If `user` is `null` and token refresh has been attempted → redirect to `/auth?mode=login`.
- Shows a full-page `Skeleton` loader while initial token refresh is in-flight.

**Protected Routes:**
- `/dashboard`
- `/resumes`
- `/templates`
- `/editor/:id`
- `/settings`

---

### 2.5 Phase 2 Completion Criteria

- [ ] User can sign up with name, email, password — account persisted in DB.
- [ ] User can log in and is issued a JWT.
- [ ] Refresh token silently renews sessions on page reload.
- [ ] Logout fully clears the session and cookie.
- [ ] Visiting a protected route while unauthenticated redirects to `/auth`.
- [ ] Invalid tokens return `401`.
- [ ] Brute-force protection (rate limiting) is active on auth routes.

---

## Phase 3: Persistent Structured Resume Parsing & Storage *(PENDING)*

### Goal
Build the core AI-powered resume processing pipeline. Users upload a PDF/DOCX, the file is parsed into a strict, versioned JSON schema, stored in the database, and rendered in the selected template.

---

### 3.1 Resume Schema (Immutable Contract)

This schema is the single source of truth. It is defined as a Zod schema in the backend and TypeScript types in the frontend.

```typescript
// /backend/src/types/ResumeSchema.ts

interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  summary: string;
}

interface WorkExperience {
  company: string;
  role: string;
  startDate: string;      // ISO 8601: "YYYY-MM"
  endDate?: string;       // ISO 8601 or "Present"
  location?: string;
  bullets: string[];      // Max 6 bullet points per role
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  honors?: string;
}

interface Project {
  name: string;
  description: string;
  techStack: string[];
  url?: string;
  github?: string;
  bullets: string[];
}

interface SkillGroup {
  category: string;       // e.g., "Languages", "Frameworks", "Tools"
  items: string[];
}

interface ResumeSchema {
  schemaVersion: string;  // e.g., "1.0.0" — bump on breaking changes
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications?: string[];
  languages?: string[];
}
```

---

### 3.2 Parser Service (`/parser-service/main.py`)

A lightweight Python FastAPI microservice responsible for extracting text from resumes and converting them into the `ResumeSchema` JSON.

**Endpoint:**
```
POST /parse
Content-Type: multipart/form-data
Body: file (PDF or DOCX, max 5MB)

Response 200:
{
  "success": true,
  "data": { ...ResumeSchema },
  "confidence": 0.92           // 0–1 confidence score from LLM
}
```

**Processing Pipeline:**
1. **File Extraction:** Use `pdfplumber` (PDF) or `python-docx` (DOCX) to extract raw text.
2. **LLM Structuring:** Send extracted text to OpenAI `gpt-4o-mini` (or Google Gemini) with a strict system prompt instructing it to output only valid JSON conforming to `ResumeSchema`. Use `response_format: { type: "json_object" }` (structured output mode).
3. **Zod/Pydantic Validation:** Validate the LLM's JSON output against the schema. If validation fails, retry the LLM call up to 2 times with the validation errors appended to the prompt.
4. **Return parsed JSON** back to the backend.

**Error Handling:**
- File too large → `413 Payload Too Large`
- Unsupported file type → `415 Unsupported Media Type`
- LLM parse failure after retries → `422 Unprocessable Entity` with `{ "error": "parse_failed", "details": "..." }`

---

### 3.3 Backend Resume Routes (`/backend/src/routes/resumeRoutes.ts`)

All routes require `authenticate` middleware.

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/resumes/upload` | Accepts file, calls parser service, saves structured JSON + metadata to DB. Returns new resume record. |
| `GET` | `/api/resumes` | Returns list of all resumes for the authenticated user (metadata only, no full JSON body). |
| `GET` | `/api/resumes/:id` | Returns full resume data including parsed JSON. |
| `PATCH` | `/api/resumes/:id` | Updates resume content (used by the editor for manual edits). Accepts partial `ResumeSchema`. |
| `DELETE` | `/api/resumes/:id` | Soft-deletes the resume. |
| `POST` | `/api/resumes/:id/duplicate` | Creates an exact copy of the resume with a "(Copy)" suffix on the title. |

---

### 3.4 Database Schema Updates (`/backend/prisma/schema.prisma`)

```prisma
model Resume {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title         String
  templateId    String                       // e.g., "minimal-clean"
  parsedData    Json                         // Stores the full ResumeSchema JSON
  schemaVersion String   @default("1.0.0")
  atsScore      Int?                         // 0–100, computed after parse
  isDeleted     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

### 3.5 ATS Score Computation

After a resume is parsed, compute an ATS score (0–100) based on:

| Check | Points |
|---|---|
| `personalInfo.email` present | 5 |
| `personalInfo.phone` present | 5 |
| `personalInfo.summary` ≥ 50 chars | 10 |
| ≥ 1 work experience entry | 15 |
| Each work experience has ≥ 3 bullets | 10 |
| ≥ 1 education entry | 10 |
| ≥ 1 project entry | 10 |
| `skills` has ≥ 2 categories | 15 |
| No placeholder text detected | 10 |
| All date fields in correct format | 10 |

Stored as `atsScore` on the `Resume` model.

---

### 3.6 Resume Editor (`/src/pages/Editor.tsx`)

A live editor that lets the user manually correct any parsing mistakes.

**Layout:**
- **Left panel (40%):** Form-based editor. Each section of the schema (`Personal Info`, `Work Experience`, `Education`, `Projects`, `Skills`) is rendered as an editable form. `Work Experience` and `Projects` are dynamic list editors (add/remove entries, reorder via drag-and-drop).
- **Right panel (60%):** Live PDF preview of the selected template, re-rendered in real time as the user types (debounced at 500ms).

**Save Behavior:**
- Auto-save to backend every 30 seconds if there are unsaved changes.
- Manual "Save" button.
- Indicator showing "All changes saved" / "Saving..." / "Unsaved changes".

**Template Switcher:**
- A dropdown at the top lets the user switch between templates without losing their data.

**Export:**
- "Download PDF" button → uses `react-to-pdf` or a backend `/api/resumes/:id/export` route to generate the PDF.

---

### 3.7 Phase 3 Completion Criteria

- [ ] User can upload a PDF or DOCX.
- [ ] Parser service returns a valid `ResumeSchema` JSON.
- [ ] Parsed data is stored in the database against the user.
- [ ] ATS score is computed and displayed.
- [ ] User can view all their resumes on the Dashboard (real data, not mock).
- [ ] User can open a resume in the editor and make manual corrections.
- [ ] Changes are saved to the backend.
- [ ] User can download their resume as a PDF.
- [ ] User can delete and duplicate resumes.

---

## Phase 4: Deployment (GitHub + Vercel) *(PENDING)*

### Goal
Configure the project for clean, one-command deployment. The frontend deploys to Vercel. The backend deploys to a cloud provider (Railway, Render, or Fly.io). The parser microservice deploys separately as a Python service. All connected via environment variables.

---

### 4.1 Monorepo Structure (Final)

```
neatresume/
├── frontend/               # React (Vite) app
├── backend/                # Node.js (Express + Prisma) API
├── parser-service/         # Python (FastAPI) microservice
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       ├── backend-deploy.yml
│       └── parser-deploy.yml
├── PRD.md
└── README.md
```

---

### 4.2 Frontend Deployment (Vercel)

**Method:** Connect the GitHub repo to Vercel. Configure the root directory to `./frontend`.

**Vercel Settings (`vercel.json` in `/frontend`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Environment Variables (set in Vercel dashboard):**
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_PARSER_BASE_URL=https://parser.yourdomain.com
```

---

### 4.3 Backend Deployment (Railway / Render)

**Method:** Deploy the `/backend` directory as a Node.js service.

**Build & Start Commands:**
```bash
# Build
npm install && npx prisma generate && npm run build

# Start
node dist/index.js
```

**Environment Variables (set in deployment dashboard):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=<random 64-char hex string>
JWT_REFRESH_SECRET=<random 64-char hex string>
PARSER_SERVICE_URL=https://parser.yourdomain.com
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://neatresume.vercel.app
```

**Database:**
- Use **Supabase** (free tier) or **Railway Postgres** as the PostgreSQL provider.
- Run `npx prisma migrate deploy` as part of the deployment startup script.

---

### 4.4 Parser Service Deployment (Railway / Render — Python)

**Method:** Deploy the `/parser-service` directory as a Python service.

**`requirements.txt`:**
```
fastapi
uvicorn
pdfplumber
python-docx
openai
pydantic
python-multipart
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Environment Variables:**
```
OPENAI_API_KEY=sk-...
MAX_FILE_SIZE_MB=5
```

---

### 4.5 GitHub Actions CI/CD

**Frontend Deploy (`.github/workflows/frontend-deploy.yml`):**
- Trigger: push to `main` branch, changes in `frontend/`.
- Steps: Install → Test → Build → Vercel CLI deploy.

**Backend Deploy (`.github/workflows/backend-deploy.yml`):**
- Trigger: push to `main` branch, changes in `backend/`.
- Steps: Install → TypeScript compile → Run DB migrations → Deploy to Railway/Render via CLI.

**Parser Deploy (`.github/workflows/parser-deploy.yml`):**
- Trigger: push to `main` branch, changes in `parser-service/`.
- Steps: Install Python deps → Run tests → Deploy.

---

### 4.6 Domain & CORS Configuration

- Register a custom domain (e.g., `neatresume.app`) and point it to Vercel.
- Backend API at `api.neatresume.app`, parser at `parser.neatresume.app`.
- CORS: Backend only allows requests from `https://neatresume.app` and `https://www.neatresume.app` in production. `localhost:5173` allowed only in development.

---

### 4.7 README.md (Final)

The project `README.md` must include:
- Project description + live demo link.
- Screenshot of the dashboard.
- Tech stack badges.
- Local development setup instructions (step-by-step: clone, install, `.env` setup, DB migrate, start all three services).
- One-click "Deploy to Vercel" badge.
- Architecture diagram (simple ASCII or image).

---

### 4.8 Phase 4 Completion Criteria

- [ ] Frontend is accessible at a public Vercel URL.
- [ ] Backend API is live and reachable from the frontend.
- [ ] Parser service is live and reachable from the backend.
- [ ] Database is migrated and connected.
- [ ] User can sign up, upload a resume, and download a PDF — end-to-end — on the live URL.
- [ ] GitHub Actions pipelines pass and auto-deploy on push to `main`.
- [ ] `README.md` contains full setup instructions and a live demo link.
- [ ] All secrets are stored in environment variables — **no secrets are committed to the repository.**