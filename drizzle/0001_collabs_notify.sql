CREATE TABLE "winchester"."collabs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role_ro" text DEFAULT '' NOT NULL,
	"role_ru" text DEFAULT '' NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."notify_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"telegram_token" text DEFAULT '' NOT NULL,
	"telegram_chat_id" text DEFAULT '' NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
