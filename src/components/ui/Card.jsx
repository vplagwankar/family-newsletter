export default function Card({ children, className = '', onClick }) {
  const interactive = onClick
    ? 'cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:ring-terracotta'
    : ''
  return (
    <div
      className={`bg-white rounded-xl shadow-sm transition-shadow ${interactive} ${className}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={
        onClick
          ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e) }
          : undefined
      }
    >
      {children}
    </div>
  )
}
