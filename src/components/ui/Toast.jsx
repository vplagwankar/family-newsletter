import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const typeStyles = {
  success: 'bg-warmgreen text-white',
  error:   'bg-red-600 text-white',
  info:    'bg-gray-800 text-white',
}

const typeIcons = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
}

/**
 * Simple toast notification.
 * Usage: <Toast message="Saved!" type="success" onDone={() => setToast(null)} />
 */
export default function Toast({ message, type = 'success', duration = 3000, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [onDone, duration])

  return createPortal(
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3
        px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-up
        ${typeStyles[type]}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-base font-bold" aria-hidden="true">{typeIcons[type]}</span>
      {message}
    </div>,
    document.body
  )
}
