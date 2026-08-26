export function EmptyState({ message, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-start gap-2 py-8 ${className}`}>
      <p className="fd-body text-muted">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="fd-ui text-signal hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
