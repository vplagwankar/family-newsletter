import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAllEvents, getMembers, getAllPhotos, getUpcomingEvents } from '../services/api.js'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import { useAuth } from '../hooks/useAuth.js'
import Spinner from '../components/ui/Spinner.jsx'
import Badge from '../components/ui/Badge.jsx'

function StatCard({ icon, label, value, color = 'terracotta' }) {
  const colorMap = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    warmgreen:  'bg-warmgreen/10  text-warmgreen',
    saffron:    'bg-saffron/10    text-saffron-dark',
    gray:       'bg-gray-100      text-gray-600',
  }
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { t }     = useTranslation()
  const { admin } = useAuth()

  const [allEvents,      setAllEvents]      = useState([])
  const [members,        setMembers]        = useState([])
  const [photos,         setPhotos]         = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    document.title = `${t('admin.dashboard')} — Lagwankar Admin`
    Promise.all([
      getAllEvents(),
      getMembers(),
      getAllPhotos(),
      getUpcomingEvents(60),
    ]).then(([ev, mem, ph, up]) => {
      setAllEvents(ev)
      setMembers(mem)
      setPhotos(ph)
      setUpcomingEvents(up)
      setLoading(false)
    })
  }, [t])

  const recentEvents = allEvents
    .filter((e) => e.published)
    .slice(0, 5)

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('admin.welcome', { name: admin?.name || 'Admin' })}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with the family chronicle.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="📋" label={t('admin.totalEvents')}    value={allEvents.filter(e => e.published).length} color="terracotta" />
              <StatCard icon="📅" label={t('admin.upcomingEvents')} value={upcomingEvents.length} color="saffron" />
              <StatCard icon="👥" label={t('admin.totalMembers')}   value={members.length}  color="warmgreen" />
              <StatCard icon="🖼️" label={t('admin.totalPhotos')}    value={photos.length}   color="gray" />
            </div>

            {/* Quick actions */}
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {t('admin.quickActions')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { to: '/admin/posts/new',     label: t('admin.newPost'),      icon: '✏️', color: 'bg-terracotta' },
                  { to: '/admin/members',        label: t('admin.addMember'),    icon: '👤', color: 'bg-warmgreen' },
                  { to: '/admin/gallery',        label: t('admin.manageGallery'), icon: '🖼️', color: 'bg-saffron' },
                  { to: '/admin/family-tree/edit', label: t('admin.editTree'),   icon: '🌳', color: 'bg-gray-600' },
                ].map(({ to, label, icon, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`${color} text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity`}
                  >
                    <span aria-hidden="true">{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </section>

            {/* Recent events */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {t('admin.recentEvents')}
              </h2>
              {recentEvents.length === 0 ? (
                <p className="text-gray-400 text-sm">{t('admin.noEvents')}</p>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4">
                      <img
                        src={event.coverPhoto}
                        alt=""
                        className="w-12 h-10 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge category={event.category} />
                          <span className="text-xs text-gray-400">
                            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/admin/posts/${event.id}/edit`}
                          className="text-xs text-gray-500 hover:text-terracotta px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                        >
                          {t('admin.editEvent')}
                        </Link>
                        <button
                          className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                          onClick={() => alert('Delete not implemented in mock mode.')}
                        >
                          {t('admin.deleteEvent')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
