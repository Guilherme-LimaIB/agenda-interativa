export function LoadingState({ message = 'Carregando...', className = '' }) {
  return <p className={`fd-meta text-muted ${className}`}>{message}</p>
}
