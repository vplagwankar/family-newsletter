import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { searchAll } from '../services/api.js'
import { useLanguage } from '../hooks/useLanguage.js'
import Spinner from '../components/ui/Spinner.jsx'
import Badge from '../components/ui/Badge.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SearchPage() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const [params, setParams] = useSearchParams()
  const [query,    setQuery]    = useState(params.get('q') || '')
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    document.title = `${t('search.pageTitle')} — Lagwankar Family`
    inputRef.current?.focus()
  }, [t])

  useEffect(() => {
    const q = params.get('q') || ''
    setQuery(q)
    if (!q.trim()) { setResults(null); return }
    setLoading(true)
    searchAll(q).then((r) => { setResults(r); setLoading(false) })
  }, [params])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) setParams({ q: query.trim() })
  }

  const q = params.get('q') || ''
  const total = results ? results.events.length + results.members.length + results.announcements.length : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark mb-6">
        {t('search.pageTitle')}
      </h1>

      {/* Search box */}
      <form onSubmit={handleSubmit} role="search" className="mb-8">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta bg-white"
            aria-label={t('search.placeholder')}
          />
          <button
            type="submit"
            className="px-5 py-3 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-dark transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* States */}
      {!q && (
        <p className="text-gray-400 text-center py-16">{t('search.typeToSearch')}</p>
      )}

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}

      {results && !loading && (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {total === 0
              ? t('search.noResults', { query: q })
              : t('search.resultsFor', { query: q })
            }
          </p>

          {/* Events */}
          {results.events.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {t('search.resultsEvents')} ({results.events.length})
              </h2>
              <div className="space-y-3">
                {results.events.map((e) => {
                  const title = lang === 'kn' && e.titleKn ? e.titleKn : e.title
                  return (
                    <Link
                      key={e.id}
                      to={`/events/${e.id}`}
                      className="flex gap-4 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      {e.coverPhoto && (
                        <img
                          src={e.coverPhoto}
                          alt=""
                          className="w-16 h-14 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge category={e.category} />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm truncate">{title}</p>
                        <p className="text-xs text-gray-400">{formatDate(e.date)} · {e.location}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Members */}
          {results.members.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {t('search.resultsMembers')} ({results.members.length})
              </h2>
              <div className="space-y-2">
                {results.members.map((m) => {
                  const name = lang === 'kn' && m.nameKn ? m.nameKn : m.name
                  return (
                    <Link
                      key={m.id}
                      to="/members"
                      className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <img
                        src={m.photo}
                        alt={name}
                        className={`w-12 h-12 rounded-full object-cover shrink-0 ${m.isDeceased ? 'grayscale' : ''}`}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{name}</p>
                        <p className="text-xs text-gray-400">{m.role} · {t('members.generation', { gen: m.generation })}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Announcements */}
          {results.announcements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {t('search.resultsAnnouncements')} ({results.announcements.length})
              </h2>
              <div className="space-y-2">
                {results.announcements.map((a) => {
                  const title = lang === 'kn' && a.titleKn ? a.titleKn : a.title
                  return (
                    <div
                      key={a.id}
                      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                    >
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lang === 'kn' && a.bodyKn ? a.bodyKn : a.body}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
