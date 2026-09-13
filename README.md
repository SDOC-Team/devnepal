# devNepal

**Government technology, built where the public can watch.**

Office of the Prime Minister, Government of Nepal
<https://pmdevcore.gov.np> · [नेपालीमा पढ्नुहोस् →](./README.ne.md)

---

## What this is

devNepal is the public register of Government of Nepal technology work that is open to contribution. Government bodies publish the work they need help with; anyone can contribute. All work happens in public repositories.

This repository is the portal itself — and it is the first project listed on it.

**The first thing devNepal built is devNepal, in public, from the first commit.**

---

## Contributing needs no account

Contribution happens on GitHub. A devNepal profile is optional: it collects your accepted contributions in one public place.

| | |
|---|---|
| **[Open issues](../../issues)** | Start with anything labelled `good-first-issue` |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How we work, and how long we take to respond |
| **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** | What we expect of each other |
| **[SECURITY.md](./SECURITY.md)** | Report a vulnerability privately — never in a public issue |
| **[GOVERNANCE.md](./GOVERNANCE.md)** | Who decides what |

---

## Nine kinds of contribution

Code is one of them. All nine are reviewed by a named maintainer and credited the same way.

**Code** · **Design and UX** · **Accessibility** · **Nepali translation and content** · **Documentation** · **Testing and bug reports** · **Security** · **Research** · **Community support**

If you improve a Nepali error message or find a contrast failure, you have contributed. Tell us and we will credit it.

---

## Run it locally

```bash
git clone https://github.com/SDOC-Team/devnepal.git
cd devnepal
cp .env.example .env          # no real secrets needed for local development
npm install
npm run dev
```

Open <http://localhost:3000>.

**If this does not work in under ten minutes on a clean machine, that is a bug — please open an issue.** Setup friction is one of the most valuable things you can fix here, and you are better placed to notice it than we are.

---

## Built with

English and Nepali throughout · design tokens rather than hard-coded styles · every quality gate enforced in CI

The application stack is recorded in `docs/adr/` — we write down what we chose and why, including the reasoning we would need if we ever reconsidered.

---

## What we are not building yet

Stated deliberately, so you know the shape of the thing:

- Member blogs and community-owned project listings
- Public contribution leaderboards
- Stipends or bounties
- Ministry self-service publishing

Each is deferred for a reason, and each will arrive with an announcement rather than silently.

---

## Licence

[Apache License 2.0](./LICENSE). Any person or company may use, modify and build on this code, including commercially. You keep the copyright in your contributions.

---

## Governance

Maintained by the Office of the Prime Minister. Contributions are reviewed by named maintainers, who may be from outside government. **Merge and deployment are performed by the government team.** See [GOVERNANCE.md](./GOVERNANCE.md).
