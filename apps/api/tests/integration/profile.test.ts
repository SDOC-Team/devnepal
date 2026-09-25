import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { GET, PATCH } from "@/app/v1/profile/route";
import { db } from "@/db/client";
import { members } from "@/db/schema";

import { resetDatabase } from "../helpers/db";
import { ADMIN_GITHUB_ID, createMember } from "../helpers/factories";
import { jsonRequest, mockSessionAs } from "../helpers/session";

const PROFILE_URL = "http://localhost:3000/v1/profile";

async function loadMember(id: string) {
  const rows = await db.select().from(members).where(eq(members.id, id));
  return rows[0] ?? null;
}

describe("PATCH /v1/profile", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("updates only the authenticated member", async () => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    const bob = await createMember({ githubUsername: "bob", displayName: "Bob" });
    mockSessionAs(alice);

    const response = await PATCH(
      jsonRequest(PROFILE_URL, "PATCH", {
        body: {
          displayName: "Alice Updated",
          bio: "Building things",
          skills: ["engineering"],
          links: ["https://example.com"],
        },
      }),
    );

    expect(response.status).toBe(200);
    const aliceAfter = await loadMember(alice.id);
    const bobAfter = await loadMember(bob.id);
    expect(aliceAfter?.displayName).toBe("Alice Updated");
    expect(aliceAfter?.bio).toBe("Building things");
    expect(aliceAfter?.skills).toEqual(["engineering"]);
    expect(aliceAfter?.links).toEqual(["https://example.com"]);
    expect(bobAfter?.displayName).toBe("Bob");
    expect(bobAfter?.bio).toBeNull();
    expect(bobAfter?.updatedAt).toEqual(bob.updatedAt);
  });

  it.each([
    ["id", "uuid"],
    ["githubId", "githubId"],
    ["githubUsername", "githubUsername"],
    ["status", "literal"],
    ["priority", "priority"],
    ["avatarPath", "literal"],
    ["approvedAt", "literal"],
    ["approvedBy", "literal"],
  ])("rejects a body injecting %s and never touches the other member", async (key, kind) => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    const bob = await createMember({ githubUsername: "bob", displayName: "Bob" });
    mockSessionAs(alice);

    const injection =
      kind === "uuid"
        ? bob.id
        : kind === "githubId"
          ? bob.githubId
          : kind === "githubUsername"
            ? bob.githubUsername
            : kind === "priority"
              ? 999
              : "hacked";

    const response = await PATCH(
      jsonRequest(PROFILE_URL, "PATCH", {
        body: { displayName: "Alice Edited", [key]: injection },
      }),
    );

    expect(response.status).toBe(400);
    const aliceAfter = await loadMember(alice.id);
    const bobAfter = await loadMember(bob.id);
    expect(aliceAfter?.displayName).toBe("Alice");
    expect(bobAfter?.displayName).toBe("Bob");
    expect(bobAfter?.githubUsername).toBe("bob");
    expect(bobAfter?.status).toBe("pending");
    expect(bobAfter?.priority).toBe(0);
  });

  it("rejects unauthenticated updates", async () => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    mockSessionAs(null);

    const response = await PATCH(
      jsonRequest(PROFILE_URL, "PATCH", { body: { displayName: "Nope" } }),
    );

    expect(response.status).toBe(401);
    expect((await loadMember(alice.id))?.displayName).toBe("Alice");
  });

  it("rejects disallowed origins", async () => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    mockSessionAs(alice);

    const response = await PATCH(
      jsonRequest(PROFILE_URL, "PATCH", {
        body: { displayName: "Cross Site" },
        origin: "http://evil.example",
      }),
    );

    expect(response.status).toBe(403);
    expect((await loadMember(alice.id))?.displayName).toBe("Alice");
  });

  it("allows the configured web origin", async () => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    mockSessionAs(alice);

    const response = await PATCH(
      jsonRequest(PROFILE_URL, "PATCH", {
        body: { displayName: "Alice Same Origin" },
        origin: "http://localhost:5173",
      }),
    );

    expect(response.status).toBe(200);
  });

  it("returns validation details for oversized fields", async () => {
    const alice = await createMember({ githubUsername: "alice" });
    mockSessionAs(alice);

    const response = await PATCH(
      jsonRequest(PROFILE_URL, "PATCH", { body: { bio: "x".repeat(401) } }),
    );

    expect(response.status).toBe(400);
    const payload = (await response.json()) as { error: { details: unknown[] } };
    expect(payload.error.details.length).toBeGreaterThan(0);
  });
});

describe("GET /v1/profile", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns the authenticated member with internal fields", async () => {
    const alice = await createMember({ githubUsername: "alice", displayName: "Alice" });
    mockSessionAs(alice);

    const response = await GET();
    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      member: { id: string; status: string; githubUsername: string; displayName: string };
      isAdmin: boolean;
    };
    expect(payload.member.id).toBe(alice.id);
    expect(payload.member.status).toBe("pending");
    expect(payload.member.githubUsername).toBe("alice");
    expect(payload.member.displayName).toBe("Alice");
    expect(payload.isAdmin).toBe(false);
  });

  it("flags admins in the profile payload", async () => {
    const admin = await createMember({
      githubId: ADMIN_GITHUB_ID,
      githubUsername: "admin-user",
      displayName: "Admin",
    });
    mockSessionAs(admin);

    const response = await GET();
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { isAdmin: boolean };
    expect(payload.isAdmin).toBe(true);
  });

  it("returns 401 without a session", async () => {
    mockSessionAs(null);
    expect((await GET()).status).toBe(401);
  });
});
