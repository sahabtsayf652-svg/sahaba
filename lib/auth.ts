import { db } from '@/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'sahaba-cloud-secret-key-2024-very-long'

function getSecret() {
  return new TextEncoder().encode(JWT_SECRET)
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'sahaba-salt')
  const hash = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(hash)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password)
  return hashed === hash
}

export async function generateToken(userId: string): Promise<string> {
  const secret = getSecret()
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user || user.isDeleted === true || user.isSuspended === true) return null
    return user
  } catch {
    return null
  }
}

export function generateId(): string {
  return crypto.randomUUID()
}
