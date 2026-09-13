import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { type Member, members, type NewMember } from "@/db/schema";

export async function findById(id: string): Promise<Member | null> {
  const rows = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function findByGithubId(githubId: number): Promise<Member | null> {
  const rows = await db.select().from(members).where(eq(members.githubId, githubId)).limit(1);
  return rows[0] ?? null;
}

export async function findByGithubUsername(username: string): Promise<Member | null> {
  const rows = await db
    .select()
    .from(members)
    .where(sql`lower(${members.githubUsername}) = ${username.toLowerCase()}`)
    .limit(1);
  return rows[0] ?? null;
}

export async function listDirectory(): Promise<Member[]> {
  return db
    .select()
    .from(members)
    .where(eq(members.status, "approved"))
    .orderBy(desc(members.priority), sql`${members.approvedAt} desc nulls last`);
}

export async function listByStatus(status: Member["status"]): Promise<Member[]> {
  return db
    .select()
    .from(members)
    .where(eq(members.status, status))
    .orderBy(desc(members.priority), sql`${members.createdAt} asc`);
}

export async function insertMember(values: NewMember): Promise<Member | null> {
  const rows = await db.insert(members).values(values).onConflictDoNothing().returning();
  return rows[0] ?? null;
}

export async function updateMemberFields(
  id: string,
  values: Partial<Omit<NewMember, "id">>,
): Promise<Member | null> {
  if (Object.keys(values).length === 0) {
    return findById(id);
  }
  const rows = await db.update(members).set(values).where(eq(members.id, id)).returning();
  return rows[0] ?? null;
}

export async function listAll(): Promise<Member[]> {
  return db
    .select()
    .from(members)
    .orderBy(asc(members.status), desc(members.priority), asc(members.createdAt));
}
