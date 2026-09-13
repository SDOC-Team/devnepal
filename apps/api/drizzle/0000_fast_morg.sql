CREATE TYPE "public"."member_status" AS ENUM('pending', 'approved', 'rejected', 'hidden');--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" bigint NOT NULL,
	"github_username" varchar(39) NOT NULL,
	"avatar_path" varchar(255),
	"display_name" varchar(80) NOT NULL,
	"headline" varchar(120),
	"affiliation" varchar(120),
	"location" varchar(80),
	"bio" varchar(400),
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "member_status" DEFAULT 'pending' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_approved_by_members_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "members_github_id_uq" ON "members" USING btree ("github_id");--> statement-breakpoint
CREATE UNIQUE INDEX "members_github_username_lower_uq" ON "members" USING btree (lower("github_username"));--> statement-breakpoint
CREATE INDEX "members_directory_idx" ON "members" USING btree ("status","priority" DESC NULLS LAST,"approved_at" DESC NULLS LAST);