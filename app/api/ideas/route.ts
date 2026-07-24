import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { ideas } from '@/db/schemas/ideas'
import { users } from '@/db/schemas/users'
import { eq, desc, and, ne } from 'drizzle-orm'
import { getAuthUser, generateId } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mine = searchParams.get('mine') === 'true'
  const type = searchParams.get('type') || 'idea'
  const genre = searchParams.get('genre') || ''
  const novelStatus = searchParams.get('novelStatus') || ''

  const user = await getAuthUser()

  if (mine) {
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    const conditions = [
      eq(ideas.userId, user.id),
      eq(ideas.type, type as 'idea' | 'novel' | 'design'),
      ne(ideas.status, 'deleted'),
    ]
    const myIdeas = await db.select().from(ideas).where(and(...conditions)).orderBy(desc(ideas.createdAt))
    return NextResponse.json({ ideas: myIdeas })
  }

  // Public feed
  const conditions = [
    eq(ideas.status, 'active'),
    eq(ideas.type, type as 'idea' | 'novel' | 'design'),
  ]
  if (genre) conditions.push(eq(ideas.novelGenre, genre))
  if (novelStatus) conditions.push(eq(ideas.novelStatus, novelStatus))

  const allIdeas = await db
    .select({
      id: ideas.id,
      userId: ideas.userId,
      title: ideas.title,
      content: ideas.content,
      preview: ideas.preview,
      type: ideas.type,
      ideaCategory: ideas.ideaCategory,
      novelGenre: ideas.novelGenre,
      novelStatus: ideas.novelStatus,
      designCategory: ideas.designCategory,
      mediaUrl: ideas.mediaUrl,
      visibility: ideas.visibility,
      price: ideas.price,
      writtenAt: ideas.writtenAt,
      purchaseCount: ideas.purchaseCount,
      viewCount: ideas.viewCount,
      createdAt: ideas.createdAt,
      authorName: users.displayName,
      authorAvatar: users.avatarUrl,
    })
    .from(ideas)
    .leftJoin(users, eq(ideas.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(ideas.createdAt))
    .limit(60)

  return NextResponse.json({ ideas: allIdeas })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  if (!user.profileCompleted) return NextResponse.json({ error: 'يجب إكمال الملف الشخصي أولاً' }, { status: 403 })

  try {
    const body = await req.json()
    const { title, content, type, visibility, price, writtenAt, chapters,
            ideaCategory, novelGenre, novelStatus, designCategory, mediaUrl } = body

    if (!title || !content || !writtenAt) {
      return NextResponse.json({ error: 'العنوان والمحتوى والتاريخ مطلوبة' }, { status: 400 })
    }

    const forbidden = ['إباحي', 'جنسي', 'تحرش', 'عنصري', 'كراهية']
    const combined = `${title} ${content}`.toLowerCase()
    for (const word of forbidden) {
      if (combined.includes(word)) {
        return NextResponse.json({ error: 'المحتوى يخالف سياسة الاستخدام المقبول' }, { status: 400 })
      }
    }

    const preview = visibility === 'paid' ? content.slice(0, 200) + '...' : null
    const id = generateId()

    await db.insert(ideas).values({
      id,
      userId: user.id,
      title, content, preview,
      type: type || 'idea',
      ideaCategory: ideaCategory || null,
      novelGenre: novelGenre || null,
      novelStatus: novelStatus || null,
      designCategory: designCategory || null,
      mediaUrl: mediaUrl || null,
      visibility: visibility || 'free',
      price: visibility === 'paid' ? (price || 0) : 0,
      writtenAt,
      chapters: chapters ? JSON.stringify(chapters) : null,
      status: 'active',
    })

    return NextResponse.json({ success: true, id })
  } catch (e) {
    console.error('Create idea error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
