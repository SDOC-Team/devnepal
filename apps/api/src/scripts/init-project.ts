import { config as loadEnv } from "dotenv";
import { ne } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv();

const GITHUB_API = "https://api.github.com";
const DEFAULT_REPOSITORY = "SDOC-Team/devnepal";

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  license: { spdx_id: string | null } | null;
};

function isGitHubRepository(value: unknown): value is GitHubRepository {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const license = candidate.license;
  const validLicense =
    license === null ||
    (typeof license === "object" &&
      license !== null &&
      (typeof (license as Record<string, unknown>).spdx_id === "string" ||
        (license as Record<string, unknown>).spdx_id === null));

  return (
    typeof candidate.id === "number" &&
    Number.isSafeInteger(candidate.id) &&
    candidate.id > 0 &&
    typeof candidate.name === "string" &&
    candidate.name.length > 0 &&
    typeof candidate.full_name === "string" &&
    candidate.full_name.length > 0 &&
    typeof candidate.html_url === "string" &&
    candidate.html_url.startsWith("https://github.com/") &&
    (typeof candidate.description === "string" || candidate.description === null) &&
    validLicense
  );
}

function repositoryFromEnvironment(): string {
  const value = process.env.GITHUB_PROJECT_REPOSITORY?.trim() || DEFAULT_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) {
    throw new Error("GITHUB_PROJECT_REPOSITORY must use the GitHub owner/repository format");
  }
  return value;
}

async function fetchRepository(fullName: string): Promise<GitHubRepository> {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "devnepal-project-init",
    "x-github-api-version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token !== undefined && token.length > 0) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API}/repos/${fullName}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub repository request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isGitHubRepository(payload)) {
    throw new Error("GitHub repository response did not match the expected structure");
  }
  if (payload.full_name.toLowerCase() !== fullName.toLowerCase()) {
    throw new Error(`GitHub returned ${payload.full_name} while initializing ${fullName}`);
  }
  return payload;
}

async function main(): Promise<void> {
  const requestedRepository = repositoryFromEnvironment();
  const repository = await fetchRepository(requestedRepository);
  const [{ db }, { projects }, projectRepository, { syncProjectIssues }] = await Promise.all([
    import("../db/client"),
    import("../db/schema"),
    import("../server/projects/repository"),
    import("../server/projects/sync"),
  ]);

  await projectRepository.upsertProject({
    githubRepoId: repository.id,
    fullName: repository.full_name,
    title: repository.name,
    description: repository.description,
    htmlUrl: repository.html_url,
    license: repository.license?.spdx_id ?? null,
    isActive: true,
  });
  await db
    .update(projects)
    .set({ isActive: false })
    .where(ne(projects.githubRepoId, repository.id));

  const result = await syncProjectIssues();
  console.log(
    `Initialized ${repository.full_name} and synced ${result.synced} issues ` +
      `(skipped ${result.skippedPullRequests} pull requests).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Project initialization failed:", error);
    process.exit(1);
  });
