'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DecorativeBg } from '@/components/DecorativeBg'
import { SahabaLogoHeader } from '@/components/SahabaLogo'

type User = { id: string; email: string; displayName: string; firstName: string; lastName: string; avatarUrl?: string; country: string; gender: string; profileCompleted: boolean }
type Item = { id: string; title: string; content: string; type: string; visibility: string; price: number; writtenAt: string; purchaseCount: number; viewCount: number; createdAt: string; novelGenre?: string; novelStatus?: string; ideaCategory?: string; designCategory?: string }

const GENRE_LABELS: Record<string, string> = {
  action: '⚔️ أكشن', romance: '💕 رومانسية', mystery: '🔍 تشويق', scifi: '🚀 خيال علمي',
  horror: '👻 رعب', drama: '🎭 دراما', comedy: '😄 كوميديا', historical: '🏛️ تاريخية',
  social: '🌍 اجتماعية', other: '📖 أخرى',
}
const DESIGN_LABELS: Record<string, string> = {
  photo: '🖼️ صورة', cv: '📄 CV', research: '🔬 بحث', chart: '📊 مخطط', poster: '🎨 بوستر', other: '📁 أخرى',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'ideas' | 'novels' | 'designs'>('ideas')
  const [ideas, setIdeas] = useState<Item[]>([])
  const [novels, setNovels] = useState<Item[]>([])
  const [designs, setDesigns] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pr, ir, nr, dr] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/ideas?mine=true&type=idea'),
          fetch('/api/ideas?mine=true&type=novel'),
          fetch('/api/ideas?mine=true&type=design'),
        ])
        if (!pr.ok) { router.push('/auth/login'); return }
        const { user: u } = await pr.json()
        if (!u.profileCompleted) { router.push('/profile/complete'); return }
        setUser(u)
        setIdeas((await ir.json()).ideas || [])
        setNovels((await nr.json()).ideas || [])
        setDesigns((await dr.json()).ideas || [])
      } catch { router.push('/auth/login') }
      finally { setLoading(false) }
    }
    load()
  }, [router])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    await fetch(`/api/ideas/${id}`, { method: 'DELETE' })
    setIdeas(p => p.filter(i => i.id !== id))
    setNovels(p => p.filter(i => i.id !== id))
    setDesigns(p => p.filter(i => i.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-blue-100" dir="rtl">
      <div className="text-center"><div className="text-6xl cloud-float mb-4">☁</div><p className="text-blue-500">جارٍ التحميل...</p></div>
    </div>
  )

  const tabs = [
    { key: 'ideas' as const,   icon: '💡', label: 'أفكاري',   count: ideas.length,   color: 'bg-yellow-500' },
    { key: 'novels' as const,  icon: '📚', label: 'رواياتي',  count: novels.length,  color: 'bg-purple-500' },
    { key: 'designs' as const, icon: '🎨', label: 'تصاميمي',  count: designs.length, color: 'bg-teal-500' },
  ]
  const currentItems = activeTab === 'ideas' ? ideas : activeTab === 'novels' ? novels : designs

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white overflow-hidden" dir="rtl">
      <DecorativeBg />

      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/"><SahabaLogoHeader /></Link>
          <div className="flex items-center gap-3">
            <Link href="/explore" className="text-sm text-blue-500 hover:underline font-medium">استكشاف</Link>
            <Link href="/profile" className="text-sm text-blue-700 font-semibold hover:underline">{user?.displayName}</Link>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">خروج</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* بطاقة الترحيب */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-blue-100 shadow-lg flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-sky-300 flex items-center justify-center text-2xl shadow-lg overflow-hidden flex-shrink-0">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : (user?.gender === 'female' ? '👩' : '👤')}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800">مرحباً، {user?.displayName} 👋</h2>
            <p className="text-gray-500 text-sm">{user?.country}</p>
          </div>
          <div className="flex gap-4">
            {tabs.map(t => (
              <div key={t.key} className="text-center">
                <div className="text-xl font-black text-blue-600">{t.count}</div>
                <div className="text-xs text-gray-400">{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* البوابات الثلاث */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { href: '/dashboard/new-idea',   icon: '💡', color: 'bg-yellow-100 group-hover:bg-yellow-200', title: 'بوابة الأفكار',          sub: 'فكرة مشروع أو رواية' },
            { href: '/dashboard/new-novel',  icon: '📚', color: 'bg-purple-100 group-hover:bg-purple-200', title: 'بوابة الروايات والقصص',  sub: 'اكتب وصنّف روايتك' },
            { href: '/dashboard/new-design', icon: '🎨', color: 'bg-teal-100   group-hover:bg-teal-200',   title: 'بوابة الإبداعات',         sub: 'صور • CV • أبحاث • مخططات' },
          ].map(gw => (
            <Link key={gw.href} href={gw.href}
              className="bg-white/85 backdrop-blur-xl rounded-2xl p-5 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${gw.color} rounded-xl flex items-center justify-center text-2xl transition-colors group-hover:scale-110 duration-200`}>{gw.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{gw.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{gw.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* التبويبات */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-md overflow-hidden">
          <div className="flex border-b border-blue-100">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === t.key ? `${t.color} text-white` : 'text-gray-500 hover:bg-blue-50'}`}>
                {t.icon} {t.label} ({t.count})
              </button>
            ))}
          </div>

          <div className="p-4">
            {currentItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">{activeTab === 'ideas' ? '💡' : activeTab === 'novels' ? '📚' : '🎨'}</div>
                <p className="text-gray-400 mb-4">لا يوجد محتوى بعد</p>
                <Link href={activeTab === 'ideas' ? '/dashboard/new-idea' : activeTab === 'novels' ? '/dashboard/new-novel' : '/dashboard/new-design'}
                  className={`px-6 py-2.5 text-white rounded-xl text-sm font-bold transition-all ${activeTab === 'ideas' ? 'bg-yellow-500 hover:bg-yellow-600' : activeTab === 'novels' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-teal-500 hover:bg-teal-600'}`}>
                  أضف أول {activeTab === 'ideas' ? 'فكرة' : activeTab === 'novels' ? 'رواية' : 'عمل'}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {currentItems.map(item => (
                  <div key={item.id} className="border border-blue-100 rounded-xl p-4 hover:border-blue-300 transition-all bg-white/70">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <h4 className="font-bold text-gray-800 truncate text-sm">{item.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${item.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {item.visibility === 'free' ? '🆓 مجاني' : `💰 $${item.price}`}
                          </span>
                          {item.novelGenre && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{GENRE_LABELS[item.novelGenre] || item.novelGenre}</span>}
                          {item.novelStatus && <span className={`text-xs px-2 py-0.5 rounded-full ${item.novelStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.novelStatus === 'completed' ? '✅ مكتملة' : '✍️ مستمرة'}</span>}
                          {item.ideaCategory && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{item.ideaCategory === 'project_idea' ? '🚀 مشروع' : '✍️ فكرة رواية'}</span>}
                          {item.designCategory && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{DESIGN_LABELS[item.designCategory] || item.designCategory}</span>}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.content.slice(0, 80)}...</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span>📅 {item.writtenAt}</span>
                          <span>👁 {item.viewCount}</span>
                          <span>🛒 {item.purchaseCount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/ideas/${item.id}`} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition-all font-medium">عرض</Link>
                        <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs hover:bg-red-100 transition-all">حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
