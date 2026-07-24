import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { ideas } from '@/db/schemas/ideas'
import { users } from '@/db/schemas/users'
import { eq, desc, like, or, and, SQL } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAuthUser()
  if (!admin?.isAdmin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const filter = searchParams.get('filter') || 'all'
  const type = searchParams.get('type') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const conditions: SQL[] = []
  if (filter === 'active') conditions.push(eq(ideas.status, 'active'))
  if (filter === 'deleted') conditions.push(eq(ideas.status, 'deleted'))
  if (filter === 'suspended') conditions.push(eq(ideas.status, 'suspended'))
  if (type === 'idea') conditions.push(eq(ideas.type, 'idea'))
  if (type === 'novel') conditions.push(eq(ideas.type, 'novel'))
  if (search) {
    const sc = or(like(ideas.title, `%${search}%`), like(ideas.content, `%${search}%`))
    if (sc) conditions.push(sc)
  }

  const whereClause = conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : and(...conditions)

  const allIdeas = await db.select({
    id: ideas.id,
    title: ideas.title,
    content: ideas.content,
    type: ideas.type,
    visibility: ideas.visibility,
    status: ideas.status,
    price: ideas.price,
    writtenAt: ideas.writtenAt,
    purchaseCount: ideas.purchaseCount,
    viewCount: ideas.viewCount,
    userId: ideas.userId,
    createdAt: ideas.createdAt,
    authorName: users.displayName,
    authorEmail: users.email,
  })
    .from(ideas)
    .leftJoin(users, eq(ideas.userId, users.id))
    .where(whereClause)
    .orderBy(desc(ideas.createdAt))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ ideas: allIdeas, page, hasMore: allIdeas.length === limit })
}
