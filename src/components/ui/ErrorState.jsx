export function ErrorState({ message, className = '' }) {
  return <p className={`fd-ui text-signal ${className}`}>{message}</p>
}
