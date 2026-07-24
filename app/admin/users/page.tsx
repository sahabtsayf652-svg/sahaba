'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type AdminUser = {
  id: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  country: string
  gender: string
  isAdmin: boolean
  isSuspended: boolean
  suspendedUntil: string | null
  suspensionCount: number
  isDeleted: boolean
  profileCompleted: boolean
  createdAt: string
  ideaCount: number
}

function AdminUsersInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, filter, page: String(page) })
    const res = await fetch(`/api/admin/users?${params}`)
    if (res.status === 403) { router.push('/'); return }
    const data = await res.json()
    setUsers(data.users || [])
    setHasMore(data.hasMore)
    setLoading(false)
  }, [search, filter, page, router])

  useEffect(() => { loadUsers() }, [loadUsers])

  async function doAction(userId: string, action: string) {
    const confirmMsg: Record<string, string> = {
      suspend_month: 'هل تريد تعليق هذا الحساب شهراً كاملاً؟',
      unsuspend: 'هل تريد رفع التعليق عن هذا الحساب؟',
      delete_permanent: '⚠️ هل أنت متأكد من حذف هذا الحساب نهائياً؟ لا يمكن التراجع.',
      make_admin: 'هل تريد تعيين هذا المستخدم كمشرف؟',
      remove_admin: 'هل تريد إزالة صلاحيات الإدارة من هذا المستخدم؟',
    }
    if (!confirm(confirmMsg[action] || 'متأكد؟')) return
    setActionLoading(userId + action)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    setToast(data.message || data.error || '')
    setTimeout(() => setToast(''), 3000)
    setActionLoading(null)
    loadUsers()
  }

  const filterTabs = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: '✅ نشطون' },
    { value: 'suspended', label: '⏸️ موقوفون' },
    { value: 'deleted', label: '🗑️ محذوفون' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-slate-800 border-l border-slate-700 fixed right-0 top-0 z-10">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">⚙️</div>
              <div>
                <div className="font-bold text-white">لوحة الإدارة</div>
                <div className="text-xs text-slate-400">سحابة</div>
              </div>
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
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 right-4 left-4">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 text-sm transition-all">
              ← العودة لسحابة
            </Link>
          </div>
        </aside>

        <main className="flex-1 mr-64 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">إدارة المستخدمين</h1>
              <p className="text-slate-400 text-sm">تصفح وإدارة جميع حسابات المستخدمين</p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="flex-1 min-w-48 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
            />
            <div className="flex gap-2">
              {filterTabs.map(t => (
                <button key={t.value} onClick={() => { setFilter(t.value); setPage(1) }}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${filter === t.value ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="mb-4 p-3 bg-green-700/50 border border-green-600 rounded-xl text-green-300 text-sm text-center">
              {toast}
            </div>
          )}

          {/* Table */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="text-4xl mb-3 animate-spin">⚙️</div>
                جارٍ التحميل...
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="text-4xl mb-3">👥</div>
                لا يوجد مستخدمون
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase">
                      <th className="text-right px-5 py-3">المستخدم</th>
                      <th className="text-right px-4 py-3">البلد</th>
                      <th className="text-right px-4 py-3">الأفكار</th>
                      <th className="text-right px-4 py-3">الحالة</th>
                      <th className="text-right px-4 py-3">تاريخ التسجيل</th>
                      <th className="text-right px-4 py-3">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                              {user.gender === 'female' ? '👩' : '👤'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-white">{user.displayName || '—'}</span>
                                {user.isAdmin && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">مشرف</span>}
                              </div>
                              <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">{user.country || '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">{user.ideaCount}</td>
                        <td className="px-4 py-3">
                          {user.isDeleted ? (
                            <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded-lg">محذوف</span>
                          ) : user.isSuspended ? (
                            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded-lg">موقوف</span>
                          ) : !user.profileCompleted ? (
                            <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-lg">غير مكتمل</span>
                          ) : (
                            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-lg">نشط</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString('ar')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Link href={`/admin/users/${user.id}`}
                              className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs transition-all">
                              عرض
                            </Link>
                            {!user.isAdmin && !user.isDeleted && (
                              <>
                                {user.isSuspended ? (
                                  <button onClick={() => doAction(user.id, 'unsuspend')}
                                    disabled={!!actionLoading}
                                    className="px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-xs transition-all disabled:opacity-50">
                                    رفع التعليق
                                  </button>
                                ) : (
                                  <button onClick={() => doAction(user.id, 'suspend_month')}
                                    disabled={!!actionLoading}
                                    className="px-2.5 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-xs transition-all disabled:opacity-50">
                                    تعليق شهر
                                  </button>
                                )}
                                <button onClick={() => doAction(user.id, 'delete_permanent')}
                                  disabled={!!actionLoading}
                                  className="px-2.5 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-xs transition-all disabled:opacity-50">
                                  حذف
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {(page > 1 || hasMore) && (
            <div className="flex justify-center gap-3 mt-4">
              {page > 1 && (
                <button onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-slate-700 rounded-xl text-sm hover:bg-slate-600 transition-all">
                  ← السابق
                </button>
              )}
              <span className="px-4 py-2 text-slate-400 text-sm">صفحة {page}</span>
              {hasMore && (
                <button onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-slate-700 rounded-xl text-sm hover:bg-slate-600 transition-all">
                  التالي →
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">جارٍ التحميل...</div>}>
      <AdminUsersInner />
    </Suspense>
  )
}
