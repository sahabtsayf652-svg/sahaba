import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { ideas } from '@/db/schemas/ideas'
import { users } from '@/db/schemas/users'
import { violations } from '@/db/schemas/ideas'
import { eq } from 'drizzle-orm'
import { getAuthUser, generateId } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { id } = await params
  const { action, reason } = await req.json()

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1)
  if (!idea) return NextResponse.json({ error: 'المحتوى غير موجود' }, { status: 404 })

  if (action === 'delete') {
    await db.update(ideas).set({ status: 'deleted', updatedAt: new Date() }).where(eq(ideas.id, id))

    // Log violation
    await db.insert(violations).values({
      id: generateId(),
      reportedContentId: id,
      reportedUserId: idea.userId,
      reason: reason || 'محتوى مخالف',
      action: 'deleted',
      resolvedAt: new Date(),
    })

    return NextResponse.json({ success: true, message: 'تم حذف المحتوى' })
  }

  if (action === 'suspend') {
    await db.update(ideas).set({ status: 'suspended', updatedAt: new Date() }).where(eq(ideas.id, id))

    await db.insert(violations).values({
      id: generateId(),
      reportedContentId: id,
      reportedUserId: idea.userId,
      reason: reason || 'محتوى مشبوه',
      action: 'warned',
      resolvedAt: new Date(),
    })

    return NextResponse.json({ success: true, message: 'تم تعليق المحتوى' })
  }

  if (action === 'restore') {
    await db.update(ideas).set({ status: 'active', updatedAt: new Date() }).where(eq(ideas.id, id))
    return NextResponse.json({ success: true, message: 'تم استعادة المحتوى' })
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
}
