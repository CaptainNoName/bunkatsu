ALTER TABLE "receipts" ADD COLUMN "paid_by" text;--> statement-breakpoint
UPDATE "receipts" SET "paid_by" = "user_id" WHERE "paid_by" IS NULL;--> statement-breakpoint
ALTER TABLE "receipts" ALTER COLUMN "paid_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_paid_by_user_id_fk" FOREIGN KEY ("paid_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;