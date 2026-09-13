# Contributing to devNepal

Thank you. This is a public service built in public, and outside contribution is the point rather than a bonus.

---

## What we commit to

| | |
|---|---|
| First response to a pull request | **5 working days** |
| First response to an issue | **5 working days** |
| Security report acknowledgement | **24 hours** |

If we are ever at capacity we will say so publicly and pause new claims, rather than going quiet. Holding you in silence is the one thing we will not do.

---

## Before you start

**Comment on the issue to claim it.** We will assign it to you.

If there is no activity after 14 days, a bot unassigns it automatically so the issue does not sit idle. This is never a judgement on you — claim it again whenever you are ready.

**Open an issue before large or design work.** A proposal that arrives as a finished artifact has already cost you a weekend, and we would rather agree the problem with you first.

---

## How to contribute code

1. Fork the repository, branch from `main`
2. Make your change. **One issue per pull request**
3. Use conventional commit messages: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
4. **Sign off every commit**: `git commit -s`
5. Open a pull request referencing the issue

Draft pull requests are welcome early. Reviewing direction at 20% complete costs everyone far less than reviewing at 100%.

---

## Sign-off (DCO)

Every commit needs a `Signed-off-by` line. `git commit -s` adds it from your git configuration.

It certifies that you wrote the contribution, or that you have the right to submit it under this project's licence. It is **not** a copyright assignment — you keep the copyright in your work, and there is no separate agreement to sign.

The full text is at <https://developercertificate.org>.

---

## Licensing

devNepal is released under the Apache License 2.0. By submitting a contribution you agree that it is licensed to the project under those same terms.

You retain copyright in your contribution. This project does not ask you to assign or transfer copyright, and requires no separate agreement.

---

## Contribution beyond code

All of these are reviewed by a named maintainer and credited the same way as code.

| | |
|---|---|
| **Design and UX** | Interface improvements, patterns, iconography |
| **Accessibility** | Contrast, keyboard operation, screen-reader testing |
| **Nepali translation and content** | Translation review, terminology, microcopy |
| **Documentation** | Setup guides, architecture notes, tutorials |
| **Testing and bug reports** | A well-written bug report is a contribution |
| **Security** | Responsible disclosure — see SECURITY.md |
| **Research** | User research, accessibility audits, comparative analysis |
| **Community support** | Answering questions, reviewing others' work, mentoring |

**On design work specifically:** icons, accessibility fixes, typography and content are open now. The core visual language is being settled by the design team while the system is established — we will open it once the design system is published, and we will say so when that happens.

---

## What we look for

- Works in **both** English and Nepali
- Accessible: keyboard operable, visible focus, sufficient contrast
- Uses design tokens — never hard-coded colours or spacing
- Tests for behaviour changes
- **No new dependency without discussion in the issue first.** A new package on a government repository is a supply-chain decision

---

## Review

Reviews name the specific change requested, never a vague dissatisfaction.

A comment prefixed `Nit:` is a preference and never blocks a merge.

**If we decline a pull request on direction, we will explain what would have been accepted.** You spent hours; three sentences of explanation is the minimum owed.

If we take over a pull request, you keep the credit and we will tell you why.

---

## Language

Issues, pull requests and reviews may be in English or Nepali. Say so if you would prefer Nepali and we will switch.

---

## Who merges

Maintainers — who may be from outside government — review and approve. **Merge and deployment are performed by the government team.** This is a deliberate boundary and it is described in [GOVERNANCE.md](./GOVERNANCE.md).
