'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DecorativeBg } from '@/components/DecorativeBg'
import { SahabaLogo, SahabaLogoHeader } from '@/components/SahabaLogo'

export default function Home() {
  const [user, setUser] = useState<{ displayName?: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white overflow-hidden" dir="rtl">
      {/* خلفية زخرفية شفافة */}
      <DecorativeBg />

      {/* ===== Header ===== */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/75 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <SahabaLogoHeader />
        </Link>
        <nav className="flex items-center gap-3">
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md">
                  لوحتي
                </Link>
                <Link href="/profile" className="text-sm text-blue-700 font-medium hover:underline">
                  {user.displayName || user.email}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"
                  className="px-4 py-2 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition-all border border-blue-200">
                  تسجيل الدخول
                </Link>
                <Link href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md">
                  إنشاء حساب
                </Link>
              </div>
            )
          )}
        </nav>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">

        {/* الشعار الكبير */}
        <div className="mb-6 cloud-float">
          <SahabaLogo size="xl" />
        </div>

        <p className="text-xl text-blue-500 font-semibold mb-3">منصتك الآمنة للأفكار الإبداعية</p>
        <p className="text-gray-500 max-w-xl mb-3 leading-relaxed text-[15px]">
          احفظ أفكارك وروايتك في مكان آمن محمي، شاركها مجاناً أو بيعها.
          كل فكرة موثقة بتاريخها ومحمية بحقوق الملكية الفكرية.
        </p>
        <p className="text-blue-400 text-sm mb-8 font-medium">
          ✨ فكرة وتصميم: <span className="text-blue-600 font-bold">سحابة صيف</span>
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link href="/auth/register"
            className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-base font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:scale-105 active:scale-95">
            ابدأ الآن مجاناً ✨
          </Link>
          <Link href="/explore"
            className="px-8 py-3.5 bg-white text-blue-700 border-2 border-blue-200 rounded-2xl text-base font-bold hover:bg-blue-50 transition-all shadow-md">
            استكشف الأفكار 👁
          </Link>
        </div>

        {/* ===== بطاقات الميزات ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full">
          {[
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="#fef9c3"/>
                  <path d="M18 8 C13 8 10 12 10 16 C10 19 12 21.5 15 22.5 L15 26 L21 26 L21 22.5 C24 21.5 26 19 26 16 C26 12 23 8 18 8Z" fill="#f59e0b" opacity="0.8"/>
                  <rect x="15" y="26" width="6" height="2" rx="1" fill="#d97706"/>
                  <line x1="18" y1="4" x2="18" y2="6" stroke="#fbbf24" strokeWidth="1.5"/>
                  <line x1="26" y1="8" x2="24.5" y2="9.5" stroke="#fbbf24" strokeWidth="1.5"/>
                  <line x1="30" y1="16" x2="28" y2="16" stroke="#fbbf24" strokeWidth="1.5"/>
                </svg>
              ),
              title: 'بوابة الأفكار',
              desc: 'سجّل أفكارك ومشاريعك المبتكرة بشكل منظم مع تاريخ التوثيق لحماية حقوقك الفكرية',
              border: 'border-yellow-200',
              bg: 'from-yellow-50/80 to-amber-50/60',
            },
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="#f3e8ff"/>
                  <rect x="9" y="7" width="18" height="22" rx="2" fill="#a855f7" opacity="0.8"/>
                  <rect x="11" y="7" width="16" height="22" rx="2" fill="#ede9fe"/>
                  <rect x="9" y="7" width="4" height="22" rx="2" fill="#7c3aed"/>
                  {[12,16,20,24].map(y => <line key={y} x1="15" y1={y} x2="25" y2={y} stroke="#c4b5fd" strokeWidth="1.2"/>)}
                </svg>
              ),
              title: 'بوابة الروايات',
              desc: 'اكتب روايتك كاملة بجميع فصولها وقصصك وشاركها مع القراء بحرية',
              border: 'border-purple-200',
              bg: 'from-purple-50/80 to-pink-50/60',
            },
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="#dcfce7"/>
                  <rect x="11" y="9" width="14" height="18" rx="2" fill="#22c55e" opacity="0.8"/>
                  <path d="M14 16 L17 19 L22 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 26 L13 29 L18 27 L23 29 L23 26" fill="#16a34a"/>
                </svg>
              ),
              title: 'حماية الملكية الفكرية',
              desc: 'كل محتوى موثق بتاريخه ومحمي من السرقة مع نظام عقوبات رادع وفعّال',
              border: 'border-green-200',
              bg: 'from-green-50/80 to-emerald-50/60',
            },
          ].map((f, i) => (
            <div key={i}
              className={`p-6 rounded-2xl bg-gradient-to-br ${f.bg} border ${f.border} text-right backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              style={{ background: undefined }}>
              <div className="mb-3">{f.icon}</div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== إحصائيات / مميزات إضافية ===== */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '100%', label: 'آمن وموثوق' },
            { value: '✍️', label: 'أفكار وروايات' },
            { value: '🔒', label: 'حماية فكرية' },
            { value: '🌍', label: 'للجميع' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 bg-white/70 rounded-2xl border border-blue-100 backdrop-blur-sm shadow-sm">
              <div className="text-2xl font-black text-blue-600 mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* تنبيه السياسة */}
      <section className="relative z-10 bg-red-50/80 border-t border-red-100 px-6 py-5 text-center backdrop-blur-sm">
        <p className="text-red-600 font-semibold text-sm">
          ⚠️ يُمنع منعاً باتاً نشر أي محتوى مسيء أو غير أخلاقي — المخالف يُحذف حسابه نهائياً
        </p>
      </section>

      <footer className="relative z-10 text-center py-5 text-gray-400 text-xs">
        © 2024 سحابة — منصة الأفكار الإبداعية
      </footer>
    </div>
  )
}
