import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const memberStatusEnum = pgEnum("member_status", [
  "pending",
  "approved",
  "rejected",
  "hidden",
]);

export type MemberStatus = (typeof memberStatusEnum.enumValues)[number];

export const members = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    githubId: bigint("github_id", { mode: "number" }).notNull(),
    githubUsername: varchar("github_username", { length: 39 }).notNull(),
    avatarPath: varchar("avatar_path", { length: 255 }),
    displayName: varchar("display_name", { length: 80 }).notNull(),
    headline: varchar("headline", { length: 120 }),
    affiliation: varchar("affiliation", { length: 120 }),
    location: varchar("location", { length: 80 }),
    bio: varchar("bio", { length: 400 }),
    links: jsonb("links").$type<string[]>().notNull().default([]),
    skills: jsonb("skills").$type<string[]>().notNull().default([]),
    status: memberStatusEnum("status").notNull().default("pending"),
    priority: integer("priority").notNull().default(0),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    approvedBy: uuid("approved_by").references((): AnyPgColumn => members.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("members_github_id_uq").on(table.githubId),
    uniqueIndex("members_github_username_lower_uq").on(sql`lower(${table.githubUsername})`),
    index("members_directory_idx").on(table.status, table.priority.desc(), table.approvedAt.desc()),
  ],
);

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    githubRepoId: bigint("github_repo_id", { mode: "number" }).notNull(),
    fullName: varchar("full_name", { length: 250 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: varchar("description", { length: 500 }),
    htmlUrl: varchar("html_url", { length: 300 }).notNull(),
    license: varchar("license", { length: 100 }),
    isActive: boolean("is_active").notNull().default(true),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("projects_github_repo_id_uq").on(table.githubRepoId)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type IssueLabel = {
  name: string;
  color: string;
};

export const githubIssues = pgTable(
  "github_issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    body: text("body"),
    state: varchar("state", { length: 10 }).notNull().default("open"),
    labels: jsonb("labels").$type<IssueLabel[]>().notNull().default([]),
    authorLogin: varchar("author_login", { length: 100 }).notNull(),
    authorAvatarUrl: varchar("author_avatar_url", { length: 300 }),
    htmlUrl: varchar("html_url", { length: 300 }).notNull(),
    commentsCount: integer("comments_count").notNull().default(0),
    source: varchar("source", { length: 10 }).notNull().default("github"),
    createdAtGithub: timestamp("created_at_github", { withTimezone: true }).notNull(),
    updatedAtGithub: timestamp("updated_at_github", { withTimezone: true }).notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("github_issues_project_number_uq").on(table.projectId, table.number),
    index("github_issues_project_state_idx").on(
      table.projectId,
      table.state,
      table.updatedAtGithub.desc(),
    ),
  ],
);

export type GithubIssue = typeof githubIssues.$inferSelect;
export type NewGithubIssue = typeof githubIssues.$inferInsert;

export const githubEvents = pgTable(
  "github_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deliveryId: varchar("delivery_id", { length: 100 }).notNull(),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    action: varchar("action", { length: 50 }),
    repositoryFullName: varchar("repository_full_name", { length: 250 }),
    signatureValid: boolean("signature_valid").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("received"),
    error: text("error"),
    payload: jsonb("payload").$type<unknown>(),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("github_events_delivery_id_uq").on(table.deliveryId),
    index("github_events_status_idx").on(table.status, table.receivedAt.desc()),
  ],
);

export type GithubEvent = typeof githubEvents.$inferSelect;
export type NewGithubEvent = typeof githubEvents.$inferInsert;
