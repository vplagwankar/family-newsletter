import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllEvents }    from '../services/api.js'
import EventGrid from '../components/events/EventGrid.jsx'

const CATEGORIES = ['all', 'puja', 'ceremony', 'reunion', 'celebration']

const filterLabelMap = {
  all:         'events.filterAll',
  puja:        'events.filterPuja',
  ceremony:    'events.filterCeremony',
  reunion:     'events.filterReunion',
  celebration: 'events.filterCelebration',
}

export default function EventsPage() {
  const { t } = useTranslation()
  const [events,   setEvents]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [category, setCategory] = useState('all')
  const [year,     setYear]     = useState('all')

  useEffect(() => {
    document.title = `${t('events.pageTitle')} — Lagwankar Family`
    getAllEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [t])

  // Unique years derived from published events
  const years = useMemo(() => {
    const set = new Set(
      events
        .filter((e) => e.published)
        .map((e) => new Date(e.date).getFullYear())
    )
    return ['all', ...Array.from(set).sort((a, b) => b - a)]
  }, [events])

  const filtered = useMemo(() => {
    return events
      .filter((e) => e.published)
      .filter((e) => category === 'all' || e.category === category)
      .filter((e) => year === 'all' || new Date(e.date).getFullYear() === Number(year))
  }, [events, category, year])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark mb-8">
        {t('events.pageTitle')}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('events.category')}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === cat
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'border-gray-300 text-gray-600 hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {t(filterLabelMap[cat])}
            </button>
          ))}
        </div>

        {/* Year dropdown */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="ml-auto text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-terracotta"
          aria-label={t('events.filterYear')}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y === 'all' ? t('events.filterAll') : y}
            </option>
          ))}
        </select>
      </div>

      <EventGrid events={filtered} loading={loading} />
    </div>
  )
}
