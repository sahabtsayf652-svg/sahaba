import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { ideas } from '@/db/schemas/ideas'
import { eq, and, ne } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [user] = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarUrl: users.avatarUrl,
      country: users.country,
      bio: users.bio,
      gender: users.gender,
      contactInfo: users.contactInfo,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.isDeleted, false)))
    .limit(1)

  if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

  const userIdeas = await db
    .select({
      id: ideas.id,
      title: ideas.title,
      type: ideas.type,
      visibility: ideas.visibility,
      price: ideas.price,
      preview: ideas.preview,
      writtenAt: ideas.writtenAt,
      purchaseCount: ideas.purchaseCount,
      viewCount: ideas.viewCount,
      createdAt: ideas.createdAt,
    })
    .from(ideas)
    .where(and(eq(ideas.userId, id), ne(ideas.status, 'deleted')))
    .limit(20)

  return NextResponse.json({ user, ideas: userIdeas })
}
