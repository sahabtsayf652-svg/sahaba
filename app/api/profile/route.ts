import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { passwordHash, ...safeUser } = user
  return NextResponse.json({ user: safeUser })
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  try {
    const body = await req.json()
    const { firstName, lastName, displayName, avatarUrl, birthDate, country, age, gender, contactInfo, bio } = body

    if (!firstName || !lastName || !displayName || !birthDate || !country || !gender) {
      return NextResponse.json({ error: 'يرجى ملء جميع الحقول الإجبارية' }, { status: 400 })
    }

    await db.update(users).set({
      firstName,
      lastName,
      displayName,
      avatarUrl: avatarUrl || null,
      birthDate,
      country,
      age: age ? parseInt(age) : null,
      gender,
      contactInfo: contactInfo || null,
      bio: bio || null,
      profileCompleted: true,
      updatedAt: new Date(),
    }).where(eq(users.id, user.id))

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Profile update error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
