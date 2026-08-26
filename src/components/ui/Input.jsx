export function Input({ label, className = '', id, ...props }) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="fd-ui text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`fd-body border-b border-line bg-transparent px-1 py-2 text-ink placeholder:text-muted/70 focus:border-signal focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}

export function SearchInput({ className = '', ...props }) {
  return (
    <input
      type="search"
      className={`fd-ui rounded-sm border border-line bg-surface px-3 py-2 text-ink placeholder:text-muted focus:border-signal focus:outline-none ${className}`}
      {...props}
    />
  )
}
