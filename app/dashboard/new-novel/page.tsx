'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DecorativeBg } from '@/components/DecorativeBg'

type Chapter = { title: string; content: string }

const NOVEL_PRICE = 8  // سعر ثابت مقترح بالدولار

const GENRES = [
  { value: 'action',    label: '⚔️ أكشن ومغامرة' },
  { value: 'romance',   label: '💕 رومانسية' },
  { value: 'mystery',   label: '🔍 غموض وتشويق' },
  { value: 'scifi',     label: '🚀 خيال علمي' },
  { value: 'horror',    label: '👻 رعب' },
  { value: 'drama',     label: '🎭 دراما' },
  { value: 'comedy',    label: '😄 كوميديا' },
  { value: 'historical',label: '🏛️ تاريخية' },
  { value: 'social',    label: '🌍 اجتماعية' },
  { value: 'other',     label: '📖 أخرى' },
]

export default function NewNovelPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', description: '',
    writtenAt: new Date().toISOString().split('T')[0],
    visibility: 'free',
    novelGenre: '',
    novelStatus: 'ongoing',
  })
  const [chapters, setChapters] = useState<Chapter[]>([{ title: 'الفصل الأول', content: '' }])
  const [activeChapter, setActiveChapter] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addChapter() {
    setChapters(prev => [...prev, { title: `الفصل ${prev.length + 1}`, content: '' }])
    setActiveChapter(chapters.length)
  }

  function removeChapter(i: number) {
    if (chapters.length === 1) return
    setChapters(prev => prev.filter((_, idx) => idx !== i))
    setActiveChapter(Math.max(0, i - 1))
  }

  function updateChapter(index: number, key: keyof Chapter, value: string) {
    setChapters(prev => prev.map((c, i) => i === index ? { ...c, [key]: value } : c))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.novelGenre) { setError('يرجى اختيار تصنيف الرواية'); return }
    if (!form.title.trim()) { setError('عنوان الرواية مطلوب'); return }
    if (!form.description.trim()) { setError('وصف الرواية مطلوب'); return }
    if (!chapters.some(c => c.content.trim().length > 0)) {
      setError('يجب كتابة محتوى الفصل الأول على الأقل'); return
    }
    setLoading(true)
    const fullContent = chapters.map(c => `${c.title}\n\n${c.content}`).join('\n\n---\n\n')
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title, content: fullContent,
          writtenAt: form.writtenAt,
          visibility: form.visibility,
          price: form.visibility === 'paid' ? NOVEL_PRICE : 0,
          type: 'novel',
          novelGenre: form.novelGenre,
          novelStatus: form.novelStatus,
          chapters,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      router.push('/dashboard')
    } catch { setError('حدث خطأ في الاتصال') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white overflow-hidden" dir="rtl">
      <DecorativeBg />
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 text-sm font-medium">← العودة للوحة</Link>
          <h1 className="text-lg font-bold text-blue-700">📚 رواية / قصة جديدة</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* العمود الجانبي */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-blue-100">
                <h2 className="text-base font-bold text-gray-800 mb-4">معلومات الرواية</h2>

                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs mb-4">{error}</div>}

                <div className="space-y-4">

                  {/* التصنيف */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">تصنيف الرواية *</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GENRES.map(g => (
                        <button key={g.value} type="button"
                          onClick={() => setForm(f => ({ ...f, novelGenre: g.value }))}
                          className={`px-2 py-1.5 rounded-lg border text-xs text-right transition-all font-medium ${form.novelGenre === g.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200'}`}>
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* حالة الرواية */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">حالة الرواية *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'ongoing',   icon: '✍️', label: 'مستمرة' },
                        { v: 'completed', icon: '✅', label: 'مكتملة' },
                      ].map(s => (
                        <button key={s.v} type="button"
                          onClick={() => setForm(f => ({ ...f, novelStatus: s.v }))}
                          className={`p-2.5 rounded-xl border-2 text-center text-sm transition-all font-medium ${form.novelStatus === s.v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'}`}>
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* العنوان */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">عنوان الرواية *</label>
                    <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      required placeholder="اسم روايتك..."
                      className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                  </div>

                  {/* الوصف */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">نبذة قصيرة *</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      required rows={3} placeholder="ملخص مختصر عن القصة..."
                      className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none" />
                  </div>

                  {/* التاريخ */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">تاريخ البدء *</label>
                    <input type="date" value={form.writtenAt} onChange={e => setForm(f => ({ ...f, writtenAt: e.target.value }))}
                      required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                  </div>

                  {/* النشر */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">طريقة النشر</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'free', icon: '🆓', label: 'مجاني' },
                        { v: 'paid', icon: '💰', label: 'للبيع' },
                      ].map(o => (
                        <button key={o.v} type="button"
                          onClick={() => setForm(f => ({ ...f, visibility: o.v }))}
                          className={`p-2.5 rounded-xl border-2 text-center text-sm font-medium transition-all ${form.visibility === o.v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                          {o.icon} {o.label}
                        </button>
                      ))}
                    </div>
                    {form.visibility === 'paid' && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                        💡 سعر قراءة الرواية المقترح: <strong className="text-amber-800">${NOVEL_PRICE}</strong> (ثابت لجميع البلدان)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* قائمة الفصول */}
              <div className="bg-white/85 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-700 text-sm">الفصول ({chapters.length})</h3>
                  <button type="button" onClick={addChapter}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
                    + فصل جديد
                  </button>
                </div>
                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {chapters.map((c, i) => (
                    <div key={i} className={`flex items-center gap-1 rounded-lg transition-all ${activeChapter === i ? 'bg-blue-500' : 'bg-white/60 hover:bg-blue-50'}`}>
                      <button type="button" onClick={() => setActiveChapter(i)}
                        className={`flex-1 text-right px-3 py-2 text-sm font-medium ${activeChapter === i ? 'text-white' : 'text-gray-700'}`}>
                        {c.title || `الفصل ${i + 1}`}
                        {c.content.length > 0 && <span className={`text-xs mr-1 opacity-70`}>({c.content.length}ح)</span>}
                      </button>
                      {chapters.length > 1 && (
                        <button type="button" onClick={() => removeChapter(i)}
                          className={`px-2 text-lg leading-none ${activeChapter === i ? 'text-white/70 hover:text-white' : 'text-gray-300 hover:text-red-400'}`}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg disabled:opacity-60">
                {loading ? 'جارٍ الحفظ...' : '💾 حفظ الرواية'}
              </button>
            </div>

            {/* محرر الفصل */}
            <div className="lg:col-span-2">
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-blue-100 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-bold text-gray-500">الفصل {activeChapter + 1} من {chapters.length}</span>
                  <div className="flex-1 h-1 bg-blue-100 rounded-full">
                    <div className="h-1 bg-blue-500 rounded-full transition-all" style={{ width: `${((activeChapter + 1) / chapters.length) * 100}%` }} />
                  </div>
                </div>
                <div className="mb-4">
                  <input type="text" value={chapters[activeChapter]?.title || ''}
                    onChange={e => updateChapter(activeChapter, 'title', e.target.value)}
                    placeholder="عنوان الفصل"
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={chapters[activeChapter]?.content || ''}
                    onChange={e => updateChapter(activeChapter, 'content', e.target.value)}
                    rows={22}
                    placeholder="ابدأ الكتابة هنا... اكتب بحرية وإبداع 🖊️"
                    className="w-full h-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-base leading-loose"
                  />
                  <p className="text-xs text-gray-400 mt-1">{chapters[activeChapter]?.content.length || 0} حرف</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
