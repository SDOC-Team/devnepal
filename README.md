# devNepal

Office of the Prime Minister and Council of Ministers, Government of Nepal ·
<https://pmdevcore.gov.np>

The Government of Nepal's public collaboration portal. It presents one
open-source project, the open issues from its GitHub repository, and a
directory of contributors whose profiles an administrator has approved. The
site has English (`/en`) and Nepali (`/ne`) versions.

[नेपालीमा पढ्नुहोस् →](./README.ne.md)

> **Status:** in development, before the first release. Licensed under
> [Apache-2.0](./LICENSE).

- [Run it with Docker](#run-it-with-docker)
- [Develop locally](#develop-locally)
- [Configuration](#configuration)
- [Commands](#commands)
- [How it is built](#how-it-is-built)
- [Contributing](#contributing)

## Run it with Docker

Requires Docker with Compose v2.24 or later. Nothing else runs on the host.

1. **Create a GitHub OAuth App.** The app checks its configuration at startup
   and does not start without one. At
   <https://github.com/settings/developers> → **New OAuth App**, use
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
2. **Create the configuration file**, `.env` next to `docker-compose.yml`, and
   fill in `AUTH_SECRET` (`openssl rand -base64 48`), `AUTH_GITHUB_ID` and
   `AUTH_GITHUB_SECRET`:

   ```sh
   cp apps/api/.env.example .env
   ```

   Compose reads every setting from this one file. It builds its own
   `DATABASE_URL` from the `POSTGRES_*` settings in the file's last section, so
   the `DATABASE_URL` line is ignored.
3. **Start the stack.** Postgres starts, the migrations run, then the app:

   ```sh
   docker compose up -d --build
   ```

4. **Load the project and its issues from GitHub:**

   ```sh
   docker compose run --rm migrate node scripts/init-project.js
   ```

Open <http://localhost:3000/en>. If ports 3000 or 5432 are already taken, set
`API_PORT` and `DB_PORT`, for example `API_PORT=13000 DB_PORT=15432 docker
compose up -d`; with a different `API_PORT`, use that port in the OAuth App's
URLs too. To refresh issues later, run
`docker compose run --rm migrate node scripts/sync-github.js`.
`docker compose down -v` removes the stack and its data.

Hosting platforms provide settings the same way, in that `.env`. For
production, use `prod-docker-compose.yaml`;
[docs/deployment.md](docs/deployment.md) covers deploying it on Dokploy.

## Develop locally

Requires [Bun](https://bun.sh) 1.4 or later and Docker (for Postgres).

1. **Bootstrap.** `bun run setup` writes `apps/api/.env.local` with a generated
   `AUTH_SECRET` (it never overwrites an existing file), starts Postgres,
   installs dependencies, applies the migrations, and loads the project and its
   issues from GitHub. It is safe to rerun.

   ```sh
   git clone git@github.com:SDOC-Team/devnepal.git
   cd devnepal
   bun run setup
   ```

2. **Add the GitHub OAuth App credentials** to `apps/api/.env.local`
   (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`; see step 1 of the Docker
   instructions). For the admin screens, add your numeric GitHub ID
   (`https://api.github.com/users/<login>` → `id`) to `ADMIN_GITHUB_IDS`.
3. **Run it:**

   ```sh
   bun run dev    # http://localhost:3000/en
   ```

4. **Check it:**

   | Check | Expected |
   |---|---|
   | `curl localhost:3000/health` | `{"status":"ok"}` |
   | <http://localhost:3000/en>, <http://localhost:3000/ne> | the home page in each language |
   | <http://localhost:3000/en/issues> | the repository's open issues, with label filter and search |
   | <http://localhost:3000/en/members> | approved members only (empty until someone signs in and is approved) |
   | `bun run test` | the whole suite passes |

The setup creates no member accounts. Sign in with GitHub once to create yours;
after that `bun run dev:session <your-github-username>` prints a session cookie
for that member, so you can test the signed-in screens without going through
GitHub each time. See [docs/frontend.md](docs/frontend.md).

**Troubleshooting**

- `docker compose` fails: Docker isn't running (`colima start`, or start Docker
  Desktop).
- Port 5432 or 3000 is taken: set `DB_PORT` / `API_PORT` in `.env` next to
  `docker-compose.yml`, and change the port in `DATABASE_URL` in
  `apps/api/.env.local` to match.
- Start again from nothing: `docker compose down -v && bun run setup`.

## Configuration

All settings are environment variables. `bun run dev` reads them from
`apps/api/.env.local`; Docker Compose reads them from `.env` next to
`docker-compose.yml`. [`apps/api/.env.example`](apps/api/.env.example) lists
every one with a comment, including the few only Compose uses; `.env*` files
other than the example are never committed.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Session encryption, at least 32 characters |
| `AUTH_GITHUB_ID` | yes | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | yes | GitHub OAuth App client secret |
| `ADMIN_GITHUB_IDS` | no | Comma-separated numeric GitHub IDs allowed to moderate members |
| `GITHUB_PROJECT_REPOSITORY` | no | Repository `db:init` loads; defaults to `SDOC-Team/devnepal` |
| `GITHUB_TOKEN` | no | Raises the GitHub API rate limit for `db:init` and `sync:github` |
| `STORAGE_DIR` | no | Where avatars are stored; defaults to `./storage` (a volume in Docker) |
| `WEB_ORIGIN` | no | Extra origin allowed to call the API with credentials; the UI itself is same-origin |
| `GITHUB_WEBHOOK_SECRET` | no | Enables `POST /webhooks/github`; the endpoint is inert without it |
| `TEST_DATABASE_URL` | no | Database for the test suite |

## Commands

```sh
bun run setup          # local bootstrap (safe to rerun)
bun run dev            # development server at http://localhost:3000
bun run build          # production build (standalone output)
bun run start          # serve the production build
bun run test           # test suite (creates and migrates the test database)
bun run typecheck      # TypeScript
bun run lint           # Biome
bun run format         # Biome formatter
bun run api:check      # lint the OpenAPI contract and fail if the client is out of date
bun run db:generate    # create a migration from the schema
bun run db:migrate     # apply migrations to DATABASE_URL
bun run db:init        # load the project and its issues from GitHub
bun run sync:github    # refresh issues from GitHub
bun run dev:session    # print a session cookie for an existing member
```

## How it is built

One Next.js 16 application serves both the pages (`/en`, `/ne`) and a versioned
JSON API (`/v1/...`), backed by PostgreSQL 17 through Drizzle ORM. Sign-in is
GitHub OAuth through Auth.js. The UI uses React 19, Tailwind CSS 4 with
shadcn/ui components on Base UI, and SWR. Tests run on Vitest against a real
database; Biome lints and formats.

```
apps/api/
  src/app/(site)/[locale]/   pages: home, project, issues, members, profile, welcome, admin, about
  src/app/v1/                API route handlers
  src/components/            UI components
  src/lib/                   translations (i18n.ts) and client helpers
  src/server/                services, repositories, authorization, storage
  src/db/                    schema and database client
  drizzle/                   generated SQL migrations
  src/scripts/               project init, GitHub sync, dev session
  tests/                     unit and integration tests
packages/api-contract/       OpenAPI description of the API
packages/api-client/         generated API types and browser client
packages/shared/             validation schemas and shared types
docs/                        frontend guide and deployment notes
```

**The API contract** is
[`packages/api-contract/openapi.yaml`](packages/api-contract/openapi.yaml).
Change it first, regenerate the client with `bun run api:generate`, then
implement the handler; CI fails if the generated client is out of date.

**Issues** come from the project's public GitHub repository. `db:init` and
`sync:github` reconcile them; GitHub stays the source of truth.

**Member profiles** are created at first GitHub sign-in as `pending`. Only
`approved` profiles are public. For a pending, rejected or hidden profile the
API returns `404` to everyone except the member, and the page shows "Profile not
available". Public responses never include the internal id, moderation status,
priority or approval details.

**Privacy and security**, each covered by tests:

- Sign-in requests the `read:user` scope only. Email addresses are never
  requested, stored, or kept in the session.
- A member can only change their own profile, and only its editable fields.
  Administrators are the GitHub IDs in `ADMIN_GITHUB_IDS`, checked on every
  request.
- Avatars are downloaded once, checked to be real PNG, JPEG or WebP images of
  at most 2 MB, and served from the portal. Pages never load an avatar from
  GitHub.
- Issue text is rendered as sanitised Markdown; raw HTML is never injected.
- Changes made with a session cookie are rejected from other origins, sign-in
  and write routes are rate-limited per client, and every response carries
  baseline security headers.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md): how to pick up an issue (only
those labelled `ready`), work on a fork, and sign off every commit with
`git commit -s`. Branch names, commit types, labels and what makes a pull
request done are in [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

A pull request needs passing CI (lint, typecheck, tests, build, API contract
check) and one approving review. Before pushing, run
`bun run lint && bun run typecheck && bun run test && bun run build`.

- [Code of conduct](CODE_OF_CONDUCT.md) · [Governance](GOVERNANCE.md) ·
  [Maintainers](MAINTAINERS.md)
- Security problems: never in a public issue. See [SECURITY.md](SECURITY.md).
- Product requirements: [docs/PRD-v0.1.md](docs/PRD-v0.1.md)
- Privacy: [PRIVACY.md](PRIVACY.md)
- Deployment: [docs/deployment.md](docs/deployment.md)
