import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { PATCH as adminPatch } from "@/app/v1/admin/members/[id]/route";
import { GET as adminList } from "@/app/v1/admin/members/route";
import { db } from "@/db/client";
import { members } from "@/db/schema";

import { resetDatabase } from "../helpers/db";
import { ADMIN_GITHUB_ID, createMember } from "../helpers/factories";
import { jsonRequest, mockSessionAs } from "../helpers/session";

function patchRequest(id: string, body: unknown): Request {
  return jsonRequest(`http://localhost:3000/v1/admin/members/${id}`, "PATCH", { body });
}

function patchContext(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

async function createAdmin() {
  return createMember({
    githubId: ADMIN_GITHUB_ID,
    githubUsername: "admin-user",
    displayName: "Admin",
    status: "pending",
  });
}

async function loadMember(id: string) {
  const rows = await db.select().from(members).where(eq(members.id, id));
  return rows[0] ?? null;
}

describe("PATCH /v1/admin/members/{id}", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("approves a member and records approvedAt and approvedBy", async () => {
    const admin = await createAdmin();
    const target = await createMember({ githubUsername: "target", status: "pending" });
    mockSessionAs(admin);

    const response = await adminPatch(
      patchRequest(target.id, { status: "approved" }),
      patchContext(target.id),
    );

    expect(response.status).toBe(200);
    const updated = await loadMember(target.id);
    expect(updated?.status).toBe("approved");
    expect(updated?.approvedAt).not.toBeNull();
    expect(updated?.approvedBy).toBe(admin.id);
  });

  it("rejects a member", async () => {
    const admin = await createAdmin();
    const target = await createMember({ githubUsername: "target", status: "pending" });
    mockSessionAs(admin);

    const response = await adminPatch(
      patchRequest(target.id, { status: "rejected" }),
      patchContext(target.id),
    );

    expect(response.status).toBe(200);
    expect((await loadMember(target.id))?.status).toBe("rejected");
  });

  it("hides an approved member", async () => {
    const admin = await createAdmin();
    const target = await createMember({
      githubUsername: "target",
      status: "approved",
      approvedAt: new Date(),
    });
    mockSessionAs(admin);

    const response = await adminPatch(
      patchRequest(target.id, { status: "hidden" }),
      patchContext(target.id),
    );

    expect(response.status).toBe(200);
    expect((await loadMember(target.id))?.status).toBe("hidden");
  });

  it("changes priority", async () => {
    const admin = await createAdmin();
    const target = await createMember({ githubUsername: "target", status: "approved" });
    mockSessionAs(admin);

    const response = await adminPatch(
      patchRequest(target.id, { priority: 25 }),
      patchContext(target.id),
    );

    expect(response.status).toBe(200);
    expect((await loadMember(target.id))?.priority).toBe(25);
  });

  it("blocks non-admin members", async () => {
    const member = await createMember({ githubUsername: "not-admin" });
    const target = await createMember({ githubUsername: "target", status: "pending" });
    mockSessionAs(member);

    const response = await adminPatch(
      patchRequest(target.id, { status: "approved" }),
      patchContext(target.id),
    );

    expect(response.status).toBe(403);
    expect((await loadMember(target.id))?.status).toBe("pending");
  });

  it("blocks unauthenticated calls", async () => {
    const target = await createMember({ githubUsername: "target", status: "pending" });
    mockSessionAs(null);

    const response = await adminPatch(
      patchRequest(target.id, { status: "approved" }),
      patchContext(target.id),
    );

    expect(response.status).toBe(401);
    expect((await loadMember(target.id))?.status).toBe("pending");
  });

  it.each([
    ["unknown field", { githubId: 1 }],
    ["invalid status", { status: "published" }],
    ["empty body", {}],
  ])("rejects %s", async (_label, body) => {
    const admin = await createAdmin();
    const target = await createMember({ githubUsername: "target", status: "pending" });
    mockSessionAs(admin);

    const response = await adminPatch(patchRequest(target.id, body), patchContext(target.id));

    expect(response.status).toBe(400);
    expect((await loadMember(target.id))?.status).toBe("pending");
  });

  it("returns 404 for unknown and malformed ids", async () => {
    const admin = await createAdmin();
    mockSessionAs(admin);

    const unknown = await adminPatch(
      patchRequest("00000000-0000-4000-8000-000000000000", { status: "approved" }),
      patchContext("00000000-0000-4000-8000-000000000000"),
    );
    const malformed = await adminPatch(
      patchRequest("not-a-uuid", { status: "approved" }),
      patchContext("not-a-uuid"),
    );

    expect(unknown.status).toBe(404);
    expect(malformed.status).toBe(404);
  });
});

describe("GET /v1/admin/members", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("filters by status", async () => {
    const admin = await createAdmin();
    await createMember({ githubUsername: "pending-a", status: "pending" });
    await createMember({
      githubUsername: "approved-b",
      status: "approved",
      approvedAt: new Date(),
    });
    mockSessionAs(admin);

    const response = await adminList(
      new Request("http://localhost:3000/v1/admin/members?status=pending", { method: "GET" }),
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { members: { githubUsername: string }[] };
    expect(payload.members.map((member) => member.githubUsername)).toEqual([
      "admin-user",
      "pending-a",
    ]);
  });

  it("rejects invalid status filters", async () => {
    const admin = await createAdmin();
    mockSessionAs(admin);

    const response = await adminList(
      new Request("http://localhost:3000/v1/admin/members?status=everything", { method: "GET" }),
    );

    expect(response.status).toBe(400);
  });

  it("blocks non-admins and unauthenticated users", async () => {
    const member = await createMember({ githubUsername: "not-admin" });
    mockSessionAs(member);
    expect((await adminList(new Request("http://localhost:3000/v1/admin/members"))).status).toBe(
      403,
    );

    mockSessionAs(null);
    expect((await adminList(new Request("http://localhost:3000/v1/admin/members"))).status).toBe(
      401,
    );
  });
});
