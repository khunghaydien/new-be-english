/*
  Warnings:

  - Made the column `relativeId` on table `Search` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Search" ALTER COLUMN "relativeId" SET NOT NULL;
