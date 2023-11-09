/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Hall` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "hall" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Hall_name_key" ON "Hall"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Post_name_key" ON "Post"("name");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_hall_fkey" FOREIGN KEY ("hall") REFERENCES "Hall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
