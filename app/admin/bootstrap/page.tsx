'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminBootstrapPage() {
  const [form, setForm] = useState({ secret: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ msg: string; type: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult({ msg: data.message || data.error, type: res.ok ? 'success' : 'error' })
    } catch {
      setResult({ msg: 'حدث خطأ في الاتصال', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-800 border-l border-slate-700 fixed right-0 top-0 z-10">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">⚙️</div>
              <div><div className="font-bold">لوحة الإدارة</div><div className="text-xs text-slate-400">سحابة</div></div>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {[
              { href: '/admin', icon: '📊', label: 'لوحة التحكم' },
              { href: '/admin/users', icon: '👥', label: 'إدارة المستخدمين' },
              { href: '/admin/content', icon: '📝', label: 'إدارة المحتوى' },
              { href: '/admin/violations', icon: '🚨', label: 'المخالفات' },
              { href: '/admin/bootstrap', icon: '🔑', label: 'إنشاء مشرف', active: true },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 right-4 left-4">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 text-sm">← العودة لسحابة</Link>
          </div>
        </aside>

        <main className="flex-1 mr-64 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">إنشاء حساب مشرف</h1>
            <p className="text-slate-400 text-sm">
              استخدم هذه الصفحة لإنشاء أول حساب مشرف أو ترقية حساب موجود
            </p>
          </div>

          <div className="max-w-md">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-xl p-4 mb-6">
                <p className="text-yellow-300 text-sm font-medium mb-1">🔑 كيفية الاستخدام</p>
                <ul className="text-yellow-200/80 text-xs space-y-1 list-disc list-inside">
                  <li>الرمز السري الافتراضي هو: <code className="bg-slate-700 px-1 rounded">sahaba-admin-2024</code></li>
                  <li>يمكنك تغييره عبر متغير البيئة <code className="bg-slate-700 px-1 rounded">ADMIN_BOOTSTRAP_SECRET</code></li>
                  <li>إذا كان البريد موجوداً سيتم ترقيته لمشرف</li>
                  <li>إذا لم يكن موجوداً سيتم إنشاء حساب جديد</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {result && (
                  <div className={`p-3 rounded-xl text-sm ${result.type === 'success' ? 'bg-green-700/40 border border-green-600 text-green-300' : 'bg-red-700/40 border border-red-600 text-red-300'}`}>
                    {result.msg}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">الرمز السري</label>
                  <input type="password" value={form.secret} onChange={e => setForm(f => ({ ...f, secret: e.target.value }))}
                    required placeholder="أدخل الرمز السري"
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">كلمة المرور (للحساب الجديد فقط)</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="اتركه فارغاً إذا كان الحساب موجوداً"
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-all disabled:opacity-50">
                  {loading ? 'جارٍ المعالجة...' : '🔑 إنشاء / ترقية الحساب'}
                </button>
              </form>
            </div>

            <div className="mt-4 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <p className="text-slate-400 text-xs">
                💡 <strong className="text-slate-300">بعد الإنشاء:</strong> سجّل الدخول بالحساب المنشأ، ثم اذهب إلى <code className="bg-slate-700 px-1 rounded">/admin</code> للوصول للوحة الإدارة.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
