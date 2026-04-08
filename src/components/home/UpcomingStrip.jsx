import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage }    from '../../hooks/useLanguage.js'
import { getUpcomingEvents } from '../../services/api.js'
import Badge from '../ui/Badge.jsx'
import Spinner from '../ui/Spinner.jsx'

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function CountdownBadge({ days }) {
  const { t } = useTranslation()
  if (days <= 0)  return <span className="text-xs font-semibold text-white/80">{t('common.today')}</span>
  if (days === 1) return <span className="text-xs font-semibold text-white/80">{t('common.tomorrow')}</span>
  return (
    <span className="text-xs font-semibold text-white/80">
      {t('common.countdownDays', { count: days })}
    </span>
  )
}

export default function UpcomingStrip() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUpcomingEvents(30).then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  return (
    <section className="bg-terracotta" aria-label={t('home.upcomingTitle')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-cream font-semibold text-sm uppercase tracking-widest mb-4">
          {t('home.upcomingTitle')}
        </h2>

        {loading && (
          <div className="flex justify-center py-4">
            <Spinner size="sm" className="border-cream/40 border-t-cream" />
          </div>
        )}

        {!loading && events.length === 0 && (
          <p className="text-cream/70 text-sm">{t('home.upcomingEmpty')}</p>
        )}

        {!loading && events.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {events.map((ev) => {
              const days    = daysUntil(ev.date)
              const dateObj = new Date(ev.date)
              const title   = lang === 'kn' && ev.titleKn ? ev.titleKn : ev.title
              return (
                <div
                  key={ev.id}
                  className="flex-shrink-0 snap-start bg-white/10 backdrop-blur-sm rounded-xl p-4 w-64 sm:w-72 border border-white/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-cream">
                      <div className="text-2xl font-bold leading-none">
                        {dateObj.getDate()}
                      </div>
                      <div className="text-xs opacity-70 uppercase tracking-wide">
                        {dateObj.toLocaleString('default', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <CountdownBadge days={days} />
                  </div>
                  <p className="text-cream font-medium text-sm leading-snug line-clamp-2 mb-2">
                    {title}
                  </p>
                  <div className="flex items-center gap-1 text-cream/60 text-xs">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{ev.location}</span>
                  </div>
                  <div className="mt-2">
                    <Badge label={ev.category} type={ev.category} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
