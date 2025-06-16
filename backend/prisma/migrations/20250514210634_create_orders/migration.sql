/*
  Warnings:

  - You are about to drop the column `table` on the `Order` table. All the data in the column will be lost.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mesa` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "table",
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "mesa" TEXT NOT NULL,
ADD COLUMN     "observacao" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Aguardando';
