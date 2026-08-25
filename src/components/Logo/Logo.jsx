export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-gradient)" />
      <rect x="7" y="8" width="18" height="17" rx="4" fill="white" fillOpacity="0.18" />
      <rect x="7" y="8" width="18" height="6" rx="3" fill="white" fillOpacity="0.35" />
      <circle cx="12.5" cy="19" r="1.6" fill="white" />
      <circle cx="16.5" cy="19" r="1.6" fill="white" />
      <circle cx="20.5" cy="19" r="1.6" fill="white" fillOpacity="0.55" />
    </svg>
  )
}

export function Logo({ className = '', textClassName = 'text-white' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className={`font-display text-lg font-bold tracking-tight ${textClassName}`}>FlowDaily</span>
    </div>
  )
}
