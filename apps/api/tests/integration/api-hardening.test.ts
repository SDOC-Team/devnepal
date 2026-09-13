import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { GET as avatarGet } from "@/app/avatars/[...key]/route";
import { GET as healthGet } from "@/app/health/route";
import { OPTIONS as membersOptions } from "@/app/members/route";
import { PATCH as profilePatch } from "@/app/profile/route";
import { GET as issueGet } from "@/app/project/issues/[number]/route";
import { GET as issuesGet } from "@/app/project/issues/route";
import { RATE_LIMITS } from "@/server/rate-limit";

import { resetDatabase } from "../helpers/db";
import { createIssue, createMember, createProject } from "../helpers/factories";
import { jsonRequest, mockSessionAs } from "../helpers/session";

const STORAGE_DIR = path.resolve("./.test-storage");
const UUID = "123e4567-e89b-42d3-a456-426614174000";
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function issueContext(number: string): { params: Promise<{ number: string }> } {
  return { params: Promise.resolve({ number }) };
}

function avatarContext(key: string[]): { params: Promise<{ key: string[] }> } {
  return { params: Promise.resolve({ key }) };
}

describe("API hardening", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(async () => {
    await rm(STORAGE_DIR, { recursive: true, force: true });
  });

  it("returns the standard error envelope for auth and missing resources", async () => {
    mockSessionAs(null);
    const unauthorized = await profilePatch(
      jsonRequest("http://localhost:3000/profile", "PATCH", { body: { displayName: "No" } }),
    );
    expect(unauthorized.status).toBe(401);
    const unauthorizedBody = (await unauthorized.json()) as { error: { code: string } };
    expect(unauthorizedBody.error.code).toBe("unauthorized");

    await createProject({ fullName: "voidash/gov-portal" });
    const missing = await issueGet(
      new Request("http://localhost:3000/project/issues/999"),
      issueContext("999"),
    );
    expect(missing.status).toBe(404);
    const missingBody = (await missing.json()) as { error: { code: string } };
    expect(missingBody.error.code).toBe("not_found");
  });

  it("rejects malformed JSON bodies with a validation error", async () => {
    const alice = await createMember({ githubUsername: "alice" });
    mockSessionAs(alice);

    const response = await profilePatch(
      new Request("http://localhost:3000/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: "not-json",
      }),
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: { message: string } };
    expect(body.error.message).toBe("Request body must be valid JSON");
  });

  it("returns an empty page when pagination runs past the last result", async () => {
    const project = await createProject({ fullName: "voidash/gov-portal" });
    await createIssue({ projectId: project.id, number: 1 });

    const response = await issuesGet(new Request("http://localhost:3000/project/issues?page=99"));
    expect(response.status).toBe(200);
    const body = (await response.json()) as { issues: unknown[]; total: number };
    expect(body.issues).toHaveLength(0);
    expect(body.total).toBe(1);
  });

  it("serves stored avatars and 404s missing, malformed, and traversal keys", async () => {
    await mkdir(path.join(STORAGE_DIR, "avatars"), { recursive: true });
    await writeFile(path.join(STORAGE_DIR, "avatars", `${UUID}.png`), PNG_BYTES);

    const served = await avatarGet(
      new Request(`http://localhost:3000/avatars/${UUID}.png`),
      avatarContext([`${UUID}.png`]),
    );
    expect(served.status).toBe(200);
    expect(served.headers.get("content-type")).toBe("image/png");
    expect(served.headers.get("cache-control")).toContain("immutable");

    const missing = await avatarGet(
      new Request("http://localhost:3000/avatars/11111111-1111-4111-8111-111111111111.png"),
      avatarContext(["11111111-1111-4111-8111-111111111111.png"]),
    );
    expect(missing.status).toBe(404);

    const traversal = await avatarGet(
      new Request("http://localhost:3000/avatars/../../etc/passwd"),
      avatarContext(["..", "..", "etc", "passwd"]),
    );
    expect(traversal.status).toBe(404);
  });

  it("answers CORS preflight for the configured web origin", async () => {
    const response = membersOptions();
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:5173");
    expect(response.headers.get("access-control-allow-methods")).toContain("PATCH");
  });

  it("rate limits profile writes with 429 and a Retry-After header", async () => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    mockSessionAs(alice);

    let last: Response | null = null;
    for (let attempt = 0; attempt <= RATE_LIMITS.profileWrite.limit; attempt += 1) {
      last = await profilePatch(
        jsonRequest("http://localhost:3000/profile", "PATCH", {
          body: { displayName: "Alice" },
        }),
      );
    }

    expect(last?.status).toBe(429);
    const retryAfter = last?.headers.get("retry-after");
    expect(retryAfter).not.toBeNull();
    const body = (await last?.json()) as { error: { code: string } };
    expect(body.error.code).toBe("rate_limited");
  });

  it("reports healthy when the database answers", async () => {
    const response = await healthGet();
    expect(response.status).toBe(200);
    const body = (await response.json()) as { status: string };
    expect(body.status).toBe("ok");
  });
});
