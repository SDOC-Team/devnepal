import { createHmac } from "node:crypto";

import { desc, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { GET as listIssues } from "@/app/project/issues/route";
import { POST } from "@/app/webhooks/github/route";
import { db } from "@/db/client";
import { githubEvents, githubIssues } from "@/db/schema";

import { resetDatabase } from "../helpers/db";
import { createProject } from "../helpers/factories";

const SECRET = "test-webhook-secret";

function sign(body: string): string {
  return `sha256=${createHmac("sha256", SECRET).update(body).digest("hex")}`;
}

function issuePayload(action = "opened", overrides: Record<string, unknown> = {}) {
  return {
    action,
    repository: { full_name: "voidash/gov-portal" },
    issue: {
      number: 42,
      title: "Fresh from a webhook",
      body: "Delivered without a manual sync.",
      state: "open",
      labels: [{ name: "good first issue", color: "7057ff" }],
      user: { login: "voidash", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      html_url: "https://github.com/voidash/gov-portal/issues/42",
      comments: 0,
      created_at: "2026-09-13T10:00:00Z",
      updated_at: "2026-09-13T10:00:00Z",
      ...overrides,
    },
  };
}

function webhookRequest(
  body: unknown,
  options: { signature?: string | null; delivery?: string; event?: string } = {},
): Request {
  const raw = JSON.stringify(body);
  const headers = new Headers({
    "content-type": "application/json",
    "x-github-event": options.event ?? "issues",
    "x-github-delivery": options.delivery ?? "delivery-1",
  });
  if (options.signature !== null) {
    headers.set("x-hub-signature-256", options.signature ?? sign(raw));
  }
  return new Request("http://localhost:3000/webhooks/github", {
    method: "POST",
    headers,
    body: raw,
  });
}

async function listWebhookEvents() {
  return db.select().from(githubEvents).orderBy(desc(githubEvents.receivedAt));
}

async function listStoredIssues(projectId: string) {
  return db.select().from(githubIssues).where(eq(githubIssues.projectId, projectId));
}

describe("POST /webhooks/github", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("stores and applies an issue opened delivery", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });

    const response = await POST(webhookRequest(issuePayload()));
    expect(response.status).toBe(202);

    const issues = await listStoredIssues(project.id);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.number).toBe(42);
    expect(issues[0]?.title).toBe("Fresh from a webhook");

    const events = await listWebhookEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.status).toBe("processed");
    expect(events[0]?.signatureValid).toBe(true);
  });

  it("rejects a bad signature and records the failure", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });

    const response = await POST(webhookRequest(issuePayload(), { signature: "sha256=deadbeef" }));
    expect(response.status).toBe(401);
    expect(await listStoredIssues(project.id)).toHaveLength(0);
    const events = await listWebhookEvents();
    expect(events[0]?.status).toBe("failed");
    expect(events[0]?.signatureValid).toBe(false);
  });

  it("rejects a delivery with no signature header", async () => {
    await createProject({ fullName: "voidash/gov-portal" });
    const response = await POST(webhookRequest(issuePayload(), { signature: null }));
    expect(response.status).toBe(401);
  });

  it("treats a repeated delivery id as a duplicate", async () => {
    await createProject({ fullName: "voidash/gov-portal" });

    const first = await POST(webhookRequest(issuePayload()));
    const second = await POST(webhookRequest(issuePayload()));

    expect(first.status).toBe(202);
    expect(second.status).toBe(200);
    const payload = (await second.json()) as { status: string };
    expect(payload.status).toBe("duplicate");
    expect(await listWebhookEvents()).toHaveLength(1);
  });

  it("applies closed and edited updates to the stored issue", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    await POST(webhookRequest(issuePayload()));

    await POST(
      webhookRequest(issuePayload("edited", { title: "Renamed issue" }), {
        delivery: "delivery-2",
      }),
    );
    await POST(
      webhookRequest(issuePayload("closed", { state: "closed", title: "Renamed issue" }), {
        delivery: "delivery-3",
      }),
    );

    const issues = await listStoredIssues(project.id);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.title).toBe("Renamed issue");
    expect(issues[0]?.state).toBe("closed");

    const listing = await listIssues(new Request("http://localhost:3000/project/issues"));
    expect(listing.status).toBe(200);
    const listed = (await listing.json()) as { total: number };
    expect(listed.total).toBe(0);
  });

  it("ignores deliveries for repositories that are not the project", async () => {
    await createProject({ fullName: "voidash/gov-portal" });
    const payload = issuePayload();
    payload.repository.full_name = "someone/else";

    const response = await POST(webhookRequest(payload));
    expect(response.status).toBe(202);
    const body = (await response.json()) as { status: string };
    expect(body.status).toBe("ignored");
  });

  it("ignores event types it does not process", async () => {
    await createProject({ fullName: "voidash/gov-portal" });
    const response = await POST(webhookRequest({ action: "opened" }, { event: "pull_request" }));
    expect(response.status).toBe(202);
    const body = (await response.json()) as { status: string };
    expect(body.status).toBe("ignored");
  });

  it("acknowledges ping deliveries", async () => {
    await createProject({ fullName: "voidash/gov-portal" });
    const response = await POST(
      webhookRequest({ zen: "Keep it logically awesome." }, { event: "ping" }),
    );
    expect(response.status).toBe(202);
    const body = (await response.json()) as { status: string };
    expect(body.status).toBe("processed");
  });
});
