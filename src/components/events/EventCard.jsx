import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage }    from '../../hooks/useLanguage.js'
import Badge from '../ui/Badge.jsx'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function EventCard({ event }) {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const title    = lang === 'kn' && event.titleKn ? event.titleKn : event.title
  const coverUrl = event.coverPhoto || event.photos?.[0]?.url || 'https://picsum.photos/seed/placeholder/800/450'

  const handleClick = () => navigate(`/events/${event.id}`)

  return (
    <article
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
      onClick={handleClick}
      role="article"
      tabIndex={0}
      aria-label={title}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      {/* Cover image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge label={event.category} type={event.category} />
          {event.attendeeCount > 0 && (
            <span className="text-xs text-gray-400">
              {t('events.attendees', { count: event.attendeeCount })}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-terracotta transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={event.date}>{formatDate(event.date)}</time>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </article>
  )
}
