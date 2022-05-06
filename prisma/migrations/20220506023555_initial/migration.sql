-- CreateEnum
CREATE TYPE "Apps" AS ENUM ('MOBILE', 'DESKTOP', 'WEB');

-- CreateTable
CREATE TABLE "betaCode" (
    "id" TEXT NOT NULL,

    CONSTRAINT "betaCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayname" TEXT,
    "flags" TEXT[],
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "client_ip" TEXT NOT NULL,
    "client_user_agent" TEXT NOT NULL,
    "client_app" "Apps" NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "images" TEXT[],
    "flags" TEXT[],
    "replies" TEXT[],
    "posted" TIMESTAMP(3) NOT NULL,
    "author" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
