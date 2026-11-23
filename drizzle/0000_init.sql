CREATE SCHEMA IF NOT EXISTS "winchester";
--> statement-breakpoint
CREATE TABLE "winchester"."admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "winchester"."bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"instagram" text DEFAULT '' NOT NULL,
	"service_id" integer,
	"service_label" text DEFAULT '' NOT NULL,
	"preferred_date" text DEFAULT '' NOT NULL,
	"preferred_time" text DEFAULT '' NOT NULL,
	"hair_length" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"locale" text DEFAULT 'ro' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_ro" text NOT NULL,
	"question_ru" text NOT NULL,
	"answer_ro" text NOT NULL,
	"answer_ru" text NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title_ro" text NOT NULL,
	"title_ru" text NOT NULL,
	"excerpt_ro" text DEFAULT '' NOT NULL,
	"excerpt_ru" text DEFAULT '' NOT NULL,
	"body_ro" text DEFAULT '' NOT NULL,
	"body_ru" text DEFAULT '' NOT NULL,
	"cover" text,
	"video" text,
	"topic_ro" text DEFAULT '' NOT NULL,
	"topic_ru" text DEFAULT '' NOT NULL,
	"reading_min" integer DEFAULT 3 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."service_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name_ro" text NOT NULL,
	"name_ru" text NOT NULL,
	"intro_ro" text DEFAULT '' NOT NULL,
	"intro_ru" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "service_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "winchester"."services" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name_ro" text NOT NULL,
	"name_ru" text NOT NULL,
	"note_ro" text DEFAULT '' NOT NULL,
	"note_ru" text DEFAULT '' NOT NULL,
	"price_from" integer NOT NULL,
	"price_to" integer,
	"is_from" boolean DEFAULT false NOT NULL,
	"duration_min" integer DEFAULT 60 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"service_ro" text DEFAULT '' NOT NULL,
	"service_ru" text DEFAULT '' NOT NULL,
	"text_ro" text NOT NULL,
	"text_ru" text NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winchester"."works" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_ro" text NOT NULL,
	"title_ru" text NOT NULL,
	"caption_ro" text DEFAULT '' NOT NULL,
	"caption_ru" text DEFAULT '' NOT NULL,
	"tag" text DEFAULT 'cut' NOT NULL,
	"kind" text DEFAULT 'photo' NOT NULL,
	"src" text NOT NULL,
	"poster" text,
	"width" integer,
	"height" integer,
	"credit" text DEFAULT '' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "winchester"."bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "winchester"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "winchester"."services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "winchester"."service_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "winchester"."bookings" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "winchester"."posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "winchester"."posts" USING btree ("published","published_at");--> statement-breakpoint
CREATE INDEX "services_category_idx" ON "winchester"."services" USING btree ("category_id","sort");--> statement-breakpoint
CREATE INDEX "works_sort_idx" ON "winchester"."works" USING btree ("published","sort");