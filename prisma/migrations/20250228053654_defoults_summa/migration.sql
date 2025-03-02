-- AlterTable
ALTER TABLE "Banner" ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT 5000,
ALTER COLUMN "status" SET DEFAULT false;
