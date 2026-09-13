import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db/client";
import {
  type GithubIssue,
  githubIssues,
  type NewGithubIssue,
  type NewProject,
  type Project,
  projects,
} from "@/db/schema";

export type IssueQuery = {
  label?: string;
  q?: string;
  page: number;
  perPage: number;
};

export async function findActiveProject(): Promise<Project | null> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.isActive, true))
    .orderBy(desc(projects.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function findProjectByFullName(fullName: string): Promise<Project | null> {
  const rows = await db
    .select()
    .from(projects)
    .where(sql`lower(${projects.fullName}) = ${fullName.toLowerCase()}`)
    .limit(1);
  return rows[0] ?? null;
}

export async function countOpenIssues(projectId: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(githubIssues)
    .where(and(eq(githubIssues.projectId, projectId), eq(githubIssues.state, "open")));
  return rows[0]?.count ?? 0;
}

function issueWhere(projectId: string, query: IssueQuery) {
  const clauses = [eq(githubIssues.projectId, projectId), eq(githubIssues.state, "open")];
  if (query.label !== undefined) {
    clauses.push(sql`${githubIssues.labels} @> ${JSON.stringify([{ name: query.label }])}::jsonb`);
  }
  if (query.q !== undefined) {
    const pattern = `%${query.q}%`;
    const search = or(ilike(githubIssues.title, pattern), ilike(githubIssues.body, pattern));
    if (search !== undefined) {
      clauses.push(search);
    }
  }
  return and(...clauses);
}

export async function listIssues(
  projectId: string,
  query: IssueQuery,
): Promise<{ issues: GithubIssue[]; total: number }> {
  const where = issueWhere(projectId, query);
  const [issues, totals] = await Promise.all([
    db
      .select()
      .from(githubIssues)
      .where(where)
      .orderBy(desc(githubIssues.updatedAtGithub))
      .limit(query.perPage)
      .offset((query.page - 1) * query.perPage),
    db.select({ count: sql<number>`count(*)::int` }).from(githubIssues).where(where),
  ]);
  return { issues, total: totals[0]?.count ?? 0 };
}

export async function findIssueByNumber(
  projectId: string,
  number: number,
): Promise<GithubIssue | null> {
  const rows = await db
    .select()
    .from(githubIssues)
    .where(and(eq(githubIssues.projectId, projectId), eq(githubIssues.number, number)))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertProject(values: NewProject): Promise<Project> {
  const rows = await db
    .insert(projects)
    .values(values)
    .onConflictDoUpdate({
      target: projects.githubRepoId,
      set: {
        fullName: values.fullName,
        title: values.title,
        description: values.description ?? null,
        htmlUrl: values.htmlUrl,
        license: values.license ?? null,
        isActive: values.isActive ?? true,
      },
    })
    .returning();
  const project = rows[0];
  if (project === undefined) {
    throw new Error(`Failed to upsert project ${values.fullName}`);
  }
  return project;
}

export async function upsertIssues(
  projectId: string,
  values: Omit<NewGithubIssue, "projectId">[],
): Promise<void> {
  for (const value of values) {
    await db
      .insert(githubIssues)
      .values({ ...value, projectId })
      .onConflictDoUpdate({
        target: [githubIssues.projectId, githubIssues.number],
        set: {
          title: value.title,
          body: value.body ?? null,
          state: value.state ?? "open",
          labels: value.labels ?? [],
          authorLogin: value.authorLogin,
          authorAvatarUrl: value.authorAvatarUrl ?? null,
          htmlUrl: value.htmlUrl,
          commentsCount: value.commentsCount ?? 0,
          source: value.source ?? "github",
          updatedAtGithub: value.updatedAtGithub,
          syncedAt: new Date(),
        },
      });
  }
}

export async function deleteSampleIssues(projectId: string): Promise<void> {
  await db
    .delete(githubIssues)
    .where(and(eq(githubIssues.projectId, projectId), eq(githubIssues.source, "sample")));
}

export async function deleteIssueByNumber(projectId: string, number: number): Promise<void> {
  await db
    .delete(githubIssues)
    .where(and(eq(githubIssues.projectId, projectId), eq(githubIssues.number, number)));
}

export async function touchProjectSynced(projectId: string): Promise<void> {
  await db.update(projects).set({ lastSyncedAt: new Date() }).where(eq(projects.id, projectId));
}

export type LabelFacet = {
  name: string;
  count: number;
};

export async function listLabelFacets(projectId: string): Promise<LabelFacet[]> {
  const result = await db.execute<LabelFacet>(sql`
    select label->>'name' as name, count(*)::int as count
    from github_issues, jsonb_array_elements(labels) as label
    where project_id = ${projectId} and state = 'open'
    group by 1
    order by count desc, name asc
  `);
  return result.rows;
}
