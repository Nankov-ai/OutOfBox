import { db } from './db'
import { startOfDay, isYesterday, isToday } from 'date-fns'

export async function updateStreak(userId: string) {
  const progress = await db.userProgress.findUnique({ where: { userId } })
  const today = startOfDay(new Date())

  if (!progress) {
    await db.userProgress.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today, totalSessions: 0, totalMessages: 0, totalJournalEntries: 0, totalCheckIns: 0 }
    })
    return
  }

  if (progress.lastActiveDate && isToday(progress.lastActiveDate)) return

  const newStreak = progress.lastActiveDate && isYesterday(progress.lastActiveDate)
    ? progress.currentStreak + 1
    : 1

  await db.userProgress.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastActiveDate: today,
    }
  })
}
