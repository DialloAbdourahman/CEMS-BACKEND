/*
  Warnings:

  - Added the required column `location` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "location" TEXT NOT NULL;
