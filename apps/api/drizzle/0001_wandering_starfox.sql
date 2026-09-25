CREATE TABLE "github_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"title" varchar(300) NOT NULL,
	"body" text,
	"state" varchar(10) DEFAULT 'open' NOT NULL,
	"labels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_login" varchar(100) NOT NULL,
	"author_avatar_url" varchar(300),
	"html_url" varchar(300) NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"source" varchar(10) DEFAULT 'github' NOT NULL,
	"created_at_github" timestamp with time zone NOT NULL,
	"updated_at_github" timestamp with time zone NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_repo_id" bigint NOT NULL,
	"full_name" varchar(250) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" varchar(500),
	"html_url" varchar(300) NOT NULL,
	"license" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_issues_project_number_uq" ON "github_issues" USING btree ("project_id","number");--> statement-breakpoint
CREATE INDEX "github_issues_project_state_idx" ON "github_issues" USING btree ("project_id","state","updated_at_github" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "projects_github_repo_id_uq" ON "projects" USING btree ("github_repo_id");