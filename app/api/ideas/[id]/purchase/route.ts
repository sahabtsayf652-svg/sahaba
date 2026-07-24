import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { ideas, purchases } from '@/db/schemas/ideas'
import { eq, and } from 'drizzle-orm'
import { getAuthUser, generateId } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1)
  if (!idea || idea.status !== 'active') return NextResponse.json({ error: 'الفكرة غير موجودة' }, { status: 404 })

  if (idea.userId === user.id) return NextResponse.json({ error: 'لا يمكنك شراء فكرتك الخاصة' }, { status: 400 })
  if (idea.visibility !== 'paid') return NextResponse.json({ error: 'هذه الفكرة مجانية' }, { status: 400 })

  // Check if already purchased
  const [existing] = await db
    .select()
    .from(purchases)
    .where(and(eq(purchases.userId, user.id), eq(purchases.ideaId, id)))
    .limit(1)

  if (existing) return NextResponse.json({ error: 'لقد اشتريت هذه الفكرة مسبقاً' }, { status: 400 })

  // Record purchase
  const purchaseId = generateId()
  await db.insert(purchases).values({
    id: purchaseId,
    userId: user.id,
    ideaId: id,
    amount: idea.price || 0,
  })

  await db.update(ideas).set({
    purchaseCount: (idea.purchaseCount || 0) + 1,
  }).where(eq(ideas.id, id))

  return NextResponse.json({ success: true, message: 'تم الشراء بنجاح' })
}
