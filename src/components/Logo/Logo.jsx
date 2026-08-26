export function LogoMark({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 18 10 Q 18 5 25 5 L 76 5 Q 82 5 78.5 10 L 67 24 Q 64 27 60 27 L 32 27 L 32 37 L 60 37 Q 65 37 62 41 L 50 55 Q 47 58 43 58 L 32 58 L 32 90 L 18 90 Z"
        fill="currentColor"
      />
      <path d="M 32 64 L 52 64 Q 57 64 54 68 L 46 78 Q 43 81 39 81 L 32 81 Z" fill="#e53935" />
    </svg>
  )
}

export function Logo({ className = '', textClassName = 'text-ink', markClassName = '' }) {
  return (
    <span
      className={`font-display inline-flex items-center gap-2 text-lg font-bold tracking-tight uppercase ${textClassName} ${className}`}
    >
      <LogoMark className={markClassName || textClassName} />
      Flow<span className="text-signal">Daily</span>
    </span>
  )
}
