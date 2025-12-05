CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image_url" text NOT NULL,
	CONSTRAINT "characters_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"tier" text NOT NULL,
	"session_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;