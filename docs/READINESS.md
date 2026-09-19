# Readiness and follow-up work

**Current stage: documentation and planning. All items below are TODOs. They do not block merging the seed documentation PR.** They become required at the milestones shown below. The [v0.1 PRD](./PRD-v0.1.md) defines what must be built. This checklist records implementation status, temporary procedures and verification; it does not replace or reduce the PRD requirements. Change the PRD only when a product requirement changes or needs correction, not when implementation is incomplete.

## Keeping this work visible

The core team owns this checklist until named assignees are recorded. At each weekly review, check open items, assign the next work and record progress here. Before an item starts, add a named assignee and a GitHub issue link; use the existing task template and include the item's ID. The entries below are repository TODOs, not already-created GitHub issues.

Every implementation PR must reference the affected IDs and update this file. An item is complete only when its acceptance criteria are met and its evidence column links to the implementation and verification. Creating an issue or merging documentation alone does not complete an implementation item. Never put private reports or credentials in evidence links; record a safe verification summary instead.

Before each milestone, the core team must review its required rows and record the decision, reviewer and date in a PR updating this file. Unfinished required items hold that milestone. Non-blocking follow-ups must receive a named owner and target release if postponed. Keep completed rows as a record.

**This is a manual review process.** No scheduler, CI check or deployment gate currently enforces it. The PR template prompts reviewers to keep it current; `BUILD-02` adds automated checks and records which repository protections enforce them.

## Before broad contributor onboarding

The current documentation PR can merge while these items are pending. Complete them before advertising the repository as fully ready for outside contributors.

| ID | Status | Accountable role / assignee | Issue / evidence | Completion criteria |
|---|---|---|---|---|
| SEED-01 | TODO | Core team / unassigned | Not created / none | Publish named area reviewers in MAINTAINERS.md. Publish a monitored private conduct contact and an alternate for conflicts and appeals. Confirm recipients accept the role and the 48-hour acknowledgement commitment. Update CODE_OF_CONDUCT.md and the issue chooser together. |
| SEED-02 | TODO | Core team / unassigned | Not created / none | Enable GitHub private vulnerability reporting, verify it is available to an outside reporter and that notifications reach the responsible person. Confirm 24-hour acknowledgement coverage. Record who verified this and when; replace the availability caveat in SECURITY.md. A dedicated mailbox is optional if GitHub reporting works. |

## Application setup and routine code contributions

| ID | Status | Accountable role / assignee | Issue / evidence | Completion criteria |
|---|---|---|---|---|
| BUILD-01 | TODO | Core team / unassigned | Not created / none | Choose and scaffold the stack. Add actual source files, dependency manifests and a secret-free tracked .env.example if configuration is needed. Confirm source/output paths and ignore rules. Provide equivalent setup instructions in both READMEs and record a clean-machine run under ten minutes before claiming local setup works. |
| BUILD-02 | TODO | Tooling maintainer, core team until appointed / unassigned | Not created / none | Before routine application PRs, install checks for commit sign-offs, raw colours outside token source, locale-key parity and applicable application tests. Demonstrate each check rejects a representative failure and passes a valid change. Configure required checks/reviews for main, applying to the core team as well as contributors, and record the protections. Update CI claims only after verification. Add remaining release automation before launch; document any manual deployment checks. |

Until BUILD-02 is complete, reviewers must manually check applicable sign-offs, token use and bilingual changes. Documentation-only changes do not need application tests.

### Before the v0.1 launch

| ID | Status | Accountable role / assignee | Issue / evidence | Completion criteria |
|---|---|---|---|---|
| BUILD-03 | TODO | Tooling maintainer, core team until appointed / unassigned | Not created / none | Implement the PRD section 3.3 requirement to automatically unassign issues after 14 days without activity. Define qualifying activity and notifications; verify active issues remain assigned and inactive issues receive an explanation. Update CONTRIBUTING.md when automation is operational. The manual check-in procedure is temporary and does not satisfy this launch requirement. |

## Before enabling public accounts

Complete the onboarding and applicable build rows above as well as all account rows below. Public registration must remain unavailable until then. The rest of the v0.1 launch criteria still apply.

| ID | Status | Accountable role / assignee | Issue / evidence | Completion criteria |
|---|---|---|---|---|
| ACCOUNT-01 | TODO | Core team with privacy reviewer / unassigned | Not created / none | Implement the PRD requirement to store email for account contact. Resolve the tension with its public-profile-only sign-in wording by specifying the email source, required permissions and behaviour when email is unavailable or permission is declined; record any necessary product decision explicitly. Public profile information requires no OAuth scope; `read:user` alone does not guarantee access to private email addresses. Specify any additional permission before implementing the flow. Test with a private-email GitHub account and declined permissions. Align implementation, sign-in explanation and privacy notice with the agreed requirements; request no private-repository or account-write access. Do not drop email collection merely because it is not implemented yet. |
| ACCOUNT-03 | TODO | Core team with privacy reviewer / unassigned | Not created / none | Publish and verify a monitored private privacy contact and the proposed 15-working-day response commitment. Finalize the field inventory, recipients and retention rules, including logs, caches, backups and profile deletion. Test correction, hiding and deletion, including activity removal behaviour. Update the notice to match actual handling; remove its draft banner only when verified. |
| ACCOUNT-04 | TODO | Core team with security and accessibility reviewers / unassigned | Not created / none | Verify sign-in and admin authorization, approval and re-review, public 404s for pending/hidden profiles, and exclusion of email from pages, responses and logs. Check all shipped pages and policies in both languages, v0.1 structural accessibility, activity freshness, programme-only totals and all PRD launch criteria. Record release verification and resolve open security findings before public launch. |

## Later follow-ups

These are outside the v0.1 launch gate. The target is a planning commitment to review, not a claim that the work is already scheduled or implemented.

| ID | Status | Accountable role / assignee | Target | Issue / evidence | Completion criteria |
|---|---|---|---|---|---|
| FOLLOW-02 | TODO | Accessibility maintainer, core team until appointed / unassigned | Release after v0.1 | Not created / none | Complete the deferred full accessibility audit, manual screen-reader pass, reduced-motion handling and component-state coverage from PRD section 4.1. Publish a conformance statement only after testing and remediation; continue to describe the audit as deferred until complete. |

## Milestone decisions

No readiness milestone has been approved yet. When one is reviewed, add its name, decision, reviewer, date and supporting PR here. This section is not needed to approve the seed documentation PR.
