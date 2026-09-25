import type {
  IssueDto,
  IssueLabelDto,
  IssueListDto,
  IssueListParams,
  ProjectDto,
} from "@gov-portal/shared";

import type { GithubIssue, Project } from "@/db/schema";

import { NotFoundError } from "../errors";
import { countApproved } from "../members/repository";

import * as repo from "./repository";

function toProjectDto(
  project: Project,
  counts: { openIssues: number; members: number },
): ProjectDto {
  return {
    githubRepoId: project.githubRepoId,
    fullName: project.fullName,
    title: project.title,
    description: project.description,
    htmlUrl: project.htmlUrl,
    license: project.license,
    openIssueCount: counts.openIssues,
    memberCount: counts.members,
    lastSyncedAt: project.lastSyncedAt?.toISOString() ?? null,
  };
}

function toIssueDto(issue: GithubIssue): IssueDto {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body,
    state: issue.state === "closed" ? "closed" : "open",
    labels: issue.labels as IssueLabelDto[],
    authorLogin: issue.authorLogin,
    authorAvatarUrl: issue.authorAvatarUrl,
    htmlUrl: issue.htmlUrl,
    commentsCount: issue.commentsCount,
    createdAt: issue.createdAtGithub.toISOString(),
    updatedAt: issue.updatedAtGithub.toISOString(),
  };
}

async function requireActiveProject(): Promise<Project> {
  const project = await repo.findActiveProject();
  if (project === null) {
    throw new NotFoundError("No active project");
  }
  return project;
}

export async function getProjectOverview(): Promise<ProjectDto> {
  const project = await requireActiveProject();
  const [openIssues, members] = await Promise.all([
    repo.countOpenIssues(project.id),
    countApproved(),
  ]);
  return toProjectDto(project, { openIssues, members });
}

export async function listProjectIssues(params: IssueListParams): Promise<IssueListDto> {
  const project = await requireActiveProject();
  const { issues, total } = await repo.listIssues(project.id, params);
  return {
    issues: issues.map(toIssueDto),
    total,
    page: params.page,
    perPage: params.perPage,
  };
}

export async function getProjectIssue(number: number): Promise<IssueDto> {
  const project = await requireActiveProject();
  const issue = await repo.findIssueByNumber(project.id, number);
  if (issue === null) {
    throw new NotFoundError(`Issue #${number} not found`);
  }
  return toIssueDto(issue);
}

export async function listIssueLabels(): Promise<repo.LabelFacet[]> {
  const project = await requireActiveProject();
  return repo.listLabelFacets(project.id);
}

export async function getProjectOverviewOrNull(): Promise<ProjectDto | null> {
  try {
    return await getProjectOverview();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    throw error;
  }
}
