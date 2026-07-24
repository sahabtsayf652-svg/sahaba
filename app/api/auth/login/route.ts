import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'
import { verifyPassword, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    if (user.isDeleted) {
      return NextResponse.json({ error: 'تم حذف هذا الحساب نهائياً' }, { status: 403 })
    }

    if (user.isSuspended && user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
      return NextResponse.json({
        error: `حسابك موقوف حتى ${new Date(user.suspendedUntil).toLocaleDateString('ar')}`,
      }, { status: 403 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const token = await generateToken(user.id)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 86400 * 7,
      sameSite: 'none',
      secure: true,
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
      profileCompleted: user.profileCompleted,
    })
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى' }, { status: 500 })
  }
}
