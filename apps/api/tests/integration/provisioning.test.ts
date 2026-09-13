import { readFile, rm } from "node:fs/promises";
import path from "node:path";

import { sql } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { ensureMemberFromGithubLogin } from "@/server/members/service";

import { resetDatabase } from "../helpers/db";

const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const STORAGE_DIR = path.resolve("./.test-storage");

function pngFetchMock() {
  return vi.fn(
    async (_input: RequestInfo | URL) =>
      new Response(PNG_BYTES, {
        status: 200,
        headers: {
          "content-type": "image/png",
          "content-length": String(PNG_BYTES.byteLength),
        },
      }),
  );
}

describe("ensureMemberFromGithubLogin", () => {
  beforeEach(async () => {
    await resetDatabase();
    await rm(STORAGE_DIR, { recursive: true, force: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates a pending member on first login", async () => {
    const member = await ensureMemberFromGithubLogin({
      githubId: 111111,
      githubUsername: "alice",
      displayName: "Alice Thapa",
      avatarUrl: null,
    });

    expect(member.status).toBe("pending");
    expect(member.githubId).toBe(111111);
    expect(member.githubUsername).toBe("alice");
    expect(member.displayName).toBe("Alice Thapa");
    expect(member.avatarPath).toBeNull();
    expect(member.approvedAt).toBeNull();
    expect(member.approvedBy).toBeNull();
  });

  it("is idempotent and updates a renamed GitHub username", async () => {
    const first = await ensureMemberFromGithubLogin({
      githubId: 222222,
      githubUsername: "old-login",
      displayName: "Renamed Person",
      avatarUrl: null,
    });
    const second = await ensureMemberFromGithubLogin({
      githubId: 222222,
      githubUsername: "new-login",
      displayName: "Renamed Person",
      avatarUrl: null,
    });

    expect(second.id).toBe(first.id);
    expect(second.githubUsername).toBe("new-login");
    expect(second.displayName).toBe("Renamed Person");
  });

  it("falls back to the login when GitHub supplies no usable display name", async () => {
    const member = await ensureMemberFromGithubLogin({
      githubId: 333333,
      githubUsername: "plain-login",
      displayName: null,
      avatarUrl: null,
    });
    expect(member.displayName).toBe("plain-login");
  });

  it("downloads and stores the GitHub avatar, requesting size 400", async () => {
    const fetchMock = pngFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const member = await ensureMemberFromGithubLogin({
      githubId: 444444,
      githubUsername: "avatar-user",
      displayName: "Avatar User",
      avatarUrl: "https://avatars.githubusercontent.com/u/444444?v=4",
    });

    expect(member.avatarPath).toMatch(/^avatars\/[0-9a-f-]{36}\.png$/);
    const requested = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requested.hostname).toBe("avatars.githubusercontent.com");
    expect(requested.searchParams.get("size")).toBe("400");

    const stored = await readFile(path.join(STORAGE_DIR, member.avatarPath ?? ""));
    expect(stored.equals(PNG_BYTES)).toBe(true);
  });

  it("still creates the member when the avatar download fails, then self-heals", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("upstream error", { status: 500 })),
    );

    const failed = await ensureMemberFromGithubLogin({
      githubId: 555555,
      githubUsername: "resilient-user",
      displayName: "Resilient",
      avatarUrl: "https://avatars.githubusercontent.com/u/555555?v=4",
    });
    expect(failed.status).toBe("pending");
    expect(failed.avatarPath).toBeNull();

    vi.stubGlobal("fetch", pngFetchMock());
    const healed = await ensureMemberFromGithubLogin({
      githubId: 555555,
      githubUsername: "resilient-user",
      displayName: "Resilient",
      avatarUrl: "https://avatars.githubusercontent.com/u/555555?v=4",
    });
    expect(healed.id).toBe(failed.id);
    expect(healed.avatarPath).not.toBeNull();
  });

  it("rejects non-image payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("<html>not an image</html>", {
            status: 200,
            headers: { "content-type": "text/html" },
          }),
      ),
    );

    const member = await ensureMemberFromGithubLogin({
      githubId: 666666,
      githubUsername: "sneaky-user",
      displayName: "Sneaky",
      avatarUrl: "https://avatars.githubusercontent.com/u/666666?v=4",
    });
    expect(member.avatarPath).toBeNull();
  });

  it("never stores an email address", async () => {
    const result = await db.execute<{ column_name: string }>(
      sql`select column_name from information_schema.columns where table_name = 'members'`,
    );
    const columns = result.rows.map((row) => row.column_name);
    expect(columns.length).toBeGreaterThan(0);
    expect(columns).not.toContain("email");
  });
});
