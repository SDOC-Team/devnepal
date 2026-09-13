import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { GET as getByUsername } from "@/app/members/[username]/route";
import { GET as getByGithubId } from "@/app/members/id/[githubId]/route";
import { GET as getDirectory } from "@/app/members/route";

import { resetDatabase } from "../helpers/db";
import { createMember } from "../helpers/factories";
import { mockSessionAs } from "../helpers/session";

function usernameRequest(username: string): Request {
  return new Request(`http://localhost:3000/members/${username}`, { method: "GET" });
}

function githubIdRequest(githubId: number): Request {
  return new Request(`http://localhost:3000/members/id/${githubId}`, { method: "GET" });
}

function usernameContext(username: string): { params: Promise<{ username: string }> } {
  return { params: Promise.resolve({ username }) };
}

function githubIdContext(githubId: string): { params: Promise<{ githubId: string }> } {
  return { params: Promise.resolve({ githubId }) };
}

describe("member visibility", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it.each(["pending", "rejected", "hidden"] as const)(
    "returns 404 to the public for a %s member",
    async (status) => {
      const member = await createMember({ githubUsername: `${status}-user`, status });
      mockSessionAs(null);

      expect(
        (
          await getByUsername(
            usernameRequest(member.githubUsername),
            usernameContext(member.githubUsername),
          )
        ).status,
      ).toBe(404);
      expect(
        (
          await getByGithubId(
            githubIdRequest(member.githubId),
            githubIdContext(String(member.githubId)),
          )
        ).status,
      ).toBe(404);
    },
  );

  it("returns 200 to the public for an approved member on both routes", async () => {
    const member = await createMember({
      githubUsername: "approved-user",
      status: "approved",
      approvedAt: new Date(),
    });
    mockSessionAs(null);

    const byUsername = await getByUsername(
      usernameRequest(member.githubUsername),
      usernameContext(member.githubUsername),
    );
    const byGithubId = await getByGithubId(
      githubIdRequest(member.githubId),
      githubIdContext(String(member.githubId)),
    );
    expect(byUsername.status).toBe(200);
    expect(byGithubId.status).toBe(200);
  });

  it("lets the owner see their own non-public profile on both routes", async () => {
    const member = await createMember({ githubUsername: "pending-owner", status: "pending" });
    mockSessionAs(member);

    expect(
      (
        await getByUsername(
          usernameRequest(member.githubUsername),
          usernameContext(member.githubUsername),
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await getByGithubId(
          githubIdRequest(member.githubId),
          githubIdContext(String(member.githubId)),
        )
      ).status,
    ).toBe(200);
  });

  it("hides a non-public profile from other authenticated members", async () => {
    const alice = await createMember({ githubUsername: "alice", status: "pending" });
    const bob = await createMember({
      githubUsername: "bob",
      status: "approved",
      approvedAt: new Date(),
    });
    mockSessionAs(bob);

    expect(
      (
        await getByUsername(
          usernameRequest(alice.githubUsername),
          usernameContext(alice.githubUsername),
        )
      ).status,
    ).toBe(404);
  });

  it("resolves usernames case-insensitively", async () => {
    await createMember({
      githubUsername: "MixedCase",
      status: "approved",
      approvedAt: new Date(),
    });
    mockSessionAs(null);

    expect(
      (await getByUsername(usernameRequest("mixedcase"), usernameContext("mixedcase"))).status,
    ).toBe(200);
  });

  it("returns 404 for malformed github id routes", async () => {
    mockSessionAs(null);
    expect((await getByGithubId(githubIdRequest(0), githubIdContext("abc"))).status).toBe(404);
    expect((await getByGithubId(githubIdRequest(0), githubIdContext("-5"))).status).toBe(404);
  });

  it("never exposes the internal UUID or moderation fields publicly", async () => {
    const member = await createMember({
      githubUsername: "public-user",
      status: "approved",
      approvedAt: new Date(),
    });
    mockSessionAs(null);

    const response = await getByUsername(
      usernameRequest(member.githubUsername),
      usernameContext(member.githubUsername),
    );
    const payload = (await response.json()) as { member: Record<string, unknown> };
    expect(payload.member).not.toHaveProperty("id");
    expect(payload.member).not.toHaveProperty("status");
    expect(payload.member).not.toHaveProperty("priority");
    expect(payload.member).not.toHaveProperty("approvedBy");
    expect(payload.member).not.toHaveProperty("approvedAt");
  });
});

describe("GET /members/", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("lists only approved members", async () => {
    await createMember({
      githubUsername: "approved-a",
      status: "approved",
      approvedAt: new Date(),
    });
    await createMember({ githubUsername: "pending-b", status: "pending" });
    await createMember({ githubUsername: "rejected-c", status: "rejected" });
    await createMember({ githubUsername: "hidden-d", status: "hidden" });
    mockSessionAs(null);

    const response = await getDirectory();
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { members: { githubUsername: string }[] };
    expect(payload.members.map((member) => member.githubUsername)).toEqual(["approved-a"]);
  });

  it("orders by priority desc, then approvedAt desc", async () => {
    const early = new Date("2026-01-01T00:00:00.000Z");
    const late = new Date("2026-06-01T00:00:00.000Z");
    await createMember({
      githubUsername: "low",
      status: "approved",
      priority: 0,
      approvedAt: late,
    });
    await createMember({
      githubUsername: "high-old",
      status: "approved",
      priority: 5,
      approvedAt: early,
    });
    await createMember({
      githubUsername: "high-new",
      status: "approved",
      priority: 5,
      approvedAt: late,
    });
    await createMember({
      githubUsername: "low-old",
      status: "approved",
      priority: 0,
      approvedAt: early,
    });
    mockSessionAs(null);

    const response = await getDirectory();
    const payload = (await response.json()) as { members: { githubUsername: string }[] };
    expect(payload.members.map((member) => member.githubUsername)).toEqual([
      "high-new",
      "high-old",
      "low",
      "low-old",
    ]);
  });
});
