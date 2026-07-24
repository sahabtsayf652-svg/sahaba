'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const COUNTRIES = [
  'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'مصر', 'الأردن', 'الكويت',
  'البحرين', 'قطر', 'عُمان', 'العراق', 'سوريا', 'لبنان', 'فلسطين', 'اليمن',
  'ليبيا', 'تونس', 'الجزائر', 'المغرب', 'السودان', 'الصومال', 'موريتانيا',
  'المملكة المتحدة', 'الولايات المتحدة', 'كندا', 'أستراليا', 'ألمانيا', 'فرنسا', 'أخرى',
]

export default function ProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '', lastName: '', displayName: '', avatarUrl: '',
    birthDate: '', country: '', age: '', gender: '', contactInfo: '', bio: '',
  })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/profile')
      .then(r => { if (!r.ok) { router.push('/auth/login'); return null; } return r.json() })
      .then(data => {
        if (!data) return
        const u = data.user
        setEmail(u.email)
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          displayName: u.displayName || '',
          avatarUrl: u.avatarUrl || '',
          birthDate: u.birthDate || '',
          country: u.country || '',
          age: u.age?.toString() || '',
          gender: u.gender || '',
          contactInfo: u.contactInfo || '',
          bio: u.bio || '',
        })
        setLoading(false)
      })
      .catch(() => router.push('/auth/login'))
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      setSuccess(true)
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50" dir="rtl">
      <div className="text-6xl cloud-float">☁</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50" dir="rtl">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 text-sm">← لوحتي</Link>
          <h1 className="font-bold text-blue-700">الملف الشخصي</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="cloud-card rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-blue-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-sky-300 flex items-center justify-center text-2xl shadow-lg overflow-hidden">
              {form.avatarUrl ? <img src={form.avatarUrl} alt="" className="w-full h-full object-cover" /> : (form.gender === 'female' ? '👩' : '👤')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{form.displayName || 'مستخدم سحابة'}</h2>
              <p className="text-gray-400 text-sm">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm text-center">✓ تم الحفظ بنجاح</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول *</label>
                <input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اللقب *</label>
                <input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الظاهر للآخرين *</label>
              <input type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
              <input type="url" value={form.avatarUrl} onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الجنس *</label>
              <div className="flex gap-3">
                {['male', 'female'].map(g => (
                  <button key={g} type="button" onClick={() => setForm(f => ({ ...f, gender: g }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.gender === g ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-blue-200 text-gray-700'}`}>
                    {g === 'male' ? '👤 ذكر' : '👩 أنثى'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد *</label>
                <input type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
                  required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العمر</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value.replace(/[^0-9]/g, '') }))}
                  placeholder="مثال: 25"
                  className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البلد *</label>
              <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                required className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
                <option value="">اختر البلد</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">معلومات التواصل</label>
              <input type="text" value={form.contactInfo} onChange={e => setForm(f => ({ ...f, contactInfo: e.target.value }))}
                placeholder="واتساب، تيليجرام، موقع..." className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نبذة عنك</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3} placeholder="نبذة مختصرة..." className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none" />
            </div>

            <button type="submit" disabled={saving}
              className="w-full py-3.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md disabled:opacity-60">
              {saving ? 'جارٍ الحفظ...' : '💾 حفظ التغييرات'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
