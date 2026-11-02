# Doctor Tracker — Frontend

Next.js admin interface for the Doctor Tracker application. It provides the login screen, statistics dashboard, doctor management, and patient management UI, backed by the Doctor Tracker REST API.

For full project documentation, screenshots, and deployment details, see the [root README](../README.md).

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- TanStack Query
- React Hook Form + Zod
- shadcn / Base UI components
- Phosphor and Lucide icons
- `ofetch` API client
- Biome for linting and formatting

## Getting Started

Install dependencies:

```bash
bun install
```

Create the environment file from the example:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Set the API base URL (it must include the `/api` prefix):

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend must be running and reachable at the configured API URL.

## Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Start the development server |
| `build` | `next build` | Create a production build |
| `start` | `next start` | Serve the production build |
| `lint` | `biome check` | Lint and check formatting |
| `format` | `biome format --write` | Apply formatting |

## Environment Variables

| Variable | Required | Purpose | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the REST API, including `/api` | `http://localhost:5000/api` |

## Project Structure

```text
src/
├── api/                 # Request functions per resource
│   ├── auth.api.ts
│   ├── dashboard.api.ts
│   ├── doctor.api.ts
│   ├── patient.api.ts
│   └── index.ts
├── app/
│   ├── (dashboard)/     # Protected dashboard, doctors, patients pages
│   ├── login/           # Login page
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── auth/            # Auth guard and loading state
│   ├── charts/          # Bar list, donut, and trend charts
│   ├── dashboard/       # Stat cards
│   ├── dilog/           # Create/edit/delete dialogs and sheets
│   ├── form/            # Login, doctor, and patient forms
│   ├── layout/          # Sidebar
│   ├── shared/          # Logo, headers, pagination, search
│   ├── skeleton/        # Loading skeletons
│   ├── table/           # Doctor and patient tables
│   └── ui/              # shadcn/Base UI primitives
├── hooks/               # TanStack Query hooks per resource
├── lib/
│   ├── apiClient.ts     # Configured ofetch client
│   ├── format.ts        # Formatting helpers
│   └── utils.ts
├── providers/           # React Query and app providers
└── types/               # Shared API and domain types
```

## API Client

`src/lib/apiClient.ts` creates a single `ofetch` instance using `NEXT_PUBLIC_API_URL` with `credentials: "include"` so the backend's `httpOnly` auth cookies are sent with every request. API errors are converted to `Error` instances using the backend's `message` field.

## Pages

| Route | Purpose |
|---|---|
| `/login` | Admin sign-in |
| `/` | Dashboard statistics and charts |
| `/doctors` | Doctor list, create, search/filter, delete, and assigned patients |
| `/patients` | Patient list, create, edit, delete, search/filter |

All dashboard routes are wrapped by the auth guard, which verifies the current session through `GET /api/auth/me`.
