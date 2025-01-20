/*
  Warnings:

  - A unique constraint covering the columns `[authId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_authId_key" ON "users"("authId");
