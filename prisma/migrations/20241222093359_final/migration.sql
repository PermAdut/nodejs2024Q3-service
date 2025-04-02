/*
  Warnings:

  - A unique constraint covering the columns `[idAirlines]` on the table `Sale_tickets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idFlight]` on the table `Sale_tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantity` to the `Sale_tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale_tickets" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_tickets_idAirlines_key" ON "Sale_tickets"("idAirlines");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_tickets_idFlight_key" ON "Sale_tickets"("idFlight");
