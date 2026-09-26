-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('REFLECTION', 'GROWTH_PLAN');

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "type" "SessionType" NOT NULL DEFAULT 'REFLECTION';
