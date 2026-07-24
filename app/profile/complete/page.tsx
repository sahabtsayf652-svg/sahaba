'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DecorativeBg } from '@/components/DecorativeBg'
import { SahabaLogo } from '@/components/SahabaLogo'

const COUNTRIES = [
  'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'مصر', 'الأردن', 'الكويت',
  'البحرين', 'قطر', 'عُمان', 'العراق', 'سوريا', 'لبنان', 'فلسطين', 'اليمن',
  'ليبيا', 'تونس', 'الجزائر', 'المغرب', 'السودان', 'الصومال', 'موريتانيا',
  'المملكة المتحدة', 'الولايات المتحدة', 'كندا', 'أستراليا', 'ألمانيا', 'فرنسا', 'أخرى',
]

export default function CompleteProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '', lastName: '', displayName: '', avatarUrl: '',
    birthDate: '', country: '', age: '', gender: '', contactInfo: '', bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  function handleChange(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.firstName || !form.lastName || !form.displayName || !form.birthDate || !form.country || !form.gender) {
      setError('يرجى ملء جميع الحقول الإجبارية (*)'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      router.push('/dashboard')
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white px-4 py-8 overflow-hidden" dir="rtl">
      <DecorativeBg />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-2">
            <SahabaLogo size="md" />
          </Link>
          <h1 className="text-xl font-bold text-blue-700 mt-2">إكمال الملف الشخصي</h1>
          <p className="text-blue-500 text-sm mt-1">هذه الخطوة إجبارية لاستخدام سحابة</p>
        </div>

        <div className="cloud-card rounded-3xl p-8 shadow-xl">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            {[1, 2].map(s => (
              <div key={s} className={`h-2 w-16 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-blue-100'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">المعلومات الشخصية</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول *</label>
                    <input type="text" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)}
                      required placeholder="الاسم" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اللقب *</label>
                    <input type="text" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)}
                      required placeholder="اللقب / العائلة" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الذي تريد ظهوره للآخرين *</label>
                  <input type="text" value={form.displayName} onChange={e => handleChange('displayName', e.target.value)}
                    required placeholder="مثال: الكاتب أحمد / أبو عبدالله" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة الشخصية (اختياري)</label>
                  <input type="url" value={form.avatarUrl} onChange={e => handleChange('avatarUrl', e.target.value)}
                    placeholder="https://example.com/photo.jpg" className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الجنس *</label>
                  <div className="flex gap-4">
                    {['male', 'female'].map(g => (
                      <button key={g} type="button"
                        onClick={() => handleChange('gender', g)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.gender === g ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-blue-200 text-gray-700 hover:border-blue-400'}`}>
                        {g === 'male' ? '👤 ذكر' : '👩 أنثى'}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={() => {
                  if (!form.firstName || !form.lastName || !form.displayName || !form.gender) {
                    setError('يرجى ملء الحقول الإجبارية'); return
                  }
                  setError(''); setStep(2)
                }} className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md">
                  التالي →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات إضافية</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد *</label>
                    <input type="date" value={form.birthDate} onChange={e => handleChange('birthDate', e.target.value)}
                      required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العمر (اختياري)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.age}
                      onChange={e => {
                        const v = e.target.value.replace(/[^0-9]/g, '')
                        handleChange('age', v)
                      }}
                      placeholder="مثال: 25"
                      className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البلد *</label>
                  <select value={form.country} onChange={e => handleChange('country', e.target.value)}
                    required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
                    <option value="">اختر البلد</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">معلومات التواصل (اختياري)</label>
                  <input type="text" value={form.contactInfo} onChange={e => handleChange('contactInfo', e.target.value)}
                    placeholder="مثال: واتساب، تيليجرام، موقع..." className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نبذة عنك (اختياري)</label>
                  <textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)}
                    rows={3} placeholder="اكتب نبذة مختصرة عن نفسك..."
                    className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none" />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition-all">
                    ← رجوع
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md disabled:opacity-60">
                    {loading ? 'جارٍ الحفظ...' : 'أكمل التسجيل ✓'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
