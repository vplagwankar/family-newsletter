import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const navLinks = [
  { to: '/',            key: 'nav.home' },
  { to: '/events',      key: 'nav.events' },
  { to: '/upcoming',    key: 'nav.upcoming' },
  { to: '/gallery',     key: 'nav.gallery' },
  { to: '/members',     key: 'nav.members' },
  { to: '/family-tree', key: 'nav.familyTree' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-terracotta-dark text-cream mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">🪔</span>
              <span className="font-bold text-lg">Lagwankar Family</span>
            </div>
            <p className="text-cream/70 text-sm">{t('footer.tagline')}</p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation" className="sm:col-span-2">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70">
              {navLinks.map(({ to, key }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-cream transition-colors">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-cream/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/50">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  )
}
