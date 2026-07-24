import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { ideas } from '@/db/schemas/ideas'
import { eq, desc, like, or, count, and } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const filter = searchParams.get('filter') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = db.select({
    id: users.id,
    email: users.email,
    displayName: users.displayName,
    firstName: users.firstName,
    lastName: users.lastName,
    country: users.country,
    gender: users.gender,
    isAdmin: users.isAdmin,
    isSuspended: users.isSuspended,
    suspendedUntil: users.suspendedUntil,
    suspensionCount: users.suspensionCount,
    isDeleted: users.isDeleted,
    profileCompleted: users.profileCompleted,
    createdAt: users.createdAt,
  }).from(users).$dynamic()

  const conditions = []
  if (search) {
    conditions.push(or(
      like(users.email, `%${search}%`),
      like(users.displayName, `%${search}%`),
    ))
  }
  if (filter === 'active') conditions.push(and(eq(users.isDeleted, false), eq(users.isSuspended, false)))
  if (filter === 'suspended') conditions.push(eq(users.isSuspended, true))
  if (filter === 'deleted') conditions.push(eq(users.isDeleted, true))

  if (conditions.length > 0) {
    query = query.where(conditions.length === 1 ? conditions[0]! : and(...conditions.filter(Boolean) as Parameters<typeof and>))
  }

  const allUsers = await query.orderBy(desc(users.createdAt)).limit(limit).offset(offset)

  // Count ideas per user
  const ideaCounts = await db.select({
    userId: ideas.userId,
    cnt: count(),
  }).from(ideas).where(eq(ideas.status, 'active')).groupBy(ideas.userId)

  const ideaMap = Object.fromEntries(ideaCounts.map(r => [r.userId, r.cnt]))

  const enriched = allUsers.map(u => ({ ...u, ideaCount: ideaMap[u.id] || 0 }))

  return NextResponse.json({ users: enriched, page, hasMore: allUsers.length === limit })
}
