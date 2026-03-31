import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateStreak } from '@/lib/streak'
import { getDayOfYear } from 'date-fns'

const QUESTIONS_PT = [
  'Que situação na tua vida está atualmente a desafiar-te e o que ela pode estar a tentar ensinar-te?',
  'Se o teu eu do futuro olhasse para hoje, que força estaria a ser construída neste momento difícil?',
  'Que parte de ti está a crescer precisamente por causa do obstáculo que enfrentas agora?',
  'De que forma podes transformar a tua maior frustração atual numa vantagem?',
  'Que decisão pequena e corajosa podes tomar hoje para avançar um passo?',
  'O que é que este desafio te está a forçar a aprender sobre ti próprio?',
  'Se este momento fosse uma bênção disfarçada, qual seria o disfarce e qual seria a bênção?',
  'Que crença limitante está por trás da resistência que sentes agora?',
  'Quem precisas de te tornar para ultrapassar o que estás a enfrentar?',
  'Que vitória pequena conseguiste esta semana que merece ser celebrada?',
]

const QUESTIONS_EN = [
  'What situation in your life is currently challenging you and what might it be trying to teach you?',
  'If your future self looked back at today, what strength is being built right now?',
  'What part of you is growing precisely because of the obstacle you face now?',
  'How can you turn your biggest current frustration into an advantage?',
  'What small, courageous decision can you make today to move one step forward?',
  'What is this challenge forcing you to learn about yourself?',
  'If this moment were a blessing in disguise, what would the disguise be and what would the blessing be?',
  'What limiting belief is behind the resistance you feel right now?',
  'Who do you need to become to overcome what you are facing?',
  'What small victory did you achieve this week that deserves to be celebrated?',
]

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  const locale = user?.preferredLocale ?? 'pt'
  const questions = locale === 'en' ? QUESTIONS_EN : QUESTIONS_PT

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let checkIn = await db.dailyCheckIn.findFirst({
    where: { userId: session.user.id, createdAt: { gte: today } }
  })

  if (!checkIn) {
    const index = getDayOfYear(new Date()) % questions.length
    checkIn = await db.dailyCheckIn.create({
      data: { userId: session.user.id, question: questions[index], locale }
    })
  }

  return NextResponse.json({ checkIn, completed: !!checkIn.completedAt })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { checkInId, response } = await req.json()

  const checkIn = await db.dailyCheckIn.updateMany({
    where: { id: checkInId, userId: session.user.id },
    data: { response, completedAt: new Date() }
  })

  await db.userProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, totalCheckIns: 1 },
    update: { totalCheckIns: { increment: 1 } }
  })
  await updateStreak(session.user.id)

  return NextResponse.json({ checkIn })
}
