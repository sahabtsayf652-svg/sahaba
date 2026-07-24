ALTER TYPE "public"."content_type" ADD VALUE 'design';--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "idea_category" text;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "novel_genre" text;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "novel_status" text;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "design_category" text;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "media_url" text;