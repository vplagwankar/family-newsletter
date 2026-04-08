import { useState, useEffect } from 'react'
import { useParams, Link }     from 'react-router-dom'
import { useTranslation }      from 'react-i18next'
import { getEventById }        from '../services/api.js'
import EventDetail from '../components/events/EventDetail.jsx'
import Spinner     from '../components/ui/Spinner.jsx'

export default function EventDetailPage() {
  const { id }  = useParams()
  const { t }   = useTranslation()
  const [event,   setEvent]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEventById(id).then((data) => {
      setEvent(data)
      setLoading(false)
      if (data) document.title = `${data.title} — Lagwankar Family`
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-2xl font-semibold text-gray-700 mb-2">{t('eventDetail.notFound')}</p>
        <p className="text-gray-500 text-sm mb-6">{t('eventDetail.notFoundSub')}</p>
        <Link
          to="/events"
          className="text-terracotta hover:text-terracotta-dark font-medium text-sm"
        >
          {t('eventDetail.backToEvents')}
        </Link>
      </div>
    )
  }

  return <EventDetail event={event} />
}
