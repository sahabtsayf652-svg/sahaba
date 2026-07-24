import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { ideas, purchases, violations } from '@/db/schemas/ideas'
import { eq, desc, count, sql, ne, and } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const [
    totalUsersResult,
    activeUsersResult,
    suspendedUsersResult,
    deletedUsersResult,
    totalIdeasResult,
    totalNovelsResult,
    totalPurchasesResult,
    recentUsers,
    recentIdeas,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(users).where(and(eq(users.isDeleted, false), eq(users.isSuspended, false))),
    db.select({ count: count() }).from(users).where(eq(users.isSuspended, true)),
    db.select({ count: count() }).from(users).where(eq(users.isDeleted, true)),
    db.select({ count: count() }).from(ideas).where(and(eq(ideas.type, 'idea'), eq(ideas.status, 'active'))),
    db.select({ count: count() }).from(ideas).where(and(eq(ideas.type, 'novel'), eq(ideas.status, 'active'))),
    db.select({ count: count() }).from(purchases),
    db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      country: users.country,
      isAdmin: users.isAdmin,
      isSuspended: users.isSuspended,
      isDeleted: users.isDeleted,
      profileCompleted: users.profileCompleted,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt)).limit(5),
    db.select({
      id: ideas.id,
      title: ideas.title,
      type: ideas.type,
      visibility: ideas.visibility,
      status: ideas.status,
      userId: ideas.userId,
      createdAt: ideas.createdAt,
      authorName: users.displayName,
    }).from(ideas)
      .leftJoin(users, eq(ideas.userId, users.id))
      .orderBy(desc(ideas.createdAt)).limit(5),
  ])

  return NextResponse.json({
    stats: {
      totalUsers: totalUsersResult[0].count,
      activeUsers: activeUsersResult[0].count,
      suspendedUsers: suspendedUsersResult[0].count,
      deletedUsers: deletedUsersResult[0].count,
      totalIdeas: totalIdeasResult[0].count,
      totalNovels: totalNovelsResult[0].count,
      totalPurchases: totalPurchasesResult[0].count,
    },
    recentUsers,
    recentIdeas,
  })
}
