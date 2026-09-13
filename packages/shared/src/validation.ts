import { z } from "zod";

import { SKILLS, skillSchema } from "./skills";

// biome-ignore lint/suspicious/noControlCharactersInRegex: rejecting control characters is the purpose of these validators
const SINGLE_LINE_CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
// biome-ignore lint/suspicious/noControlCharactersInRegex: rejecting control characters (except newline) is the purpose of this validator
const MULTILINE_CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F]/;
const URL_LIKE = /(https?:\/\/|www\.)\S+/i;

function singleLine(max: number): z.ZodString {
  return z
    .string()
    .trim()
    .max(max)
    .refine((value) => !SINGLE_LINE_CONTROL_CHARS.test(value), {
      message: "Must not contain control characters",
    });
}

export const displayNameSchema = singleLine(80)
  .min(1, { message: "Display name is required" })
  .refine((value) => !URL_LIKE.test(value), { message: "Display name must not contain a URL" });

export const headlineSchema = singleLine(120);
export const affiliationSchema = singleLine(120);
export const locationSchema = singleLine(80);

export const bioSchema = z
  .string()
  .max(400, { message: "Bio must be at most 400 characters" })
  .refine((value) => !MULTILINE_CONTROL_CHARS.test(value), {
    message: "Bio must not contain control characters",
  });

export const linkSchema = z
  .url({ message: "Each link must be a valid URL" })
  .max(500, { message: "Each link must be at most 500 characters" })
  .refine((value) => value.startsWith("https://"), { message: "Links must use HTTPS" });

function uniqueArray<T>(items: T[]): boolean {
  return new Set(items).size === items.length;
}

export const linksSchema = z
  .array(linkSchema)
  .max(5, { message: "At most 5 links are allowed" })
  .refine(uniqueArray, { message: "Links must be unique" });

export const skillsSchema = z
  .array(skillSchema)
  .max(SKILLS.length, { message: "Too many skills" })
  .refine(uniqueArray, { message: "Skills must be unique" });

/**
 * Payload for PATCH /profile/. Strict: any unknown key (id, githubId,
 * githubUsername, status, priority, avatarPath, ...) is rejected outright.
 */
export const profileUpdateSchema = z
  .object({
    displayName: displayNameSchema.optional(),
    headline: headlineSchema.nullable().optional(),
    affiliation: affiliationSchema.nullable().optional(),
    location: locationSchema.nullable().optional(),
    bio: bioSchema.nullable().optional(),
    links: linksSchema.optional(),
    skills: skillsSchema.optional(),
  })
  .strict();

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export const memberStatusSchema = z.enum(["pending", "approved", "rejected", "hidden"]);

/** Payload for PATCH /admin/members/{id}. Strict: admins may only set these fields. */
export const adminMemberUpdateSchema = z
  .object({
    status: memberStatusSchema.optional(),
    priority: z.number().int().optional(),
  })
  .strict()
  .refine((value) => value.status !== undefined || value.priority !== undefined, {
    message: "At least one of status or priority is required",
  });

export type AdminMemberUpdate = z.infer<typeof adminMemberUpdateSchema>;
