# Doctor Tracker

Doctor Tracker is a secure, responsive administrative web application for managing doctors and their patients from one place. It provides an admin dashboard with key statistics, doctor and patient management, search, filtering, and pagination to support efficient day-to-day healthcare administration.

## Features

- **Authentication:** Cookie-based admin login, protected API routes, and route guards on the frontend.
- **Dashboard:** Overview of doctor and patient totals, month-over-month growth, 12-month trends, patients per doctor, condition and specialization distribution, gender breakdown, and recent patients with charts.
- **Doctor management:** Create, list, search, filter, sort, and paginate doctors; delete a doctor together with their assigned patients.
- **Patient management:** Create, view, search, filter, sort, paginate, edit, and delete patient records.
- **Doctor–patient relationship:** Each patient is assigned to a doctor. Patients list can be filtered by doctor, and doctor rows show the assigned patient count.
- **Validation and error handling:** Zod request validation and a centralized Express error handler with consistent JSON responses.
- **Database performance:** MongoDB indexes on frequently queried fields and server-side filtering/pagination.
- **Responsive UI:** Navigation, tables, dialogs, and dashboard layouts designed for desktop and mobile screens.

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- React Hook Form + Zod
- shadcn/Base UI components, Phosphor and Lucide icons
- ofetch API client
- Biome (lint and format)

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB (official `mongodb` driver)
- Zod 4 (request validation)
- JSON Web Token + `httpOnly` cookie authentication
- bcryptjs (password hashing)
- Biome (lint and format)

### Tooling

- Bun (dependency installation and script runner)
- Git and GitHub

## Repository Structure

```text
doctor-tracker/
├── frontend/           # Next.js client application
│   └── src/
│       ├── api/        # API request functions
│       ├── app/        # App Router pages and layouts
│       ├── components/ # UI, forms, tables, charts, dialogs
│       ├── hooks/      # TanStack Query hooks
│       ├── lib/        # API client and helpers
│       └── types/      # Shared TypeScript types
├── backend/            # Express REST API
│   └── src/
│       ├── config/     # Environment configuration
│       ├── lib/        # MongoDB connection and indexes
│       ├── middlewares/# Auth, validation, error handling
│       ├── modules/    # auth, doctor, patient, dashboard
│       ├── types/      # Domain and payload types
│       ├── utils/      # JWT, cookies, responses, seeding
│       ├── app.ts      # Express app and route mounting
│       └── server.ts   # Server bootstrap
├── screenshots/        # README visual evidence
└── README.md
```

## System Architecture

```text
Admin
  |
  v
Next.js Frontend (App Router, TanStack Query)
  |  HTTPS requests to /api/* with credentials included
  v
Express API (Node.js)
  |-- CORS for the configured frontend origin
  |-- Authentication and authorization (JWT in httpOnly cookies)
  |-- Zod request validation
  |-- Doctor, patient, and dashboard business logic
  |-- Search, filtering, sorting, and pagination
  |
  v
MongoDB
  |-- users      (admin and application accounts)
  |-- doctors
  |-- patients   (references doctors by doctorId)
  |-- Indexes for frequently queried fields
```

1. The administrator signs in through the Next.js frontend.
2. The API validates credentials and sets `accessToken` and `refreshToken` as `httpOnly` cookies.
3. The frontend sends API requests with `credentials: "include"`; protected routes verify the token and role.
4. The API queries or updates MongoDB and returns a JSON response.
5. The frontend renders the returned data and updates dashboard metrics and charts.

## Prerequisites

- [Bun](https://bun.sh/) (used to install dependencies and run scripts)
- A supported Node.js version for Next.js and the compiled backend
- A MongoDB database, such as MongoDB Atlas or a local MongoDB instance
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/imranh-dev1/doctor-tracker.git
cd doctor-tracker
```

### 2. Configure and run the backend

```bash
cd backend
bun install
```

Create the environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in at least these values:

```dotenv
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/doctor-tracker
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=change-me
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Start the API:

```bash
bun run dev
```

The server connects to MongoDB, creates the configured indexes, seeds the admin account if no admin exists, and listens on `http://localhost:5000`.

### 3. Configure and run the frontend

```bash
cd ../frontend
bun install
```

Create `frontend/.env.local` (or `.env`) from the example:

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the seeded admin account.

## Available Scripts

### Backend (`backend/package.json`)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `tsx watch src/server.ts` | Run the API in watch mode |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/server.js` | Run the compiled server |
| `typecheck` | `tsc --noEmit` | Type-check without emitting |
| `format:check` | `biome format ./src` | Check formatting |
| `format:fix` | `biome format --write ./src` | Apply formatting |
| `linter:check` | `biome lint` | Run the linter |
| `linter:fix` | `biome lint --write ./src` | Apply lint fixes |

### Frontend (`frontend/package.json`)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Start the Next.js development server |
| `build` | `next build` | Create a production build |
| `start` | `next start` | Run the production build |
| `lint` | `biome check` | Lint and check formatting |
| `format` | `biome format --write` | Apply formatting |

## Environment Variables

### Backend

| Variable | Required | Purpose | Example |
|---|---|---|---|
| `PORT` | No | Express server port (defaults to `5000`) | `5000` |
| `NODE_ENV` | No | Runtime environment; controls error detail and cookie security | `development` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://127.0.0.1:27017/doctor-tracker` |
| `FRONTEND_URL` | No | Allowed frontend origin for CORS (defaults to `http://localhost:3000`) | `http://localhost:3000` |
| `ADMIN_NAME` | Yes (first start) | Seeded admin display name | `Admin` |
| `ADMIN_EMAIL` | Yes (first start) | Seeded admin email | `admin@gmail.com` |
| `ADMIN_PASSWORD` | Yes (first start) | Seeded admin password | `change-me` |
| `BCRYPT_SALT_ROUNDS` | No | Password hashing cost | `10` |
| `JWT_ACCESS_SECRET` | Yes | Secret used to sign access tokens | Long random string |
| `JWT_REFRESH_SECRET` | Yes | Secret used to sign refresh tokens | Long random string |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime | `7d` |

`DOCTOR_*` and `PATIENT_*` entries in `.env.example` are reserved placeholders and are not currently read by the application.

### Frontend

| Variable | Required | Purpose | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the REST API, including the `/api` prefix | `http://localhost:5000/api` |

## API Overview

Base URL: `http://localhost:5000` — all application routes are prefixed with `/api`.

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Admin | Create an application user (always role `PATIENT`) |
| `POST` | `/api/auth/login` | Public | Sign in and set `accessToken` / `refreshToken` cookies |
| `GET` | `/api/auth/me` | Any authenticated role | Return the current user without the password |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookies |

### Doctors

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/doctor` | Admin | List doctors with pagination, search, filters, and sorting |
| `POST` | `/api/doctor` | Admin | Create a doctor |
| `DELETE` | `/api/doctor/:id` | Admin | Delete a doctor and their assigned patients |

### Patients

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/patient` | Admin | List patients with pagination, search, filters, and sorting |
| `POST` | `/api/patient` | Admin | Create a patient assigned to a doctor |
| `GET` | `/api/patient/conditions` | Admin | Return the distinct list of patient conditions |
| `GET` | `/api/patient/:id` | Admin | Return a single patient with doctor details |
| `PATCH` | `/api/patient/:id` | Admin | Update one or more patient fields |
| `DELETE` | `/api/patient/:id` | Admin | Delete a patient |

### Dashboard

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Admin | Return totals, growth, monthly trends, distributions, and recent patients |

### Health Check

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/` | Public | Confirm the API is running |

### Query Parameters

**Doctors** (`GET /api/doctor`): `page`, `limit` (max `100`), `search`, `specialization`, `hospital`, `fromDate`, `toDate`, `sortBy` (`name`, `email`, `phone`, `specialization`, `hospital`, `createdAt`), `sortOrder` (`asc` or `desc`).

**Patients** (`GET /api/patient`): `page`, `limit` (max `100`), `search`, `condition`, `doctorId`, `gender` (`MALE`, `FEMALE`, `OTHER`), `fromDate`, `toDate`, `sortBy` (`name`, `age`, `condition`, `createdAt`), `sortOrder` (`asc` or `desc`).

### Response Format

Successful responses:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Doctors retrieved successfully.",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

Error responses include `success: false`, `statusCode`, `name`, and `message`. In development the full error and stack trace are also returned; production responses stay generic.

### Authentication Details

- JWTs are sent as `accessToken` and `refreshToken` `httpOnly` cookies; an `Authorization: Bearer <token>` header is also accepted.
- In development cookies are `SameSite=Lax` and not `Secure`; in production they are `SameSite=None` and `Secure`.
- Access cookies live for 1 day and refresh cookies for 7 days.
- Roles are defined as `ADMIN`, `DOCTOR`, and `PATIENT`; all management routes currently require `ADMIN`.

## Data Model

| Collection | Key fields | Indexes |
|---|---|---|
| `users` | `name`, `email`, `password` (hash), `role`, `status`, `emailVerified`, timestamps | Unique `email` |
| `doctors` | `name`, `specialization`, `hospital`, `phone`, `email`, timestamps | Unique `email`, unique `phone`, `name`, `specialization`, `hospital`, `createdAt` |
| `patients` | `name`, `age`, `gender`, `phone`, `email`, `condition`, `doctorId`, timestamps | Unique `email`, `doctorId + createdAt`, `condition`, `name`, `createdAt` |

Deleting a doctor also deletes every patient whose `doctorId` references that doctor.

## Technical Decisions

### 1. MongoDB indexes and query patterns

Doctor and patient lists commonly require searching, filtering, sorting, and pagination. The backend creates indexes on fields used by those queries (for example `createdAt`, `doctorId`, `condition`, `specialization`, and unique `email`/`phone` lookups), and applies filtering and pagination in MongoDB rather than loading entire collections into the frontend.

### 2. Separate frontend and REST API

Next.js handles the user interface, while Express owns server-side validation, authorization, and database access. Database credentials stay on the server, the API has a clear responsibility boundary, and both applications can be deployed independently.

The frontend uses one configured `ofetch` client (`src/lib/apiClient.ts`) with `credentials: "include"` and a single `NEXT_PUBLIC_API_URL` value. The API validates input, enforces authorization on protected routes, and returns predictable response shapes.

### 3. Cookie-based JWT authentication

Tokens are stored in `httpOnly` cookies to reduce exposure to client-side scripts, while the API also accepts bearer tokens for non-browser clients. Passwords are hashed with bcryptjs and never returned in responses.

## Performance and Security Notes

- Search, filtering, sorting, and pagination run on the server.
- Indexes are created automatically at startup for the documented query fields.
- Request bodies are validated with Zod before database operations.
- Private routes require a valid token and an allowed role; blocked users are rejected.
- Secrets and connection strings are read from environment variables and excluded from Git via `.gitignore`.
- CORS is restricted to `FRONTEND_URL` and allows credentials.
- Password hashes and password-equivalent fields are stripped from API responses.
- Production error responses do not expose stack traces or internal messages.

## Visual Evidence

### Dashboard — Desktop

![Doctor Tracker dashboard on desktop](screenshots/dashboard-desktop.png)

### Dashboard — Mobile

![Doctor Tracker dashboard on mobile](screenshots/dashboard-mobile.png)

### Doctors Page

![Doctor Tracker doctors page](screenshots/doctors-page.png)

### Patients Page

![Doctor Tracker patients page](screenshots/patients-page.png)

### Login Page

![Doctor Tracker login page](screenshots/login-page.png)

## Deployment

- **Frontend:** `https://doctor-tracker-ui.vercel.app/`
- **Backend API:** `https://doctor-tracker-backend-phi.vercel.app/`
- **Frontend repository:** `https://github.com/imranh-dev1/doctor-tracker/tree/main/frontend`
- **Backend repository:** `https://github.com/imranh-dev1/doctor-tracker/tree/main/backend`

The backend includes a `vercel.json` that builds `dist/server.js` with `@vercel/node` and routes all requests to it. Run `bun run build` before deploying so `dist/` exists.

## Demo Credentials

- **Email:** `admin@gmail.com`
- **Password:** `admin@`

These credentials come from the local `.env` used for the demo. Change the admin email and password before any real deployment.

## Known Limitations / Future Improvements

- No automated test suite yet for authentication and CRUD workflows
- No update endpoint for doctors (create, list, and delete are exposed)
- `DOCTOR` and `PATIENT` roles exist, but only `/api/auth/me` accepts them; management routes are admin-only
- `DOCTOR_*` and `PATIENT_*` demo account variables in `.env.example` are not wired to seeding
- More detailed audit logs and analytics
- Exportable reports
- Rate limiting and additional authentication protections
- Monitoring and structured production logging
