const VARIANTS = {
  primary: 'bg-ink text-paper hover:bg-ink/90',
  signal: 'bg-signal text-paper hover:bg-signal/90',
  secondary: 'border border-line bg-surface text-ink hover:border-ink/40',
  ghost: 'text-muted hover:text-ink',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`fd-ui inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
