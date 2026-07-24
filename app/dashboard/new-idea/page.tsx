'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DecorativeBg } from '@/components/DecorativeBg'

const IDEA_CATEGORIES = [
  { value: 'project_idea', label: '🚀 فكرة مشروع', desc: 'مشروع تجاري أو تقني أو اجتماعي' },
  { value: 'novel_idea',   label: '✍️ فكرة رواية',  desc: 'حبكة أو فكرة لرواية أو قصة' },
]

export default function NewIdeaPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', content: '',
    writtenAt: new Date().toISOString().split('T')[0],
    visibility: 'free', price: '',
    ideaCategory: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.ideaCategory) { setError('يرجى اختيار نوع الفكرة'); return }
    if (!form.title.trim() || !form.content.trim()) { setError('العنوان والمحتوى مطلوبان'); return }
    if (form.content.length < 50) { setError('الفكرة قصيرة جداً، اكتب أكثر تفصيلاً'); return }
    if (form.visibility === 'paid' && (!form.price || parseInt(form.price) < 1)) {
      setError('يرجى تحديد سعر صحيح'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'idea',
          price: form.visibility === 'paid' ? parseInt(form.price) : 0,
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
          <h1 className="text-lg font-bold text-blue-700">💡 فكرة جديدة</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-blue-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">سجّل فكرتك</h2>
            <p className="text-sm text-gray-500">كل فكرة مسجلة بتاريخها ومحمية بحقوق الملكية الفكرية — بقلم <span className="text-blue-600 font-semibold">سحابة صيف</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

            {/* نوع الفكرة */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الفكرة *</label>
              <div className="grid grid-cols-2 gap-3">
                {IDEA_CATEGORIES.map(cat => (
                  <button key={cat.value} type="button"
                    onClick={() => setForm(f => ({ ...f, ideaCategory: cat.value }))}
                    className={`p-4 rounded-2xl border-2 text-right transition-all ${form.ideaCategory === cat.value ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-blue-100 bg-white hover:border-blue-300 hover:bg-blue-50/40'}`}>
                    <div className="text-lg font-bold text-gray-800">{cat.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* العنوان */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">عنوان الفكرة *</label>
              <input type="text" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required maxLength={200} placeholder="اكتب عنواناً واضحاً..."
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {/* المحتوى */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">تفاصيل الفكرة *</label>
              <textarea value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required rows={9} placeholder="اكتب فكرتك بالتفصيل... كلما كانت أوضح كانت أكثر قيمة وحماية."
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              <p className="text-xs text-gray-400 mt-1">{form.content.length} حرف</p>
            </div>

            {/* التاريخ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">تاريخ كتابة الفكرة *</label>
              <input type="date" value={form.writtenAt}
                onChange={e => setForm(f => ({ ...f, writtenAt: e.target.value }))}
                required className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <p className="text-xs text-blue-500 mt-1">🔒 هذا التاريخ يوثق ملكيتك الفكرية رسمياً</p>
            </div>

            {/* النشر */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">طريقة النشر *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'free',  icon: '🆓', title: 'مجاني',   sub: 'الجميع يقرأها مجاناً',          c: 'green' },
                  { v: 'paid',  icon: '💰', title: 'للبيع',   sub: 'القارئ يشتريها لرؤيتها كاملةً', c: 'amber' },
                ].map(o => (
                  <button key={o.v} type="button"
                    onClick={() => setForm(f => ({ ...f, visibility: o.v }))}
                    className={`p-4 rounded-2xl border-2 text-right transition-all ${form.visibility === o.v ? `border-${o.c}-500 bg-${o.c}-50 shadow-md` : 'border-blue-100 bg-white hover:border-blue-200'}`}>
                    <div className="text-2xl mb-1">{o.icon}</div>
                    <div className="font-bold text-sm text-gray-800">{o.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{o.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {form.visibility === 'paid' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  السعر بالدولار $ <span className="text-gray-400 font-normal">(أنت تحدده)</span>
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="text" inputMode="numeric" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="مثال: 5"
                    className="w-full pr-9 pl-4 py-3 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <p className="text-xs text-amber-600 mt-1">⚠️ يرى القارئ مقتطفاً مجانياً قبل الشراء</p>
              </div>
            )}

            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs text-red-600 leading-relaxed">
                ⚠️ يُمنع نشر أي محتوى مسيء أو غير أخلاقي — المخالف يُحذف حسابه نهائياً
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-60 hover:scale-[1.01] active:scale-95">
              {loading ? 'جارٍ الحفظ...' : '💾 حفظ الفكرة وتوثيقها'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
