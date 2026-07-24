// شعار سحابة الكبير — كلمة "سحابة" زرقاء مع سحابة بيضاء شفافة داخلها
export function SahabaLogo({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: { text: 28, cloud: 22, h: 40 },
    md: { text: 42, cloud: 34, h: 56 },
    lg: { text: 72, cloud: 58, h: 90 },
    xl: { text: 100, cloud: 80, h: 120 },
  }
  const s = sizes[size]

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      {/* الكلمة */}
      <span
        style={{
          fontSize: s.text,
          fontWeight: 900,
          color: '#1d4ed8',
          letterSpacing: '0.02em',
          lineHeight: 1,
          fontFamily: "'Segoe UI', Arial, sans-serif",
          position: 'relative',
          zIndex: 2,
          textShadow: '0 2px 12px rgba(59,130,246,0.25)',
        }}
      >
        سحابة
      </span>

      {/* سحابة بيضاء شفافة فوق الكلمة */}
      <svg
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          width: '105%',
          height: '120%',
          opacity: 0.18,
          zIndex: 3,
          pointerEvents: 'none',
        }}
        viewBox="0 0 300 100"
        fill="none"
      >
        <ellipse cx="150" cy="72" rx="130" ry="28" fill="white"/>
        <circle cx="90" cy="58" r="32" fill="white"/>
        <circle cx="150" cy="44" r="42" fill="white"/>
        <circle cx="215" cy="54" r="30" fill="white"/>
        <circle cx="260" cy="62" r="22" fill="white"/>
        <circle cx="45" cy="65" r="20" fill="white"/>
      </svg>
    </div>
  )
}

// نسخة صغيرة للهيدر
export function SahabaLogoHeader() {
  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="relative inline-flex items-center justify-center" style={{ height: 36 }}>
        <span style={{
          fontSize: 26,
          fontWeight: 900,
          color: '#1d4ed8',
          letterSpacing: '0.02em',
          lineHeight: 1,
          position: 'relative',
          zIndex: 2,
        }}>
          سحابة
        </span>
        <svg style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -52%)',
          width: '110%', height: '130%',
          opacity: 0.2, zIndex: 3, pointerEvents: 'none',
        }} viewBox="0 0 200 70" fill="none">
          <ellipse cx="100" cy="52" rx="88" ry="20" fill="white"/>
          <circle cx="60" cy="40" r="22" fill="white"/>
          <circle cx="100" cy="30" r="28" fill="white"/>
          <circle cx="145" cy="38" r="20" fill="white"/>
        </svg>
      </div>
    </div>
  )
}
