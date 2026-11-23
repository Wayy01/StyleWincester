CREATE TABLE "winchester"."palette_swatches" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_ro" text NOT NULL,
	"name_ru" text NOT NULL,
	"note_ro" text DEFAULT '' NOT NULL,
	"note_ru" text DEFAULT '' NOT NULL,
	"color" text NOT NULL,
	"photo" text NOT NULL,
	"photo_width" integer DEFAULT 4 NOT NULL,
	"photo_height" integer DEFAULT 5 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
