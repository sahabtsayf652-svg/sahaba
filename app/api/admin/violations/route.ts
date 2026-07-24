import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { violations } from '@/db/schemas/ideas'
import { users } from '@/db/schemas/users'
import { ideas } from '@/db/schemas/ideas'
import { eq, desc } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const allViolations = await db
    .select({
      id: violations.id,
      reportedContentId: violations.reportedContentId,
      reportedUserId: violations.reportedUserId,
      reason: violations.reason,
      action: violations.action,
      resolvedAt: violations.resolvedAt,
      createdAt: violations.createdAt,
      userName: users.displayName,
      userEmail: users.email,
      contentTitle: ideas.title,
    })
    .from(violations)
    .leftJoin(users, eq(violations.reportedUserId, users.id))
    .leftJoin(ideas, eq(violations.reportedContentId, ideas.id))
    .orderBy(desc(violations.createdAt))
    .limit(50)

  return NextResponse.json({ violations: allViolations })
}
