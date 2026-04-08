import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage.js'
import { useAuth } from '../../hooks/useAuth.js'

const navLinks = [
  { to: '/',            labelKey: 'nav.home',       end: true },
  { to: '/events',      labelKey: 'nav.events',     end: false },
  { to: '/upcoming',    labelKey: 'nav.upcoming',   end: false },
  { to: '/gallery',     labelKey: 'nav.gallery',    end: false },
  { to: '/members',     labelKey: 'nav.members',    end: false },
  { to: '/family-tree', labelKey: 'nav.familyTree', end: false },
]

const activeCls   = 'text-terracotta border-b-2 border-terracotta'
const inactiveCls = 'text-gray-600 hover:text-terracotta border-b-2 border-transparent'

export default function Navbar() {
  const { t }                  = useTranslation()
  const { lang, toggleLang }   = useLanguage()
  const { isAuthenticated, logout } = useAuth()
  const navigate               = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm shadow-sm">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo / Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 text-terracotta font-bold text-lg shrink-0"
          aria-label="Lagwankar Family — Home"
        >
          <span className="text-2xl" aria-hidden="true">🪔</span>
          <span className="hidden sm:inline">Lagwankar Family</span>
          <span className="sm:hidden">Lagwankar</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-5" role="list">
          {navLinks.map(({ to, labelKey, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 transition-colors ${isActive ? activeCls : inactiveCls}`
                }
              >
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Search icon link */}
          <Link
            to="/search"
            className="hidden sm:flex items-center text-gray-500 hover:text-terracotta transition-colors"
            aria-label={t('nav.search')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-full border border-terracotta text-terracotta text-xs font-semibold hover:bg-terracotta hover:text-white transition-colors"
            aria-label={lang === 'en' ? 'Switch to Kannada' : 'Switch to English'}
          >
            {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
          </button>

          {/* Admin controls */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="hidden sm:inline text-xs text-gray-400 hover:text-terracotta transition-colors"
            >
              {t('admin.logout')}
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="hidden sm:inline text-xs text-gray-400 hover:text-terracotta transition-colors"
            >
              {t('nav.adminLogin')}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-terracotta"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-cream px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-3" role="list">
            {navLinks.map(({ to, labelKey, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-terracotta/10 text-terracotta'
                        : 'text-gray-700 hover:bg-cream-200'
                    }`
                  }
                >
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/search"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-cream-200"
              >
                {t('nav.search')}
              </Link>
            </li>
            <li className="pt-1 border-t border-gray-100 mt-1">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-3 rounded-lg text-xs text-gray-400 hover:text-terracotta"
                >
                  {t('admin.logout')}
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg text-xs text-gray-400 hover:text-terracotta"
                >
                  {t('nav.adminLogin')}
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
