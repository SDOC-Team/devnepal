import { z } from "zod";

import { skillSchema } from "./skills";

export const publicMemberDtoSchema = z.object({
  githubId: z.number().int().positive(),
  githubUsername: z.string(),
  displayName: z.string(),
  headline: z.string().nullable(),
  affiliation: z.string().nullable(),
  location: z.string().nullable(),
  bio: z.string().nullable(),
  links: z.array(z.string()),
  skills: z.array(skillSchema),
  avatarUrl: z.string().nullable(),
});

export type PublicMemberDto = z.infer<typeof publicMemberDtoSchema>;

export const selfMemberDtoSchema = publicMemberDtoSchema.extend({
  id: z.uuid(),
  status: z.enum(["pending", "approved", "rejected", "hidden"]),
  approvedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SelfMemberDto = z.infer<typeof selfMemberDtoSchema>;

export const adminMemberDtoSchema = selfMemberDtoSchema.extend({
  priority: z.number().int(),
  approvedBy: z.uuid().nullable(),
});

export type AdminMemberDto = z.infer<typeof adminMemberDtoSchema>;
