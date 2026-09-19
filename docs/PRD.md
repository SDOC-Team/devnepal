**GOVERNMENT OF NEPAL**

**Office of the Prime Minister and Council of Ministers**

Digital Collaboration Initiative

**DevNepal**

**Software Requirements Specification and Project Scope**

> **Document purpose:** Define the product scope, operating model, functional and non-functional requirements, governance controls, delivery phases, and acceptance basis for a national platform that enables volunteers to contribute to government technology projects and strengthens Nepal's developer community.

Document metadata

| Field | Value |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Document status  | Draft for stakeholder validation                                                                                                               |
| Version          | 0.9                                                                                                                                            |
| Date             | 2 September 2026                                                                                                                               |
| Prepared for     | Office of the Prime Minister and Council of Ministers, Government of Nepal                                                                     |
| Primary audience | PMO leadership, participating ministries, product team, engineering team, security reviewers, legal/policy reviewers, and community moderators |

*This is a requirements and planning draft. It does not by itself approve policy, procurement, data processing, hosting, open-source licensing, or public release of any government system.*

> ### Reading this alongside the current release
>
> **This document is the full product scope.** It describes devNepal as intended when complete, and was written before the first release was built.
>
> **What the current release builds is in [PRD-v0.1.md](./PRD-v0.1.md)**, which covers roughly a fifth of the requirements below. Where the two disagree, the current release governs.
>
> Requirement IDs here (`AUTH-001`, `GOV-004`, and so on) are the stable references. The current release traces back to them.

---


# Contents
- 1\. Executive Summary

- 2\. Background, Vision and Principles

- 3\. Objectives and Success Measures

- 4\. Stakeholders, Users and Authorization

- 5\. Project Scope

- 6\. Operating Model and Core Workflows

- 7\. Functional Requirements

- 8\. Business Rules

- 9\. Information and Data Requirements

- 10\. Integration Requirements

- 11\. Non-Functional Requirements

- 12\. Security, Privacy and Legal Requirements

- 13\. Community and Content Governance

- 14\. User Experience, Accessibility and Localization

- 15\. Delivery Scope and Phasing

- 16\. Acceptance and Readiness

- 17\. Risks and Mitigations

- 18\. Assumptions, Dependencies and Decisions Required

- Appendices

# 1. Executive Summary
DevNepal is proposed as the Government of Nepal's public collaboration and developer-community platform. Participating ministries will publish suitable technology projects that need public contribution; members will discover opportunities, contribute through approved workflows, build a public portfolio, publish technical writing, and receive verified recognition for accepted work. The platform will also allow members to list their own public projects and external work links.

DevNepal should be treated as a trusted registry and collaboration layer, not as a replacement for GitHub. Source code, branches, issues, pull requests, continuous integration, and code review remain in approved repositories. DevNepal provides identity, project discovery, structured project metadata, applications and participation records, verified contribution events, community content, recognition, governance, and reporting.

> **Key product recommendation:** Measure and recognize accepted impact in DevNepal-listed projects, not raw commit volume. GitHub profile activity may be displayed with consent, but official leaderboards should rely on verified events such as merged pull requests, accepted documentation/design/QA work, completed issues, and maintainer-approved non-code contributions.

The platform must implement three authorization roles requested by PMO: Super Admin, Ministry Publisher, and Member. Public visitors are an unauthenticated access state, not an administrative role. For security and accountability, a ministry must be represented by an organization record with named officer accounts; shared ministry credentials are not acceptable.

# 2. Background, Vision and Principles
## 2.1 Background
Government technology projects often need specialized, time-bound contributions in software engineering, user experience, documentation, quality assurance, cybersecurity, data, localization, and research. At the same time, many Nepali developers want credible ways to contribute to public-interest technology, find peers, demonstrate skills, and learn from real projects. DevNepal connects these needs through a governed, transparent platform.

Comparable public-code initiatives emphasize discoverable inventories, consistent metadata, reusable software, and clear contribution channels. The U.S. Federal Source Code Policy highlights inventories, reuse, public access, and reduced duplication, while the Standard for Public Code emphasizes visible contact channels and contribution guidance \[R1, R2\]. DevNepal adapts those principles to Nepal's institutional and legal context rather than copying another country's policy.

## 2.2 Vision
> **Vision:** Create Nepal's trusted public-interest developer network where government institutions can safely open appropriate projects to contribution, and where developers can build capability, reputation, and community by delivering visible public value.

## 2.3 Guiding principles
- Public value first: every government listing states the citizen or institutional outcome, not only the technology task.

- Open by suitability, not by default: only projects cleared for public participation are listed; classified, sensitive, procurement-restricted, or personally identifiable data is excluded.

- Contribution must be easy: every project exposes a maintained contact, contribution guide, suitable starter work, response expectations, and decision process.

- Trust through verification: official projects, ministry identities, contribution records, and recognition are verifiable and auditable.

- Privacy by design: collect the minimum data needed, make public visibility explicit, and allow account disconnection and deletion subject to lawful retention.

- Security throughout delivery: apply secure-development practices to DevNepal and require baseline repository hygiene for listed government projects \[R10, R11\].

- Inclusive by design: English and Nepali support, mobile responsiveness, low-bandwidth behavior, and WCAG 2.2 Level AA are baseline requirements \[R9\].

- Technology neutrality: requirements define outcomes and controls; implementation choices remain replaceable and maintainable.

# 3. Objectives and Success Measures
## 3.1 Business objectives
- Enable authorized ministries to publish structured, approved project opportunities requiring public contribution.

- Reduce friction between an interested volunteer and a first meaningful contribution.

- Build a searchable national directory of developers, skills, public projects, technical writing, and verified contribution experience.

- Improve transparency around the status, maintainers, needs, and outcomes of suitable government technology projects.

- Strengthen open, secure, reusable government software practices and reduce duplicated effort where policy permits.

- Give PMO and ministries measurable insight into participation, responsiveness, contribution outcomes, and project health.

## 3.2 Outcome metrics
Proposed measurement framework; numeric targets to be approved after pilot baselining

| Outcome | Metric definition | Review cadence |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| Institutional adoption | Number of ministries with an active named publisher and at least one approved public project.                                      | Monthly            |
| Opportunity supply     | Active projects by ministry, contribution type, difficulty, and expected effort.                                                   | Monthly            |
| Contributor activation | Percentage of new members who save, apply to, or contribute to a project within 30 days.                                           | Monthly            |
| First-response quality | Median time from a member question/application/pull request to a meaningful maintainer response.                                   | Weekly             |
| Verified impact        | Accepted contribution records, unique contributors, completed milestones, and completed projects.                                  | Monthly            |
| Inclusion              | Participation by province, skill area, language preference, and experience band, reported only at privacy-safe aggregation levels. | Quarterly          |
| Community health       | Retention, repeat contributors, reports, moderation turnaround, and code-of-conduct incidents.                                     | Monthly            |
| Platform reliability   | Availability, performance, sync freshness, security findings, and support resolution.                                              | Monthly            |

# 4. Stakeholders, Users and Authorization
## 4.1 Stakeholders
Stakeholder responsibilities

| Stakeholder | Primary interest / responsibility |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| PMO sponsor and steering committee    | Own mandate, policy decisions, inter-ministry participation, funding, risk acceptance, and final scope approval.                                 |
| DevNepal product owner                | Own roadmap, requirements, backlog, outcomes, release decisions, and cross-functional coordination.                                              |
| Super Admin team                      | Provision ministries and named publishers, approve listings, manage taxonomy, moderate content, audit actions, and operate the platform.         |
| Ministry project owner / publisher    | Publish accurate project information, maintain contribution channels, respond to contributors, verify accepted work, and close/archive projects. |
| Members / volunteers                  | Maintain truthful profiles, follow project rules and code of conduct, contribute through approved channels, and report abuse/security concerns.  |
| Repository maintainers                | Triage issues, review contributions, protect branches, run tests, manage releases, and send authoritative contribution events.                   |
| Security, privacy and legal reviewers | Approve controls, data handling, terms, licenses, incident processes, and public-release boundaries.                                             |
| Public visitors                       | Browse public projects, member profiles where permitted, blogs, results, and public reports.                                                     |

## 4.2 Authorization model
Role and permission summary

| Capability | Super Admin | Ministry Publisher | Member | Public visitor |
|--------------------------------------|---------------------|--------------------------------------------------|----------------------------|------------------------|
| Manage ministry organizations        | Create / suspend    | View own                                         | No                         | No                     |
| Manage named ministry officers       | Create / revoke     | No by default                                    | No                         | No                     |
| Create government project            | Any ministry        | Own ministry                                     | No                         | No                     |
| Approve government project           | Yes                 | Submit only                                      | No                         | No                     |
| Edit published government project    | Any                 | Own ministry; material edits may re-enter review | No                         | No                     |
| Create personal project              | Yes                 | If also a member profile                         | Own                        | No                     |
| Contribute / apply                   | If member-enabled   | If member-enabled                                | Yes                        | No                     |
| Publish technical blog               | Yes                 | If member-enabled                                | Own; subject to moderation | No                     |
| Verify contribution                  | Override with audit | Own ministry projects                            | Submit evidence only       | No                     |
| Moderate / suspend                   | Yes                 | Report only                                      | Report only                | No                     |
| View audit and operational analytics | All                 | Own ministry                                     | Own activity               | Public aggregates only |

> **Control requirement:** A ministry organization may have one or more named publisher accounts, but credentials must never be shared. Each publish, approval, verification, suspension, and material edit must be attributable to a named person in an audit log.

# 5. Project Scope
## 5.1 In scope
- Public web application for desktop, tablet, and mobile browsers.

- Public catalog of approved government contribution projects and member-owned public projects.

- Member registration, profile, skills, education, links, portfolio, availability, and privacy controls.

- Super Admin provisioning of ministries and named ministry publishers.

- Government project drafting, approval, publication, maintenance, contribution intake, completion, and archival.

- Project search, filters, recommendations based on explicit skills/interests, bookmarks, and application/interest workflows.

- GitHub account connection and permissioned synchronization of profile/activity data.

- GitHub App integration for verified events from selected DevNepal-listed repositories.

- Member technical blogs in a safe Markdown-based editor and external links to Medium or other publications.

- Recognition profiles, badges, and a quality-based leaderboard using verified accepted contributions.

- In-app and email notifications for material workflow events.

- Moderation, reports, taxonomy, analytics, audit trails, consent, retention, and account lifecycle controls.

- English and Nepali interface and content metadata, Unicode search, accessibility, and low-bandwidth behavior.

## 5.2 Explicitly out of scope
- Hosting source code, branches, issues, pull requests, CI/CD pipelines, packages, or releases inside DevNepal.

- Publishing classified, security-sensitive, procurement-confidential, law-enforcement-sensitive, or personal-data-bearing government projects for open contribution.

- Production deployment privileges for volunteers or automatic merging of contributor code.

- Government procurement, tendering, employment, payroll, grants, bounties, or contract management.

- A general social network with private messaging, follower feeds, live chat, or unrelated user-generated content.

- Mirroring a member's complete Git history or importing private repository details without explicit repository-level authorization.

- Automatic legal approval of licenses, contributor agreements, data release, or source-code publication.

- Native mobile applications in the initial delivery.

- AI-generated project scoring or automated contributor selection in the MVP.

## 5.3 Scope boundary: public contribution suitability
Before a government project enters DevNepal, its ministry owner must complete a suitability checklist covering legal authority, source-code rights, data classification, security exposure, procurement restrictions, third-party licenses, repository readiness, maintainer capacity, contribution agreement, and public communications. Super Admin approval confirms completion of the process, not a transfer of legal responsibility from the ministry.

# 6. Operating Model and Core Workflows
## 6.1 Government project lifecycle
Lifecycle states and controls

| State | Meaning | Allowed transition / control |
|-----------------------|---------------------------------------------------------------------------------------------|--------------------------------------------------------|
| Draft                 | Visible only to the owning ministry and Super Admin.                                        | Ministry edits; submit for review.                     |
| In review             | PMO review of completeness, suitability, licensing, security classification, and readiness. | Approve, request changes, or reject.                   |
| Changes requested     | Returned with actionable review comments.                                                   | Ministry edits and resubmits.                          |
| Approved / scheduled  | Approved but not yet public, optionally with a future publication date.                     | Super Admin publishes or revokes approval.             |
| Open for contribution | Public, accepting volunteers or contribution events.                                        | Pause, mark in progress, complete, cancel, or archive. |
| Paused                | Public status visible; new applications disabled while existing work is retained.           | Resume, complete, cancel, or archive.                  |
| Completed             | Outcome and release/results summary published; no new work accepted.                        | Archive after retention period or reopen by approval.  |
| Cancelled             | Reason published unless restricted; no new work accepted.                                   | Archive or reopen by approval.                         |
| Archived              | Read-only historical record retained according to policy.                                   | Super Admin restore only.                              |

## 6.2 End-to-end contribution workflow
1.  A ministry prepares the project, identifies maintainers, selects an approved repository and license, defines contribution types and tasks, and submits the listing.

2.  Super Admin verifies suitability and completeness, records review comments, and approves publication.

3.  A member discovers the project, reviews prerequisites and contribution instructions, connects GitHub if needed, and expresses interest or starts a labeled task.

4.  The ministry/maintainer acknowledges participation, assigns or confirms work where assignment is required, and communicates through the public repository or approved channel.

5.  The member contributes through GitHub or submits evidence for approved non-code work such as UX, documentation, translation, testing, or research.

6.  GitHub webhooks or the ministry reviewer create a candidate contribution record. The maintainer accepts, rejects, or requests clarification with a reason.

7.  Accepted work updates the member's verified portfolio and project metrics. Recognition/leaderboard changes remain auditable and reversible.

8.  The ministry publishes progress and completion outcomes, credits contributors, and archives the listing when appropriate.

## 6.3 Personal project workflow
Members may list projects they own or maintain, with GitHub, demo, Medium, website, documentation, or other approved URLs. Personal projects are clearly distinguished from official government projects. Ownership may be verified through the connected GitHub account, domain verification, or manual moderation. Misleading government branding, unsafe links, copied content, or unlawful material is prohibited.

# 7. Functional Requirements
Priority uses MoSCoW: Must = required for production launch; Should = important for the first public release but may be deferred with approved risk; Could = later enhancement; Won't = excluded from the current scope.

Table 7A. Identity, authentication and authorization requirements

| ID | Requirement | Priority |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| AUTH-001 | The platform shall provide federated sign-in for members using approved providers, including Google, GitHub, and Facebook when enabled by configuration and policy. | Must         |
| AUTH-002 | The platform shall allow a member to connect or disconnect GitHub independently of the provider used to sign in.                                                    | Must         |
| AUTH-003 | The platform shall provision the first Super Admin through a controlled deployment process and require all subsequent Super Admin grants to be auditable.           | Must         |
| AUTH-004 | Only a Super Admin shall create, activate, suspend, or revoke a ministry organization and its named publisher accounts.                                             | Must         |
| AUTH-005 | Super Admin and Ministry Publisher accounts shall use multi-factor authentication and verified official contact information.                                        | Must         |
| AUTH-006 | Authorization shall be enforced server-side for every protected object and action, including ownership and ministry boundaries.                                     | Must         |
| AUTH-007 | The platform shall provide secure session revocation, device/session listing for privileged users, inactivity timeout, and re-authentication for high-risk actions. | Must         |
| AUTH-008 | The platform shall record provider consent, scopes, connection time, last synchronization, and revocation status without exposing tokens to users or logs.          | Must         |
| AUTH-009 | A suspended account shall lose authenticated access immediately while public records follow moderation and retention policy.                                        | Must         |
| AUTH-010 | Members shall be able to export their profile and contribution records and request account deletion, subject to lawful and audit retention.                         | Should       |

Table 7B. Member profile requirements

| ID | Requirement | Priority |
|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| MEM-001 | A member shall have a unique public username and immutable internal identifier.                                                                                                                | Must         |
| MEM-002 | A member profile shall support name, photograph, headline, biography, location, preferred language, skills, education, experience band, availability, interests, and contribution preferences. | Must         |
| MEM-003 | A member shall control visibility of optional fields; email, authentication provider, and private contact information shall be non-public by default.                                          | Must         |
| MEM-004 | Skills shall be selected from an admin-managed taxonomy with optional suggestions for missing terms.                                                                                           | Must         |
| MEM-005 | A profile shall display government and personal projects, technical blogs, verified contributions, badges, and connected external links in separate sections.                                  | Must         |
| MEM-006 | A member shall be able to link GitHub, Medium, personal website, portfolio, and other allowlisted URL types.                                                                                   | Must         |
| MEM-007 | External URLs shall be validated, normalized, checked against unsafe schemes, and rendered with clear external-link labeling.                                                                  | Must         |
| MEM-008 | A member shall be able to preview the public profile before publishing changes.                                                                                                                | Should       |
| MEM-009 | The platform shall support profile completeness guidance without making sensitive optional data mandatory.                                                                                     | Should       |
| MEM-010 | Members shall be able to report impersonation and request verification of a disputed identity or project ownership claim.                                                                      | Must         |

Table 7C. Government project publishing requirements

| ID | Requirement | Priority |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| GOV-001 | A Ministry Publisher shall create and edit project drafts only for the ministry organizations to which the account is assigned.                                                                                               | Must         |
| GOV-002 | A government project shall capture structured fields defined in Appendix A, including outcome, requirements, contribution types, maintainer, repository, license, data classification, milestones, and response expectations. | Must         |
| GOV-003 | A government project shall support proposal, requirements, architecture, design, and other approved attachments with version, file type, size, and malware controls.                                                          | Must         |
| GOV-004 | The platform shall support save-as-draft, preview, submit, change-request, approve, schedule, publish, pause, complete, cancel, archive, and restore actions according to the lifecycle.                                      | Must         |
| GOV-005 | Every review action shall record actor, timestamp, decision, reason/comment, and before/after version.                                                                                                                        | Must         |
| GOV-006 | A material edit to license, repository, data classification, scope, contribution agreement, or public-contact information shall return a published project to review or require Super Admin approval.                         | Must         |
| GOV-007 | Each open project shall expose contribution instructions, communication channel, expected first-response time, difficulty, effort, prerequisites, and at least one actionable task or workstream.                             | Must         |
| GOV-008 | A project shall support code and non-code contribution categories including engineering, UI/UX, QA, security, data, documentation, localization, research, and community support.                                             | Must         |
| GOV-009 | A Ministry Publisher shall post progress updates, milestone status, release/result links, completion summary, and contributor acknowledgements.                                                                               | Should       |
| GOV-010 | Expired deadlines shall not silently close a project; the owner shall explicitly extend, pause, complete, cancel, or archive it.                                                                                              | Must         |
| GOV-011 | The platform shall display an official-government badge only on Super Admin-approved ministry projects.                                                                                                                       | Must         |
| GOV-012 | A project with no maintainer response within the configured SLA shall be flagged to the ministry and Super Admin.                                                                                                             | Should       |

Table 7D. Member-owned project requirements

| ID | Requirement | Priority |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| PPR-001 | Members shall create, edit, unpublish, and archive their own personal project listings.                                                            | Must         |
| PPR-002 | Personal projects shall support title, summary, description, role, status, technology, skills, dates, images, and external URLs.                   | Must         |
| PPR-003 | The interface shall clearly label personal projects as community projects and never imply Government of Nepal endorsement.                         | Must         |
| PPR-004 | The platform shall attempt ownership verification for connected GitHub repositories and record verified/unverified status.                         | Should       |
| PPR-005 | Personal projects shall be subject to automated link/file checks, community reports, and Super Admin moderation.                                   | Must         |
| PPR-006 | A member may invite collaboration on a personal project only after accepting the community terms and publishing contribution/contact instructions. | Could        |

Table 7E. Discovery, application and participation requirements

| ID | Requirement | Priority |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| DSC-001 | Public users shall browse approved projects without signing in.                                                                                                    | Must         |
| DSC-002 | Search shall support title, summary, ministry, technology, skill, contribution type, status, difficulty, effort, deadline, and language filters.                   | Must         |
| DSC-003 | Search and URLs shall support Nepali Unicode and stable, human-readable project slugs.                                                                             | Must         |
| DSC-004 | Members shall bookmark projects and receive opt-in change notifications.                                                                                           | Should       |
| DSC-005 | Members shall express interest, apply to a controlled workstream, or follow direct-contribution instructions according to the project mode.                        | Must         |
| DSC-006 | Application forms shall capture only project-relevant information and support screening questions configured by the ministry.                                      | Must         |
| DSC-007 | Ministry Publishers shall accept, waitlist, decline, or request information from applicants with auditable status and reusable response templates.                 | Should       |
| DSC-008 | The platform shall preserve an application/activity timeline visible to the member and authorized ministry users.                                                  | Must         |
| DSC-009 | Public project pages shall show maintainer activity indicators and stale-project warnings without exposing private operational data.                               | Should       |
| DSC-010 | Recommendations shall be explainable and initially based on explicit profile skills, interests, language, effort, and project needs rather than opaque AI scoring. | Should       |

Table 7F. GitHub integration requirements

| ID | Requirement | Priority |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| GIT-001 | The platform shall use a registered GitHub App for repository-level integration and user authorization, using the minimum permissions required \[R3\].                                       | Must         |
| GIT-002 | Connecting GitHub shall import only consented profile fields and public activity needed for the selected DevNepal features.                                                                  | Must         |
| GIT-003 | The platform shall allow a user or repository owner to select which repositories the GitHub App may access.                                                                                  | Must         |
| GIT-004 | The platform shall subscribe to webhooks rather than relying only on polling and shall validate every webhook signature using a high-entropy secret \[R4\].                                  | Must         |
| GIT-005 | Webhook processing shall be idempotent, queued, retryable, timestamped, and protected against replay and duplicate delivery.                                                                 | Must         |
| GIT-006 | The platform shall reconcile selected repositories periodically to recover missed webhook events while respecting GitHub rate limits.                                                        | Must         |
| GIT-007 | Verified project activity shall include configured events such as pull-request merged, issue closed, approved review, release, and qualifying commits to the default branch.                 | Must         |
| GIT-008 | Raw commits, merge commits, automated/bot events, and duplicated events shall not directly generate leaderboard credit.                                                                      | Must         |
| GIT-009 | A member may display an annual GitHub contribution calendar or summary where supported, with source and freshness labels; it shall not be presented as an exact all-time work record \[R5\]. | Should       |
| GIT-010 | Private repository names, code, issue content, commit messages, or URLs shall never be public; private activity counts shall be omitted unless explicitly authorized and policy-approved.    | Must         |
| GIT-011 | On GitHub authorization revocation or app uninstall, synchronization shall stop, tokens shall be invalidated/deleted, and the profile shall show a disconnected state.                       | Must         |
| GIT-012 | Each imported event shall retain provider event ID, repository ID, actor mapping, received time, processing state, and verification provenance for audit and deduplication.                  | Must         |

Table 7G. Technical blog requirements

| ID | Requirement | Priority |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| BLG-001 | Members shall create, preview, save, publish, edit, unpublish, and archive technical blog posts.                                                            | Must         |
| BLG-002 | The editor shall support safe Markdown, code blocks, images, links, headings, tables, and accessible alternative text.                                      | Must         |
| BLG-003 | Rendered content shall sanitize HTML, prohibit executable scripts/iframes by default, and protect against stored cross-site scripting.                      | Must         |
| BLG-004 | Posts shall support title, excerpt, cover image, tags, language, reading time, publication date, and canonical external URL.                                | Must         |
| BLG-005 | Members may list an external Medium or other article as a link without copying the full text; import requires rights confirmation and supported API/format. | Should       |
| BLG-006 | Posts shall support moderation states and community reporting while preserving version/audit history for moderators.                                        | Must         |
| BLG-007 | Government or project-official posts shall require an explicit official publishing permission and visual label distinct from personal member writing.       | Must         |

Table 7H. Recognition and leaderboard requirements

| ID | Requirement | Priority |
|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| REC-001 | Recognition shall be based on verified accepted contribution records, not total commits or self-reported activity.                                         | Must         |
| REC-002 | The scoring policy shall be publicly documented, configurable, versioned, and approved by the product owner before activation.                             | Must         |
| REC-003 | The platform shall support rolling-period, annual, ministry, project, contribution-type, and lifetime views without exposing private data.                 | Should       |
| REC-004 | Members shall be able to opt out of public leaderboard display while retaining private contribution history.                                               | Must         |
| REC-005 | Moderators shall reverse, correct, or invalidate recognition with a reason and audit record.                                                               | Must         |
| REC-006 | Rate caps, bot exclusion, duplicate detection, maintainer separation-of-duties, and anomaly review shall reduce gaming.                                    | Must         |
| REC-007 | Badges shall have documented criteria, evidence, issuer, issue date, and revocation state.                                                                 | Should       |
| REC-008 | The platform shall recognize approved non-code contributions so that design, QA, documentation, translation, security, and research are not disadvantaged. | Must         |

Table 7I. Notification requirements

| ID | Requirement | Priority |
|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| NTF-001 | The platform shall provide in-app notifications for approvals, review comments, applications, assignments, contribution verification, moderation, and security events. | Must         |
| NTF-002 | Users shall control non-essential email categories and digest frequency; mandatory security/administrative notices cannot be disabled.                                 | Must         |
| NTF-003 | Notification messages shall avoid sensitive content in email subject lines and shall link to authenticated detail when needed.                                         | Must         |
| NTF-004 | Delivery failures shall be logged and retried without duplicate user-visible notifications.                                                                            | Should       |

Table 7J. Administration and moderation requirements

| ID | Requirement | Priority |
|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| ADM-001 | Super Admin shall manage ministries, named publisher accounts, skills/tags, project categories, approved licenses, contribution types, badges, moderation reasons, and feature flags. | Must         |
| ADM-002 | Super Admin shall review project submissions and user-generated content using queues, filters, assignment, comments, and service-level indicators.                                    | Must         |
| ADM-003 | Users shall report a profile, project, blog, link, comment/evidence record, or security concern using structured reasons.                                                             | Must         |
| ADM-004 | Moderation actions shall include no action, warning, content restriction, unpublish, account suspension, and escalation, each with reason and audit history.                          | Must         |
| ADM-005 | Privileged search and exports shall be access-controlled, purpose-limited, logged, and protected from bulk misuse.                                                                    | Must         |
| ADM-006 | Super Admin shall view operational dashboards for active projects, stale projects, response SLA, sync failures, reports, security alerts, and adoption metrics.                       | Should       |
| ADM-007 | The platform shall provide data correction, appeal, and content reinstatement workflows.                                                                                              | Should       |
| ADM-008 | No privileged user shall be able to erase the audit record of their own action through the application interface.                                                                     | Must         |

Table 7K. Analytics and reporting requirements

| ID | Requirement | Priority |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| ANL-001 | Analytics shall use documented event definitions and exclude authentication secrets, private repository content, and unnecessary personal data. | Must         |
| ANL-002 | Ministry dashboards shall be restricted to the ministry's own projects and authorized cross-government aggregates.                              | Must         |
| ANL-003 | Public reporting shall use aggregation and suppression thresholds to prevent identification of members in small groups.                         | Must         |
| ANL-004 | Exports shall include source, generation time, filters, field definitions, and license/usage notice.                                            | Should       |
| ANL-005 | A public read-only API for approved project metadata may be introduced after security, rate-limit, privacy, and open-data review.               | Could        |

# 8. Business Rules
Core business rules

| ID | Rule |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BR-001 | Only Super Admin-approved government projects may display official ministry identity or Government of Nepal endorsement.                                                                                            |
| BR-002 | A project cannot be published without a named ministry owner, public maintainer/contact path, approved contribution mode, response expectation, and suitability clearance.                                          |
| BR-003 | A government repository must have an approved license, README, CONTRIBUTING guide, code of conduct, security reporting path, issue/task entry point, and branch/review controls before the project is marked ready. |
| BR-004 | A member's self-declared skills and education are not treated as government-verified credentials unless a separate verification process is approved.                                                                |
| BR-005 | GitHub's contribution graph and DevNepal's verified contribution record are different measures and must be labeled separately \[R5\].                                                                               |
| BR-006 | A contribution is official only after an authoritative repository event or authorized maintainer acceptance; self-submission alone is evidence, not verification.                                                   |
| BR-007 | A ministry maintainer may not award credit to themselves without secondary approval or an automated authoritative event.                                                                                            |
| BR-008 | Deleting/unpublishing a project does not erase audit, security, or contribution evidence that policy requires retaining.                                                                                            |
| BR-009 | Personal projects and personal blogs must not use official seals, logos, or wording in a way that implies government endorsement.                                                                                   |
| BR-010 | Content takedown, suspension, and leaderboard correction must use defined reasons and an appeal path except during urgent security containment.                                                                     |
| BR-011 | A paused, completed, cancelled, or archived project does not accept new applications; existing records remain visible according to permissions.                                                                     |
| BR-012 | Taxonomy and scoring-rule changes are versioned and must not silently rewrite historical meaning.                                                                                                                   |

# 9. Information and Data Requirements
## 9.1 Core entities
Logical information model

| Entity | Purpose / key relationships |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| User                        | Internal identity; roles, status, sessions, consent, and audit relationships.                                                 |
| Member profile              | Public/private profile fields, skills, education, interests, links, preferences, and visibility.                              |
| Ministry organization       | Official identity, status, contacts, publisher assignments, and owned government projects.                                    |
| Project                     | Common project record with type = government or personal; owner, metadata, status, links, documents, tags, and milestones.    |
| Project version / review    | Immutable snapshot, submission decision, reviewer comment, and approval provenance.                                           |
| Application / participation | Member-to-project relationship, screening response, status, assignment, and timeline.                                         |
| Contribution record         | Evidence, source event, project, member, type, impact tier, verification state, verifier, and recognition outcome.            |
| Repository connection       | GitHub installation, repository ID, granted scope, sync state, cursor, and health.                                            |
| Provider event              | Webhook/reconciliation payload reference, event ID, signature result, delivery time, processing state, and deduplication key. |
| Blog post                   | Author, content, safe rendered form, language, tags, moderation state, versions, and external canonical URL.                  |
| Recognition / badge         | Criteria version, evidence, issuer, issue/revocation state, and visibility.                                                   |
| Notification                | Recipient, type, channel, delivery state, read state, and template version.                                                   |
| Report / moderation case    | Reporter, target, reason, evidence, assignment, decision, appeal, and audit trail.                                            |
| Audit event                 | Actor, action, object, before/after reference, timestamp, source, result, and correlation ID.                                 |

## 9.2 Data classification
Proposed handling classes; align with approved Government of Nepal policy before implementation

| Class | Examples | Handling |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| Public                  | Approved projects, public profiles, published blogs, public contribution acknowledgements.                                                                      | Indexed and publicly available; integrity and moderation controls required.     |
| Internal                | Drafts, review comments, ministry analytics, non-public operational metrics.                                                                                    | Authenticated access; ministry/role boundaries; no public indexing.             |
| Confidential            | Private contact details, applications, moderation evidence, provider connections, security reports.                                                             | Need-to-know access, encryption, restricted logs/exports, defined retention.    |
| Secret / credential     | OAuth tokens, signing keys, session secrets, webhook secrets.                                                                                                   | Dedicated secret storage, never displayed or logged, rotation and access audit. |
| Prohibited for DevNepal | Classified project information, production credentials, citizen records, source data containing PII, exploitable undisclosed vulnerabilities in public content. | Do not collect or publish; route to approved secure systems.                    |

## 9.3 Retention and deletion
- A records schedule shall be approved for profiles, applications, contribution evidence, audit events, provider events, logs, backups, moderation cases, and security reports.

- Public project history should remain available as a transparency record after completion, with personal data minimized.

- OAuth tokens and provider secrets shall be deleted promptly on disconnect/revocation; derived public data shall be handled according to consent and retention notices.

- Backups shall expire according to schedule and shall not become a method of indefinite retention.

- Deletion requests and legal holds shall be recorded, authorized, and verifiable.

# 10. Integration Requirements
External integration inventory

| Integration | Purpose | Required controls |
|-----------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub App / APIs                 | Sign-in/connect, selected repository access, profile/activity import, verified events. | Least privilege, PKCE/state where applicable, expiring tokens, secret vault, signatures, idempotency, rate limits, reconciliation, uninstall handling. |
| Google identity                   | Optional member federated sign-in.                                                     | OIDC validation, approved redirect URIs, minimal claims, provider outage handling.                                                                     |
| Facebook identity                 | Optional member federated sign-in if approved for production.                          | Privacy/security review, minimal claims, provider terms, disable-by-configuration.                                                                     |
| Email service                     | Verification, workflow notifications, digests, security notices.                       | Approved sender domain, SPF/DKIM/DMARC, templates, unsubscribe rules, retry and bounce handling.                                                       |
| Object storage / malware scanning | Project documents, profile/blog media, evidence files.                                 | Private-by-default buckets, signed access, type/size validation, scanning, quarantine, retention.                                                      |
| Observability / incident tools    | Metrics, logs, traces, alerts, incident coordination.                                  | PII/secret filtering, access control, retention, correlation IDs, alert ownership.                                                                     |

# 11. Non-Functional Requirements
Table 11A. Proposed non-functional requirements and acceptance targets

| ID | Requirement | Priority |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| NFR-PERF-01 | Public pages should achieve Largest Contentful Paint <= 2.5 seconds at the 75th percentile on a representative Nepal 4G/mobile profile after the pilot baseline.                                     | Should       |
| NFR-PERF-02 | Read APIs should respond within 500 ms at p95 and write APIs within 1 second at p95 under the approved launch load, excluding third-party provider latency.                                           | Should       |
| NFR-PERF-03 | Webhook receipt shall acknowledge valid deliveries quickly and process asynchronously; verified project activity should appear within 5 minutes at p95 during normal operation.                       | Should       |
| NFR-AVL-01  | The production service target shall be at least 99.5% monthly availability for the initial public release, excluding approved maintenance; higher targets may follow operational maturity.            | Should       |
| NFR-AVL-02  | No single application instance shall be required for service continuity; health checks, graceful degradation, and queued retry shall protect third-party outages.                                     | Must         |
| NFR-DR-01   | A proposed baseline is RPO <= 24 hours and RTO <= 8 hours for launch; PMO shall approve final targets after impact assessment.                                                                      | Should       |
| NFR-SCL-01  | The system shall scale independently for public reads, search, background synchronization, notifications, and file processing.                                                                        | Should       |
| NFR-A11Y-01 | The public and authenticated web experience shall conform to WCAG 2.2 Level AA and be tested with automated and manual methods \[R9\].                                                                | Must         |
| NFR-I18N-01 | The interface shall support English and Nepali, Unicode storage/search, language switching, locale-aware dates, and translation fallback without mixed or broken layouts.                             | Must         |
| NFR-COMP-01 | The web application shall support the latest two stable versions of major evergreen desktop and mobile browsers, with a documented compatibility matrix.                                              | Should       |
| NFR-SEO-01  | Approved public content shall have stable canonical URLs, descriptive metadata, social sharing metadata, sitemap inclusion, and controlled indexing; drafts/private content shall be excluded.        | Should       |
| NFR-OBS-01  | Every request and background job shall have a correlation ID; metrics, logs, traces, and alerts shall identify failure without recording secrets or unnecessary personal data.                        | Must         |
| NFR-MNT-01  | The product shall use documented APIs, migrations, configuration, runbooks, dependency ownership, and automated tests so that government teams can maintain it without a single vendor or individual. | Must         |
| NFR-PORT-01 | Deployment artifacts, configuration, and data exports shall support migration to an approved government-controlled hosting environment.                                                               | Must         |

# 12. Security, Privacy and Legal Requirements
## 12.1 Security baseline
DevNepal is a public government platform with privileged publishing workflows and third-party integrations. Security requirements should be verified against a recognized application standard such as OWASP ASVS and integrated into the development lifecycle using NIST SSDF-style practices \[R10, R11\].

Table 12A. Security requirements

| ID | Requirement | Priority |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| SEC-001 | Apply least privilege to users, services, repositories, databases, storage, and administrative tools; deny by default.                                                                          | Must         |
| SEC-002 | Encrypt network traffic with current TLS and encrypt sensitive data, backups, and secrets at rest using approved key management.                                                                | Must         |
| SEC-003 | Protect OAuth/OIDC flows with validated redirect URIs, state, PKCE where applicable, issuer/audience validation, and secure token storage.                                                      | Must         |
| SEC-004 | Use secure, HttpOnly, SameSite cookies; protect against CSRF, XSS, injection, SSRF, open redirect, path traversal, and unsafe deserialization.                                                  | Must         |
| SEC-005 | Enforce object-level and function-level authorization on every API route, including ministry ownership and moderation actions, addressing API authorization risks highlighted by OWASP \[R12\]. | Must         |
| SEC-006 | Rate-limit and monitor authentication, search, exports, reports, uploads, GitHub callbacks, webhooks, and other abuse-sensitive flows.                                                          | Must         |
| SEC-007 | Validate file type by content, limit size/count, rename safely, scan for malware, quarantine failures, and prevent direct execution.                                                            | Must         |
| SEC-008 | Keep tamper-evident audit records for privileged actions, security changes, approval decisions, data exports, and failed authorization.                                                         | Must         |
| SEC-009 | Run automated unit, integration, authorization, SAST, dependency, secret, container, and DAST checks in CI; block release on defined severity thresholds.                                       | Must         |
| SEC-010 | Generate and retain a software bill of materials using an approved standard such as SPDX, which is an ISO/IEC standard for software component information \[R13\].                              | Should       |
| SEC-011 | Perform independent penetration testing before public launch and after major identity, authorization, upload, or integration changes.                                                           | Must         |
| SEC-012 | Publish a vulnerability disclosure and security contact process; sensitive reports shall never be submitted through public project pages.                                                       | Must         |
| SEC-013 | Define incident severity, on-call ownership, containment, provider-token revocation, evidence preservation, communications, recovery, and post-incident review.                                 | Must         |
| SEC-014 | Repository security posture checks, potentially including OpenSSF Scorecard signals, may inform readiness but shall not be treated as proof that code is secure \[R14\].                        | Could        |

## 12.2 Privacy requirements
- Complete a privacy impact assessment and a data inventory before the production pilot.

- Provide clear notices for account data, public profile fields, applications, GitHub synchronization, analytics, moderation, retention, and data sharing.

- Use explicit, revocable consent for optional public fields and GitHub-derived displays; provider authorization alone is not a substitute for a clear DevNepal notice.

- Minimize collection and avoid publishing contact information, education documents, private contribution details, IP addresses, or moderation evidence.

- Implement access, correction, export, disconnect, and deletion request workflows with identity verification and documented exceptions.

- Restrict production data access to authorized named personnel and log privileged access and exports.

## 12.3 Nepal legal and policy review
Authorized counsel and policy owners must map the final design, terms, consent, records schedule, hosting, and public-release rules to applicable Nepal law and government policy. At minimum, the review should consider the Privacy Act, 2075; Electronic Transactions Act, 2063; Right to Information Act, 2064; National Cyber Security Policy, 2080; intellectual-property and copyright rules; government records rules; and any approved government enterprise architecture, interoperability, hosting, accessibility, and security directives \[R6, R7, R8\].

> **Legal boundary:** This document identifies review topics but does not interpret Nepal law. No project should be opened for public contribution until the owning ministry confirms it has authority and rights to publish the relevant code, documents, data, and task information.

## 12.4 Open-source and contribution policy
- Every government repository shall use a PMO-approved license identified with an SPDX license identifier; the allowed list and default require legal approval \[R13\].

- Each repository shall publish README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, governance/decision guidance, maintainers, release information, and project metadata.

- PMO shall choose and publish a contributor-signoff model. A Developer Certificate of Origin-style sign-off is recommended for low-friction contribution, subject to legal approval; projects needing assignment or special rights may require a CLA.

- Third-party dependencies, generated assets, data, fonts, models, and documentation shall be checked for compatible rights before release.

- Security-sensitive components may use controlled contribution or disclosure workflows even when the broader project is open.

# 13. Community and Content Governance
## 13.1 Required policies
- Terms of use and acceptable-use policy.

- Privacy notice and cookie/analytics notice.

- Community code of conduct with reporting, enforcement, confidentiality, and appeal procedures.

- Government project publication and suitability policy.

- Open-source license and contributor-signoff policy.

- Content moderation, takedown, impersonation, unsafe-link, copyright, and repeat-abuse policy.

- Leaderboard, badge, correction, and anti-gaming policy.

- Vulnerability disclosure and incident communication policy.

- Records retention, deletion, and public archive policy.

Open-source community guidance recommends visible goals, contribution guidance, governance, and a code of conduct to support constructive participation \[R2, R15\].

## 13.2 Moderation principles
- Use the least restrictive action that protects people, the platform, and public trust.

- Separate routine content quality review from security incident handling and legal takedown requests.

- Give the affected user a reason and appeal path unless disclosure would create a security, legal, or safety risk.

- Protect reporters and sensitive evidence; public moderation summaries must not expose them.

- Use documented service levels and escalation for urgent threats, impersonation, malicious files/links, and vulnerable code disclosures.

# 14. User Experience, Accessibility and Localization
## 14.1 Primary navigation
Recommended public information architecture

| Area | Purpose |
|---------------------------|--------------------------------------------------------------------------------------------------|
| Home                      | Mission, featured government projects, contribution paths, impact, and trust signals.            |
| Government Projects       | Search and filter approved ministry opportunities.                                               |
| Community Projects        | Browse member-owned projects, clearly separated from official projects.                          |
| Members                   | Discover public member profiles by skills/interests where members opt in.                        |
| Tech Blogs                | Browse technical writing by topic, language, author, and project.                                |
| Leaderboard / Recognition | Transparent verified-impact views and badge criteria.                                            |
| About / How to Contribute | Mission, process, policies, FAQ, support, code of conduct, and security contact.                 |
| Dashboard                 | Role-specific tasks, drafts, applications, bookmarks, notifications, sync health, and analytics. |

## 14.2 Accessibility requirements
- Meet WCAG 2.2 Level AA for public and authenticated workflows, including keyboard operation, focus visibility, contrast, labels, error recovery, target size, and accessible authentication \[R9\].

- Use semantic headings, landmarks, accessible names, descriptive links, captions/transcripts where needed, and alternative text for meaningful images.

- Do not use color alone for status, contribution heatmaps, or leaderboard changes; provide text/values and high-contrast modes.

- Ensure Markdown-generated blogs and ministry attachments follow accessible authoring guidance and validation.

- Test with keyboard-only use, screen readers, zoom/reflow, reduced motion, Nepali content, and low-bandwidth/mobile conditions.

## 14.3 Bilingual and low-bandwidth behavior
- All platform-owned interface text, validation, core policies, and help shall be available in Nepali and English at launch.

- Government project title and summary should be required in both languages; long descriptions/documents may declare one or both languages until translation capacity is established.

- Search shall match Devanagari and Latin text without corrupting slugs, highlights, or sorting.

- Pages shall remain usable with images disabled or delayed; media shall be optimized, lazy-loaded, and sized responsively.

- Critical actions shall not depend on animation, hover, drag-only interaction, or high-speed connectivity.

# 15. Delivery Scope and Phasing
## 15.1 Phase 0 - policy, discovery and design readiness
- Confirm mandate, product owner, steering committee, participating pilot ministries, project-suitability policy, legal/privacy owners, and hosting authority.

- Validate user journeys with ministry publishers, maintainers, students, experienced developers, non-code contributors, moderators, and people using assistive technology.

- Approve data classification, retention, authentication, GitHub App permissions, repository baseline, licenses, contributor agreement, code of conduct, moderation, metrics, and bilingual content model.

- Prototype and test project publication, discovery, first contribution, verification, and ministry response workflows before full build.

## 15.2 Phase 1 - production MVP
- Three-role authorization with named ministry users, MFA, audit, consent, and account lifecycle.

- Member profiles, skills, education, links, privacy controls, personal projects, and GitHub connection.

- Government project lifecycle, attachments, review, publication, search/filter, bookmarks, application/direct-contribution modes, and updates.

- GitHub App for selected repositories, secure webhooks, reconciliation, verified contribution records, and sync health.

- Safe technical blogs, reporting/moderation, basic badges, and a conservative verified-contribution leaderboard.

- Notifications, role dashboards, bilingual UI, accessibility, analytics, operational monitoring, backups, security testing, and support runbooks.

## 15.3 Phase 2 - ecosystem maturity
- Mentorship cohorts, events/hackathons, team formation, contributor onboarding checklists, and richer recognition.

- Repository readiness automation, public-code metadata validation, security posture signals, and improved project health dashboards.

- Advanced content workflow, editorial curation, external article import where rights and APIs permit, and multilingual authoring support.

- Public project metadata API/open-data export, integrations with approved government portals, and deeper outcome reporting.

## 15.4 Phase 3 - optional capabilities
- Explainable project/member matching based on approved criteria and measured fairness.

- Credential or certificate integrations, subject to identity, fraud, and legal review.

- Native mobile experience only if web usage evidence demonstrates a material unmet need.

- Cross-platform repository providers beyond GitHub based on demand and integration feasibility.

## 15.5 Indicative delivery approach
Use incremental releases: internal alpha, ministry pilot, invited developer beta, public beta, and general availability. Calendar and budget estimates require confirmed team capacity and technology decisions; they should not be committed from this scope document alone. Each gate should include usability, accessibility, security, privacy, content readiness, operations, and support criteria.

# 16. Acceptance and Readiness
## 16.1 Critical end-to-end acceptance scenarios
Launch-critical scenarios

| ID | Acceptance scenario |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A1     | Super Admin provisions a ministry and two named publishers; MFA is enforced; one publisher is revoked without affecting the other; all actions are audited.                                                                                             |
| A2     | A ministry drafts a bilingual project with repository, license, contribution guide, maintainer, milestones, suitability fields, and attachments; Super Admin requests changes; the ministry resubmits; approval publishes exactly the approved version. |
| A3     | A member signs in, configures public profile visibility, connects GitHub with limited scope, lists a personal project, and disconnects GitHub; sync stops and tokens are removed.                                                                       |
| A4     | A member finds a project through Nepali and English search, applies or starts an open task, receives status updates, and sees an auditable timeline.                                                                                                    |
| A5     | A signed GitHub webhook for a merged pull request creates one candidate contribution; duplicate delivery creates no duplicate; the maintainer verifies the result; recognition updates; revocation reverses it with an audit reason.                    |
| A6     | A member submits approved non-code contribution evidence; an authorized maintainer accepts it; the profile credits the correct contribution type without requiring a Git commit.                                                                        |
| A7     | A malicious blog payload and unsafe file/link are rejected or sanitized; the moderation report reaches the correct queue without exposing evidence publicly.                                                                                            |
| A8     | A keyboard and screen-reader user completes registration, project search, application, blog reading, and account settings in Nepali and English with no critical WCAG failures.                                                                         |
| A9     | A GitHub outage does not block public browsing; queued sync resumes without data loss or duplicate credit when service returns.                                                                                                                         |
| A10    | Backup restoration meets the approved RPO/RTO in a documented exercise and security/operations contacts can execute the incident runbook.                                                                                                               |

## 16.2 Production readiness checklist
- Business owner signs off scope, policies, project suitability, pilot ministries, metrics, and support model.

- Security threat model, ASVS-based verification, dependency/SBOM checks, penetration test, and remediation are complete.

- Privacy impact assessment, notices, consent, retention, data-subject workflows, and legal review are approved.

- WCAG 2.2 AA audit and bilingual content QA are complete with no unresolved critical defects.

- Backup/restore, disaster recovery, provider outage, webhook replay, incident response, and privileged-account revocation are tested.

- Ministry maintainers and Super Admins are trained; runbooks, escalation, moderation, and communication templates are available.

- At least a small set of real, contribution-ready pilot projects has active maintainers and starter tasks; the platform must not launch as an empty directory.

# 17. Risks and Mitigations
Principal delivery and operating risks

| Risk | Impact | Primary mitigation |
|-------------------------------------------------------|----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Projects are published but maintainers do not respond | Volunteer trust collapses and listings become stale.     | Require named maintainers, response SLA, readiness review, reminders, stale flags, escalation, pause/archive controls.           |
| Sensitive project/data is exposed                     | Security, legal, and public-trust harm.                  | Suitability checklist, data classification, two-person approval for high-risk changes, no production data, security review.      |
| Leaderboard rewards spam                              | Low-quality contributions and unfair recognition.        | Accepted-impact records, no raw commit score, caps, anomaly review, transparent rules, reversals and opt-out.                    |
| GitHub API limits or outages                          | Stale profiles and contribution records.                 | Webhooks, queues, reconciliation, caching, backoff, rate monitoring, freshness labels, graceful degradation.                     |
| Shared ministry credentials                           | No accountability and high compromise risk.              | Named accounts, MFA, provisioning/revocation, session controls, audit and training.                                              |
| Legal/rights ambiguity                                | Government cannot safely publish or reuse contributions. | Approved licenses, rights checklist, contributor sign-off, dependency review, legal owner, project-by-project clearance.         |
| Platform becomes a social/job site                    | Scope creep, moderation load, mission dilution.          | Clear scope, no direct messaging/jobs/payments in MVP, roadmap governance, outcome metrics.                                      |
| Underrepresentation outside major cities              | National community goal is not achieved.                 | Mobile/low-bandwidth design, bilingual outreach, partnerships, remote contribution, privacy-safe regional metrics.               |
| Toxic behavior or harassment                          | Contributor harm and community attrition.                | Code of conduct, confidential reporting, trained moderators, sanctions, appeals, safety escalation.                              |
| Vendor/individual lock-in                             | Unsustainable operations and high transition cost.       | Open standards, documented code/configuration, infrastructure-as-code, runbooks, data export, government ownership and training. |

# 18. Assumptions, Dependencies and Decisions Required
## 18.1 Assumptions
- DevNepal is sponsored by PMO and participating ministries will designate accountable project owners and maintainers.

- Only contribution-suitable public projects are listed; DevNepal does not grant volunteers access to production systems or sensitive citizen data.

- GitHub is the primary source-code collaboration platform for the initial release, but DevNepal remains conceptually provider-neutral.

- Government projects and community projects remain visually and logically distinct.

- The initial product is a responsive web application with English and Nepali support.

- Final legal, hosting, security, identity, retention, licensing, and branding decisions will be made by authorized Government of Nepal stakeholders.

## 18.2 External dependencies
- PMO governance, product ownership, ministry participation, and timely approval decisions.

- Named ministry maintainers with enough time to review and respond to contributions.

- Approved GitHub organization/repository ownership and ability to install a GitHub App.

- Approved identity providers, government sender domain/email service, hosting, monitoring, storage, secret management, and malware scanning.

- Legal/privacy/security review capacity and approved public policies.

- Bilingual content, translation, accessibility testing, community moderation, training, and launch communications.

## 18.3 Decisions required before build commitment
Decision register with recommended starting position

| Decision | Recommended starting position | Owner |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| Ministry identity model         | One ministry organization with multiple named publisher accounts; never shared credentials.                                                   | PMO / security               |
| Member sign-in providers        | GitHub and Google for MVP; enable Facebook only after privacy/security/operational approval.                                                  | Product / privacy / security |
| GitHub synchronization boundary | Verified events from selected listed repositories; optional annual public contribution calendar with consent; no full private-history mirror. | Product / security           |
| Official recognition            | Accepted impact, including non-code work; no raw commit leaderboard.                                                                          | Steering committee           |
| Government project license      | Use a small approved SPDX allowlist and documented default after legal review; do not allow free-text licenses.                               | Legal / policy               |
| Contributor agreement           | Use low-friction DCO-style sign-off where legally sufficient; CLA only where rights/policy require it.                                        | Legal / open-source lead     |
| Hosting and data residency      | Approved government-controlled production environment with managed secrets, backups, monitoring, and disaster recovery.                       | PMO / MoCIT / DoIT / NITC    |
| Project approval                | Super Admin approval plus specialist security/legal review triggers based on risk fields.                                                     | PMO                          |
| Bilingual content               | Bilingual UI and project title/summary at launch; allow declared-language long documents with translation roadmap.                            | Product / communications     |
| Leaderboard launch              | Pilot privately first; publish only after anti-gaming, opt-out, appeals, and scoring policy are validated.                                    | Product / community          |
| Public member directory         | Opt-in discoverability; public profile visibility controlled field by field.                                                                  | Privacy / product            |
| Retention schedule              | Approve before pilot using purpose-based periods and separate rules for audit/security records.                                               | Records / legal / privacy    |

# Appendix A. Project Field Specification
Government project fields

| Field group | Required information |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Identity          | Project ID, type, title (English/Nepali), slug, ministry, owner, maintainers, official badge.                                                    |
| Public value      | Problem statement, target users, expected public/institutional outcome, success indicators.                                                      |
| Description       | Short summary, detailed description, background, current state, limitations, related initiatives.                                                |
| Contribution need | Workstreams, contribution types, skills, technologies, difficulty, experience, estimated effort, capacity, location/remote, deadline.            |
| How to contribute | Contribution mode, prerequisites, starter tasks/issues, communication channel, application questions, response SLA, code of conduct.             |
| Technical         | Repository/provider, default branch, issue tracker, documentation, architecture, environments, test/build instructions, CI status.               |
| Governance        | Decision model, maintainers, review/merge authority, ownership of outcomes, escalation, completion criteria.                                     |
| Rights            | Approved license/SPDX ID, contributor sign-off model, third-party rights confirmation, content/data license.                                     |
| Security and data | Public-suitability confirmation, data classification, security contact, vulnerability disclosure path, prohibited data/access statement.         |
| Planning          | Status, dates, milestones, dependencies, risks, version/release links, progress updates.                                                         |
| Attachments       | Proposal, requirements, architecture, design, API documentation, research, terms; version, language, accessibility, and classification metadata. |
| Closure           | Outcome summary, deliverables/releases, impact, lessons, credited contributors, archive reason/date.                                             |

# Appendix B. Recommended Repository Readiness Checklist
- Public repository ownership is verified and the ministry has rights to publish the code and documentation.

- README states the problem, status, setup, architecture entry point, roadmap, and public-value outcome.

- LICENSE uses an approved SPDX identifier and matches dependency and asset rights.

- CONTRIBUTING explains setup, issue selection, branch/PR process, testing, review, sign-off, response expectations, and communication.

- CODE_OF_CONDUCT, SECURITY, maintainers/owners, governance, support boundaries, and release process are present.

- Starter issues are labeled and small enough for onboarding; issue templates ask for safe, useful information.

- Protected branches, required review, automated tests, secret scanning, dependency updates, least-privilege workflows, and release integrity controls are configured.

- No credentials, citizen data, private endpoints, security-sensitive configurations, proprietary code, or incompatible assets are present.

- Build/test instructions work from a clean environment and accessibility/localization requirements are documented where relevant.

- Named maintainers have confirmed capacity to respond and verify contributions during the listing period.

# Appendix C. Research Sources
*Sources inform recommended practices and integration constraints. They do not replace Government of Nepal legal or policy approval. Accessed 2 September 2026.*

**R1. Digital.gov - Federal Source Code Policy summary.** [<u>Open source</u>](https://digital.gov/resources/requirements-for-achieving-efficiency-transparency-and-innovation-through-reusable-and-open-source-software/)

**R2. Standard for Public Code - Make contributing easy.** [<u>Open source</u>](https://standard.publiccode.net/criteria/make-contributing-easy.html)

**R3. GitHub Docs - Choosing permissions for a GitHub App.** [<u>Open source</u>](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app)

**R4. GitHub Docs - Using webhooks with GitHub Apps.** [<u>Open source</u>](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/using-webhooks-with-github-apps)

**R5. GitHub Docs - Profile contributions reference.** [<u>Open source</u>](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference)

**R6. Nepal Law Commission - Privacy Act, 2075.** [<u>Open source</u>](https://lawcommission.gov.np/content/12261/12261-the-privacy-act-2075/)

**R7. Nepal Law Commission - Electronic Transactions Act, 2063.** [<u>Open source</u>](https://lawcommission.gov.np/content/13397/)

**R8. MoCIT - National Cyber Security Policy, 2080.** [<u>Open source</u>](https://mocit.gov.np/content/7119/7119-national-cyber-security-policy/)

**R9. W3C - Web Content Accessibility Guidelines (WCAG) 2.2.** [<u>Open source</u>](https://www.w3.org/TR/WCAG22/)

**R10. NIST SP 800-218 - Secure Software Development Framework 1.1.** [<u>Open source</u>](https://csrc.nist.gov/pubs/sp/800/218/final)

**R11. OWASP - Application Security Verification Standard.** [<u>Open source</u>](https://owasp.org/www-project-application-security-verification-standard/)

**R12. OWASP - API Security Top 10 (2023).** [<u>Open source</u>](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)

**R13. SPDX - Software Package Data Exchange standard.** [<u>Open source</u>](https://spdx.dev/)

**R14. OpenSSF - Scorecard.** [<u>Open source</u>](https://scorecard.dev/)

**R15. GitHub Open Source Guides - Starting a project, governance, community, and code of conduct.** [<u>Open source</u>](https://opensource.guide/)

**R16. Nepal Law Commission - Right to Information Act, 2064.** [<u>Open source</u>](https://lawcommission.gov.np/content/13400/rights-of-information-act--2064/)

# Appendix D. Glossary
| Term | Meaning in this document |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| Accepted contribution | A code or non-code contribution approved by an authoritative maintainer or verified by an authoritative repository event.          |
| Contribution evidence | A GitHub event, file, link, review record, or ministry attestation submitted to support verification.                              |
| GitHub App            | A GitHub integration with explicit permissions, repository installations, short-lived tokens, and webhooks.                        |
| Member                | A registered volunteer/community user who may maintain a profile, projects, blogs, and contribution history.                       |
| Ministry Publisher    | A named government officer authorized to act for an assigned ministry organization in DevNepal.                                    |
| Project suitability   | Confirmation that a government project is legally, operationally, technically, and security-appropriate for public contribution.   |
| Super Admin           | The highest platform role responsible for ministry provisioning, project approval, moderation, configuration, and audit oversight. |
| Verified contribution | An accepted contribution whose source, project, contributor mapping, and approval provenance are recorded.                         |

# End of Document
> **Next action:** PMO should hold a requirements validation workshop with the product owner, at least two pilot ministries, security/privacy/legal reviewers, repository maintainers, and representative contributors. Resolve the decision register, update this document to version 1.0, and then derive the product backlog, system architecture, delivery estimate, and test plan.
