import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { ideas, purchases } from '@/db/schemas/ideas'
import { users } from '@/db/schemas/users'
import { eq, and } from 'drizzle-orm'
import { getAuthUser, generateId } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthUser()

  const [idea] = await db
    .select({
      id: ideas.id,
      userId: ideas.userId,
      title: ideas.title,
      content: ideas.content,
      preview: ideas.preview,
      type: ideas.type,
      visibility: ideas.visibility,
      price: ideas.price,
      writtenAt: ideas.writtenAt,
      purchaseCount: ideas.purchaseCount,
      viewCount: ideas.viewCount,
      status: ideas.status,
      chapters: ideas.chapters,
      createdAt: ideas.createdAt,
      authorName: users.displayName,
      authorAvatar: users.avatarUrl,
      authorCountry: users.country,
    })
    .from(ideas)
    .leftJoin(users, eq(ideas.userId, users.id))
    .where(and(eq(ideas.id, id), eq(ideas.status, 'active')))
    .limit(1)

  if (!idea) return NextResponse.json({ error: 'الفكرة غير موجودة' }, { status: 404 })

  // Check if user owns it or has purchased
  const isOwner = user?.id === idea.userId
  let hasPurchased = false

  if (!isOwner && idea.visibility === 'paid' && user) {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.userId, user.id), eq(purchases.ideaId, id)))
      .limit(1)
    hasPurchased = !!purchase
  }

  // Increment view count
  await db.update(ideas).set({ viewCount: (idea.viewCount || 0) + 1 }).where(eq(ideas.id, id))

  return NextResponse.json({
    idea,
    canRead: isOwner || idea.visibility === 'free' || hasPurchased,
    isOwner,
    hasPurchased,
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1)
  if (!idea) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })

  if (idea.userId !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  await db.update(ideas).set({ status: 'deleted' }).where(eq(ideas.id, id))
  return NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const [idea] = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1)
  if (!idea || idea.userId !== user.id) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const body = await req.json()
  const { title, content, visibility, price, writtenAt } = body

  const preview = visibility === 'paid' ? content.slice(0, 200) + '...' : null

  await db.update(ideas).set({
    title,
    content,
    preview,
    visibility,
    price: visibility === 'paid' ? price : 0,
    writtenAt,
    updatedAt: new Date(),
  }).where(eq(ideas.id, id))

  return NextResponse.json({ success: true })
}
