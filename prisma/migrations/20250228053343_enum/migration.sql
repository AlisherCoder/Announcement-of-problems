/*
  Warnings:

  - The `status` column on the `Banner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
