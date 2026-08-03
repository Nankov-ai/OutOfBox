import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global { var prisma: PrismaClient | undefined }

function createClient() {
  let url = process.env.DATABASE_URL!
  if (process.env.NODE_ENV === 'production' && !url.includes('sslmode')) {
    url += '?uselibpqcompat=true&sslmode=require'
  }
  const adapter = new PrismaPg(url)
  return new PrismaClient({ adapter })
}

const db = globalThis.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
export { db }
