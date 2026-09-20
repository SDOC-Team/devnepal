# Contributing to devNepal

Thank you. This is a public service built in public, and outside contribution is the point rather than a bonus.

**This page explains how we work together.** Branch names, commit format, labels, and the checklists for a ready issue and a finished pull request are in **[docs/CONVENTIONS.md](./docs/CONVENTIONS.md)** — read it once, then look things up as you need them.

---

## What we commit to

| | |
|---|---|
| First response to a pull request or issue | **Within 3 days** |
| Security report acknowledgement | **Within 24 hours** |

Days are calendar days. Most of us do this outside a day job, so review happens in short windows through the week plus one longer session at the weekend.

If we are ever at capacity we will say so publicly and pause new claims, rather than going quiet.

---

## Before you start

**Only claim issues labelled `ready`. Comment on the issue to claim it.** We will assign it to you. If nothing suitable is ready, open a proposal or ask for clarification before starting.

After 14 days without activity, maintainers will check in and may manually unassign the issue, leaving an explanation. This is never a judgement on you — claim it again whenever you are ready.

**Open an issue before large or design work.** A proposal that arrives as a finished artifact has already cost you a weekend, and we would rather agree the problem with you first.

---

## How to contribute code

1. Fork the repository, branch from `main`
2. Make your change. **One issue per pull request**
3. **Sign off every commit**: `git commit -s`
4. Open a pull request referencing the issue

Branch naming, commit message format and pull-request size guidance are in **[docs/CONVENTIONS.md](./docs/CONVENTIONS.md)**.

Draft pull requests are welcome early. Reviewing direction at 20% complete costs everyone less than reviewing at 100%.

---

## Sign-off (DCO)

Every commit needs a `Signed-off-by` line, which `git commit -s` adds from your git configuration. Use `-s` on every commit.

It certifies that you wrote the contribution, or that you have the right to submit it under this project's licence. It is **not** a copyright assignment — you keep the copyright in your work, and there is no separate agreement to sign.

Full text: <https://developercertificate.org>

---

## Licensing

devNepal is released under the Apache License 2.0. By submitting a contribution you agree it is licensed to the project under those same terms.

You retain copyright in your contribution. We do not ask you to assign or transfer it.

---

## Contribution is not only code

Design, Nepali translation, documentation, testing, accessibility and security work are all reviewed and credited the same way as code. If you want to contribute to an area not on that list, open an issue and ask — the list grows as the people who can review it arrive.

If you improve a Nepali error message or find a contrast failure, you have contributed. Tell us and we will credit it.

**On design work specifically:** The core visual language is being settled by the design team while the system is established — we will say so when that changes.

---

## What we look for

- Works in **both** English and Nepali
- Accessible: keyboard operable, visible focus, sufficient contrast
- Uses design tokens — never hard-coded colours or spacing
- Tests for behaviour changes
- **No new dependency without agreeing it in the issue first.** This is a government supply chain

The full definition of done, and what makes an issue safe to claim, are in [docs/CONVENTIONS.md](./docs/CONVENTIONS.md).

---

## Review

Reviews name the specific change requested, never a vague dissatisfaction.

A comment prefixed `Nit:` is a preference and never blocks a merge.

**If we decline a pull request on direction, we will explain what would have been accepted.** You spent hours; three sentences of explanation is the minimum owed.

If we take over a pull request, you keep the credit and we will tell you why.

---

## Security

**Never report a vulnerability in a public issue or pull request.** See [SECURITY.md](./SECURITY.md).

If you find a security problem while working on something unrelated, stop and report it privately. A public fix is a public disclosure.

---

## Language

Issues, pull requests and reviews may be in English or Nepali. Say so if you would prefer Nepali and we will switch.

---

## Who merges

Maintainers — who may be from outside government — review and approve. **Merge and deployment are performed by the government team.** This is a deliberate boundary, described in [GOVERNANCE.md](./GOVERNANCE.md).
