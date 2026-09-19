# devNepal

**Government technology, built in public, with public contribution.**

Office of the Prime Minister, Government of Nepal
<https://pmdevcore.gov.np> · [नेपालीमा पढ्नुहोस् →](./README.ne.md)

> **Current stage: documentation and planning.** Contributions to the specs and documentation are welcome.

---

## What this is

devNepal is where the Government of Nepal publishes technology work that anyone can contribute to. All the work happens in public repositories.

The planned portal will list projects and show recent activity across them. Optional member profiles will collect public activity, including accepted work.

This repository is the portal itself — and the first project listed on it. **The first thing devNepal built is devNepal, in public, from the first commit.**

---

## Start here

| | |
|---|---|
| **[Open issues](../../issues)** | Start with issues labelled both `ready` and `good-first-issue` |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How we work, and how long we take to respond |
| **[docs/CONVENTIONS.md](./docs/CONVENTIONS.md)** | Branch names, commit messages, labels, definition of done |
| **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** | What we expect of each other |
| **[SECURITY.md](./SECURITY.md)** | Report a vulnerability privately — never in a public issue |
| **[GOVERNANCE.md](./GOVERNANCE.md)** | Who decides what, and who holds review authority |
| **[MAINTAINERS.md](./MAINTAINERS.md)** | Who to ask, by area |
| **[PRIVACY.md](./PRIVACY.md)** | Draft privacy notice for member accounts |
| **[docs/READINESS.md](./docs/READINESS.md)** | Implementation checklist and release readiness |

**Contributing needs no devNepal account.** Contribution happens on GitHub. A devNepal profile is optional.

---

## Contribution is not only code

Design, Nepali translation, documentation, testing, accessibility and security work should all be reviewed and credited the same way. See [MAINTAINERS.md](./MAINTAINERS.md) for area contacts. If you want to contribute something not on that list, open an issue and ask — the list grows as the people who can review it arrive.

If you improve a Nepali error message or find a contrast failure, you have contributed. Tell us and we will credit it.

---

## Working locally

```bash
git clone https://github.com/SDOC-Team/devnepal.git
cd devnepal
```

Read and edit the Markdown documents, then follow [CONTRIBUTING.md](./CONTRIBUTING.md) to submit a pull request. There is no runnable application yet.

---

## What is where

| Path | Current contents |
|---|---|
| `docs/` | Conventions, product requirements and readiness tracking |
| `.github/` | Issue and pull-request templates |

### Planned application structure

| Path | Planned contents |
|---|---|
| `src/` | The application |
| `ui/tokens/src/` | Design tokens — colour, spacing, type |
| `ui/css/` | Stylesheet and shared patterns |
| `locale/` | User-facing strings in English and Nepali |

Generated output in `ui/tokens/dist/` and `ui/css/dist/` must be rebuilt from source and is ignored by Git.

---

## Requirements for the application

- **English and Nepali throughout.** Every shipped page must support both languages. Nepali needs its own line-height for Devanagari
- **Design tokens.** Use semantic tokens for application styles; no hard-coded colours or spacing
- **Accessible.** Keyboard operation, visible focus and measured contrast are v0.1 requirements. The full accessibility audit is deferred to a later release
- **The same checks for everyone.** Review requirements apply to the core team and outside contributors equally

---

## What we are not building yet

Stated deliberately, so you know the shape of the thing:

- Member blogs and community-owned project listings
- Public contribution leaderboards, rankings or scores
- Stipends or bounties
- Ministry self-service publishing

Each is deferred for a reason, and each will arrive with an announcement rather than silently.

---

## Licence and governance

[Apache License 2.0](./LICENSE). Any person or company may use, modify and build on this code, including commercially. **You keep the copyright in your contributions.**

Maintained by the Office of the Prime Minister. Maintainers may be from outside government. **Merge and deployment are performed by the government team.**
