# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🛠️ Development Commands

### Backend (Node.js + Express)
- **Start development server**: `cd backend && npm run dev` (uses tsx watch)
- **Build for production**: `cd backend && npm run build` (generates Prisma client, pushes DB, compiles TypeScript)
- **Start production server**: `cd backend && npm run start`
- **Type checking**: `cd backend && npm run typecheck`
- **Prisma migrations**: `cd backend && npx prisma migrate dev --name <migration-name>`
- **Prisma Studio**: `cd backend && npx prisma studio`
- **Push Prisma schema**: `cd backend && npm run db:push` (or `prisma db push`)

### Frontend (React + Vite)
- **Start development server**: `cd frontend && npm run dev` (runs on http://localhost:5173)
- **Build for production**: `cd frontend && npm run build`
- **Preview production build**: `cd frontend && npm run preview`
- **Linting**: `cd frontend && npm run lint`

### Parser Service (Python FastAPI)
- **Start development server**: `cd parser-service && uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
- **Install dependencies**: `cd parser-service && pip install -r requirements.txt`

### Environment Setup
- Copy `.env.example` to `.env` in each service (backend, parser-service, frontend) and fill required variables.
- Backend requires: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, PARSER_SERVICE_URL
- Parser service requires: OPENAI_API_KEY (or Gemini API key via google-genai)
- Frontend requires: VITE_API_BASE_URL (typically http://localhost:3000/api)

## 🏗️ Architecture Overview

### Microservices
NeatResume consists of three interconnected services:
1. **Frontend** (React + Vite): User interface running in the browser
2. **Backend** (Node.js + Express): REST API handling authentication, resume management, and business logic
3. **Parser Service** (Python FastAPI): Microservice for AI-powered resume parsing using LLMs (Gemini/GPT)

### Data Flow
```
User Browser <---> Frontend <---> Backend <---> Parser Service <---> LLM API
                                  |
                                  v
                             PostgreSQL (via Prisma ORM)
```

### Key Components
- **Backend**:
  - `src/index.ts`: Application entry point
  - `src/routes/`: API route definitions (auth, resume, formatting)
  - `src/controller/`: Request handlers
  - `src/middlewares/`: Custom middleware (auth, upload)
  - `src/lib/prisma.ts`: Prisma client initialization
  - `src/types/`: TypeScript interfaces and Zod schemas
  - `src/utils/`: Utility functions (ATS scoring, prompts)

- **Frontend**:
  - `src/App.tsx`: Root application component with routing
  - `src/pages/`: Page components (Auth, Dashboard, Editor, etc.)
  - `src/components/`: Reusable UI components (shadcn-based)
  - `src/components/templates/`: Resume template variants
  - `src/context/`: React contexts (Auth, Theme, Portfolio)
  - `src/lib/`: Utility functions and API clients
  - `src/types/resume.ts`: Resume data structures

- **Parser Service**:
  - `main.py`: FastAPI application entry point
  - Handles file upload (PDF/DOCX), text extraction, and LLM-based structured data extraction

### Database Schema (Prisma)
- **User**: Authentication core (email, password hash)
- **Session**: JWT-based session management
- **RefreshToken**: Token rotation for secure authentication
- **Resume**: User resumes with parsed JSON data, template ID, and ATS score

### Communication
- Frontend ↔ Backend: REST API over HTTP (JWT-secured)
- Backend ↔ Parser Service: HTTP multipart file upload
- Parser Service ↔ LLM: Direct API calls (Google Gemini or OpenAI)

## 📝 Code Conventions
- **TypeScript**: Strict mode enabled in both backend and frontend
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API (no external libraries like Redux)
- **API Validation**: Zod for request/response validation in backend
- **File Uploads**: Multer middleware in backend

## 🔧 Common Tasks
- **Adding a new API endpoint**: 
  1. Define route in `backend/src/routes/`
  2. Implement controller in `backend/src/controller/`
  3. Add validation schema in `backend/src/types/` if needed
  4. Protect with auth middleware if required
- **Creating a new resume template**:
  1. Add component in `frontend/src/components/templates/`
  2. Import and export in template index if needed
  3. Reference by ID in resume creation
- **Modifying database schema**:
  1. Update `backend/prisma/schema.prisma`
  2. Run `npx prisma migrate dev` or `prisma db push`
  3. Regenerate Prisma client if needed