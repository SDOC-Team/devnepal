# Governance

## The short version

**The government department that owns a system decides what it must do. The technical team decides how it is built. The community contributes the work and the scrutiny. Merge and deployment are government-only.**

---

## Roles

| Role | Who | Decides | Does not decide |
|---|---|---|---|
| **Steering** | Office of the Prime Minister | Which projects enter the devNepal programme; funding; approval to deploy to production | What any individual system must do; technical design; individual pull requests |
| **Sponsoring department** | The ministry or body that owns a given system. **For this portal, the Office of the Prime Minister** | What that system must do; acceptance of completed work | How it is built; who may contribute; when it deploys |
| **Core team** | Government-employed or contracted engineers | Architecture, stack, merge, release, deployment, security posture | What a system must do |
| **Maintainers** | Appointed by the core team, **and may be from outside government** | Review and approval of pull requests in their area; triage; mentoring | Merge to `main`; deployment; releases |
| **Contributors** | Anyone | What they work on, from the open backlog | — |

---

## Maintainers, and how you become one


| Level | Who | What they can do |
|---|---|---|
| **Contributor** | Anyone | Propose changes, comment, review informally |
| **Maintainer** | Appointed by the core team. **May be from outside government** | Binding approval of pull requests in their area |
| **Core** | Government appointment or contract | Merge, release, deploy |


**What comes next.** Once there is a body of contributors with a real track record, we will publish criteria for moving from contributor to maintainer — a promotion path, rather than appointment — and start promoting from contribution. The criteria will be stated plainly rather than left to judgement.

**What holds regardless:**

- Maintainers may be non-government. **Nobody outside government merges or deploys**
- Authority is area-scoped — a maintainer of the design system has no authority over authentication
- We would rather give you review authority than keep reviewing everything ourselves. If you are contributing consistently in one area, ask where you stand and we will tell you plainly
