# Frontend development

The UI lives in the same Next.js app as the REST API: pages under
`apps/api/src/app/(site)/`, API routes at the app root (`/members`, `/project`, …).

## Design

The visual language is the DevNepal design system, ported from
`voidash/DevNepal` (branch `demo/minimal-validated-flow`) and served from
`apps/api/public/assets/devnepal/` — tokens, base, components, devnepal and
public-discovery stylesheets, the vendored Primer base layer, Inter/Barlow
fonts, and the emblem assets. See the README in that folder for provenance and
licences. Use the existing `dn-*`, `btn`, `card`, `Label`, `tag` and
`field` classes rather than inventing new ones.

## Environment

Everything the UI needs is created by `bun run setup`. For reference:

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | `apps/api/.env.local` | PostgreSQL connection |
| `AUTH_SECRET` | `apps/api/.env.local` | session encryption (generated) |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | `apps/api/.env.local` | GitHub sign-in (optional for public pages) |
| `ADMIN_GITHUB_IDS` | `apps/api/.env.local` | comma-separated GitHub numeric ids that may use `/en/admin` |
| `STORAGE_DIR` | `apps/api/.env.local` | where avatars are stored |
| `WEB_ORIGIN` | `apps/api/.env.local` | only relevant to external clients; UI and API are same-origin now |

## Run it

```sh
bun run setup        # env files, database, migrations, seed data (safe to rerun)
bun run dev          # UI + API at http://localhost:3000/en
```

Public pages work with the seed alone. Seeded members:

| Username | Status |
|---|---|
| `aashish-khanal`, `priya-sharma`, `bikash-gurung` | approved |
| `nisha-tamang` | pending |
| `rejected-sample` | rejected |
| `hidden-sample` | hidden |

## Sign in without GitHub

`bun run dev:session <githubUsername>` mints a real session cookie for a seeded
member, so you can test the profile editor and admin screens without OAuth:

```sh
bun run dev:session nisha-tamang
```

It prints `authjs.session-token=…`. Add it in DevTools → Application → Cookies →
`http://localhost:3000`, then reload. For admin screens, put the printed GitHub
id into `ADMIN_GITHUB_IDS` and restart the dev server:

```sh
bun run dev:session voidash        # prints the id to add
```

Real GitHub sign-in needs OAuth credentials in `apps/api/.env.local` (see the
README).

## Routes

| URL | Page |
|---|---|
| `/en`, `/ne` | home |
| `/en/project` | the single project (repo header, tabs, sidebar) |
| `/en/issues` | open issues with label + search filters and pagination |
| `/en/issues/{number}` | issue detail with sanitized Markdown |
| `/en/members` | approved member directory with search + skill filter |
| `/en/members/{username}` | public member profile (owner sees non-public states) |
| `/en/profile` | own profile editor (requires session) |
| `/en/welcome` | post-sign-in onboarding: admins land on the admin dashboard, approved members on the home page, and pending/rejected/hidden members see their status |
| `/en/admin` | member moderation (requires `ADMIN_GITHUB_IDS`) |
| `/en/about` | how to contribute |

Default language is English; `/` redirects to `/en`. The API and contract must
not change for UI work — if something is missing, change `packages/shared` and
the REST route, then ask for a reviewer from each side.

## Verification matrix

| Behaviour | How to verify |
|---|---|
| Directory lists approved members only | `/en/members` shows 3 seeded members; `nisha-tamang` absent |
| Non-public profile hidden | `/en/members/nisha-tamang` → "Profile not available"; with her session cookie → visible with a status banner |
| Username + GitHub id parity | `curl /members/bikash-gurung` and `curl /members/id/900103` return the same member |
| Issue filters | `/en/issues` → filter by `good first issue` (only matching rows), search `nepali` (matches title and body) |
| Issue detail | `/en/issues/101` renders labels, author, sanitized Markdown, GitHub link |
| Profile validation | `/en/profile`: empty display name, 6 links, `http://` link, unknown skill → inline errors; save persists |
| Moderation | `/en/admin`: approve `nisha-tamang` → she appears in `/en/members`; reject → 404 publicly; priority reorders |
| Non-admin denial | sign in without the id in `ADMIN_GITHUB_IDS` → `/en/admin` shows "Not authorized" |
| Bilingual | switch `EN | ने`; paths keep the locale and copy changes |
| Sign in / out | header button completes the GitHub flow; sign-out returns to the page |

## Known gaps (intentional)

- Live webhook delivery is deferred; issues come from `bun run sync:github`
  (a signed webhook endpoint exists and is tested, but nothing is wired to it).
- Contribution indexing and recognition are a later phase.
- The seed's GitHub usernames are fictional; real avatars appear after real
  sign-ins.
