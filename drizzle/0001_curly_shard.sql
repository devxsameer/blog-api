DROP INDEX "post_views_unique_idx";--> statement-breakpoint
DROP INDEX "post_views_post_idx";--> statement-breakpoint
ALTER TABLE "post_views" ADD COLUMN "view_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "post_views_unique_daily_idx" ON "post_views" USING btree ("post_id","ip_address","view_date");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_views_post_idx" ON "post_views" USING btree ("post_id");