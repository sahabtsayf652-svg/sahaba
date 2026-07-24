'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Idea = {
  id: string
  title: string
  content: string
  type: string
  visibility: string
  status: string
  price: number
  writtenAt: string
  purchaseCount: number
  viewCount: number
  userId: string
  createdAt: string
  authorName: string
  authorEmail: string
}

function AdminContentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [toast, setToast] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const loadContent = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, filter, type, page: String(page) })
    const res = await fetch(`/api/admin/content?${params}`)
    if (res.status === 403) { router.push('/'); return }
    const data = await res.json()
    setIdeas(data.ideas || [])
    setHasMore(data.hasMore)
    setLoading(false)
  }, [search, filter, type, page, router])

  useEffect(() => { loadContent() }, [loadContent])

  async function doAction(id: string, action: string, reason?: string) {
    const res = await fetch(`/api/admin/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason: reason || 'إجراء من المشرف' }),
    })
    const data = await res.json()
    setToast(data.message || data.error)
    setTimeout(() => setToast(''), 3000)
    loadContent()
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
              { href: '/admin/content', icon: '📝', label: 'إدارة المحتوى', active: true },
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
            <h1 className="text-2xl font-bold text-white mb-1">إدارة المحتوى</h1>
            <p className="text-slate-400 text-sm">تصفح ومراجعة جميع الأفكار والروايات</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input type="text" placeholder="بحث في المحتوى..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="flex-1 min-w-48 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm" />

            <div className="flex gap-2">
              {[{ v: 'all', l: 'الكل' }, { v: 'active', l: '✅ نشط' }, { v: 'deleted', l: '🗑️ محذوف' }, { v: 'suspended', l: '⏸️ موقوف' }].map(t => (
                <button key={t.v} onClick={() => { setFilter(t.v); setPage(1) }}
                  className={`px-3 py-2 rounded-xl text-xs transition-all ${filter === t.v ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {t.l}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {[{ v: 'all', l: 'نوع الكل' }, { v: 'idea', l: '💡 أفكار' }, { v: 'novel', l: '📚 روايات' }].map(t => (
                <button key={t.v} onClick={() => { setType(t.v); setPage(1) }}
                  className={`px-3 py-2 rounded-xl text-xs transition-all ${type === t.v ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {toast && (
            <div className="mb-4 p-3 bg-green-700/50 border border-green-600 rounded-xl text-green-300 text-sm text-center">{toast}</div>
          )}

          {/* Content list */}
          <div className="space-y-3">
            {loading ? (
              <div className="bg-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <div className="text-4xl mb-3 animate-spin">⚙️</div>جارٍ التحميل...
              </div>
            ) : ideas.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <div className="text-4xl mb-3">📝</div>لا يوجد محتوى
              </div>
            ) : ideas.map(idea => (
              <div key={idea.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <span className="text-2xl flex-shrink-0">{idea.type === 'idea' ? '💡' : '📚'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-white text-sm truncate">{idea.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md ${idea.status === 'active' ? 'bg-green-800 text-green-300' : idea.status === 'deleted' ? 'bg-red-800 text-red-300' : 'bg-yellow-800 text-yellow-300'}`}>
                        {idea.status === 'active' ? 'نشط' : idea.status === 'deleted' ? 'محذوف' : 'موقوف'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md ${idea.visibility === 'free' ? 'bg-slate-700 text-slate-300' : 'bg-amber-800 text-amber-300'}`}>
                        {idea.visibility === 'free' ? '🆓 مجاني' : `💰 ${idea.price}`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      ✍️ {idea.authorName || 'مجهول'} · 📅 {idea.writtenAt} · 👁 {idea.viewCount} · 🛒 {idea.purchaseCount}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => setExpanded(expanded === idea.id ? null : idea.id)}
                      className="px-2.5 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-xs transition-all">
                      {expanded === idea.id ? 'إخفاء' : 'عرض'}
                    </button>
                    {idea.status === 'active' && (
                      <>
                        <button onClick={() => { if (confirm('تعليق هذا المحتوى؟')) doAction(idea.id, 'suspend') }}
                          className="px-2.5 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded-lg text-xs transition-all">⏸</button>
                        <button onClick={() => { if (confirm('حذف هذا المحتوى نهائياً؟')) doAction(idea.id, 'delete', 'محتوى مخالف') }}
                          className="px-2.5 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-xs transition-all">🗑</button>
                      </>
                    )}
                    {idea.status !== 'active' && (
                      <button onClick={() => { if (confirm('استعادة هذا المحتوى؟')) doAction(idea.id, 'restore') }}
                        className="px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-xs transition-all">↩</button>
                    )}
                    <Link href={`/admin/users/${idea.userId}`}
                      className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs transition-all">
                      👤
                    </Link>
                  </div>
                </div>

                {expanded === idea.id && (
                  <div className="border-t border-slate-700 p-4 bg-slate-700/30">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {idea.content.slice(0, 600)}{idea.content.length > 600 ? '...' : ''}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(page > 1 || hasMore) && (
            <div className="flex justify-center gap-3 mt-6">
              {page > 1 && <button onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-slate-700 rounded-xl text-sm hover:bg-slate-600">← السابق</button>}
              <span className="px-4 py-2 text-slate-400 text-sm">صفحة {page}</span>
              {hasMore && <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-slate-700 rounded-xl text-sm hover:bg-slate-600">التالي →</button>}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">جارٍ التحميل...</div>}>
      <AdminContentInner />
    </Suspense>
  )
}
