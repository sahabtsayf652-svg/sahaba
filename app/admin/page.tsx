'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Stats = {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  deletedUsers: number
  totalIdeas: number
  totalNovels: number
  totalPurchases: number
}

type RecentUser = {
  id: string
  email: string
  displayName: string
  country: string
  isAdmin: boolean
  isSuspended: boolean
  isDeleted: boolean
  profileCompleted: boolean
  createdAt: string
}

type RecentIdea = {
  id: string
  title: string
  type: string
  visibility: string
  status: string
  userId: string
  createdAt: string
  authorName: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentIdeas, setRecentIdeas] = useState<RecentIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => {
        if (r.status === 403) { router.push('/'); return null }
        return r.json()
      })
      .then(d => {
        if (!d) return
        setStats(d.stats)
        setRecentUsers(d.recentUsers || [])
        setRecentIdeas(d.recentIdeas || [])
        setLoading(false)
      })
      .catch(() => { setError('حدث خطأ في التحميل'); setLoading(false) })
  }, [router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900" dir="rtl">
      <div className="text-center text-white">
        <div className="text-5xl mb-4 animate-pulse">⚙️</div>
        <p className="text-slate-400">جارٍ تحميل لوحة الإدارة...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white" dir="rtl">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Link href="/" className="text-blue-400 hover:underline">العودة للرئيسية</Link>
      </div>
    </div>
  )

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats?.totalUsers, icon: '👥', color: 'from-blue-600 to-blue-700', link: '/admin/users' },
    { label: 'مستخدمون نشطون', value: stats?.activeUsers, icon: '✅', color: 'from-green-600 to-green-700', link: '/admin/users?filter=active' },
    { label: 'حسابات موقوفة', value: stats?.suspendedUsers, icon: '⏸️', color: 'from-yellow-600 to-yellow-700', link: '/admin/users?filter=suspended' },
    { label: 'حسابات محذوفة', value: stats?.deletedUsers, icon: '🗑️', color: 'from-red-600 to-red-700', link: '/admin/users?filter=deleted' },
    { label: 'إجمالي الأفكار', value: stats?.totalIdeas, icon: '💡', color: 'from-amber-600 to-amber-700', link: '/admin/content?type=idea' },
    { label: 'إجمالي الروايات', value: stats?.totalNovels, icon: '📚', color: 'from-purple-600 to-purple-700', link: '/admin/content?type=novel' },
    { label: 'عمليات الشراء', value: stats?.totalPurchases, icon: '🛒', color: 'from-teal-600 to-teal-700', link: '/admin/content' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Sidebar + Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-slate-800 border-l border-slate-700 flex-shrink-0 fixed right-0 top-0 z-10">
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
              { href: '/admin/users', icon: '👥', label: 'إدارة المستخدمين' },
              { href: '/admin/content', icon: '📝', label: 'إدارة المحتوى' },
              { href: '/admin/violations', icon: '🚨', label: 'المخالفات' },
              { href: '/admin/bootstrap', icon: '🔑', label: 'إنشاء مشرف' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm">
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 right-4 left-4">
            <Link href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 text-sm transition-all">
              ← العودة لسحابة
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 mr-64 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">لوحة التحكم الرئيسية</h1>
            <p className="text-slate-400 text-sm">نظرة عامة على إحصائيات المنصة</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <Link key={i} href={card.link}
                className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 hover:scale-[1.02] transition-all block`}>
                <div className="text-3xl mb-3">{card.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{card.value?.toLocaleString('ar')}</div>
                <div className="text-sm text-white/80">{card.label}</div>
              </Link>
            ))}
          </div>

          {/* Recent data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent users */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-700">
                <h2 className="font-bold text-white">أحدث المستخدمين</h2>
                <Link href="/admin/users" className="text-xs text-blue-400 hover:underline">عرض الكل →</Link>
              </div>
              <div className="divide-y divide-slate-700">
                {recentUsers.length === 0 ? (
                  <p className="p-5 text-slate-500 text-sm text-center">لا يوجد مستخدمون</p>
                ) : recentUsers.map(user => (
                  <Link key={user.id} href={`/admin/users/${user.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-slate-700/50 transition-all">
                    <div className="w-9 h-9 bg-slate-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {user.displayName || user.email}
                        </span>
                        {user.isAdmin && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-md">مشرف</span>}
                        {user.isSuspended && <span className="text-xs bg-yellow-600 text-white px-1.5 py-0.5 rounded-md">موقوف</span>}
                        {user.isDeleted && <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-md">محذوف</span>}
                      </div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('ar')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent content */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-700">
                <h2 className="font-bold text-white">أحدث المحتوى</h2>
                <Link href="/admin/content" className="text-xs text-blue-400 hover:underline">عرض الكل →</Link>
              </div>
              <div className="divide-y divide-slate-700">
                {recentIdeas.length === 0 ? (
                  <p className="p-5 text-slate-500 text-sm text-center">لا يوجد محتوى</p>
                ) : recentIdeas.map(idea => (
                  <div key={idea.id} className="flex items-center gap-3 p-4">
                    <div className="text-xl flex-shrink-0">{idea.type === 'idea' ? '💡' : '📚'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{idea.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                          idea.status === 'active' ? 'bg-green-700 text-green-100' :
                          idea.status === 'deleted' ? 'bg-red-700 text-red-100' :
                          'bg-yellow-700 text-yellow-100'
                        }`}>{idea.status === 'active' ? 'نشط' : idea.status === 'deleted' ? 'محذوف' : 'موقوف'}</span>
                      </div>
                      <div className="text-xs text-slate-400">{idea.authorName || 'مجهول'}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(idea.createdAt).toLocaleDateString('ar')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
