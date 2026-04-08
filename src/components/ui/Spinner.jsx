import { useTranslation } from 'react-i18next'

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
}

export default function Spinner({ size = 'md', className = '' }) {
  const { t } = useTranslation()
  return (
    <div
      role="status"
      aria-label={t('common.loading')}
      className={`inline-block animate-spin rounded-full border-gray-200 border-t-terracotta ${sizes[size]} ${className}`}
    />
  )
}
