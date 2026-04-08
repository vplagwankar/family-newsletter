import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function HeroBanner() {
  const { t } = useTranslation()

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-200 to-terracotta/10 min-h-[60vh] sm:min-h-[72vh] flex items-center"
      aria-label="Hero banner"
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0622F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="text-5xl sm:text-6xl mb-6" aria-hidden="true">🪔</div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-terracotta-dark leading-tight mb-4">
          {t('home.heroTitle')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
          {t('home.heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/events"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-terracotta text-white text-base font-semibold hover:bg-terracotta-dark transition-colors"
          >
            {t('home.heroCtaEvents')}
          </Link>
          <Link
            to="/members"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-terracotta text-terracotta text-base font-medium hover:bg-terracotta hover:text-white transition-colors"
          >
            {t('nav.members')}
          </Link>
        </div>
      </div>
    </section>
  )
}
