import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getRecentEvents } from '../../services/api.js'
import Spinner  from '../ui/Spinner.jsx'
import EventCard from '../events/EventCard.jsx'

export default function RecentEvents() {
  const { t }     = useTranslation()
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentEvents(3).then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label={t('home.recentEventsTitle')}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-terracotta-dark">
          {t('home.recentEventsTitle')}
        </h2>
        <Link
          to="/events"
          className="text-sm text-terracotta hover:text-terracotta-dark font-medium"
        >
          {t('home.recentEventsViewAll')} →
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </section>
  )
}
