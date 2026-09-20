# Conventions

Reference material. [CONTRIBUTING.md](../CONTRIBUTING.md) explains how we work together; this is what to look up while doing it.

---

## Branch names

Format: `type/short-kebab-description`. Lowercase, hyphens, no issue numbers — the pull request links the issue, and a number in a branch name tells a reader nothing.

| Prefix | Use when | Do not use when |
|---|---|---|
| `feat/` | The application can do something it could not before | You are correcting behaviour that was supposed to work — that is `fix` |
| `fix/` | Behaviour was wrong and is now correct | The behaviour was never specified. Adding it is `feat` |
| `docs/` | Only prose changes | Code changed too — use the code's prefix |
| `design/` | Visual or interaction change: tokens, patterns, layout, typography | It is purely accessibility — `a11y` is more specific and routes to a different reviewer |
| `a11y/` | Contrast, keyboard, focus, screen-reader behaviour, touch targets, semantic markup | — |
| `i18n/` | Translation, terminology, locale formatting, Devanagari rendering, `lang` attributes | You are changing the English wording itself — that is `docs` or `design` |
| `test/` | Adding or repairing tests, no production code touched | You fixed a bug and added a test proving it. That is `fix` — the test is part of the fix |
| `refactor/` | Structure changed, behaviour did not | Behaviour changed at all. Then it is `fix` or `feat` |
| `perf/` | Same behaviour, measurably faster or lighter | You have not measured it — that is `refactor` |
| `chore/` | Dependencies, CI config, tooling, lockfiles | It changes user-facing application behaviour — use `feat` or `fix` |

**The rule that settles most disputes:** ask what a reader scanning history in a year would want to know. `refactor/` promises they can skip it. If something did change, you have misled them in a way that is expensive to discover.

**When a change spans two types, split it.** If you cannot, use the prefix for the part carrying the most risk — a `fix` bundled with a `refactor` is a `fix`.

**Security fixes get no prefix of their own.** A public branch named for a vulnerability discloses it before the patch ships. See [SECURITY.md](../SECURITY.md).

Contributors work on forks, so these names govern the core team and maintainers. Branch from `main`; there is no `develop`. Branches are deleted after merge.

---

## Commit messages

Conventional commits, with the same types as branch prefixes:

```
feat: add empty state to the members directory

Explain why, if it is not obvious from the change. Wrap at 72 characters.

Closes #42
Signed-off-by: Your Name <you@example.com>
```

- **Subject in the imperative** — "add", not "added" or "adds"
- **No full stop** at the end of the subject
- **Sign off every commit**: `git commit -s`. See the DCO section in CONTRIBUTING

---

## Pull requests

| | |
|---|---|
| **One issue per pull request** | If it grows, split it. We will ask, and explain why |
| **Title** | Same form as the commit subject |
| **Draft early** | Reviewing direction at 20% costs everyone less than at 100% |
| **Size** | Under ~400 changed lines where possible. Beyond that, review quality falls and so does the value of the feedback you get |
| **Rebase or merge** | Either. We squash on merge, so your local history is yours |

---

## Issue Labels

| Group | Labels |
|---|---|
| **Difficulty** | `good-first-issue` · `intermediate` · `advanced` |
| **Type** | `feature` · `bug` · `docs` · `design` · `a11y` · `i18n` · `test` · `infra` · `security` |
| **Area** | `area/portal` · `area/members` · `area/ui` · `area/content` · `area/tooling` |
| **Status** | `ready` · `needs-spec` · `blocked` · `claimed` · `stale` |
| **Meta** | `help-wanted` · `mentorship-available` · `nepali-language` |

**Only claim issues labelled `ready`.** Anything labelled `needs-spec` is not yet settled enough to start, and working on it risks work we cannot accept.

---

## What makes an issue ready

If you are writing an issue, or wondering whether one is safe to start:

- **Context** — why it exists and who it serves, assuming no prior knowledge
- **In scope** and **out of scope**, explicitly. The out-of-scope line is what protects your time
- **Acceptance criteria** — testable and enumerated
- **Where to look** — files, and an existing example to copy the pattern from
- **Tests expected** — automated tests or manual verification; explain when none apply
- **Size** — S (under 4h) · M (4–16h) · L (16–40h)
- **A named mentor** who will answer questions

If an issue you want is missing any of these, say so in a comment. That is useful feedback, not a complaint.

---

## What makes a pull request done

- [ ] Acceptance criteria met
- [ ] Tests added or updated for behaviour changes
- [ ] Works in **both** English and Nepali
- [ ] Keyboard operable, focus visible, contrast sufficient
- [ ] Uses design tokens — **no raw colour or spacing values**
- [ ] No new dependency, or agreed in the issue first
- [ ] No secret and no real personal data anywhere in the diff
- [ ] Commits signed off

---

## Code conventions

**Design tokens only.** Use `var(--dn-color-action)`, never `#C8102E`. Never reference a primitive such as `crimson-500` — application code uses semantic tokens. Raw colours belong only in `ui/tokens/src/`.

**No user-facing text in components.** Every string goes in `locale/en.json` and `locale/ne.json` under the same key. Both files must contain the same keys.

**Nepali is not a translation layer.** It has its own line-height token, because Devanagari matras need more vertical space than Latin. Do not unify them. Test with real Nepali strings, not placeholder text.

**Dates in Bikram Sambat** wherever they are user-facing.

**Never `outline: none`** without an equivalent visible replacement.

---

## Adding a dependency

Ask in the issue first, and say why nothing already present will do. This is a government supply chain, and every package is a long-term commitment someone will have to maintain. Most of the time the answer is to use what the framework already provides.

---

## Security

**Never open a public issue, pull request or branch for a vulnerability.** Report privately — see [SECURITY.md](../SECURITY.md).

If you find a security problem while working on something unrelated, stop and report it privately rather than fixing it in the open. A public fix is a public disclosure.
