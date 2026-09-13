"use server";

import { profileUpdateSchema } from "@gov-portal/shared";

import { getActor } from "@/server/actor";
import { updateOwnProfile } from "@/server/members/service";

export type SaveProfileResult =
  | { ok: true }
  | { ok: false; message: string; errors: Record<string, string> };

function mapIssues(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "form";
    if (errors[key] === undefined) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export async function saveProfile(input: unknown): Promise<SaveProfileResult> {
  const actor = await getActor();
  if (actor === null) {
    return { ok: false, message: "unauthorized", errors: {} };
  }

  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "validation_error", errors: mapIssues(parsed.error.issues) };
  }

  try {
    await updateOwnProfile(actor, parsed.data);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unexpected error",
      errors: {},
    };
  }
}
