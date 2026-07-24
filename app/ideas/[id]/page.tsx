'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type IdeaDetail = {
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
  authorCountry?: string
  userId: string
  chapters?: string
}

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<{ idea: IdeaDetail; canRead: boolean; isOwner: boolean; hasPurchased: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/ideas/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function handlePurchase() {
    setError('')
    setPurchasing(true)
    try {
      const res = await fetch(`/api/ideas/${id}/purchase`, { method: 'POST' })
      const result = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push('/auth/login'); return }
        setError(result.error || 'حدث خطأ')
        return
      }
      // Reload
      const updated = await fetch(`/api/ideas/${id}`).then(r => r.json())
      setData(updated)
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-blue-100" dir="rtl">
      <div className="text-center">
        <div className="text-6xl cloud-float mb-4">☁</div>
        <p className="text-blue-400">جارٍ التحميل...</p>
      </div>
    </div>
  )

  if (!data?.idea) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50" dir="rtl">
      <div className="text-center">
        <p className="text-2xl mb-4">😕</p>
        <p className="text-gray-500 mb-4">الفكرة غير موجودة</p>
        <Link href="/explore" className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm">استكشف الأفكار</Link>
      </div>
    </div>
  )

  const { idea, canRead, isOwner, hasPurchased } = data
  let parsedChapters: { title: string; content: string }[] = []
  if (idea.chapters) {
    try { parsedChapters = JSON.parse(idea.chapters) } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50" dir="rtl">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/explore" className="text-blue-500 hover:text-blue-700 text-sm">
            ← العودة للاستكشاف
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl">☁</span>
            <span className="font-bold text-blue-700">سحابة</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="cloud-card rounded-3xl p-8 shadow-xl mb-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {idea.type === 'idea' ? '💡 فكرة' : '📚 رواية'}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${idea.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {idea.visibility === 'free' ? '🆓 مجاني' : `💰 ${idea.price} رصيد`}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{idea.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                    {idea.authorAvatar ? (
                      <img src={idea.authorAvatar} alt="" className="w-full h-full object-cover" />
                    ) : '👤'}
                  </div>
                  <span className="font-medium text-gray-700">{idea.authorName || 'مجهول'}</span>
                  {idea.authorCountry && <span className="text-gray-400">• {idea.authorCountry}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Copyright notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">🔒</span>
            <div className="text-xs text-blue-700">
              <strong>تاريخ التوثيق: {idea.writtenAt}</strong> — هذا المحتوى محمي بحقوق الملكية الفكرية.
              سرقة هذه الفكرة يؤدي إلى تعليق حساب السارق وحذف المحتوى المسروق فوراً.
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <div className="text-center"><div className="text-lg font-bold text-blue-600">{idea.viewCount}</div><div className="text-xs text-gray-400">مشاهدة</div></div>
            <div className="text-center"><div className="text-lg font-bold text-green-600">{idea.purchaseCount}</div><div className="text-xs text-gray-400">مشتري</div></div>
          </div>

          {/* Content */}
          {canRead ? (
            <div>
              {idea.type === 'novel' && parsedChapters.length > 0 ? (
                <div className="space-y-8">
                  {parsedChapters.map((ch, i) => (
                    <div key={i} className="border-t border-blue-100 pt-6 first:border-t-0 first:pt-0">
                      <h2 className="text-lg font-bold text-blue-700 mb-4">{ch.title}</h2>
                      <div className="text-gray-800 leading-loose whitespace-pre-wrap text-base">{ch.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-800 leading-loose whitespace-pre-wrap text-base">{idea.content}</div>
              )}
            </div>
          ) : (
            <div>
              {/* Free preview */}
              <div className="text-gray-600 leading-loose mb-6 whitespace-pre-wrap text-base relative">
                {idea.preview || idea.content.slice(0, 200)}...
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-bold text-gray-800 mb-2">هذا المحتوى مدفوع</h3>
                <p className="text-sm text-gray-600 mb-4">
                  لقراءة المحتوى كاملاً، يجب عليك شراؤه بـ <strong>{idea.price} رصيد</strong>
                </p>
                <button onClick={handlePurchase} disabled={purchasing}
                  className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md disabled:opacity-60">
                  {purchasing ? 'جارٍ الشراء...' : `🛒 اشترِ الآن — ${idea.price} رصيد`}
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  ✓ بعد الشراء ستتمكن من قراءة المحتوى كاملاً في أي وقت
                </p>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="mt-6 pt-4 border-t border-blue-100 flex gap-3">
              <span className="text-sm text-green-600 font-medium">✓ هذا محتواك</span>
            </div>
          )}
        </div>

        {/* Author profile link */}
        <div className="text-center">
          <Link href={`/users/${idea.userId}`} className="text-blue-500 hover:underline text-sm">
            عرض صفحة الكاتب →
          </Link>
        </div>
      </main>
    </div>
  )
}
