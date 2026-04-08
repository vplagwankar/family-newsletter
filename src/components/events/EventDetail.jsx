import { useState } from 'react'
import { Link }     from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage }    from '../../hooks/useLanguage.js'
import Badge     from '../ui/Badge.jsx'
import Button    from '../ui/Button.jsx'
import PhotoGrid from './PhotoGrid.jsx'
import Lightbox  from '../ui/Lightbox.jsx'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function EventDetail({ event }) {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const [lightbox, setLightbox] = useState({ open: false, startIndex: 0 })

  const title       = lang === 'kn' && event.titleKn       ? event.titleKn       : event.title
  const description = lang === 'kn' && event.descriptionKn ? event.descriptionKn : event.description
  const coverUrl    = event.coverPhoto || event.photos?.[0]?.url

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert(t('eventDetail.shareCopied'))
    }
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/events"
        className="inline-flex items-center text-sm text-terracotta hover:text-terracotta-dark font-medium mb-6"
      >
        {t('eventDetail.backToEvents')}
      </Link>

      {/* Hero cover photo */}
      {coverUrl && (
        <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge label={event.category} type={event.category} />
        {event.attendeeCount > 0 && (
          <span className="text-sm text-gray-500">
            {event.attendeeCount} {t('eventDetail.attendees')}
          </span>
        )}
        <div className="ml-auto">
          <Button variant="secondary" size="sm" onClick={handleShare}>
            {t('eventDetail.shareButton')}
          </Button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark leading-tight mb-3">
        {title}
      </h1>

      {/* Date + location */}
      <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-terracotta shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={event.date}>{formatDate(event.date)}</time>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-terracotta shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-gray max-w-none mb-10">
        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{description}</p>
      </div>

      {/* Photo gallery */}
      {event.photos && event.photos.length > 0 && (
        <section aria-label={t('eventDetail.photos')}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('eventDetail.photos')} ({event.photos.length})
          </h2>
          <PhotoGrid
            photos={event.photos}
            onPhotoClick={(idx) => setLightbox({ open: true, startIndex: idx })}
          />
        </section>
      )}

      {/* Lightbox */}
      {lightbox.open && (
        <Lightbox
          photos={event.photos}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox({ open: false, startIndex: 0 })}
        />
      )}
    </article>
  )
}
