# AbleSpace Task Management System

## Live Demo
- **Frontend:** [https://ablespace-task-management.vercel.app](https://ablespace-task-management.vercel.app)
- **Backend Health Check:** [https://ablespace-task-management-t5tc.onrender.com/api/health](https://ablespace-task-management-t5tc.onrender.com/api/health)
- **Backend API Base:** [https://ablespace-task-management-t5tc.onrender.com/api](https://ablespace-task-management-t5tc.onrender.com/api)

---

## Overview
Full-stack Task Management System built for the **AbleSpace Full Stack Developer** assessment.  
Matches the provided Figma design faithfully with Kanban board and list views, dynamic theme system, guest & demo authentication, project management, customizable settings, and scalable NestJS REST APIs.

---

## Features
- **Guest Login & JWT Authentication:** Instant guest and demo sessions ("Dexter" profile) alongside JWT-based token authorization.
- **Tasks Board (Kanban) & List Views:** Intuitive task workflow organization with status columns, responsive drag/move, and switchable board/list view layouts.
- **Detailed Task View:** Comprehensive task modal/page with subtasks, comments, priority tags, due dates, assignees, and status management.
- **Projects Management:** Full project directory list and dedicated project detail view with filtered task categorization.
- **Settings & Profile Customization:** Personalized profile details, theme switcher, and persistent user preferences.
- **Light / Dark Mode + 6 Accent Colors:** Dynamic themes with 6 curated accent color palettes stored in local storage and database preferences.
- **Filtering & Search:** Real-time search by task title/description and configurable fields toggle for clean UI density.
- **Clean Architecture & Reusable Components:** Modular component hierarchy, robust custom hooks, type-safe API client, and clean NestJS service-repository pattern.

---

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Axios, Context API, Lucide Icons
- **Backend:** NestJS, TypeScript, Prisma ORM, JWT, class-validator, bcryptjs
- **Database:** PostgreSQL (Neon Serverless)
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## Monorepo Structure
```text
ablespace-task-management/
├── frontend/          # Next.js 14 frontend application
├── backend/           # NestJS REST API backend service
└── README.md          # Project documentation and submission guide
```

---

## Local Setup

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm / pnpm / yarn
- PostgreSQL database instance (or free Neon PostgreSQL connection string)

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables in backend/.env
# DATABASE_URL="postgresql://..."
# JWT_SECRET="your_jwt_secret"
# PORT=3001
# FRONTEND_URL="http://localhost:3000"

npx prisma generate
npx prisma db push
npx prisma db seed
npm run start:dev
```
Backend will start on `http://localhost:3001` (API Base: `http://localhost:3001/api`).

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment variables in frontend/.env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

npm run dev
```
Frontend will be accessible at `http://localhost:3000`.

---

## API Endpoints

### Authentication
- `POST /api/auth/guest-login` - Authenticate or create a quick guest user session
- `POST /api/auth/demo-login` - Login as the default demo user (Dexter)
- `GET /api/auth/me` - Retrieve authenticated user profile

### Tasks
- `GET /api/tasks` - List tasks (supports query filtering by project, status, priority, search)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Fetch task details with subtasks and comments
- `PATCH /api/tasks/:id` - Update task details or status
- `DELETE /api/tasks/:id` - Delete a task

### Projects
- `GET /api/projects` - List all projects with summary stats
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Fetch project details and related tasks
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Labels & Comments
- `GET /api/labels` - List available labels/tags
- `POST /api/labels` - Create a new custom label
- `POST /api/comments` - Add a comment to a task
- `DELETE /api/comments/:id` - Remove a comment

### User Preferences
- `GET /api/users/me` - Get current user settings
- `PATCH /api/users/me` - Update profile information
- `PATCH /api/users/me/preferences` - Update theme mode (light/dark) and accent color

---

## Design Notes
- **Figma Alignment:** Components, spacing, typography, cards, and modal layouts have been crafted to closely mirror the provided AbleSpace Figma design specifications.
- **OAuth Authentication:** In accordance with standard assessment scoping, the Google Sign-In button leverages a pre-configured demo path ("Dexter") to demonstrate authenticated state flows smoothly without requiring third-party OAuth redirect configuration in grading environments.
- **Theme Engine:** Implemented zero-flicker CSS variable injection supporting dynamic light/dark modes with 6 distinct brand accent colors.

---

## Author
**Padmavathi-1234**  
Assessment submission for **AbleSpace Full Stack Developer (Fresher)**
