import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage }    from '../../hooks/useLanguage.js'
import { getAnnouncements } from '../../services/api.js'
import Spinner from '../ui/Spinner.jsx'

const iconMap = {
  baby:    '👶',
  trophy:  '🏆',
  rings:   '💍',
  star:    '⭐',
  default: '📢',
}

const typeColorMap = {
  birth:       'border-pink-300 bg-pink-50',
  achievement: 'border-yellow-300 bg-yellow-50',
  marriage:    'border-red-300 bg-red-50',
  memorial:    'border-gray-300 bg-gray-50',
  default:     'border-warmgreen/30 bg-warmgreen/5',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function Announcements() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnnouncements().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  if (!loading && items.length === 0) return null

  return (
    <section className="bg-cream-200/60" aria-label={t('home.announcementsTitle')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-terracotta-dark mb-6">
          {t('home.announcementsTitle')}
        </h2>

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((ann) => {
              const icon  = iconMap[ann.icon] ?? iconMap.default
              const color = typeColorMap[ann.type] ?? typeColorMap.default
              const title = lang === 'kn' && ann.titleKn ? ann.titleKn : ann.title
              const body  = lang === 'kn' && ann.bodyKn  ? ann.bodyKn  : ann.body

              return (
                <article
                  key={ann.id}
                  className={`rounded-xl border-l-4 p-4 ${color}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0" aria-hidden="true">{icon}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                        {title}
                      </p>
                      <p className="text-gray-600 text-xs line-clamp-3 mb-2">{body}</p>
                      <time
                        dateTime={ann.date}
                        className="text-xs text-gray-400"
                      >
                        {formatDate(ann.date)}
                      </time>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
