/*
  Warnings:

  - Made the column `phoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userRole` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "refreshTokens" SET NOT NULL,
ALTER COLUMN "refreshTokens" SET DATA TYPE TEXT,
ALTER COLUMN "userRole" SET NOT NULL;
