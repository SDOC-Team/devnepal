import { type AdminMemberUpdate, displayNameSchema, type ProfileUpdate } from "@gov-portal/shared";

import { isAdminGithubId } from "@/config";
import type { Member, MemberStatus, NewMember } from "@/db/schema";

import { storeGithubAvatar } from "../avatars";
import { ForbiddenError, NotFoundError } from "../errors";

import * as repo from "./repository";

export type GithubIdentity = {
  githubId: number;
  githubUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
};

function initialDisplayName(provided: string | null, username: string): string {
  const fromGithub = displayNameSchema.safeParse(provided ?? "");
  if (fromGithub.success) {
    return fromGithub.data;
  }
  const fromUsername = displayNameSchema.safeParse(username);
  if (fromUsername.success) {
    return fromUsername.data;
  }
  return "Member";
}

/**
 * Idempotent first-login provisioning. Creates the member as `pending`,
 * downloads the GitHub avatar once, and later refreshes only the mutable
 * GitHub identity (username) or a still-missing avatar.
 */
export async function ensureMemberFromGithubLogin(identity: GithubIdentity): Promise<Member> {
  const existing = await repo.findByGithubId(identity.githubId);
  if (existing !== null) {
    const updates: Partial<Omit<NewMember, "id">> = {};
    if (existing.githubUsername !== identity.githubUsername) {
      updates.githubUsername = identity.githubUsername;
    }
    if (existing.avatarPath === null && identity.avatarUrl !== null) {
      const stored = await storeGithubAvatar(identity.githubId, identity.avatarUrl);
      if (stored !== null) {
        updates.avatarPath = stored;
      }
    }
    if (Object.keys(updates).length === 0) {
      return existing;
    }
    const updated = await repo.updateMemberFields(existing.id, updates);
    if (updated === null) {
      throw new Error(`Member ${existing.id} disappeared while updating the GitHub identity`);
    }
    return updated;
  }

  const avatarPath =
    identity.avatarUrl !== null
      ? await storeGithubAvatar(identity.githubId, identity.avatarUrl)
      : null;

  const created = await repo.insertMember({
    githubId: identity.githubId,
    githubUsername: identity.githubUsername,
    avatarPath,
    displayName: initialDisplayName(identity.displayName, identity.githubUsername),
    status: "pending",
  });
  if (created !== null) {
    return created;
  }

  const raced = await repo.findByGithubId(identity.githubId);
  if (raced === null) {
    throw new Error(`Member creation raced but no row exists for GitHub id ${identity.githubId}`);
  }
  return raced;
}

function normalizeOptionalText(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Self-write only: the target is exclusively `actor.id`. The update payload is
 * validated upstream with a strict schema, so it cannot carry another member's
 * id, GitHub id, or username.
 */
export async function updateOwnProfile(actor: Member, update: ProfileUpdate): Promise<Member> {
  const values: Partial<Omit<NewMember, "id">> = {};
  if (update.displayName !== undefined) {
    values.displayName = update.displayName;
  }
  if (update.headline !== undefined) {
    values.headline = normalizeOptionalText(update.headline);
  }
  if (update.affiliation !== undefined) {
    values.affiliation = normalizeOptionalText(update.affiliation);
  }
  if (update.location !== undefined) {
    values.location = normalizeOptionalText(update.location);
  }
  if (update.bio !== undefined) {
    values.bio = normalizeOptionalText(update.bio);
  }
  if (update.links !== undefined) {
    values.links = update.links;
  }
  if (update.skills !== undefined) {
    values.skills = update.skills;
  }

  const updated = await repo.updateMemberFields(actor.id, values);
  if (updated === null) {
    throw new NotFoundError("Member not found");
  }
  return updated;
}

function canView(member: Member, viewer: Member | null): boolean {
  return member.status === "approved" || (viewer !== null && viewer.id === member.id);
}

export async function getVisibleMemberByUsername(
  username: string,
  viewer: Member | null,
): Promise<Member> {
  const member = await repo.findByGithubUsername(username);
  if (member === null || !canView(member, viewer)) {
    throw new NotFoundError("Member not found");
  }
  return member;
}

export async function getVisibleMemberByGithubId(
  githubId: number,
  viewer: Member | null,
): Promise<Member> {
  const member = await repo.findByGithubId(githubId);
  if (member === null || !canView(member, viewer)) {
    throw new NotFoundError("Member not found");
  }
  return member;
}

export async function listDirectoryMembers(): Promise<Member[]> {
  return repo.listDirectory();
}

export function assertAdmin(actor: Member): void {
  if (!isAdminGithubId(actor.githubId)) {
    throw new ForbiddenError("Admin access required");
  }
}

export async function adminListMembers(
  actor: Member,
  status: MemberStatus | undefined,
): Promise<Member[]> {
  assertAdmin(actor);
  if (status === undefined) {
    return repo.listAll();
  }
  return repo.listByStatus(status);
}

export async function adminUpdateMember(
  actor: Member,
  targetId: string,
  update: AdminMemberUpdate,
): Promise<Member> {
  assertAdmin(actor);

  const values: Partial<Omit<NewMember, "id">> = {};
  if (update.status !== undefined) {
    values.status = update.status;
    if (update.status === "approved") {
      values.approvedAt = new Date();
      values.approvedBy = actor.id;
    }
  }
  if (update.priority !== undefined) {
    values.priority = update.priority;
  }

  const updated = await repo.updateMemberFields(targetId, values);
  if (updated === null) {
    throw new NotFoundError("Member not found");
  }
  return updated;
}
