import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth.js'
import { useEffect } from 'react'

const sideLinks = [
  { to: '/admin/dashboard',       label: 'admin.dashboard',    icon: '📊' },
  { to: '/admin/posts/new',       label: 'admin.newPost',      icon: '✏️' },
  { to: '/admin/members',         label: 'admin.manageMembers',icon: '👥' },
  { to: '/admin/gallery',         label: 'admin.manageGallery',icon: '🖼️' },
  { to: '/admin/family-tree/edit',label: 'admin.editTree',     icon: '🌳' },
]

export default function AdminLayout({ children }) {
  const { t } = useTranslation()
  const { isAuthenticated, admin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 text-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2 text-saffron font-bold text-sm">
            <span>🪔</span>
            <span>Admin Panel</span>
          </Link>
          {admin && (
            <div className="mt-2">
              <p className="text-xs text-white truncate font-medium">{admin.name}</p>
              <p className="text-[10px] text-gray-500 capitalize">{admin.role}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-0.5">
            {sideLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-saffron/20 text-saffron'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <span aria-hidden="true" className="text-base">{icon}</span>
                  <span className="truncate">{t(label)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-700 space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span aria-hidden="true">🏠</span>
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <span aria-hidden="true">🚪</span>
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
