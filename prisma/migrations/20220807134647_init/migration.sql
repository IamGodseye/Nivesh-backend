/*
  Warnings:

  - Added the required column `IP` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "IP" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
