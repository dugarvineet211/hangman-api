-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "roomHash" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "playerCount" INTEGER NOT NULL DEFAULT 0,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomHash_key" ON "Room"("roomHash");

-- CreateIndex
CREATE UNIQUE INDEX "Room_creatorId_key" ON "Room"("creatorId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
