import { beforeEach, describe, expect, it } from "vitest";

import { GET as getIssue } from "@/app/project/issues/[number]/route";
import { GET as listIssues } from "@/app/project/issues/route";
import { GET as getProject } from "@/app/project/route";

import { resetDatabase } from "../helpers/db";
import { createIssue, createMember, createProject } from "../helpers/factories";

function issueContext(number: string): { params: Promise<{ number: string }> } {
  return { params: Promise.resolve({ number }) };
}

describe("GET /project", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns the project with open issue and approved member counts", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    await createIssue({ projectId: project.id, number: 1, state: "open" });
    await createIssue({ projectId: project.id, number: 2, state: "open" });
    await createIssue({ projectId: project.id, number: 3, state: "closed" });
    await createMember({ status: "approved", approvedAt: new Date() });
    await createMember({ status: "pending" });

    const response = await getProject();
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { project: Record<string, unknown> };
    expect(payload.project.fullName).toBe("voidash/gov-portal");
    expect(payload.project.openIssueCount).toBe(2);
    expect(payload.project.memberCount).toBe(1);
  });

  it("returns 404 when no active project exists", async () => {
    const response = await getProject();
    expect(response.status).toBe(404);
  });
});

describe("GET /project/issues", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  async function request(query = ""): Promise<Response> {
    return listIssues(new Request(`http://localhost:3000/project/issues${query}`));
  }

  it("returns only open issues, most recently updated first", async () => {
    const project = await createProject();
    await createIssue({
      projectId: project.id,
      number: 1,
      title: "Older",
      updatedAtGithub: new Date("2026-01-01T00:00:00.000Z"),
    });
    await createIssue({
      projectId: project.id,
      number: 2,
      title: "Newer",
      updatedAtGithub: new Date("2026-06-01T00:00:00.000Z"),
    });
    await createIssue({ projectId: project.id, number: 3, title: "Closed", state: "closed" });

    const response = await request();
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { issues: { number: number }[]; total: number };
    expect(payload.issues.map((issue) => issue.number)).toEqual([2, 1]);
    expect(payload.total).toBe(2);
  });

  it("filters by label", async () => {
    const project = await createProject();
    await createIssue({
      projectId: project.id,
      number: 1,
      labels: [{ name: "good first issue", color: "7057ff" }],
    });
    await createIssue({
      projectId: project.id,
      number: 2,
      labels: [{ name: "documentation", color: "0075ca" }],
    });

    const response = await request("?label=good%20first%20issue");
    const payload = (await response.json()) as { issues: { number: number }[] };
    expect(payload.issues.map((issue) => issue.number)).toEqual([1]);
  });

  it("searches titles and bodies case-insensitively", async () => {
    const project = await createProject();
    await createIssue({ projectId: project.id, number: 1, title: "Add Nepali labels" });
    await createIssue({
      projectId: project.id,
      number: 2,
      title: "Other",
      body: "includes nepali text",
    });
    await createIssue({ projectId: project.id, number: 3, title: "Unrelated" });

    const response = await request("?q=NEPALI");
    const payload = (await response.json()) as { issues: { number: number }[] };
    expect(payload.issues.map((issue) => issue.number).sort()).toEqual([1, 2]);
  });

  it("paginates", async () => {
    const project = await createProject();
    for (let number = 1; number <= 5; number += 1) {
      await createIssue({ projectId: project.id, number });
    }

    const response = await request("?page=2&perPage=2");
    const payload = (await response.json()) as {
      issues: unknown[];
      total: number;
      page: number;
      perPage: number;
    };
    expect(payload.issues).toHaveLength(2);
    expect(payload.total).toBe(5);
    expect(payload.page).toBe(2);
    expect(payload.perPage).toBe(2);
  });

  it("rejects invalid query parameters", async () => {
    const project = await createProject();
    await createIssue({ projectId: project.id, number: 1 });

    const response = await request("?page=0");
    expect(response.status).toBe(400);
    const payload = (await response.json()) as { error: { code: string; details: unknown[] } };
    expect(payload.error.code).toBe("validation_error");
    expect(payload.error.details.length).toBeGreaterThan(0);
  });
});

describe("GET /project/issues/{number}", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns a single issue with labels and author", async () => {
    const project = await createProject();
    await createIssue({
      projectId: project.id,
      number: 42,
      title: "Answer everything",
      body: "The body",
      labels: [{ name: "help wanted", color: "008672" }],
      authorLogin: "voidash",
      commentsCount: 3,
    });

    const response = await getIssue(
      new Request("http://localhost:3000/project/issues/42"),
      issueContext("42"),
    );
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { issue: Record<string, unknown> };
    expect(payload.issue.number).toBe(42);
    expect(payload.issue.title).toBe("Answer everything");
    expect(payload.issue.labels).toEqual([{ name: "help wanted", color: "008672" }]);
    expect(payload.issue.authorLogin).toBe("voidash");
    expect(payload.issue.commentsCount).toBe(3);
  });

  it("returns 404 for unknown or malformed issue numbers", async () => {
    const project = await createProject();
    await createIssue({ projectId: project.id, number: 1 });

    expect(
      (await getIssue(new Request("http://localhost:3000/project/issues/999"), issueContext("999")))
        .status,
    ).toBe(404);
    expect(
      (await getIssue(new Request("http://localhost:3000/project/issues/abc"), issueContext("abc")))
        .status,
    ).toBe(404);
  });
});
