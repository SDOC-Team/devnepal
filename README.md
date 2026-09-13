# gov-portal

Track A — **member directory backend**. A JSON REST API where a person signs in
with GitHub, completes a profile, an admin approves them, and the profile becomes
public in the member directory.

The backend is a Next.js app used strictly as a REST server (route handlers, no
UI). A separate frontend consumes it.

## Stack

| Concern | Choice |
|---|---|
| Runtime | Node 24 LTS (Bun for package management and scripts) |
| Framework | Next.js 16 route handlers (JSON only) |
| Database | PostgreSQL 17 |
| ORM | Drizzle ORM + drizzle-kit (plain-SQL migrations) |
| Auth | Auth.js v5 (`next-auth@5` beta) — GitHub OAuth, JWT sessions, no adapter |
| Validation | Zod 4, contracts shared through `packages/shared` |
| Tests | Vitest against a real PostgreSQL database |
| Lint/format | Biome |

## Layout

```
apps/api/
  src/app/                 REST route handlers (members, profile, admin, avatars, auth, health)
  src/server/              services, repository, authorization seam, storage, errors
  src/db/                  Drizzle schema + client
  drizzle/                 generated SQL migrations (committed)
  tests/                   unit + integration tests, test DB bootstrap
apps/web/                  placeholder frontend (Vite + React) consuming the REST API
packages/shared/src/       Zod validation + API DTO contracts
compose.yaml               PostgreSQL for development (and a full api profile)
.github/workflows/ci.yml   Lint, typecheck, tests, builds on every PR
```

## Working together (frontend + backend)

One monorepo, two teams, one contract.

- **`packages/shared` is the contract.** Zod schemas and DTO types for every
  request and response live there. The frontend imports them directly
  (`@gov-portal/shared`) — no publishing, no codegen, and a contract change that
  breaks either side fails `bun run typecheck` in the same CI run.
- **Ownership.** Backend team owns `apps/api` and `packages/shared`; frontend
  team owns `apps/web` (a working placeholder is already in place). Contract
  changes are reviewed by both sides — treat `packages/shared` as shared code,
  not backend code.
- **Integration topology.** The frontend talks to the API over HTTP using an
  API base URL environment variable (dev: `http://localhost:3000`, prod:
  `https://api.<domain>`). Nothing is path-proxied, so frontend page routes can
  never collide with API paths like `/members`. In production the web app and
  API live on the same registrable domain (`app.x` + `api.x`) so cookie auth is
  same-site; the API CORS allows exactly `WEB_ORIGIN` with credentials.
- **Dev data without GitHub.** `bun run db:seed` inserts six sample members in
  every moderation state so the frontend can build against a populated
  directory before real sign-ins exist.
- **Contract discipline.** Additive changes only by default. A breaking change
  needs both teams in the PR, a migration note, and — once a mobile client
  exists — an API version bump. Every endpoint's shape is documented below and
  owned by `packages/shared`.
- **Review flow.** Short-lived branches, PR into `main`, CI green + 1 review
  required. Backend changes come with tests that cite the invariant they
  protect; the names in `apps/api/tests` are the specification.

## Local development

Prerequisites: [Bun](https://bun.sh) and Docker (colima works).

```sh
bun install
docker compose up -d db
cp apps/api/.env.example apps/api/.env.local   # then fill in the values
openssl rand -base64 48                        # use the output as AUTH_SECRET
bun run db:migrate
bun run db:seed      # optional: sample members for frontend work
bun run dev          # API at http://localhost:3000/health

bun run dev:web      # placeholder frontend at http://localhost:5173 (second terminal)
```

### GitHub OAuth App

Create one at <https://github.com/settings/developers> → **New OAuth App**:

- Homepage URL: `http://localhost:5173` (the frontend origin; any value in dev)
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

Copy the client ID and secret into `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`.
The provider requests **`read:user` only** — email is never requested or stored.

The single-admin role comes from `ADMIN_GITHUB_IDS` (comma-separated numeric
GitHub IDs, e.g. from `https://api.github.com/users/<login>`), checked on every
admin request — never from the database.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Auth.js session encryption, ≥ 32 chars |
| `AUTH_GITHUB_ID` | yes | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | yes | GitHub OAuth App client secret |
| `ADMIN_GITHUB_IDS` | yes | Comma-separated admin GitHub numeric IDs (may be empty) |
| `WEB_ORIGIN` | yes | Frontend origin for CORS + mutation Origin checks |
| `STORAGE_DIR` | yes | Directory for stored avatars (persistent volume) |
| `TEST_DATABASE_URL` | tests | Separate database used by the test suite |

`.env*` files are gitignored; `.env.example` is the only committed reference.

## Commands

```sh
bun run dev            # dev server
bun run dev:web        # placeholder frontend (Vite, port 5173)
bun run build          # production build (standalone output)
bun run build:web      # frontend production build
bun run start          # production server
bun run test           # Vitest (+ creates and migrates the test database)
bun run typecheck      # tsc --noEmit
bun run lint           # Biome check
bun run format         # Biome format --write
bun run db:generate    # generate a migration from the Drizzle schema
bun run db:migrate     # apply migrations to DATABASE_URL
bun run db:seed        # insert sample members for local development
```

## REST API

Canonical paths have **no trailing slash** (`/members`, not `/members/`).
Success bodies are `{ "member": ... }` or `{ "members": [...] }`; errors are
`{ "error": { "code", "message", "details"? } }`.

| Method | Path | Access | Notes |
|---|---|---|---|
| `GET` | `/health` | public | 200 when the database answers |
| `GET` | `/members` | public | Approved members only, `priority DESC`, `approvedAt DESC` |
| `GET` | `/members/{githubUsername}` | public / owner | Case-insensitive username lookup |
| `GET` | `/members/id/{githubId}` | public / owner | Same member, numeric GitHub ID |
| `GET` | `/avatars/{key}` | public | Stored avatar bytes, immutable cache headers |
| `GET` | `/profile` | authenticated | Own member incl. `id`, `status`, `approvedAt` |
| `PATCH` | `/profile` | authenticated | Updates the session member only |
| `GET` | `/admin/members?status=` | admin | Moderation queue, optional status filter |
| `PATCH` | `/admin/members/{id}` | admin | `{ status?, priority? }` |
| `GET/POST` | `/api/auth/*` | public | Auth.js endpoints (sign-in, callback, session, sign-out) |

### Visibility rules

- `approved` → public on both member routes.
- `pending`, `rejected`, `hidden` → `404` to everyone except the member
  themselves (who sees their own profile while signed in).
- Public payloads never include the internal UUID, moderation status, priority,
  or approval fields.

### Profile updates

`PATCH /profile` accepts only: `displayName`, `headline`, `affiliation`,
`location`, `bio`, `links`, `skills`. The payload is strict — any other key
(`id`, `githubId`, `githubUsername`, `status`, `priority`, `avatarPath`, …) is
rejected with `400`. The update target is always the authenticated member.

Validation highlights: display name required ≤ 80 chars, no URLs, no control
characters; bio ≤ 400 chars; links ≤ 5, HTTPS only, unique; skills from the
fixed taxonomy in `packages/shared/src/skills.ts`.

## Security invariants (tested)

- **Self-write only** — profile writes resolve the target exclusively from the
  session; there is no route or payload that can target another member.
- **Immutables** — UUID, GitHub ID, GitHub username, avatar path, moderation
  fields, and priority are not writable through `/profile`.
- **Admin is env-only** — `ADMIN_GITHUB_IDS`, re-checked per request.
- **No email** — not requested (OAuth scope `read:user`), no column, never returned.
- **Avatars** — downloaded to `STORAGE_DIR`, capped at 2 MB, magic-byte checked
  (png/jpeg/webp only), stored under a generated UUID key; GitHub URLs are never
  stored or served. If the download fails the member is still created and the
  avatar self-heals on the next login.
- **CSRF** — Auth.js protects its own routes; mutations additionally reject
  requests whose `Origin` header is not `WEB_ORIGIN`.
- **Secrets** — only placeholders are committed; `.env*` is gitignored.

## Tests

```sh
bun run test
```

The suite creates `refined_test` if needed, applies migrations, and runs 79
tests covering: Alice/Bob write isolation and injection attempts, all visibility
states on both member routes, admin approve/reject/hide/priority and non-admin
denials, directory filtering and ordering, validation rejections, avatar
handling, and the absence of an email column. Override the database with
`TEST_DATABASE_URL`.

## Deployment

```sh
docker build -f apps/api/Dockerfile -t refined-devnepal-api .
```

The image runs the Next.js standalone server as a non-root user (`node`), exposes
port 3000, and expects the environment variables above. Avatars live in
`/app/storage` — mount a persistent volume there. Run migrations against the
target database before starting the new image (`bun run db:migrate` from a
checkout with the production `DATABASE_URL`).

Cookie auth requires the frontend and API to be same-site (e.g. `app.example.com`
and `api.example.com`); the API's CORS only allows `WEB_ORIGIN` with credentials.

## Notes

- The API is intentionally unversioned for now; a future mobile client pins to
  these paths, so the first breaking change will need a coordinated migration.
- Community contributions, projects, and GitHub event indexing are out of scope
  for this track.
- The spec's final checklist item was truncated ("No email is …"); this build
  interprets it as "no email is stored or exposed anywhere" and enforces that.
