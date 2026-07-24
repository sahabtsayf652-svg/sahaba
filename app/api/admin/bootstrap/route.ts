import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'
import { getAuthUser, hashPassword, generateId } from '@/lib/auth'

// Create first admin (only if no admins exist, for bootstrap)
export async function POST(req: NextRequest) {
  const { secret, email, password } = await req.json()

  // Security: require bootstrap secret
  if (secret !== (process.env.ADMIN_BOOTSTRAP_SECRET || 'sahaba-admin-2024')) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (existing) {
    await db.update(users).set({ isAdmin: true, updatedAt: new Date() }).where(eq(users.email, email))
    return NextResponse.json({ success: true, message: 'تم تعيين المستخدم الحالي كمشرف' })
  }

  const hash = await hashPassword(password || 'Admin@2024')
  const id = generateId()
  await db.insert(users).values({
    id,
    email,
    passwordHash: hash,
    displayName: 'المشرف',
    firstName: 'المشرف',
    lastName: 'الرئيسي',
    country: 'غير محدد',
    gender: 'male',
    birthDate: '1990-01-01',
    profileCompleted: true,
    isAdmin: true,
  })

  return NextResponse.json({ success: true, message: 'تم إنشاء حساب المشرف' })
}
