import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global { var prisma: PrismaClient | undefined }

function createClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const db = globalThis.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
export { db }
