# Security Policy

## Reporting a vulnerability

**Do not open a public issue.**

### Use GitHub private vulnerability reporting

Go to the **Security** tab of this repository → **Report a vulnerability**. Your report is visible only to the maintainers.

This is the fastest route and it works today. *(A dedicated `security@pmdevcore.gov.np` address is being provisioned and will be published here once it is live and monitored. Until then, please use the GitHub route — we would rather give you a channel that works than an address nobody is reading.)*

### What to include

- What you found
- How to reproduce it
- What it affects, and what an attacker could do with it

| | |
|---|---|
| Acknowledgement | **Within 24 hours** |
| Initial assessment | Within 5 working days |
| Coordinated disclosure window | 90 days |

We will publish an advisory after remediation and credit you, unless you prefer otherwise.

---

## Scope

**In scope:** this repository, and the deployed portal at <https://pmdevcore.gov.np/>.

**Out of scope:** other government systems — each has its own disclosure path. Also out of scope: denial of service, social engineering, and automated scanner output without a demonstrated impact.

---

## Safe harbour

We will not pursue action against good-faith security research that:

- Respects the privacy of others — do not access, modify or retain data belonging to another person
- Avoids degrading the service
- Gives us reasonable time to remediate before public disclosure

If you are unsure whether something is in scope, ask first through the private reporting channel.

---

## For contributors

**Never commit a secret.** If you believe a credential has been exposed, report it privately and immediately — do not open an issue or a pull request describing it.

If you find a security problem while working on an unrelated issue, stop and report it privately. A public fix is a public disclosure.
