ALTER TABLE "receipts" ALTER COLUMN "paid_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "code" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "is_valid" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "valid_date" timestamp NOT NULL;