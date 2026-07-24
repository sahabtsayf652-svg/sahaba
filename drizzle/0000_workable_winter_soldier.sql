CREATE TYPE "public"."content_status" AS ENUM('active', 'deleted', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('idea', 'novel');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('free', 'paid');--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"preview" text,
	"type" "content_type" DEFAULT 'idea' NOT NULL,
	"visibility" "visibility" DEFAULT 'free' NOT NULL,
	"price" integer DEFAULT 0,
	"status" "content_status" DEFAULT 'active' NOT NULL,
	"written_at" text NOT NULL,
	"purchase_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"chapters" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"idea_id" text NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "violations" (
	"id" text PRIMARY KEY NOT NULL,
	"reported_content_id" text NOT NULL,
	"reported_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"resolved_at" timestamp,
	"action" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"display_name" text,
	"avatar_url" text,
	"birth_date" text,
	"country" text,
	"age" integer,
	"gender" text,
	"contact_info" text,
	"bio" text,
	"profile_completed" boolean DEFAULT false NOT NULL,
	"is_suspended" boolean DEFAULT false NOT NULL,
	"suspended_until" timestamp,
	"suspension_count" integer DEFAULT 0 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
