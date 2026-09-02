<div align="center">
  <!-- Use a nice SVG or emoji for the logo if none exists -->
  <h1>📄 NeatResume</h1>
  <p align="center">
    <strong>A modern, AI-powered resume builder.</strong>
    <br />
    Upload raw resumes, effortlessly parse into structured schemas powered by AI, and export in beautiful ATS-optimized templates.
    <br />
    <br />
    <a href="https://neatresume.app">View Demo</a> (Coming Soon)
    ·
    <a href="https://github.com/thepiyush-303/neat-resume/issues">Report a Bug</a>
  </p>
  
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthepiyush-303%2Fneat-resume">
    <img src="https://vercel.com/button" alt="Deploy to Vercel"/>
  </a>
</div>

<br />

> **NeatResume** lets you upload your raw PDF/DOCX resumes, automatically structures them via a powerful LLM-based parsing microservice, and seamlessly renders beautifully designed, ATS-friendly templates on the fly!

---

## ✨ Features

- **🤖 AI-Powered Parsing:** Effortlessly extracts structured data from PDF or DOCX format using Google Gemini / OpenAI `gpt-4o-mini`.
- **🎨 Modern, Responsive UI:** Built with React 18, Tailwind CSS, and shadcn/ui.
- **🛡️ Secure Authentication:** Full JWT strategy with silent refresh flows.
- **📄 Extensible Formats:** Real-time resume preview rendering matching strict structural data schemas.
- **📊 ATS Scoring:** Automated calculation of ATS compatibility metrics to get you hired.
- **🚀 Deploy Anywhere:** Ready for setup on Vercel, Railway, Render, or self-hosting!

---

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite_4-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Python_FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</div>

---

## 📐 Architecture

Below is a high-level overview of the microservice architecture running the NeatResume ecosystem:

```mermaid
graph TD
    Client(["User / Browser"]) -->|REST API| Frontend["Frontend (React + Vite)"]
    Frontend -->|JWT Secured| Backend["Backend API (Node.js + Express)"]
    Backend -->|Prisma ORM| Database[("PostgreSQL")]
    Backend -->|Multipart Upload| Parser["Parser Service (Python FastAPI)"]
    Parser -->|Prompt & Extract| LLM["LLM (Gemini / GPT)"]
```

---

## 🚀 Getting Started

Follow these steps to set up the complete monolithic environment locally.

### 1. Prerequisites
Ensure you have the following installed to run the 3 services:
- **Node.js**: `v18+`
- **Python**: `3.9+`
- **PostgreSQL**: A local instance or remote URL (e.g., Supabase)
- **API Keys**: OpenAI / Gemini account for parsing algorithms

### 2. Clone the Repository
```bash
git clone https://github.com/thepiyush-303/neat-resume.git
cd neat-resume
```

### 3. Backend Setup
```bash
cd backend
npm install
```
- Copy `.env.example` to `.env` and fill the variables:
  ```env
  DATABASE_URL="postgres://user:pass@localhost:5432/resume_db"
  JWT_SECRET="your-secret"
  JWT_REFRESH_SECRET="your-refresh-secret"
  PARSER_SERVICE_URL="http://localhost:8000"
  ```
- Run Prisma migrations and generate the client:
  ```bash
  npx prisma migrate dev --name init
  ```
- Start the server:
  ```bash
  npm run dev
  ```

### 4. Parser Microservice Setup
Open a new terminal for the parser inside `/parser-service`:
```bash
cd parser-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
- Create a `.env` in this directory:
  ```env
  OPENAI_API_KEY="sk-..."
  ```
- Run the FastAPI application:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
  ```

### 5. Frontend Setup
Open another terminal:
```bash
cd frontend
npm install
```
- Map variables inside `.env`:
  ```env
  VITE_API_BASE_URL="http://localhost:3000/api"
  ```
- Fire up the dev environment:
  ```bash
  npm run dev
  ```
The dashboard applies UI components efficiently in development port `http://localhost:5173`.

---

## 🎨 Dashboard Preview

> *(Preview Coming soon - Deploy real screenshot here for showcase)*

_Upload flow is completely responsive across all devices and template selections._ 

---

## 📄 License & Terms

NeatResume operates under the open-source MIT License. Feel free to modify, host privately, or distribute!
