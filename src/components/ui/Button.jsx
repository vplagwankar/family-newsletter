const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary:   'bg-terracotta text-white hover:bg-terracotta-dark',
  secondary: 'border border-terracotta text-terracotta bg-white hover:bg-cream-200',
  ghost:     'text-terracotta hover:text-terracotta-dark hover:bg-cream-200',
  danger:    'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
