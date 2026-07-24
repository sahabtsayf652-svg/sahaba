'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DecorativeBg } from '@/components/DecorativeBg'
import { SahabaLogo } from '@/components/SahabaLogo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      router.push(data.profileCompleted ? '/dashboard' : '/profile/complete')
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-blue-50 to-white px-4 overflow-hidden" dir="rtl">
      <DecorativeBg />

      <div className="relative z-10 w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <SahabaLogo size="lg" />
          </Link>
          <p className="text-blue-500 text-sm font-medium mt-2">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* البطاقة */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="example@email.com"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder:text-gray-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-60 hover:scale-[1.02] active:scale-95">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="20"/></svg>
                  جارٍ الدخول...
                </span>
              ) : 'دخول ☁'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-blue-50 text-center text-sm text-gray-500">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
              سجل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
