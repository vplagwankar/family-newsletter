import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

export default function Lightbox({ photos, startIndex = 0, onClose }) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() =>
    setCurrent((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() =>
    setCurrent((i) => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const photo = photos[current]

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={t('eventDetail.photos')}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm opacity-70">
          {current + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 text-2xl leading-none"
          aria-label={t('common.close')}
        >
          ✕
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative px-12">
        <img
          src={photo.url}
          alt={photo.alt || ''}
          className="max-h-full max-w-full object-contain"
        />

        {/* Prev arrow */}
        {photos.length > 1 && (
          <button
            onClick={prev}
            aria-label={t('common.prev')}
            className="absolute left-2 text-white text-3xl bg-black/30 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {photos.length > 1 && (
          <button
            onClick={next}
            aria-label={t('common.next')}
            className="absolute right-2 text-white text-3xl bg-black/30 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ›
          </button>
        )}
      </div>

      {/* Caption */}
      {photo.alt && (
        <p className="text-center text-white/60 text-sm px-4 py-3">{photo.alt}</p>
      )}
    </div>,
    document.body
  )
}
