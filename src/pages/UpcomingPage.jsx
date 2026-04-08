import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getUpcomingEvents } from '../services/api.js'
import { useLanguage } from '../hooks/useLanguage.js'
import Spinner from '../components/ui/Spinner.jsx'
import Badge from '../components/ui/Badge.jsx'

function countdown(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(dateStr)
  eventDate.setHours(0, 0, 0, 0)
  return Math.round((eventDate - today) / (1000 * 60 * 60 * 24))
}

function CountdownBadge({ days, t }) {
  if (days === 0) return <span className="inline-flex items-center gap-1 bg-terracotta text-white text-xs font-bold px-3 py-1 rounded-full">{t('upcoming.today')}</span>
  if (days === 1) return <span className="inline-flex items-center gap-1 bg-saffron text-white text-xs font-bold px-3 py-1 rounded-full">{t('upcoming.tomorrow')}</span>
  return <span className="inline-flex items-center gap-1 bg-warmgreen text-white text-xs font-bold px-3 py-1 rounded-full">{t('upcoming.countdown_other', { count: days })}</span>
}

function generateICS(event) {
  const start = event.date.replace(/-/g, '')
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lagwankar Family//Newsletter//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@lagwankar.family`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${start}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n').slice(0, 300)}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

function formatDisplayDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function UpcomingPage() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `${t('upcoming.pageTitle')} — Lagwankar Family`
    getUpcomingEvents(60).then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [t])

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark mb-8">
        {t('upcoming.pageTitle')}
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg">{t('upcoming.empty')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const days   = countdown(event.date)
            const title  = lang === 'kn' && event.titleKn ? event.titleKn : event.title

            return (
              <article
                key={event.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Cover photo strip */}
                {event.coverPhoto && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={event.coverPhoto}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge category={event.category} />
                        <CountdownBadge days={days} t={t} />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
                    </div>
                  </div>

                  {/* Date + Location */}
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">📅</span>
                      <time dateTime={event.date}>{formatDisplayDate(event.date)}</time>
                    </div>
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {lang === 'kn' && event.descriptionKn ? event.descriptionKn : event.description}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => generateICS(event)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-warmgreen text-white text-xs font-semibold rounded-full hover:bg-warmgreen-dark transition-colors"
                    >
                      <span aria-hidden="true">📥</span>
                      {t('upcoming.addToCalendar')}
                    </button>
                    <Link
                      to="/calendar"
                      className="text-xs text-terracotta hover:underline"
                    >
                      View calendar →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
