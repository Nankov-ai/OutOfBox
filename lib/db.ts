import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global { var prisma: PrismaClient | undefined }

function createClient() {
  const connectionString = process.env.DATABASE_URL!
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const db = globalThis.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
export { db }
