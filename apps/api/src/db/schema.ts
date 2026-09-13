import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigint,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
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
