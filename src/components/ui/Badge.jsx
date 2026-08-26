const TONES = {
  neutral: 'border border-line text-muted',
  signal: 'border border-signal/40 bg-signal-soft text-signal',
  dark: 'bg-dark text-paper',
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`fd-meta inline-flex items-center rounded-xs px-1.5 py-0.5 uppercase ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
