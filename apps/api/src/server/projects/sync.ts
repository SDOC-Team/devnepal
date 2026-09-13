import type { NewGithubIssue } from "@/db/schema";

import * as repo from "./repository";

const GITHUB_API = "https://api.github.com";
const PER_PAGE = 100;
const FALLBACK_LABEL_COLOR = "ededed";

type GithubApiLabel = string | { name?: string; color?: string };

export type GithubApiIssue = {
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: GithubApiLabel[];
  user: { login: string; avatar_url: string } | null;
  html_url: string;
  comments: number;
  created_at: string;
  updated_at: string;
  pull_request?: unknown;
};

export type SyncResult = {
  synced: number;
  skippedPullRequests: number;
};

function normalizeColor(color: string | undefined): string {
  return color !== undefined && /^[0-9a-fA-F]{6}$/.test(color) ? color : FALLBACK_LABEL_COLOR;
}

function normalizeLabels(labels: GithubApiLabel[]): { name: string; color: string }[] {
  return labels.map((label) =>
    typeof label === "string"
      ? { name: label, color: FALLBACK_LABEL_COLOR }
      : { name: label.name ?? "label", color: normalizeColor(label.color) },
  );
}

export function mapGitHubIssue(issue: GithubApiIssue): Omit<NewGithubIssue, "projectId"> {
  return {
    number: issue.number,
    title: issue.title.slice(0, 300),
    body: issue.body,
    state: issue.state === "closed" ? "closed" : "open",
    labels: normalizeLabels(issue.labels ?? []),
    authorLogin: issue.user?.login ?? "ghost",
    authorAvatarUrl: issue.user?.avatar_url ?? null,
    htmlUrl: issue.html_url,
    commentsCount: issue.comments ?? 0,
    source: "github",
    createdAtGithub: new Date(issue.created_at),
    updatedAtGithub: new Date(issue.updated_at),
  };
}

/**
 * Reconciles the single project's issues from the public GitHub REST API.
 * Idempotent: upserts by (project, number) and replaces sample fixtures.
 * `fetchImpl` is injectable so tests never touch the network.
 */
export async function syncProjectIssues(
  options: { fetchImpl?: typeof fetch } = {},
): Promise<SyncResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const project = await repo.findActiveProject();
  if (project === null) {
    throw new Error("No active project to sync; seed the database first");
  }

  const [owner, name] = project.fullName.split("/");
  if (owner === undefined || name === undefined) {
    throw new Error(`Invalid project repository name: ${project.fullName}`);
  }

  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "gov-portal-sync",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token !== undefined && token.length > 0) {
    headers.authorization = `Bearer ${token}`;
  }

  const collected: Omit<NewGithubIssue, "projectId">[] = [];
  let skippedPullRequests = 0;
  let page = 1;

  for (;;) {
    const response = await fetchImpl(
      `${GITHUB_API}/repos/${owner}/${name}/issues?state=all&per_page=${PER_PAGE}&page=${page}`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }
    const batch = (await response.json()) as GithubApiIssue[];
    if (!Array.isArray(batch)) {
      throw new Error("Unexpected GitHub API response shape");
    }
    for (const issue of batch) {
      if (issue.pull_request !== undefined) {
        skippedPullRequests += 1;
        continue;
      }
      collected.push(mapGitHubIssue(issue));
    }
    if (batch.length < PER_PAGE) {
      break;
    }
    page += 1;
  }

  await repo.upsertIssues(project.id, collected);
  await repo.deleteSampleIssues(project.id);
  await repo.touchProjectSynced(project.id);

  return { synced: collected.length, skippedPullRequests };
}
