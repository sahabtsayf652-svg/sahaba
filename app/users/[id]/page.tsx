'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type UserProfile = {
  id: string
  displayName: string
  firstName: string
  lastName: string
  avatarUrl?: string
  country: string
  bio?: string
  gender: string
  contactInfo?: string
  createdAt: string
}

type IdeaItem = {
  id: string
  title: string
  type: string
  visibility: string
  price: number
  preview?: string
  writtenAt: string
  purchaseCount: number
  viewCount: number
  createdAt: string
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [ideas, setIdeas] = useState<IdeaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'idea' | 'novel'>('idea')

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(d => { setUser(d.user); setIdeas(d.ideas || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50" dir="rtl">
      <div className="text-6xl cloud-float">☁</div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 text-center" dir="rtl">
      <div>
        <p className="text-2xl mb-4">😕</p>
        <p className="text-gray-500">المستخدم غير موجود</p>
        <Link href="/explore" className="mt-4 inline-block text-blue-500 hover:underline">← العودة</Link>
      </div>
    </div>
  )

  const filtered = ideas.filter(i => i.type === tab)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50" dir="rtl">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/explore" className="text-blue-500 hover:text-blue-700 text-sm">← العودة</Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl">☁</span>
            <span className="font-bold text-blue-700">سحابة</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile card */}
        <div className="cloud-card rounded-3xl p-8 shadow-xl mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-sky-300 flex items-center justify-center text-3xl shadow-lg overflow-hidden flex-shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
              ) : user.gender === 'female' ? '👩' : '👤'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
              <p className="text-gray-500 text-sm">{user.firstName} {user.lastName}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span>🌍 {user.country}</span>
                <span>{user.gender === 'male' ? '👤 ذكر' : '👩 أنثى'}</span>
              </div>
              {user.contactInfo && (
                <p className="text-sm text-blue-600 mt-1">📞 {user.contactInfo}</p>
              )}
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-2xl font-bold text-blue-600">{ideas.length}</div>
              <div className="text-xs text-gray-400">منشورات</div>
            </div>
          </div>
          {user.bio && (
            <p className="mt-4 text-gray-600 leading-relaxed border-t border-blue-50 pt-4">{user.bio}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex gap-3 mb-5">
          <button onClick={() => setTab('idea')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'idea' ? 'bg-yellow-400 text-white' : 'bg-white text-gray-600 border border-blue-100'}`}>
            💡 الأفكار ({ideas.filter(i => i.type === 'idea').length})
          </button>
          <button onClick={() => setTab('novel')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'novel' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-blue-100'}`}>
            📚 الروايات ({ideas.filter(i => i.type === 'novel').length})
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 cloud-card rounded-2xl">
            <p className="text-4xl mb-3">{tab === 'idea' ? '💡' : '📚'}</p>
            <p className="text-gray-400">لا يوجد محتوى</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(item => (
              <Link key={item.id} href={`/ideas/${item.id}`}
                className="cloud-card rounded-2xl p-5 hover:scale-[1.01] transition-all block">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 line-clamp-2">{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${item.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.visibility === 'free' ? '🆓' : `💰 ${item.price}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span>📅 {item.writtenAt}</span>
                  <span>👁 {item.viewCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
