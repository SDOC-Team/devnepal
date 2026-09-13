# Contributing to devNepal

devNepal welcomes volunteer contributions to open-source government software projects in Nepal. Contributions include code, documentation, design, accessibility testing, bug reports, and practical feedback from people who use public services.

This guide covers work on the devNepal platform itself. Other projects listed on devNepal may have their own contribution guides, licenses, and review processes. Follow the instructions in the repository you are contributing to.

Work on this repository uses GitHub issues, pull requests, and reviews, so you need a GitHub account to take part. You do not need a devNepal account. The planned contribution index will record public work in participating repositories without automatically creating devNepal accounts or profiles. If you later sign in with or connect the relevant GitHub account, devNepal will show you its indexed history after verifying that you control the account.

The planned devNepal platform will also support member comments and feedback using email or supported sign-in services, including Google and Facebook, without requiring GitHub. Only authorised government bodies will be able to create projects on devNepal. A connected GitHub account will be required for members taking part as developers or repository contributors. See the [privacy notice](PRIVACY.md) for account and profile information. The steps below cover contributions through GitHub.

## Start with a clear task

For a project listed on devNepal, check its current stage. New projects first recruit a founding team to establish the design and a maintainable foundation. SDOC selects applicants based on experience, and recognises those who demonstrate good work as maintainers. Each founding team includes a representative of the government office that will use the software and an SDOC representative acting as administrator. Follow the listing's application instructions if you want to help lead that work; send application information through the route specified by SDOC.

Once the foundation is ready, the team publishes issues for defined milestones and opens public task contributions.

Use the project's GitHub issues to find work, ask questions about a task, or propose an improvement. Read the existing discussion before starting. Labels can help when they are available, but the issue description should explain what needs to change and how to tell when it is done.

Comment on the issue with what you intend to do. For a substantial change, agree on scope with a maintainer before investing significant time. For a small correction, such as a typo or broken link, a focused pull request is enough.

If the task is unclear, ask a specific question in the issue. If someone is named as its mentor, they are the first person to ask about that task. Do not assume that an unassigned issue has no work in progress; check its recent comments and linked pull requests.

Application code and verified setup instructions have not yet been added to this repository. Documentation and task clarification are useful starting points while that work is being prepared. Before starting code work, check that the issue has a working starting point and the instructions needed to run and check the relevant code.

## Describe the problem

Search existing issues before opening a new one. A useful bug report includes:

- What you were trying to do and where the problem occurred.
- Steps that someone else can follow to reproduce it.
- What you expected and what actually happened.
- Relevant environment details, such as browser, device, or version.
- A small, safe example or screenshot when it helps explain the problem.

For an improvement, explain who it helps, the problem they face, and the result you want. Describe the need before proposing a particular implementation.

Before marking a task ready for contributors, maintainers should add its scope and exclusions, testable acceptance criteria, relevant files and examples, expected checks, dependencies, estimated effort, and a mentor who has agreed to help. You can report a problem or propose an idea without having all these details.

## Make a focused contribution

Keep each change tied to one outcome. Follow the surrounding code or writing style, and avoid unrelated cleanup that makes the change harder to review. Explain any dependency or scope change in the issue before expanding the work.

For code, work on a separate branch in your fork or in the repository if you have access. Use the documented setup and validation commands once they are available. If an instruction is missing or fails, report the exact problem in the issue with sensitive information removed.

For documentation, edit the relevant file and explain what was unclear or incorrect. For design, accessibility findings, or other work that does not need a code change, put the proposed result and supporting evidence in the issue. Agree on the deliverable before preparing substantial work. You do not need to create an empty pull request for a contribution that can be reviewed in the issue.

English documentation and site copy are the current priority. Nepali translation and review are planned for later; agree on scope before starting that work.

## Check the result

Choose checks that show whether the change solves the problem:

- For code, run the relevant documented checks and add or update tests when they are needed to verify changed behavior.
- For documentation, check accuracy, links, spelling, and the rendered page. Try any instructions you change.
- For interface changes, check the affected screen on a small display and with a keyboard. Include other accessibility checks relevant to the change.
- For a bug fix, repeat the original reproduction steps and record the result.

In the submission, state what you checked, what happened, and anything you could not verify, including missing tools or instructions.

## Submit and work through review

Open a pull request when the work changes repository files. Link the issue if there is one, give the change a descriptive title, and explain the problem, the result, and the checks performed. Include screenshots for visual changes when useful, using fictional data. Mark unfinished work as a draft and say what feedback you need.

Keep questions and decisions in the issue or pull request so the next contributor can follow them. Respond to review comments by making the change or explaining your reasoning. It is fine to ask a reviewer to clarify a request or to explain a different approach.

Acceptance depends on the agreed scope and the maintainer's review. Review contacts and response expectations are still being arranged; no response deadline is established yet. If you need to follow up, use the existing thread. If you can no longer finish a task, leave a short note describing what remains so someone else can continue.

The proposed review and merge rules cover protected branches, independent review, required checks, and merge authority. The proposed baseline uses at least one independent approval and squash merges, with fresh review when the work changes. Each repository must publish and configure its agreed requirements; technical review and merge permission are separate from founding-team selection and SDOC's administrative role.

Preserve attribution when building on someone else's work. Acknowledge collaborators using names or handles they have agreed to share. Record accepted code and non-code work in its GitHub issue or pull request so contributors have a clear record of the result.

## Keep public contributions safe and respectful

Treat issues, pull requests, files, screenshots, and logs as public. Use fictional people and sample data. Remove credentials, tokens, private email addresses, citizen records, private endpoints, and other confidential details before sharing. Only submit code, text, images, or data that you have the right to share; identify the source of any third-party material.

Do not post suspected vulnerabilities, exploit details, or private conduct reports in a public issue. These reports should go to the team designated by SDOC. Private reporting contacts have not yet been published; until they are available, ask a maintainer for the reporting route without including sensitive details. Repository access does not itself authorise someone to handle confidential reports or personal data.

Discuss the work with care for the people doing it. Be specific about problems, explain disagreements, and give contributors room to ask questions. Harassment, personal attacks, and sharing someone else's private information have no place here.
