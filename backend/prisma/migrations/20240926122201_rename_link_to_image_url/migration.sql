/*
  Warnings:

  - You are about to drop the column `link` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `eventDate` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "link",
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT;
