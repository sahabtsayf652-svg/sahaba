import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { ideas } from '@/db/schemas/ideas'
import { eq, desc } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { id } = await params
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

  const userIdeas = await db
    .select()
    .from(ideas)
    .where(eq(ideas.userId, id))
    .orderBy(desc(ideas.createdAt))
    .limit(30)

  const { passwordHash, ...safeUser } = user
  return NextResponse.json({ user: safeUser, ideas: userIdeas })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { action } = body

  const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!target) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
  if (target.isAdmin) return NextResponse.json({ error: 'لا يمكن تعديل حساب مشرف آخر' }, { status: 403 })

  if (action === 'suspend_month') {
    const until = new Date()
    until.setMonth(until.getMonth() + 1)
    await db.update(users).set({
      isSuspended: true,
      suspendedUntil: until,
      suspensionCount: (target.suspensionCount || 0) + 1,
      updatedAt: new Date(),
    }).where(eq(users.id, id))
    return NextResponse.json({ success: true, message: 'تم تعليق الحساب شهراً كاملاً' })
  }

  if (action === 'unsuspend') {
    await db.update(users).set({
      isSuspended: false,
      suspendedUntil: null,
      updatedAt: new Date(),
    }).where(eq(users.id, id))
    return NextResponse.json({ success: true, message: 'تم رفع التعليق' })
  }

  if (action === 'delete_permanent') {
    await db.update(users).set({
      isDeleted: true,
      updatedAt: new Date(),
    }).where(eq(users.id, id))
    // Also delete all their content
    await db.update(ideas).set({ status: 'deleted' }).where(eq(ideas.userId, id))
    return NextResponse.json({ success: true, message: 'تم حذف الحساب نهائياً' })
  }

  if (action === 'make_admin') {
    await db.update(users).set({ isAdmin: true, updatedAt: new Date() }).where(eq(users.id, id))
    return NextResponse.json({ success: true, message: 'تم تعيين المستخدم كمشرف' })
  }

  if (action === 'remove_admin') {
    await db.update(users).set({ isAdmin: false, updatedAt: new Date() }).where(eq(users.id, id))
    return NextResponse.json({ success: true, message: 'تم إزالة صلاحيات الإدارة' })
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
}
