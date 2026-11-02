# Doctor Tracker — Backend

Express + TypeScript REST API for the Doctor Tracker application. It provides cookie-based JWT authentication, admin-protected doctor and patient management, MongoDB-backed search/filtering/pagination, and dashboard statistics.

For full project documentation, setup, screenshots, and deployment details, see the [root README](../README.md).

## Tech Stack

- Node.js + Express 5
- TypeScript (compiled with `tsc`)
- MongoDB (`mongodb` driver)
- Zod 4 for request validation
- JSON Web Token + `httpOnly` cookies
- bcryptjs for password hashing
- Biome for linting and formatting
- `tsx` for development watch mode

## Getting Started

```bash
bun install
Copy-Item .env.example .env   # Windows PowerShell
# cp .env.example .env        # macOS / Linux
bun run dev
```

The server connects to MongoDB, creates the required indexes, seeds an admin account when none exists, and listens on `PORT` (default `5000`). Health check: `GET http://localhost:5000/`.

## Environment Variables

| Variable | Required | Purpose | Example |
|---|---|---|---|
| `PORT` | No | Server port (default `5000`) | `5000` |
| `NODE_ENV` | No | `development` or `production` | `development` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://127.0.0.1:27017/doctor-tracker` |
| `FRONTEND_URL` | No | Allowed CORS origin | `http://localhost:3000` |
| `ADMIN_NAME` | Yes (first start) | Seeded admin name | `Admin` |
| `ADMIN_EMAIL` | Yes (first start) | Seeded admin email | `admin@gmail.com` |
| `ADMIN_PASSWORD` | Yes (first start) | Seeded admin password | `change-me` |
| `BCRYPT_SALT_ROUNDS` | No | bcrypt cost factor | `10` |
| `JWT_ACCESS_SECRET` | Yes | Access token signing secret | Long random string |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret | Long random string |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime | `7d` |

`DOCTOR_*` and `PATIENT_*` variables in `.env.example` are reserved placeholders and are not currently used.

## Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `tsx watch src/server.ts` | Development server with reload |
| `build` | `tsc` | Compile to `dist/` |
| `start` | `node dist/server.js` | Run the compiled server |
| `typecheck` | `tsc --noEmit` | Type-check only |
| `format:check` | `biome format ./src` | Check formatting |
| `format:fix` | `biome format --write ./src` | Apply formatting |
| `linter:check` | `biome lint` | Lint |
| `linter:fix` | `biome lint --write ./src` | Apply lint fixes |

## Project Structure

```text
src/
├── app.ts                     # Express app, CORS, routes, error handling
├── server.ts                  # Mongo connect, indexes, admin seed, listen
├── config/index.ts            # Environment configuration
├── lib/
│   ├── db.ts                  # Mongo client and database access
│   └── indexes.ts             # Index definitions and creation
├── middlewares/
│   ├── checkAuth.ts           # JWT verification and role guards
│   ├── validateRequest.ts     # Zod body validation
│   ├── globalErrorHandler.ts  # Central error responses
│   └── not-found.ts           # 404 handler
├── modules/
│   ├── auth/                  # register, login, me, logout
│   ├── doctor/                # create, list, delete
│   ├── patient/               # CRUD + distinct conditions
│   └── dashboard/             # stats and chart aggregates
├── types/                     # Domain and payload types
└── utils/
    ├── AppError.ts            # Error with statusCode
    ├── authCookie.ts          # Set/clear auth cookies
    ├── catchAsync.ts          # Async error wrapper
    ├── dateRange.ts           # fromDate/toDate range builder
    ├── jwt.ts                 # Sign/verify helpers
    ├── seed.ts                # Admin seeding
    └── sendResponse.ts        # Standard response shape
```

## API

All routes are under `/api` except the root health check.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/` | Public | Health check |
| `POST` | `/api/auth/register` | Admin | Create a user (always `PATIENT`) |
| `POST` | `/api/auth/login` | Public | Sign in and set auth cookies |
| `GET` | `/api/auth/me` | Authenticated | Current user |
| `POST` | `/api/auth/logout` | Public | Clear auth cookies |
| `GET` | `/api/doctor` | Admin | List doctors |
| `POST` | `/api/doctor` | Admin | Create a doctor |
| `DELETE` | `/api/doctor/:id` | Admin | Delete a doctor and their patients |
| `GET` | `/api/patient` | Admin | List patients |
| `POST` | `/api/patient` | Admin | Create a patient |
| `GET` | `/api/patient/conditions` | Admin | Distinct conditions |
| `GET` | `/api/patient/:id` | Admin | Single patient |
| `PATCH` | `/api/patient/:id` | Admin | Update a patient |
| `DELETE` | `/api/patient/:id` | Admin | Delete a patient |
| `GET` | `/api/dashboard/stats` | Admin | Dashboard statistics |

### Query Parameters

- **Doctors:** `page`, `limit` (max `100`), `search`, `specialization`, `hospital`, `fromDate`, `toDate`, `sortBy`, `sortOrder`
- **Patients:** `page`, `limit` (max `100`), `search`, `condition`, `doctorId`, `gender`, `fromDate`, `toDate`, `sortBy`, `sortOrder`

### Response Shape

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Doctors retrieved successfully.",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

Errors return `success: false` with a `statusCode` and `message`; development adds the error object and stack trace.

## Auth and Cookies

- Tokens are read from the `accessToken` cookie or an `Authorization: Bearer <token>` header.
- Development cookies: `httpOnly`, `SameSite=Lax`, not `Secure`.
- Production cookies: `httpOnly`, `SameSite=None`, `Secure`.
- Access cookie lifetime is 1 day; refresh cookie lifetime is 7 days.
- Roles: `ADMIN`, `DOCTOR`, `PATIENT`. Management routes currently require `ADMIN`.

## MongoDB Collections

| Collection | Indexes |
|---|---|
| `users` | unique `email` |
| `doctors` | unique `email`, unique `phone`, `name`, `specialization`, `hospital`, `createdAt` |
| `patients` | unique `email`, `doctorId + createdAt`, `condition`, `name`, `createdAt` |

Indexes are created on startup by `src/lib/indexes.ts`; failures are logged without stopping the server.
