# devNepal Portal — Product Requirements, v0.1

**The full product scope is in [PRD.md](./PRD.md)** — this release covers roughly a fifth of it. Where the two disagree, this document governs.

---

## 1. Purpose

devNepal is where the Government of Nepal publishes technology work that anyone can help build.

v0.1 establishes that it exists, that it is credible, and that contributing is genuinely possible. It does not onboard ministries or run the full contribution lifecycle.

---

## 2. Users

**Contributor** : someone whose work has been accepted on Github; no account needed on devNepal Portal.

**Member** : someone who has a devNepal Portal account; no contribution needed on Github.

| User | Needs from v0.1 | Not yet |
|---|---|---|
| **Contributor** | To find work matched to their skill and start without permission | — |
| **Member** | A public profile under their own name, showing their contributions once they exist | Scoring, badges, rankings |
| **Citizen or journalist** | To judge whether this is real and credible| Ministry-level browsing |

A ministry official is not a v0.1 user.

---

## 3. Scope

### In

Each row states what must be built, in enough detail to design and implement from. The `Traces to` column references requirements in the full PRD v0.9. A reduced or adapted reference does not imply that the entire original requirement is included; new v0.1 behaviour is labelled explicitly.

| # | Capability | What it means | Traces to |
|:--|:-----------------|:--------------------------------------------------------------------|:--------|
| 1 | **Sign in with GitHub** | One button. A visitor authorises devNepal to read their public GitHub profile and nothing more, then returns to the site signed in. On first sign-in a profile record is created for them, holding their GitHub username, display name and avatar URL. No password is ever set, stored or reset — there is no email sign-up and no credentials form anywhere in the product | `AUTH-001` reduced; `AUTH-008` |
| 2 | **Member profile, self-edited** | A signed-in member can set a display name, a one-line headline, an organisation or university, a location, a short biography, and up to five links to their own sites. **Each field is optional and labelled as such.** A profile with nothing filled in may be declined, because a reviewer has nothing to assess — the interface should say so rather than letting someone submit an empty profile and wait. The biography is plain text, not formatted | `MEM-002` reduced; `MEM-003` adapted; `MEM-006`, `MEM-007`, `MEM-009` |
| 3 | **Approval before a profile is public** | A new or materially edited profile is *pending*: visible to its owner, invisible to everyone else, and returning 404 on its public URL. An administrator reviews it and approves or hides it. The member is told, on the edit page, that this is happening and roughly how long it takes. Review looks for impersonation and abuse, and may decline a profile where something appears inaccurate. **It is not a verification** — no claim is confirmed, and an approval means only that nothing obviously wrong was found | `ADM-002` reduced; new v0.1 profile approval rules |
| 4 | **Public member directory** | One page listing every approved profile as a card: avatar, display name, headline, organisation, location, and a link to that person's GitHub account. Newest approval first. A disclaimer stating that roles and organisations are self-declared is visible without scrolling. No email address appears, and no per-member counts of any kind | New v0.1 member-directory requirement |
| 5 | **Public member profile page** | One page per member at a stable URL based on their GitHub username, showing everything from row 2 plus their recent work if they have any. If they have none, that section is **absent rather than empty**, since most members will legitimately have none in the first weeks | `MEM-001`; `MEM-005` reduced; new v0.1 public-activity display |
| 6 | **Recent activity on the home page** | Above the fold: three counts describing the programme, and about ten recent events, each written as a readable sentence naming the person. | `GIT-007`, `GIT-008` adapted; new v0.1 programme totals |
| 7 | **Open issues on the contribute page** | A list of work currently available, read from GitHub, showing title, which repository, and its labels. Each links to the issue on GitHub, where claiming and contributing actually happen. A list, not a filterable browser | `DSC-001` adapted to GitHub issues |
| 8 | **Bilingual throughout** | Every page exists in Nepali and English at separate URLs, and **no page ships in only one language**. Nepali is not a translation layer added afterwards: it has its own line-height, because Devanagari needs more vertical space than Latin, and dates are shown in Bikram Sambat. Every string lives in a translation file rather than in the code | `NFR-I18N-01`; new v0.1 Bikram Sambat display rule |
| 9 | **Stable human-readable URLs** | Addresses are readable and permanent — `/en/members/username` rather than an opaque identifier. If a member changes their GitHub username, the old address keeps working by redirect. Retrofitting this later breaks every link already shared | `MEM-001`; `NFR-SEO-01`; new v0.1 username redirects |
| 10 | **Vulnerability disclosure path** | A published route for reporting a security problem privately, with a stated acknowledgement time of 24 hours. In v0.1 this is GitHub's private vulnerability reporting, because a dedicated address is not yet provisioned | `SEC-012` |
| 11 | **Repository ready for contribution** | The repository carries everything a stranger needs before contributing: licence, contribution guide, code of conduct, security policy, governance, named code owners, and issue and pull-request templates. Local setup works from a clean machine in under ten minutes | `BR-003` |
| 12 | **Server-rendered and search-visible** | Pages render on the server, so content is present without client-side JavaScript, is indexable, and loads quickly on a phone over a mobile connection. This is a baseline for a public government service, not an optimisation | `NFR-SEO-01`, `NFR-PERF-01` |
| 13 | **Administrative approval view** | A list of profiles, pending first, showing each member's claims alongside a link to their GitHub account that opens in a new tab, and the age of that account. Two actions: approve, hide. Each records who acted and when. The GitHub link is the whole control — it must be one click, or it gets skipped under volume | `ADM-002` reduced; `SEC-008` |

Nothing in v0.1 is stubbed, faked or seeded with placeholder content.

### Out

| Deferred | Reason |
|---|---|
| Ministry publishing workflow (`GOV-*`) | Needs a named Product Owner per project |
| GitHub App, webhooks (`GIT-001`–`006`) | Public API read covers the display need |
| Recognition, badges, scoring (`REC-001`, `002`, `005`–`008`) | Needs verified contribution records |
| Leaderboards, rankings, per-person counts (`REC-003`) | Invites gaming; makes a legitimate zero look like a failing |
| Notifications (`NTF-*`) | Nothing to notify about |
| Moderation queues (`ADM-003`, `004`) | No user-generated content at this scale |
| Search and filtering (`DSC-002`) | Nothing to search at fifteen profiles |
| Member blogs (`BLG-*`), community projects (`PPR-*`) | Content-moderation surface disproportionate to the value |
| A dedicated activity page | The home-page strip carries the value while there is one repository. Returns when there are several |
| Activity charts, filters, graphs | GitHub Insights is free, public and better. Linked to instead |
| Contributor standing labels — maintainer, reviewer | Nobody is promoted in v0.1. Designed for, not populated |
| Separate project page | One project. Open issues live on the contribute page |
| Skills taxonomy, featured ordering, profile preview | Cosmetic |
| Stipends, bounties | Blocked on the procurement legal opinion |

### 3.1 Activity — full definition

**What an event is.** A pull request merged or opened, or an issue opened or closed, in any public repository of the organisation. Nothing else — in particular **not comments**, which are high in volume and low in signal.

**How an event is displayed.** As a sentence a non-developer can read, with the date in Bikram Sambat and a link to the original on GitHub:

> **12 Bhadra** — Sunita Rai improved the Nepali translation of the contribute page

**On the home page:** three counts describing the programme — pull requests merged, open issues, and the number of distinct people who have contributed — then about ten events, newest first, and a prominent link to GitHub Insights for anyone wanting statistics.

**On a member profile:** that member's own events, newest first, matched to their GitHub account rather than self-declared. The section is absent when there are none.

**Freshness.** Data is refreshed on a schedule, not live. Every view states how old it is — *"as of 12 minutes ago"*. If a refresh fails, the previous data is shown with its age; **the page never goes blank**, because an empty credibility page is worse than a stale one.

**Not shown:** comments, charts, graphs, filters, per-person counts, rankings, bot activity, or anything from a private repository.

**Why the portal shows this at all**, given GitHub Insights exists and is better: aggregation across repositories, plain language for a non-developer, Nepali, and real names attached to GitHub usernames.

### 3.2 What a public visitor's experience looks like

A visitor arrives with one of two questions — *is this real?* or *can I help?* — and the site does not know which. Every page has to answer both without asking anything of them.

1. Arrives on the home page, signed out. Nothing is asked of them: no account, no cookie banner, no interstitial
2. Understands within a minute what devNepal is, from the hero and three steps explaining how it works
3. **Above the fold, sees that work is actually happening** — three counts and about ten recent events, each naming a real person and linking out to GitHub. This is what answers *is this real?*, and it is checkable in one click without a GitHub account or knowing what a pull request is
4. Can follow any event to the original on GitHub, and read the actual change and discussion
5. Goes to the members directory to see who is behind it. Each profile links to that person's GitHub account, so every claim is independently verifiable — the site does not ask to be trusted
6. Goes to the contribute page to find work. Open issues are listed with their labels; each links to GitHub, where claiming and contributing happen
7. Reads *what we are not building yet* on the home page, and learns what is deliberately absent rather than wondering what is missing
8. Contributes — **without ever creating an account here.** A profile is something they may want afterwards, never a gate before. From here the sequence continues in the contributor's section below.

**Every page works signed out**, and no page withholds content behind a sign-in. The only signed-in surfaces are editing your own profile and the administrative approval view.

If a visitor follows a stale or shared link to a profile that is pending or hidden, they see *not found* — never an error page and never a confirmation that the profile exists.

The thing most often built badly here is step 3. A home page that describes intentions rather than showing evidence leaves a sceptical reader with nothing to check, and that reader is the one who decides whether the launch is credible.

### 3.3 What a contributor's experience looks like

**Six of the nine steps happen on GitHub, not here.** That is the honest shape of the product: the portal's job is to help someone find work and to collect the credit afterwards. The work itself, and every review, happens where the code is.

1. **Finds an issue** — from the contribute page here, or directly on GitHub
2. **Reads it and can start without asking a question.** Context, what is in and out of scope, testable acceptance criteria, where to look, and a named mentor. An issue missing any of these is not ready to be claimed
3. **Claims it by commenting.** A maintainer assigns it. If there is no activity for 14 days a bot unassigns it, so issues do not sit idle — this is never a judgement, and it can be claimed again
4. **Works on their own fork**, branches from `main`, and opens a pull request with every commit signed off
5. **Gets a human response within three days**, and is told which review lane the change falls into — so they know whether to expect a merge this week or after the weekend session
6. **Iterates if asked.** A maintainer approves; the government team merges
7. **Is credited in the repository history**, whether or not they ever create a profile here
8. **Optionally creates a profile**, at which point their merged work appears on it automatically — they do nothing to make that happen
9. **Comes back, or does not.** What decides it is almost never the difficulty of the work

**Step 2 is where contribution is won or lost.** A contributor who has to ask three questions before starting usually does not start, and the out-of-scope line is what protects their weekend from a change we would decline.

**Step 5 is where they are lost.** Silence is worse than a slow merge, and a decline without an explanation of what would have been accepted is worse than both. Whatever else slips, the three-day response does not.

**Non-code contributors follow the same path.** A translation review, an accessibility audit or a documentation fix is claimed, reviewed and credited identically. Nothing about this sequence assumes the contribution is code.

### 3.4 What a member's experience looks like

A designer and developer need this as a sequence, not a feature list.

1. Arrives at the sign-in page. One button, one line naming the permission requested
2. Authorises on GitHub, returns signed in
3. Lands on their own profile edit page, with a banner explaining that the profile is pending review and will be public once approved
4. Fills in the fields they choose. Saves. The banner persists. An entirely empty profile is not submittable
5. An administrator approves. The profile becomes public and appears in the directory
6. Later, once they have contributed, their work appears on the profile automatically — they do nothing to make that happen
7. At any point they can change their details, hide their profile, or delete it. Editing the headline or organisation returns it to pending, and they are told so

Step 3 is the one most often built badly: without that banner a member fills in a profile, sees nothing public, and concludes the site is broken.

---

## 4. Success criteria

Measured at the launch gate.

| Measure | Target |
|---|---|
| Approved member profiles | ≥ 15. Below this the directory reads as abandoned rather than new |
| Merged pull requests from outside the core team | ≥ 8 |
| Members whose profile shows a contribution | ≥ 3 |
| Every contribution acknowledged | Within 3 days of being opened, without exception. Acknowledgement means a human reply, not a label |
| Bilingual completeness | 100% of shipped pages |
| Structural accessibility | Every item met on every shipped page |
| Open security findings | 0 |
| Clone to running locally | Under 10 minutes on a machine that has never seen the project, following only the written instructions |
| Activity record freshness | Under 30 minutes behind GitHub, with the age always displayed |

Not measured: page views, sign-ups, stars, lines of code.

**If the first four are not met, the launch is delayed.**

### 4.1 Accessibility

**Required in v0.1.** Each is cheap now and expensive to retrofit, because it is structural rather than cosmetic.

| Requirement | What it means in practice |
|---|---|
| Semantic HTML | Real headings in order, landmarks, lists, and native buttons and links rather than styled `div`s. This is what assistive technology navigates by |
| Keyboard operability | Every action reachable and completable without a mouse, in a sensible order, with no element that traps focus |
| Visible focus | A clearly visible indicator on whatever is focused, meeting 3:1 contrast against its surroundings. Nothing removes the outline without replacing it |
| Contrast, measured | Every text-on-background pair checked with a tool, not judged by eye, in light and dark |
| Correct `lang` | Set on the page, and on any element whose language differs from it. Without it a screen reader reads Devanagari as English |
| Alternative text | On every image, including avatars |

**Deferred to a later release, and stated publicly as deferred.** Additive work that does not change the structure:

full WCAG 2.2 AA audit and conformance statement · manual screen-reader pass · reduced-motion handling · AA coverage across every component state.

**No conformance claim is made until it has been tested.** Fixing contrast is a one-line change at any point; retrofitting semantic markup across a built site is a rewrite.

---

## 5. Principal risk

The directory publishes **self-declared affiliations on a `gov.np` domain**. A false claim would make the government the publisher of a false statement about a named person and a named organisation.

Three controls, all mandatory:
1. **Approval before display.** A profile is `pending` until an administrator approves it, and returns 404 publicly until then. Review looks for impersonation and abuse, and may decline a profile where something appears inaccurate. **Approval is not verification** — no claim is confirmed, and nothing about an approved profile is warranted by the government
2. **Self-declared labelling.** Wherever an organisation or role appears — card, profile, administrative view — a visible line states that it is provided by the member and not verified by the Government of Nepal. On the directory it is visible without scrolling
3. **No email, no organisational voice.** Email addresses never appear in any page or response. A profile may describe an individual's role; it may not be written as though the organisation itself is speaking

The link to a member's GitHub account is the trust mechanism, because it lets any reader verify independently. It is prominent on the card, the profile, and the administrator's approval view.

---

## 6. Constraints

| | |
|---|---|
| Personal data | Only GitHub identity and what a member volunteers. Email is stored for account contact and **never** appears in any page, response or log |
| No file uploads | Avatars are loaded from GitHub by URL. Nothing is uploaded to us, which removes file storage, malware scanning and content-type validation from this release entirely |
| One server-side credential | Reading public GitHub data at a usable rate needs a token. It is server-side, holds no permissions, and can read nothing a signed-out visitor could not already see |
| Bilingual is a gate | A page does not ship in one language. This constrains scope: every capability costs its Nepali translation and a native-speaker review |
| Stack | Chosen for depth of the local hiring pool, which outranks the team's own preference. The government must be able to hire maintainers in Kathmandu in three years |

---

## 7. What unblocks each deferred capability

For the deferrals, what has to be true before they can be taken up.

| Deferred capability | Unblocked by |
|---|---|
| Ministry publishing workflow | A named Product Owner in a department, with allocated hours |
| Verified contributions, recognition, badges | Independent security review of the identity layer |
| Notifications | Something worth notifying a member about — in practice, recognition or ministry projects |
| Moderation queues | User-generated content, which arrives with blogs or community projects |
| Search and filtering | Roughly fifty profiles |
| A dedicated activity page | Several repositories worth aggregating |
| Contributor standing labels | The first promotions |
| Stipends, bounties | The procurement legal opinion |

---
