/*
  Warnings:

  - Added the required column `currentGuess` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN "isRoundOver" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "currentWord" TEXT,
    "currentWordMasterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_currentWordMasterId_fkey" FOREIGN KEY ("currentWordMasterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
