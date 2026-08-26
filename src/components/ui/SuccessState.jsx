export function SuccessState({ message, className = '' }) {
  return (
    <div className={`flex items-start gap-2 border border-dark bg-dark px-3 py-2.5 text-paper ${className}`}>
      <span aria-hidden="true">✓</span>
      <p className="fd-ui">{message}</p>
    </div>
  )
}
