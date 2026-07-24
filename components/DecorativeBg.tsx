// مكوّن الخلفية الزخرفية المشتركة — أقلام، دفاتر، دماغ، سحاب — شفافة
export function DecorativeBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* ===== أقلام ===== */}

      {/* قلم كبير يمين أعلى */}
      <svg className="absolute" style={{ top: '4%', right: '3%', opacity: 0.07, width: 80, transform: 'rotate(-25deg)' }} viewBox="0 0 40 160" fill="none">
        <rect x="15" y="0" width="10" height="110" rx="3" fill="#3b82f6"/>
        <polygon points="10,110 30,110 20,140" fill="#60a5fa"/>
        <polygon points="17,138 23,138 20,150" fill="#1e3a5f"/>
        <rect x="13" y="0" width="14" height="12" rx="2" fill="#bfdbfe"/>
      </svg>

      {/* قلم وسط يسار */}
      <svg className="absolute" style={{ top: '30%', left: '2%', opacity: 0.06, width: 55, transform: 'rotate(15deg)' }} viewBox="0 0 40 160" fill="none">
        <rect x="15" y="0" width="10" height="110" rx="3" fill="#2563eb"/>
        <polygon points="10,110 30,110 20,140" fill="#3b82f6"/>
        <polygon points="17,138 23,138 20,150" fill="#1e3a5f"/>
        <rect x="13" y="0" width="14" height="12" rx="2" fill="#93c5fd"/>
      </svg>

      {/* قلم أسفل يمين */}
      <svg className="absolute" style={{ bottom: '15%', right: '6%', opacity: 0.07, width: 48, transform: 'rotate(-40deg)' }} viewBox="0 0 40 160" fill="none">
        <rect x="15" y="0" width="10" height="110" rx="3" fill="#1d4ed8"/>
        <polygon points="10,110 30,110 20,140" fill="#3b82f6"/>
        <polygon points="17,138 23,138 20,150" fill="#0f2a5e"/>
        <rect x="13" y="0" width="14" height="12" rx="2" fill="#bfdbfe"/>
      </svg>

      {/* قلم رصاص يسار أسفل */}
      <svg className="absolute" style={{ bottom: '8%', left: '5%', opacity: 0.06, width: 40, transform: 'rotate(30deg)' }} viewBox="0 0 30 120" fill="none">
        <rect x="10" y="0" width="10" height="85" rx="2" fill="#60a5fa"/>
        <polygon points="7,85 23,85 15,108" fill="#93c5fd"/>
        <polygon points="12,106 18,106 15,115" fill="#1e3a5f"/>
        <rect x="9" y="0" width="12" height="10" rx="2" fill="#dbeafe"/>
      </svg>

      {/* قلم وسط أعلى */}
      <svg className="absolute" style={{ top: '8%', left: '20%', opacity: 0.05, width: 35, transform: 'rotate(50deg)' }} viewBox="0 0 40 160" fill="none">
        <rect x="15" y="0" width="10" height="110" rx="3" fill="#3b82f6"/>
        <polygon points="10,110 30,110 20,140" fill="#60a5fa"/>
        <polygon points="17,138 23,138 20,150" fill="#1e3a5f"/>
        <rect x="13" y="0" width="14" height="12" rx="2" fill="#bfdbfe"/>
      </svg>

      {/* ===== دفاتر / مفكرات ===== */}

      {/* دفتر كبير يسار */}
      <svg className="absolute" style={{ top: '18%', left: '8%', opacity: 0.07, width: 90, transform: 'rotate(-8deg)' }} viewBox="0 0 80 100" fill="none">
        <rect x="8" y="2" width="64" height="96" rx="4" fill="#3b82f6"/>
        <rect x="12" y="2" width="60" height="96" rx="4" fill="#eff6ff"/>
        <rect x="8" y="2" width="8" height="96" rx="2" fill="#2563eb"/>
        {/* خطوط */}
        {[20,30,40,50,60,70,80].map(y => (
          <line key={y} x1="22" y1={y} x2="68" y2={y} stroke="#bfdbfe" strokeWidth="1.5"/>
        ))}
        {/* حلقات التجليد */}
        {[18,40,62,84].map(y => (
          <circle key={y} cx="8" cy={y} r="3" fill="#1d4ed8"/>
        ))}
      </svg>

      {/* دفتر صغير يمين أسفل */}
      <svg className="absolute" style={{ bottom: '20%', right: '4%', opacity: 0.06, width: 70, transform: 'rotate(10deg)' }} viewBox="0 0 80 100" fill="none">
        <rect x="8" y="2" width="64" height="96" rx="4" fill="#60a5fa"/>
        <rect x="12" y="2" width="60" height="96" rx="4" fill="#f0f9ff"/>
        <rect x="8" y="2" width="8" height="96" rx="2" fill="#3b82f6"/>
        {[20,30,40,50,60,70,80].map(y => (
          <line key={y} x1="22" y1={y} x2="68" y2={y} stroke="#bfdbfe" strokeWidth="1.5"/>
        ))}
        {[18,40,62,84].map(y => (
          <circle key={y} cx="8" cy={y} r="3" fill="#2563eb"/>
        ))}
      </svg>

      {/* دفتر وسط يمين */}
      <svg className="absolute" style={{ top: '50%', right: '2%', opacity: 0.05, width: 60, transform: 'rotate(-15deg)' }} viewBox="0 0 80 100" fill="none">
        <rect x="8" y="2" width="64" height="96" rx="4" fill="#93c5fd"/>
        <rect x="12" y="2" width="60" height="96" rx="4" fill="#f8faff"/>
        <rect x="8" y="2" width="8" height="96" rx="2" fill="#3b82f6"/>
        {[20,35,50,65,80].map(y => (
          <line key={y} x1="22" y1={y} x2="68" y2={y} stroke="#dbeafe" strokeWidth="1.5"/>
        ))}
        {[20,50,80].map(y => (
          <circle key={y} cx="8" cy={y} r="3" fill="#2563eb"/>
        ))}
      </svg>

      {/* ===== دماغ / عقل ===== */}

      {/* دماغ كبير يمين */}
      <svg className="absolute" style={{ top: '35%', right: '7%', opacity: 0.07, width: 100 }} viewBox="0 0 120 100" fill="none">
        <path d="M60 85 C35 85 15 70 15 52 C15 42 20 34 30 29 C28 24 29 18 34 15 C39 12 45 13 49 17 C52 14 56 12 60 12 C64 12 68 14 71 17 C75 13 81 12 86 15 C91 18 92 24 90 29 C100 34 105 42 105 52 C105 70 85 85 60 85Z" fill="#3b82f6"/>
        {/* تعرجات الدماغ */}
        <path d="M40 35 Q45 28 50 35 Q55 42 60 35 Q65 28 70 35 Q75 42 80 35" stroke="#bfdbfe" strokeWidth="2" fill="none"/>
        <path d="M35 50 Q42 43 49 50 Q56 57 63 50 Q70 43 77 50 Q84 57 88 50" stroke="#bfdbfe" strokeWidth="2" fill="none"/>
        <path d="M38 65 Q46 58 54 65 Q62 72 70 65 Q78 58 85 65" stroke="#93c5fd" strokeWidth="2" fill="none"/>
        {/* خط المنتصف */}
        <line x1="60" y1="15" x2="60" y2="83" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3,3"/>
      </svg>

      {/* دماغ صغير يسار أسفل */}
      <svg className="absolute" style={{ bottom: '30%', left: '3%', opacity: 0.06, width: 70 }} viewBox="0 0 120 100" fill="none">
        <path d="M60 85 C35 85 15 70 15 52 C15 42 20 34 30 29 C28 24 29 18 34 15 C39 12 45 13 49 17 C52 14 56 12 60 12 C64 12 68 14 71 17 C75 13 81 12 86 15 C91 18 92 24 90 29 C100 34 105 42 105 52 C105 70 85 85 60 85Z" fill="#60a5fa"/>
        <path d="M40 35 Q45 28 50 35 Q55 42 60 35 Q65 28 70 35 Q75 42 80 35" stroke="#dbeafe" strokeWidth="2" fill="none"/>
        <path d="M35 50 Q42 43 49 50 Q56 57 63 50 Q70 43 77 50 Q84 57 88 50" stroke="#dbeafe" strokeWidth="2" fill="none"/>
        <line x1="60" y1="15" x2="60" y2="83" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="3,3"/>
      </svg>

      {/* ===== سحابات شفافة متناثرة ===== */}
      <svg className="absolute" style={{ top: '12%', right: '25%', opacity: 0.06, width: 130 }} viewBox="0 0 200 80" fill="none">
        <ellipse cx="100" cy="58" rx="80" ry="22" fill="#3b82f6"/>
        <circle cx="70" cy="48" r="22" fill="#60a5fa"/>
        <circle cx="100" cy="38" r="28" fill="#3b82f6"/>
        <circle cx="135" cy="45" r="20" fill="#60a5fa"/>
      </svg>

      <svg className="absolute" style={{ bottom: '12%', right: '30%', opacity: 0.05, width: 90 }} viewBox="0 0 200 80" fill="none">
        <ellipse cx="100" cy="58" rx="80" ry="22" fill="#2563eb"/>
        <circle cx="70" cy="48" r="22" fill="#3b82f6"/>
        <circle cx="100" cy="38" r="28" fill="#2563eb"/>
        <circle cx="135" cy="45" r="20" fill="#3b82f6"/>
      </svg>

      <svg className="absolute" style={{ top: '60%', left: '15%', opacity: 0.05, width: 75 }} viewBox="0 0 200 80" fill="none">
        <ellipse cx="100" cy="58" rx="80" ry="22" fill="#60a5fa"/>
        <circle cx="70" cy="48" r="22" fill="#93c5fd"/>
        <circle cx="100" cy="38" r="28" fill="#60a5fa"/>
        <circle cx="135" cy="45" r="20" fill="#93c5fd"/>
      </svg>

      {/* نقاط زخرفية */}
      {[
        { x: '15%', y: '5%', r: 3 }, { x: '40%', y: '8%', r: 2 }, { x: '70%', y: '3%', r: 4 },
        { x: '88%', y: '22%', r: 2 }, { x: '5%', y: '55%', r: 3 }, { x: '92%', y: '68%', r: 2 },
        { x: '25%', y: '92%', r: 3 }, { x: '60%', y: '95%', r: 2 }, { x: '80%', y: '90%', r: 4 },
      ].map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#3b82f6" opacity="0.15"/>
      ))}
    </div>
  )
}
