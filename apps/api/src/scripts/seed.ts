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

async function main(): Promise<void> {
  const { db } = await import("../db/client");
  const { members } = await import("../db/schema");

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

  console.log(
    `Seeded ${samples.length} sample members (3 approved, 1 pending, 1 rejected, 1 hidden).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
