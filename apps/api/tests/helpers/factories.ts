import { db } from "@/db/client";
import type { GithubIssue, IssueLabel, Member, MemberStatus, Project } from "@/db/schema";
import { githubIssues, members, projects } from "@/db/schema";

export const ADMIN_GITHUB_ID = 424242;

let sequence = 0;

type MemberOverrides = {
  githubId?: number;
  githubUsername?: string;
  displayName?: string;
  headline?: string | null;
  affiliation?: string | null;
  location?: string | null;
  bio?: string | null;
  links?: string[];
  skills?: string[];
  status?: MemberStatus;
  priority?: number;
  approvedAt?: Date | null;
  approvedBy?: string | null;
  avatarPath?: string | null;
};

export async function createMember(overrides: MemberOverrides = {}): Promise<Member> {
  sequence += 1;
  const rows = await db
    .insert(members)
    .values({
      githubId: overrides.githubId ?? 900000 + sequence,
      githubUsername: overrides.githubUsername ?? `member-${sequence}`,
      displayName: overrides.displayName ?? `Member ${sequence}`,
      headline: overrides.headline ?? null,
      affiliation: overrides.affiliation ?? null,
      location: overrides.location ?? null,
      bio: overrides.bio ?? null,
      links: overrides.links ?? [],
      skills: overrides.skills ?? [],
      status: overrides.status ?? "pending",
      priority: overrides.priority ?? 0,
      approvedAt: overrides.approvedAt ?? null,
      approvedBy: overrides.approvedBy ?? null,
      avatarPath: overrides.avatarPath ?? null,
    })
    .returning();
  const created = rows[0];
  if (created === undefined) {
    throw new Error("Failed to create test member");
  }
  return created;
}

type ProjectOverrides = {
  githubRepoId?: number;
  fullName?: string;
  title?: string;
  description?: string | null;
  htmlUrl?: string;
  license?: string | null;
  isActive?: boolean;
  lastSyncedAt?: Date | null;
};

export async function createProject(overrides: ProjectOverrides = {}): Promise<Project> {
  sequence += 1;
  const rows = await db
    .insert(projects)
    .values({
      githubRepoId: overrides.githubRepoId ?? 800000 + sequence,
      fullName: overrides.fullName ?? `test-owner/test-repo-${sequence}`,
      title: overrides.title ?? `Test Project ${sequence}`,
      description: overrides.description ?? null,
      htmlUrl: overrides.htmlUrl ?? `https://github.com/test-owner/test-repo-${sequence}`,
      license: overrides.license ?? null,
      isActive: overrides.isActive ?? true,
      lastSyncedAt: overrides.lastSyncedAt ?? null,
    })
    .returning();
  const created = rows[0];
  if (created === undefined) {
    throw new Error("Failed to create test project");
  }
  return created;
}

type IssueOverrides = {
  projectId: string;
  number?: number;
  title?: string;
  body?: string | null;
  state?: "open" | "closed";
  labels?: IssueLabel[];
  authorLogin?: string;
  authorAvatarUrl?: string | null;
  htmlUrl?: string;
  commentsCount?: number;
  source?: "sample" | "github";
  createdAtGithub?: Date;
  updatedAtGithub?: Date;
};

export async function createIssue(overrides: IssueOverrides): Promise<GithubIssue> {
  sequence += 1;
  const createdAt = overrides.createdAtGithub ?? new Date();
  const rows = await db
    .insert(githubIssues)
    .values({
      projectId: overrides.projectId,
      number: overrides.number ?? sequence,
      title: overrides.title ?? `Issue ${sequence}`,
      body: overrides.body ?? null,
      state: overrides.state ?? "open",
      labels: overrides.labels ?? [],
      authorLogin: overrides.authorLogin ?? "test-author",
      authorAvatarUrl: overrides.authorAvatarUrl ?? null,
      htmlUrl: overrides.htmlUrl ?? `https://github.com/test/issues/${sequence}`,
      commentsCount: overrides.commentsCount ?? 0,
      source: overrides.source ?? "github",
      createdAtGithub: createdAt,
      updatedAtGithub: overrides.updatedAtGithub ?? createdAt,
    })
    .returning();
  const created = rows[0];
  if (created === undefined) {
    throw new Error("Failed to create test issue");
  }
  return created;
}
