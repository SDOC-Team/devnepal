import { z } from "zod";

export const projectDtoSchema = z.object({
  githubRepoId: z.number().int().positive(),
  fullName: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  htmlUrl: z.string(),
  license: z.string().nullable(),
  openIssueCount: z.number().int().nonnegative(),
  memberCount: z.number().int().nonnegative(),
  lastSyncedAt: z.string().nullable(),
});

export type ProjectDto = z.infer<typeof projectDtoSchema>;

export const issueLabelDtoSchema = z.object({
  name: z.string(),
  color: z.string().regex(/^[0-9a-fA-F]{6}$/),
});

export type IssueLabelDto = z.infer<typeof issueLabelDtoSchema>;

export const issueDtoSchema = z.object({
  number: z.number().int().positive(),
  title: z.string(),
  body: z.string().nullable(),
  state: z.enum(["open", "closed"]),
  labels: z.array(issueLabelDtoSchema),
  authorLogin: z.string(),
  authorAvatarUrl: z.string().nullable(),
  htmlUrl: z.string(),
  commentsCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IssueDto = z.infer<typeof issueDtoSchema>;

export const issueListParamsSchema = z.object({
  label: z.string().trim().min(1).max(100).optional(),
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(20),
});

export type IssueListParams = z.infer<typeof issueListParamsSchema>;

export const issueListDtoSchema = z.object({
  issues: z.array(issueDtoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  perPage: z.number().int().positive(),
});

export type IssueListDto = z.infer<typeof issueListDtoSchema>;

export const labelFacetDtoSchema = z.object({
  name: z.string(),
  count: z.number().int().nonnegative(),
});

export type LabelFacetDto = z.infer<typeof labelFacetDtoSchema>;
