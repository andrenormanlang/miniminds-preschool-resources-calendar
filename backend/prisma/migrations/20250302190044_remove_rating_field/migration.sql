/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "imageUrl",
DROP COLUMN "rating";
