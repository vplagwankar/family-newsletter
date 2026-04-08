import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage }    from '../../hooks/useLanguage.js'
import { getSpotlightMember } from '../../services/api.js'
import Spinner from '../ui/Spinner.jsx'

export default function Spotlight() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const [member,  setMember]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSpotlightMember().then((data) => {
      setMember(data)
      setLoading(false)
    })
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label={t('home.spotlightTitle')}>
      <h2 className="text-2xl sm:text-3xl font-bold text-terracotta-dark mb-6">
        {t('home.spotlightTitle')}
      </h2>

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {!loading && member && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-sm mx-auto sm:mx-0 sm:max-w-none sm:flex sm:gap-8 sm:items-center p-6 sm:p-8 border-2 border-terracotta/20">
          {/* Photo */}
          <div className="flex justify-center sm:block shrink-0 mb-4 sm:mb-0">
            <img
              src={member.photo}
              alt={lang === 'kn' && member.nameKn ? member.nameKn : member.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-terracotta/30 shadow"
            />
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <div className="inline-block px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-xs font-medium mb-2">
              {t('home.spotlightGeneration', { gen: member.generation })}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {lang === 'kn' && member.nameKn ? member.nameKn : member.name}
            </h3>
            <p className="text-sm text-terracotta font-medium mb-3">
              {lang === 'kn' && member.roleKn ? member.roleKn : member.role}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {lang === 'kn' && member.bioKn ? member.bioKn : member.bio}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
