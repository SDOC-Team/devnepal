CREATE TABLE "github_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_id" varchar(100) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"action" varchar(50),
	"repository_full_name" varchar(250),
	"signature_valid" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'received' NOT NULL,
	"error" text,
	"payload" jsonb,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "github_events_delivery_id_uq" ON "github_events" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "github_events_status_idx" ON "github_events" USING btree ("status","received_at" DESC NULLS LAST);