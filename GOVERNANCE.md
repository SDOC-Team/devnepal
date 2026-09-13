# Governance

## The short version

**The sponsoring body decides what the system must do. The technical team decides how it is built. The community contributes the work and the scrutiny. Merge and deployment are government-only.**

None of these is a community vote, and saying so plainly is more honest than implying otherwise.

---

## Roles

| Role | Who | Decides | Does not decide |
|---|---|---|---|
| **Steering** | Office of the Prime Minister | Which projects enter; funding; go/no-go for production | Technical design; individual pull requests |
| **Core team** | Government-employed or contracted engineers | Architecture, stack, merge, release, deployment, security posture | What the system must do |
| **Maintainers** | Promoted contributors, **may be from outside government** | Review and approve pull requests in their area; triage; mentor | Merge to main; deploy; release |
| **Contributors** | Anyone | What they work on, from the open backlog | — |

---

## The contributor ladder

Review capacity, not contributor supply, is what limits how fast an open project can move. The ladder is how review capacity grows.

| Level | How you get there | What you can do |
|---|---|---|
| **Contributor** | Open a pull request | Propose changes, comment |
| **Trusted Contributor** | 5 merged pull requests, or one substantial feature | Triage and label issues; mentor newcomers |
| **Reviewer** | 10+ merged pull requests in an area, nominated by a maintainer | Non-binding review that core weights heavily |
| **Maintainer** | 3 months as Reviewer, confirmed by core | **Binding approval** in your area |
| **Core** | Government appointment or contract | Merge, release, deploy |

**Rungs are area-scoped and terms are time-boxed**, so promotion is cheap where risk is low and letting a term lapse is painless.

**Maintainers may be non-government.** Nobody outside government merges or deploys.

---

## How decisions are made

Anything that changes an interface, adds a dependency, alters the data model, or affects security goes through a lightweight proposal:

1. Open it as a pull request into `specs/rfcs/`
2. Minimum 7 days for comment — 14 if it touches security or the data model
3. Core decides and **records the decision with its reasoning**, including for rejections
4. Rejected proposals stay in the repository, marked rejected

Decisions are not consensus-based. Core decides — but core must write down why, in public, every time. A visible archive of reasoned rejections is the best defence against relitigating the same argument every six months.

---

## Changing this document

Through the same proposal process, with a 14-day comment period.
