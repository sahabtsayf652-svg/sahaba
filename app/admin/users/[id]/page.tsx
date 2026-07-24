'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type User = {
  id: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  country: string
  gender: string
  age: number | null
  birthDate: string
  contactInfo: string
  bio: string
  isAdmin: boolean
  isSuspended: boolean
  suspendedUntil: string | null
  suspensionCount: number
  isDeleted: boolean
  profileCompleted: boolean
  createdAt: string
}

type Idea = {
  id: string
  title: string
  type: string
  visibility: string
  status: string
  price: number
  writtenAt: string
  purchaseCount: number
  viewCount: number
  createdAt: string
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })

  async function load() {
    const res = await fetch(`/api/admin/users/${id}`)
    if (res.status === 403) { router.push('/'); return }
    const data = await res.json()
    setUser(data.user)
    setIdeas(data.ideas || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function doAction(action: string) {
    const confirmMsg: Record<string, string> = {
      suspend_month: 'هل تريد تعليق هذا الحساب شهراً كاملاً؟',
      unsuspend: 'هل تريد رفع التعليق عن هذا الحساب؟',
      delete_permanent: '⚠️ هل أنت متأكد من حذف هذا الحساب نهائياً؟ لا يمكن التراجع.',
      make_admin: 'هل تريد تعيين هذا المستخدم كمشرف؟',
      remove_admin: 'هل تريد إزالة صلاحيات الإدارة؟',
    }
    if (!confirm(confirmMsg[action] || 'متأكد؟')) return
    setActionLoading(true)
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    setToast({ msg: data.message || data.error, type: res.ok ? 'success' : 'error' })
    setTimeout(() => setToast({ msg: '', type: '' }), 3000)
    setActionLoading(false)
    if (res.ok) load()
  }

  async function doContentAction(ideaId: string, action: string) {
    if (!confirm('هل أنت متأكد من هذا الإجراء؟')) return
    await fetch(`/api/admin/content/${ideaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason: 'إجراء من المشرف' }),
    })
    load()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white" dir="rtl">
      <div className="text-4xl animate-spin">⚙️</div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white" dir="rtl">
      <div className="text-center">
        <p className="text-slate-400 mb-4">المستخدم غير موجود</p>
        <Link href="/admin/users" className="text-blue-400 hover:underline">← العودة</Link>
      </div>
    </div>
  )

  const activeIdeas = ideas.filter(i => i.status === 'active')
  const deletedIdeas = ideas.filter(i => i.status !== 'active')

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
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
              { href: '/admin/users', icon: '👥', label: 'إدارة المستخدمين', active: true },
              { href: '/admin/content', icon: '📝', label: 'إدارة المحتوى' },
              { href: '/admin/violations', icon: '🚨', label: 'المخالفات' },
              { href: '/admin/bootstrap', icon: '🔑', label: 'إنشاء مشرف' },
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
            <Link href="/admin/users" className="text-slate-400 hover:text-white text-sm mb-3 inline-block">← العودة للمستخدمين</Link>
            <h1 className="text-2xl font-bold text-white">تفاصيل المستخدم</h1>
          </div>

          {toast.msg && (
            <div className={`mb-4 p-3 rounded-xl text-sm text-center ${toast.type === 'success' ? 'bg-green-700/50 border border-green-600 text-green-300' : 'bg-red-700/50 border border-red-600 text-red-300'}`}>
              {toast.msg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Profile */}
            <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  {user.gender === 'female' ? '👩' : '👤'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white">{user.displayName || '—'}</h2>
                    {user.isAdmin && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-lg">مشرف</span>}
                    {user.isSuspended && <span className="text-xs bg-yellow-700 text-yellow-200 px-2 py-0.5 rounded-lg">موقوف</span>}
                    {user.isDeleted && <span className="text-xs bg-red-700 text-red-200 px-2 py-0.5 rounded-lg">محذوف نهائياً</span>}
                  </div>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'الاسم الأول', value: user.firstName },
                  { label: 'اللقب', value: user.lastName },
                  { label: 'البلد', value: user.country },
                  { label: 'الجنس', value: user.gender === 'male' ? 'ذكر' : 'أنثى' },
                  { label: 'تاريخ الميلاد', value: user.birthDate },
                  { label: 'العمر', value: user.age ? `${user.age} سنة` : '—' },
                  { label: 'التواصل', value: user.contactInfo || '—' },
                  { label: 'تاريخ التسجيل', value: new Date(user.createdAt).toLocaleDateString('ar') },
                ].map(f => (
                  <div key={f.label} className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-0.5">{f.label}</div>
                    <div className="text-white">{f.value || '—'}</div>
                  </div>
                ))}
              </div>

              {user.bio && (
                <div className="mt-3 bg-slate-700/50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">نبذة</div>
                  <p className="text-slate-300 text-sm">{user.bio}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h3 className="font-bold text-white mb-4">إجراءات الإدارة</h3>
              <div className="space-y-2">
                {!user.isAdmin && !user.isDeleted && (
                  <>
                    {user.isSuspended ? (
                      <button onClick={() => doAction('unsuspend')} disabled={actionLoading}
                        className="w-full py-2.5 bg-green-700 hover:bg-green-600 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                        ✅ رفع التعليق
                      </button>
                    ) : (
                      <button onClick={() => doAction('suspend_month')} disabled={actionLoading}
                        className="w-full py-2.5 bg-yellow-700 hover:bg-yellow-600 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                        ⏸️ تعليق الحساب شهراً
                      </button>
                    )}
                    <button onClick={() => doAction('make_admin')} disabled={actionLoading}
                      className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                      ⭐ تعيين كمشرف
                    </button>
                    <button onClick={() => doAction('delete_permanent')} disabled={actionLoading}
                      className="w-full py-2.5 bg-red-700 hover:bg-red-600 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                      🗑️ حذف نهائي
                    </button>
                  </>
                )}
                {user.isAdmin && !user.isDeleted && (
                  <button onClick={() => doAction('remove_admin')} disabled={actionLoading}
                    className="w-full py-2.5 bg-slate-600 hover:bg-slate-500 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                    ❌ إزالة صلاحيات الإدارة
                  </button>
                )}

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>عدد التعليقات: <span className="text-white">{user.suspensionCount}</span></div>
                    {user.suspendedUntil && (
                      <div>موقوف حتى: <span className="text-yellow-300">{new Date(user.suspendedUntil).toLocaleDateString('ar')}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User content */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700">
              <h3 className="font-bold text-white">محتوى المستخدم ({ideas.length})</h3>
            </div>
            {ideas.length === 0 ? (
              <p className="p-6 text-slate-400 text-sm text-center">لا يوجد محتوى</p>
            ) : (
              <div className="divide-y divide-slate-700">
                {ideas.map(idea => (
                  <div key={idea.id} className="flex items-center gap-3 p-4">
                    <span className="text-xl flex-shrink-0">{idea.type === 'idea' ? '💡' : '📚'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white truncate">{idea.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ${idea.status === 'active' ? 'bg-green-800 text-green-300' : 'bg-red-800 text-red-300'}`}>
                          {idea.status === 'active' ? 'نشط' : 'محذوف'}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ${idea.visibility === 'free' ? 'bg-slate-700 text-slate-300' : 'bg-amber-800 text-amber-300'}`}>
                          {idea.visibility === 'free' ? 'مجاني' : `${idea.price} رصيد`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">📅 {idea.writtenAt} · 👁 {idea.viewCount} · 🛒 {idea.purchaseCount}</div>
                    </div>
                    {idea.status === 'active' && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => doContentAction(idea.id, 'suspend')}
                          className="px-2.5 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-xs">تعليق</button>
                        <button onClick={() => doContentAction(idea.id, 'delete')}
                          className="px-2.5 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-xs">حذف</button>
                      </div>
                    )}
                    {idea.status !== 'active' && (
                      <button onClick={() => doContentAction(idea.id, 'restore')}
                        className="px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-xs flex-shrink-0">استعادة</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
