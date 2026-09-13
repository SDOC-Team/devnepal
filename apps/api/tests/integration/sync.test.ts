import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { githubIssues, projects } from "@/db/schema";
import { syncProjectIssues } from "@/server/projects/sync";

import { resetDatabase } from "../helpers/db";
import { createIssue, createProject } from "../helpers/factories";

function githubIssue(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    number: 1,
    title: "Add Nepali labels",
    body: "Body text",
    state: "open",
    labels: [{ name: "good first issue", color: "7057ff" }],
    user: {
      login: "voidash",
      avatar_url: "https://avatars.githubusercontent.com/u/23181294?v=4",
    },
    html_url: "https://github.com/voidash/gov-portal/issues/1",
    comments: 2,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-02T00:00:00Z",
    ...overrides,
  };
}

function fetchMock(batches: unknown[][]): ReturnType<typeof vi.fn> {
  let call = 0;
  return vi.fn(async () => {
    const batch = batches[call] ?? [];
    call += 1;
    return new Response(JSON.stringify(batch), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
}

async function loadIssues(projectId: string) {
  return db.select().from(githubIssues).where(eq(githubIssues.projectId, projectId));
}

describe("syncProjectIssues", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("upserts issues, skips pull requests, and records the sync time", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    const fetchImpl = fetchMock([
      [
        githubIssue({ number: 1 }),
        githubIssue({ number: 2, state: "closed", title: "Already done" }),
        githubIssue({ number: 3, title: "A pull request", pull_request: {} }),
      ],
    ]);

    const result = await syncProjectIssues({ fetchImpl: fetchImpl as unknown as typeof fetch });

    expect(result).toEqual({ synced: 2, skippedPullRequests: 1 });
    const issues = await loadIssues(project.id);
    expect(issues.map((issue) => issue.number).sort()).toEqual([1, 2]);
    const closed = issues.find((issue) => issue.number === 2);
    expect(closed?.state).toBe("closed");

    const projectRows = await db.select().from(projects).where(eq(projects.id, project.id));
    expect(projectRows[0]?.lastSyncedAt).not.toBeNull();
  });

  it("replaces sample fixtures with real issues", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    await createIssue({ projectId: project.id, number: 101, source: "sample" });

    await syncProjectIssues({
      fetchImpl: fetchMock([[githubIssue({ number: 1 })]]) as unknown as typeof fetch,
    });

    const issues = await loadIssues(project.id);
    expect(issues.map((issue) => issue.number)).toEqual([1]);
    expect(issues.every((issue) => issue.source === "github")).toBe(true);
  });

  it("is idempotent across repeated runs", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    const batch = [githubIssue({ number: 1, title: "First" })];

    await syncProjectIssues({ fetchImpl: fetchMock([batch]) as unknown as typeof fetch });
    await syncProjectIssues({
      fetchImpl: fetchMock([
        [githubIssue({ number: 1, title: "Updated title" })],
      ]) as unknown as typeof fetch,
    });

    const issues = await loadIssues(project.id);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.title).toBe("Updated title");
  });

  it("paginates through GitHub results", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    const firstPage = Array.from({ length: 100 }, (_, index) => githubIssue({ number: index + 1 }));
    const secondPage = [githubIssue({ number: 101 })];

    const result = await syncProjectIssues({
      fetchImpl: fetchMock([firstPage, secondPage]) as unknown as typeof fetch,
    });

    expect(result.synced).toBe(101);
    expect(await loadIssues(project.id)).toHaveLength(101);
  });

  it("fails loudly when GitHub rejects the request", async () => {
    await createProject({ fullName: "voidash/gov-portal" });
    const fetchImpl = vi.fn(async () => new Response("rate limited", { status: 403 }));

    await expect(
      syncProjectIssues({ fetchImpl: fetchImpl as unknown as typeof fetch }),
    ).rejects.toThrow("GitHub API request failed with status 403");
  });

  it("fails when there is no active project", async () => {
    await expect(
      syncProjectIssues({ fetchImpl: fetchMock([[]]) as unknown as typeof fetch }),
    ).rejects.toThrow("No active project to sync");
  });
});
