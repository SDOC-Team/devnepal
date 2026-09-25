import { auth } from "@/auth";
import { isAdminGithubId } from "@/config";
import type { Member } from "@/db/schema";

import { UnauthorizedError } from "./errors";
import { findById } from "./members/repository";

/**
 * The single authentication seam. Every authenticated read/write resolves the
 * actor through here — status is always re-read from the database, never taken
 * from the session token. A future Bearer-token credential for mobile clients
 * plugs in at this one place.
 */
export async function getActor(): Promise<Member | null> {
  const session = await auth();
  const memberId = session?.user?.id;
  if (typeof memberId !== "string" || memberId.length === 0) {
    return null;
  }
  return findById(memberId);
}

export async function requireActor(): Promise<Member> {
  const actor = await getActor();
  if (actor === null) {
    throw new UnauthorizedError();
  }
  return actor;
}

export function isAdminActor(actor: Member): boolean {
  return isAdminGithubId(actor.githubId);
}
