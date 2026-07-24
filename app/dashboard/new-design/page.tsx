'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DecorativeBg } from '@/components/DecorativeBg'

const DESIGN_CATEGORIES = [
  { value: 'photo',    icon: '🖼️', label: 'صورة معدّلة',   desc: 'صور عدّلتها أو صممتها' },
  { value: 'cv',       icon: '📄', label: 'السيرة الذاتية', desc: 'CV احترافي أنشأته' },
  { value: 'research', icon: '🔬', label: 'بحث أكاديمي',   desc: 'بحث أو دراسة قمت بها' },
  { value: 'chart',    icon: '📊', label: 'مخطط ورسم',     desc: 'مخططات أو إنفوغراف' },
  { value: 'poster',   icon: '🎨', label: 'بوستر وتصميم',  desc: 'بوسترات أو تصاميم جرافيك' },
  { value: 'other',    icon: '📁', label: 'أخرى',           desc: 'أي عمل إبداعي آخر' },
]

const DESIGN_PRICE = 3  // سعر ثابت للتصاميم

export default function NewDesignPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', content: '', mediaUrl: '',
    writtenAt: new Date().toISOString().split('T')[0],
    visibility: 'free', price: '',
    designCategory: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.designCategory) { setError('يرجى اختيار نوع العمل'); return }
    if (!form.title.trim()) { setError('العنوان مطلوب'); return }
    if (!form.content.trim()) { setError('الوصف مطلوب'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'design',
          price: form.visibility === 'paid' ? DESIGN_PRICE : 0,
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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 text-sm font-medium">← العودة للوحة</Link>
          <h1 className="text-lg font-bold text-blue-700">🎨 نشر عمل إبداعي</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-blue-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">نشر عملك الإبداعي</h2>
            <p className="text-sm text-gray-500">صور، سير ذاتية، أبحاث، مخططات — شارك إبداعاتك مع العالم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

            {/* نوع العمل */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نوع العمل *</label>
              <div className="grid grid-cols-3 gap-2">
                {DESIGN_CATEGORIES.map(cat => (
                  <button key={cat.value} type="button"
                    onClick={() => setForm(f => ({ ...f, designCategory: cat.value }))}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${form.designCategory === cat.value ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/30'}`}>
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-bold text-gray-800">{cat.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* العنوان */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">عنوان العمل *</label>
              <input type="text" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required maxLength={200} placeholder="اسم واضح لعملك..."
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {/* الوصف */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">وصف العمل *</label>
              <textarea value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required rows={5} placeholder="اشرح ما في عملك وكيف أنجزته..."
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>

            {/* رابط الصورة */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                رابط الصورة / الملف
                <span className="text-gray-400 font-normal mr-1">(اختياري — يمكنك رفع الصورة على Imgur أو Google Drive)</span>
              </label>
              <input type="url" value={form.mediaUrl}
                onChange={e => setForm(f => ({ ...f, mediaUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              {form.mediaUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-blue-100 max-h-48">
                  <img src={form.mediaUrl} alt="معاينة" className="w-full object-cover max-h-48" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            {/* التاريخ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">تاريخ الإنجاز *</label>
              <input type="date" value={form.writtenAt}
                onChange={e => setForm(f => ({ ...f, writtenAt: e.target.value }))}
                required className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {/* النشر */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">طريقة النشر *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'free', icon: '🆓', title: 'مجاني', sub: 'الجميع يشاهده مجاناً' },
                  { v: 'paid', icon: '💰', title: 'للبيع', sub: `بسعر ثابت $${DESIGN_PRICE}` },
                ].map(o => (
                  <button key={o.v} type="button"
                    onClick={() => setForm(f => ({ ...f, visibility: o.v }))}
                    className={`p-4 rounded-2xl border-2 text-right transition-all ${form.visibility === o.v ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-teal-200'}`}>
                    <div className="text-2xl mb-1">{o.icon}</div>
                    <div className="font-bold text-sm text-gray-800">{o.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{o.sub}</div>
                  </button>
                ))}
              </div>
              {form.visibility === 'paid' && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                  💡 السعر المقترح: <strong>${DESIGN_PRICE}</strong> — موحّد لجميع البلدان، يرى القارئ معاينة مجانية قبل الشراء
                </div>
              )}
            </div>

            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs text-red-600 leading-relaxed">
                ⚠️ يُمنع نشر محتوى مسيء أو منتهك لحقوق الآخرين — المخالف يُحذف حسابه نهائياً
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg disabled:opacity-60">
              {loading ? 'جارٍ النشر...' : '🚀 نشر العمل'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
