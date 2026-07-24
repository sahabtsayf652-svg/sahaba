import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'
import { hashPassword, generateToken, generateId } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 409 })
    }

    const hash = await hashPassword(password)
    const id = generateId()

    await db.insert(users).values({
      id,
      email,
      passwordHash: hash,
      profileCompleted: false,
      isSuspended: false,
      isDeleted: false,
      isAdmin: false,
      suspensionCount: 0,
    })

    const token = await generateToken(id)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 86400 * 7,
      sameSite: 'none',
      secure: true,
    })

    return NextResponse.json({ success: true, userId: id, profileCompleted: false })
  } catch (e) {
    console.error('Register error:', e)
    return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى' }, { status: 500 })
  }
}
