'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Violation = {
  id: string
  reportedContentId: string
  reportedUserId: string
  reason: string
  action: string
  resolvedAt: string | null
  createdAt: string
  userName: string
  userEmail: string
  contentTitle: string
}

export default function AdminViolationsPage() {
  const router = useRouter()
  const [violations, setViolations] = useState<Violation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/violations')
      .then(r => { if (r.status === 403) { router.push('/'); return null } return r.json() })
      .then(d => { if (d) { setViolations(d.violations || []); setLoading(false) } })
  }, [router])

  const actionLabels: Record<string, { label: string; color: string }> = {
    deleted: { label: 'محذوف', color: 'bg-red-800 text-red-300' },
    warned: { label: 'تحذير', color: 'bg-yellow-800 text-yellow-300' },
    suspended_1month: { label: 'تعليق شهر', color: 'bg-orange-800 text-orange-300' },
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
              { href: '/admin/violations', icon: '🚨', label: 'المخالفات', active: true },
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
            <h1 className="text-2xl font-bold text-white mb-1">سجل المخالفات</h1>
            <p className="text-slate-400 text-sm">جميع الإجراءات التأديبية المتخذة على المنصة</p>
          </div>

          {loading ? (
            <div className="bg-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <div className="text-4xl mb-3 animate-spin">⚙️</div>جارٍ التحميل...
            </div>
          ) : violations.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">✅</div>
              <p>لا توجد مخالفات مسجلة</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase">
                      <th className="text-right px-5 py-3">المستخدم</th>
                      <th className="text-right px-4 py-3">المحتوى</th>
                      <th className="text-right px-4 py-3">السبب</th>
                      <th className="text-right px-4 py-3">الإجراء</th>
                      <th className="text-right px-4 py-3">التاريخ</th>
                      <th className="text-right px-4 py-3">روابط</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {violations.map(v => {
                      const action = actionLabels[v.action] || { label: v.action, color: 'bg-slate-700 text-slate-300' }
                      return (
                        <tr key={v.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="px-5 py-3">
                            <div className="text-sm font-medium text-white">{v.userName || '—'}</div>
                            <div className="text-xs text-slate-400">{v.userEmail}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300 max-w-[200px]">
                            <div className="truncate">{v.contentTitle || '(محتوى محذوف)'}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300">{v.reason}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-lg ${action.color}`}>{action.label}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">
                            {new Date(v.createdAt).toLocaleDateString('ar')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <Link href={`/admin/users/${v.reportedUserId}`}
                                className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs">👤</Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
