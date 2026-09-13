# gov-portal

A public portal for one open-source project: its open GitHub issues, the approved
member directory, and the profile/moderation flows around it.

One Next.js app serves both the server-rendered UI (`/en`, `/ne`) and the JSON
REST API (`/members`, `/project`, …) used by external clients.

## Stack

| Concern | Choice |
|---|---|
| Runtime | Node 24 LTS (Bun for package management and scripts) |
| Framework | Next.js 16 App Router — pages + route handlers in one app |
| UI | React 19, DevNepal design system (Primer CSS vendored + tokens), react-markdown |
| Database | PostgreSQL 17 |
| ORM | Drizzle ORM + drizzle-kit (plain-SQL migrations) |
| Auth | Auth.js v5 (`next-auth@5` beta) — GitHub OAuth, JWT sessions, no adapter |
| Validation | Zod 4, contracts shared through `packages/shared` |
| Tests | Vitest against a real PostgreSQL database |
| Lint/format | Biome |

## Layout

```
apps/api/
  src/app/(site)/[locale]/   UI pages (en/ne): home, project, issues, members, profile, admin, about
  src/app/<rest routes>      REST API route handlers (members, profile, admin, project, avatars, auth, health)
  src/components/            site chrome and UI primitives
  src/lib/                   i18n dictionaries, client auth helpers
  src/server/                services, repositories, authorization seam, storage, errors
  src/db/                    Drizzle schema + client
  drizzle/                   generated SQL migrations (committed)
  src/scripts/               seed, GitHub sync, dev-session tools
  tests/                     unit + integration tests, test DB bootstrap
packages/shared/src/         Zod validation + API DTO contracts
docs/frontend.md             frontend onboarding and verification matrix
scripts/setup.ts             one-command local bootstrap
compose.yaml                 PostgreSQL for development (and a full api profile)
.github/workflows/ci.yml     Lint, typecheck, tests, build on every PR
```

## Working together (frontend + backend)

One app, one contract, two territories.

- **`packages/shared` is the contract.** Zod schemas and DTO types for every
  request and response live there. Both the UI and the REST layer import them;
  a contract change that breaks either fails `bun run typecheck` in the same CI run.
- **Ownership.** Frontend work lives in `apps/api/src/app/(site)/**`,
  `apps/api/src/components/**`, and `apps/api/src/lib/**` (i18n, client helpers).
  Backend work lives in `apps/api/src/app/<rest routes>`, `apps/api/src/server/**`,
  `apps/api/src/db/**`, and `packages/shared`. See `.github/CODEOWNERS`.
- **Same origin.** UI and API run in one app on one port; no CORS juggling, and
  the session cookie is first-party. `WEB_ORIGIN` remains only as the allowlist
  for future external clients (e.g. mobile).
- **Reads via services, writes via the shared logic.** Server components call
  the service layer directly; form mutations go through server actions that call
  the same services; the REST endpoints exist for external consumers and tests.
- **Dev data without GitHub.** `bun run setup` seeds six members in every
  moderation state plus a project and sample issues, so the UI is fully
  populated offline. `bun run dev:session <username>` mints a real session for
  authenticated screens.
- **Contract discipline.** Additive changes only by default. A breaking change
  needs both teams in the PR, a migration note, and — once a mobile client
  exists — an API version bump.
- **Review flow.** Short-lived branches, PR into `main`, CI green + 1 review
  required. Backend changes come with tests in `apps/api/tests` that name the
  invariant they protect.

### Branch workflow

`main` is protected: no direct pushes (the owner can bypass for emergencies
only), the `verify` CI check must pass, and one review is required to merge.

```sh
git switch main && git pull --ff-only
git switch -c feat/<topic>
# ... work, then run the local gates before pushing
bun run lint && bun run typecheck && bun run test && bun run build
git push -u origin HEAD
gh pr create --fill
```

Keep branches short-lived and rebase on `main` when it moves. A PR that touches
`packages/shared` needs a reviewer from each side. Branches are deleted
automatically after merge.

## Scaffolding the project

From an empty machine to a running portal. Prerequisites:
[Bun](https://bun.sh) ≥ 1.4, Docker (colima works), Git, and the disk space for
the Postgres image (~2 GB the first time).

### 1. Clone and bootstrap

```sh
git clone git@github.com:voidash/gov-portal.git
cd gov-portal
bun run setup
```

`bun run setup` is idempotent and does the whole bootstrap:

1. writes `apps/api/.env.local` from `.env.example` with a freshly generated
   `AUTH_SECRET` (never overwrites an existing file)
2. starts PostgreSQL with Docker Compose and waits until it is healthy
3. installs the workspace dependencies with Bun
4. applies the Drizzle migrations
5. seeds the database: six members (every moderation state), the project row,
   and eight sample issues

Nothing else is required — the design assets, translations, fonts, and vendored
styles all ship with the repository.

### 2. Run

```sh
bun run dev          # UI + API on one port → http://localhost:3000/en
```

### 3. Verify the scaffold

| Check | Expected |
|---|---|
| `curl localhost:3000/health` | `{"status":"ok"}` |
| http://localhost:3000/en | home page with the state strip, hero, and project card |
| http://localhost:3000/ne | the same page in Nepali |
| http://localhost:3000/en/issues | 8 seeded issues; label filter and search work |
| http://localhost:3000/en/members | 3 approved members; pending/rejected/hidden are absent |
| `curl 'localhost:3000/project/issues?perPage=2'` | JSON with `"total": 8` |
| `bun run test` | the full Vitest suite passes against `refined_test` |

### 4. Optional: sign in with GitHub

Sign-in is required only for the profile editor and admin screens.

1. Create an OAuth App at <https://github.com/settings/developers> → **New OAuth App**
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
2. Put the credentials in `apps/api/.env.local`:
   - `AUTH_GITHUB_ID` — the client ID
   - `AUTH_GITHUB_SECRET` — generate a client secret and paste it
3. To get the admin queue, add your numeric GitHub ID to `ADMIN_GITHUB_IDS`
   (`https://api.github.com/users/<login>` → `id`); comma-separate several admins.
4. Restart the dev server.

Never commit these values; share team development credentials out-of-band. The
provider requests **`read:user` only** — email is never requested or stored.

### 5. Optional: test signed-in screens without GitHub

`bun run dev:session <githubUsername>` mints a real session cookie for a seeded
member so the profile editor and admin screens can be tested offline:

```sh
bun run dev:session nisha-tamang
```

The command prints the `authjs.session-token` value and the member's GitHub ID.
Add the cookie in DevTools → Application → Cookies → `http://localhost:3000`,
and put the printed ID in `ADMIN_GITHUB_IDS` (then restart) for admin access.
See [`docs/frontend.md`](docs/frontend.md) for the full verification matrix.

### 6. Optional: real GitHub issues

Issues are reconciled from the project's public repository over the REST API
(no webhook infrastructure needed yet):

```sh
bun run sync:github      # pulls all issues for voidash/gov-portal, replaces fixtures
```

Set `GITHUB_TOKEN` to lift the anonymous rate limit. The repository ships with a
handful of real open issues (documentation, accessibility, and first-issue
tasks), so a sync replaces the sample fixtures with the GitHub list.

A signature-verified webhook endpoint (`POST /webhooks/github`) is implemented
and tested — deliveries are deduplicated in an event ledger and applied to the
stored issues. Wiring live delivery (repo webhook or `gh webhook forward`) is
optional and deferred; reconciliation with `sync:github` is the reliable path
until then. Contribution indexing is a later phase.

### Ports

| Service | URL |
|---|---|
| UI + API | http://localhost:3000 (`/en`, `/ne`) |
| PostgreSQL | localhost:5432 — user `refined`, password `refined`, databases `refined` / `refined_test` |

### Troubleshooting

- `docker compose` fails → Docker isn't running: `colima start` (or start Docker Desktop).
- Port 3000 already in use → `lsof -ti :3000 | xargs kill`
- Port 5432 already in use → stop the other Postgres, or change the `db` port
  mapping in `compose.yaml` and `DATABASE_URL` in `apps/api/.env.local` together.
- Reset all local data → `docker compose down -v && bun run setup`

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Auth.js session encryption, ≥ 32 chars |
| `AUTH_GITHUB_ID` | for sign-in | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | for sign-in | GitHub OAuth App client secret |
| `ADMIN_GITHUB_IDS` | for admin | Comma-separated admin GitHub numeric IDs (may be empty) |
| `STORAGE_DIR` | yes | Directory for stored avatars (persistent volume) |
| `WEB_ORIGIN` | external clients | CORS allowlist for non-browser clients (mobile); the UI is same-origin |
| `GITHUB_TOKEN` | optional | Raises the GitHub API rate limit for `sync:github` |
| `GITHUB_WEBHOOK_SECRET` | optional | HMAC secret for `POST /webhooks/github` deliveries (endpoint is inert without it) |
| `TEST_DATABASE_URL` | tests | Separate database used by the test suite |

`.env*` files are gitignored; `.env.example` is the only committed reference.

## Commands

```sh
bun run setup          # one-command local bootstrap (safe to rerun)
bun run dev            # UI + API at http://localhost:3000
bun run build          # production build (standalone output)
bun run start          # production server
bun run test           # Vitest (+ creates and migrates the test database)
bun run typecheck      # tsc --noEmit
bun run lint           # Biome check
bun run format         # Biome format --write
bun run db:generate    # generate a migration from the Drizzle schema
bun run db:migrate     # apply migrations to DATABASE_URL
bun run db:seed        # sample members, project, and issues for local development
bun run sync:github    # reconcile issues from the project's GitHub repository
bun run dev:session    # mint a dev session cookie for a seeded member
```

## REST API

Canonical paths have **no trailing slash** (`/members`, not `/members/`).
Success bodies are `{ "member": ... }` / `{ "members": [...] }` /
`{ "project": ... }`; errors are `{ "error": { "code", "message", "details"? } }`.
UI pages live under `/en` and `/ne` and do not collide with these paths.

| Method | Path | Access | Notes |
|---|---|---|---|
| `GET` | `/health` | public | 200 when the database answers |
| `GET` | `/project` | public | The single project + open issue / member counts |
| `GET` | `/project/issues?label=&q=&page=&perPage=` | public | Open issues, newest first |
| `GET` | `/project/issues/{number}` | public | Single issue |
| `GET` | `/members` | public | Approved members only, `priority DESC`, `approvedAt DESC` |
| `GET` | `/members/{githubUsername}` | public / owner | Case-insensitive username lookup |
| `GET` | `/members/id/{githubId}` | public / owner | Same member, numeric GitHub ID |
| `GET` | `/avatars/{key}` | public | Stored avatar bytes, immutable cache headers |
| `GET` | `/profile` | authenticated | Own member incl. `id`, `status`, `approvedAt`, plus `isAdmin` |
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

## UI

Server-rendered pages under `/en` and `/ne` (English default; `/` redirects to
`/en`): home, project, issues list with label/search filters, issue detail with
sanitized Markdown, member directory, member profiles, own profile editor,
admin moderation, and a how-to-contribute page.

Primary navigation is: Open issues · Members · How to contribute — the project
itself is reached from the home hero and the project card. When a member is
signed in, the header shows **My profile**, and **Admin** appears for accounts
listed in `ADMIN_GITHUB_IDS`.

The visual language is ported from the DevNepal frontend
([`voidash/DevNepal`, branch `demo/minimal-validated-flow`](https://github.com/voidash/DevNepal/tree/demo/minimal-validated-flow)):
the government state strip with the emblem, the black condensed headings, the
blue action ramp, and the component styles in
`apps/api/public/assets/devnepal/` (provenance and licences in that folder's
README). Primer CSS is vendored underneath as the base layer. Translations live
in `apps/api/src/lib/i18n.ts`.

## Security invariants (tested)

- **Self-write only** — profile writes resolve the target exclusively from the
  session; there is no route or payload that can target another member.
- **Immutables** — UUID, GitHub ID, GitHub username, avatar path, moderation
  fields, and priority are not writable through `/profile`.
- **Admin is env-only** — `ADMIN_GITHUB_IDS`, re-checked per request and in the
  server-rendered admin page.
- **No email** — not requested (OAuth scope `read:user`), no column, never returned.
- **Avatars** — downloaded to `STORAGE_DIR`, capped at 2 MB, magic-byte checked
  (png/jpeg/webp only), stored under a generated UUID key; GitHub URLs are never
  stored or served. If the download fails the member is still created and the
  avatar self-heals on the next login.
- **Issue content** — bodies are stored as-is and rendered through
  `react-markdown` + `rehype-sanitize`; raw HTML is never injected.
- **CSRF** — Auth.js protects its own routes; cookie-authenticated mutations
  additionally reject any request whose `Origin` is neither the app's own origin
  (same-origin UI, proxied or not) nor `WEB_ORIGIN`.
- **Rate limits** — auth routes, the webhook endpoint, and write endpoints are
  limited per client IP (`429` with `Retry-After`). The counters are in-memory,
  which is correct for the single-instance deployment; a shared store would be
  needed before scaling out.
- **Secrets** — only placeholders are committed; `.env*` is gitignored.

## Tests

```sh
bun run test
```

The suite creates `refined_test` if needed, applies migrations, and runs 102
tests covering: member write isolation and injection attempts, all visibility
states on both member routes, admin approve/reject/hide/priority and non-admin
denials, directory ordering, profile validation, avatar handling, the absence of
an email column, project/issue endpoints and filters, GitHub sync reconciliation
with mocked HTTP, and Auth.js CORS handling. Override the database with
`TEST_DATABASE_URL`.

## Deployment

See [`docs/deployment.md`](docs/deployment.md) for the full checklist, known
problems and fixes, k2 options, backups, and the cutover plan.

```sh
docker build -f apps/api/Dockerfile -t gov-portal .
```

The image runs the Next.js standalone server as a non-root user (`node`), serves
the UI and the REST API on port 3000, and expects the environment variables
above. Avatars live in `/app/storage` — mount a persistent volume there. Run
migrations against the target database before starting the new image
(`bun run db:migrate` from a checkout with the production `DATABASE_URL`).

## Notes

- The API is intentionally unversioned for now; a future mobile client pins to
  these paths, so the first breaking change will need a coordinated migration.
- Live webhook delivery and contribution indexing are a later phase; issues
  are reconciled on demand with `bun run sync:github`, and the signed webhook
  endpoint is ready when delivery is wired.
- Dark mode: the design tokens ship with light mode only for now.
