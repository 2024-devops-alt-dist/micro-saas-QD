/*
  Warnings:

  - Added the required column `household_id` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "household_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
