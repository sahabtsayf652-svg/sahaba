'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Idea = {
  id: string
  title: string
  content: string
  preview?: string
  type: string
  visibility: string
  price: number
  writtenAt: string
  purchaseCount: number
  viewCount: number
  createdAt: string
  authorName?: string
  authorAvatar?: string
  userId: string
}

export default function ExplorePage() {
  const router = useRouter()
  const [tab, setTab] = useState<'idea' | 'novel'>('idea')
  const [items, setItems] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/ideas?type=${tab}`)
      .then(r => r.json())
      .then(data => { setItems(data.ideas || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [tab])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50" dir="rtl">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl">☁</span>
            <span className="text-xl font-bold text-blue-700">سحابة</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">لوحتي</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">استكشف الأفكار</h1>
          <p className="text-gray-500">تصفح أفكار وروايات المبدعين من حول العالم</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <button onClick={() => setTab('idea')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all ${tab === 'idea' ? 'bg-yellow-400 text-white shadow-md' : 'bg-white text-gray-600 border border-blue-100 hover:bg-yellow-50'}`}>
            💡 الأفكار
          </button>
          <button onClick={() => setTab('novel')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all ${tab === 'novel' ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-gray-600 border border-blue-100 hover:bg-purple-50'}`}>
            📚 الروايات والقصص
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl cloud-float mb-4">☁</div>
            <p className="text-blue-400">جارٍ التحميل...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{tab === 'idea' ? '💡' : '📚'}</div>
            <p className="text-gray-500 mb-4">لا يوجد محتوى بعد</p>
            <Link href="/auth/register" className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600">
              كن أول من ينشر!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map(item => (
              <Link key={item.id} href={`/ideas/${item.id}`}
                className="cloud-card rounded-2xl p-5 hover:scale-[1.02] transition-all block group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium ${item.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.visibility === 'free' ? '🆓 مجاني' : `💰 ${item.price} رصيد`}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {item.visibility === 'free' ? item.content.slice(0, 150) : (item.preview || item.content.slice(0, 150))}
                  {item.visibility === 'paid' && <span className="text-blue-400">... [اشترِ لرؤية الكامل]</span>}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-sm overflow-hidden">
                      {item.authorAvatar ? (
                        <img src={item.authorAvatar} alt="" className="w-full h-full object-cover" />
                      ) : '👤'}
                    </div>
                    <span className="text-xs text-gray-500">{item.authorName || 'مجهول'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>📅 {item.writtenAt}</span>
                    <span>👁 {item.viewCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
