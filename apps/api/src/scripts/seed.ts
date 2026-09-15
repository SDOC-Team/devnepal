import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

type SampleMember = {
  githubId: number;
  githubUsername: string;
  displayName: string;
  headline: string | null;
  affiliation: string | null;
  location: string | null;
  bio: string | null;
  links: string[];
  skills: string[];
  status: "pending" | "approved" | "rejected" | "hidden";
  priority: number;
};

const samples: SampleMember[] = [
  {
    githubId: 900101,
    githubUsername: "aashish-khanal",
    displayName: "Aashish Khanal",
    headline: "Backend engineer",
    affiliation: "Open source contributor",
    location: "Kathmandu",
    bio: "Builds public-interest infrastructure. Interested in identity and data systems.",
    links: ["https://github.com/aashish-khanal"],
    skills: ["engineering", "security", "data"],
    status: "approved",
    priority: 10,
  },
  {
    githubId: 900102,
    githubUsername: "priya-sharma",
    displayName: "Priya Sharma",
    headline: "Product designer",
    affiliation: null,
    location: "Pokhara",
    bio: "Design systems, accessibility, and civic interfaces.",
    links: ["https://github.com/priya-sharma"],
    skills: ["ui-ux", "research", "documentation"],
    status: "approved",
    priority: 5,
  },
  {
    githubId: 900103,
    githubUsername: "bikash-gurung",
    displayName: "Bikash Gurung",
    headline: "QA engineer",
    affiliation: null,
    location: "Lalitpur",
    bio: "Testing, release verification, and bug triage.",
    links: [],
    skills: ["qa", "documentation"],
    status: "approved",
    priority: 0,
  },
  {
    githubId: 900104,
    githubUsername: "nisha-tamang",
    displayName: "Nisha Tamang",
    headline: "Nepali localization",
    affiliation: null,
    location: "Biratnagar",
    bio: "Translates and reviews Nepali interface copy.",
    links: [],
    skills: ["localization", "documentation"],
    status: "pending",
    priority: 0,
  },
  {
    githubId: 900105,
    githubUsername: "rejected-sample",
    displayName: "Rejected Sample",
    headline: null,
    affiliation: null,
    location: null,
    bio: null,
    links: [],
    skills: [],
    status: "rejected",
    priority: 0,
  },
  {
    githubId: 900106,
    githubUsername: "hidden-sample",
    displayName: "Hidden Sample",
    headline: null,
    affiliation: null,
    location: null,
    bio: null,
    links: [],
    skills: [],
    status: "hidden",
    priority: 0,
  },
];

type SampleIssue = {
  number: number;
  title: string;
  body: string;
  labels: { name: string; color: string }[];
  authorLogin: string;
  daysAgo: number;
};

const sampleIssues: SampleIssue[] = [
  {
    number: 101,
    title: "Add Nepali labels for every skill in the member directory",
    body: "The skills taxonomy currently renders English slugs. Add Nepali labels and wire them through the i18n catalog.",
    labels: [
      { name: "good first issue", color: "7057ff" },
      { name: "documentation", color: "0075ca" },
    ],
    authorLogin: "voidash",
    daysAgo: 2,
  },
  {
    number: 102,
    title: "Directory search should match Nepali (Devanagari) names",
    body: "Unicode search for display names currently only matches Latin text. Verify NFC normalisation and add tests.",
    labels: [
      { name: "good first issue", color: "7057ff" },
      { name: "accessibility", color: "d4c5f9" },
    ],
    authorLogin: "voidash",
    daysAgo: 3,
  },
  {
    number: 103,
    title: "Document the contribution workflow for first-time contributors",
    body: "Write a step-by-step guide: pick an issue, comment, fork, open a pull request, respond to review.",
    labels: [{ name: "documentation", color: "0075ca" }],
    authorLogin: "voidash",
    daysAgo: 5,
  },
  {
    number: 104,
    title: "Keyboard navigation audit for the member directory",
    body: "Tab order, focus visibility, and skip links need a pass against WCAG 2.2 AA.",
    labels: [{ name: "accessibility", color: "d4c5f9" }],
    authorLogin: "voidash",
    daysAgo: 6,
  },
  {
    number: 105,
    title: "Profile editor: show validation errors inline per field",
    body: "Server errors currently surface in a summary box. Map them back to the offending fields.",
    labels: [{ name: "help wanted", color: "008672" }],
    authorLogin: "voidash",
    daysAgo: 8,
  },
  {
    number: 106,
    title: "Avatar fallback: render initials when the image is missing",
    body: "Members without an uploaded GitHub avatar must still render a usable card.",
    labels: [{ name: "good first issue", color: "7057ff" }],
    authorLogin: "voidash",
    daysAgo: 9,
  },
  {
    number: 107,
    title: "Add rate-limit handling for the GitHub issue sync",
    body: "When the REST API returns 403 with a rate-limit body, back off and surface the reset time.",
    labels: [{ name: "help wanted", color: "008672" }],
    authorLogin: "voidash",
    daysAgo: 11,
  },
  {
    number: 108,
    title: "Write tests for the admin moderation queue",
    body: "Cover approve, reject, hide, priority changes, and non-admin denials end to end.",
    labels: [{ name: "documentation", color: "0075ca" }],
    authorLogin: "voidash",
    daysAgo: 13,
  },
];

async function main(): Promise<void> {
  const { db } = await import("../db/client");
  const { githubIssues, members, projects } = await import("../db/schema");

  for (const sample of samples) {
    const approved = sample.status === "approved";
    await db
      .insert(members)
      .values({
        ...sample,
        approvedAt: approved ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: members.githubId,
        set: {
          githubUsername: sample.githubUsername,
          displayName: sample.displayName,
          headline: sample.headline,
          affiliation: sample.affiliation,
          location: sample.location,
          bio: sample.bio,
          links: sample.links,
          skills: sample.skills,
          status: sample.status,
          priority: sample.priority,
          approvedAt: approved ? new Date() : null,
        },
      });
  }

  const projectRows = await db
    .insert(projects)
    .values({
      githubRepoId: 1368200551,
      fullName: "voidash/gov-portal",
      title: "Dev Nepal",
      description:
        "The Government of Nepal public collaboration portal: member directory and contribution index.",
      htmlUrl: "https://github.com/voidash/gov-portal",
      isActive: true,
    })
    .onConflictDoUpdate({
      target: projects.githubRepoId,
      set: {
        fullName: "voidash/gov-portal",
        title: "Dev Nepal",
        htmlUrl: "https://github.com/voidash/gov-portal",
        isActive: true,
      },
    })
    .returning();
  const project = projectRows[0];
  if (project === undefined) {
    throw new Error("Failed to seed the project row");
  }

  const now = Date.now();
  for (const issue of sampleIssues) {
    const createdAt = new Date(now - issue.daysAgo * 24 * 60 * 60 * 1000);
    const values = {
      projectId: project.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: "open",
      labels: issue.labels,
      authorLogin: issue.authorLogin,
      authorAvatarUrl: null,
      htmlUrl: `https://github.com/voidash/gov-portal/issues/${issue.number}`,
      commentsCount: 0,
      source: "sample",
      createdAtGithub: createdAt,
      updatedAtGithub: createdAt,
      syncedAt: new Date(),
    };
    await db
      .insert(githubIssues)
      .values(values)
      .onConflictDoUpdate({
        target: [githubIssues.projectId, githubIssues.number],
        set: {
          title: values.title,
          body: values.body,
          state: values.state,
          labels: values.labels,
          authorLogin: values.authorLogin,
          htmlUrl: values.htmlUrl,
          source: values.source,
          updatedAtGithub: values.updatedAtGithub,
          syncedAt: new Date(),
        },
      });
  }

  console.log(
    `Seeded ${samples.length} sample members, 1 project, and ${sampleIssues.length} sample issues.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
