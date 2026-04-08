import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getAlbums, getAlbumById } from '../services/api.js'
import { useLanguage } from '../hooks/useLanguage.js'
import Lightbox from '../components/ui/Lightbox.jsx'
import Spinner from '../components/ui/Spinner.jsx'

function AlbumCard({ album, onClick, lang }) {
  const title = lang === 'kn' && album.titleKn ? album.titleKn : album.title
  return (
    <button
      onClick={onClick}
      className="group relative text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 focus:outline-none focus:ring-2 focus:ring-terracotta"
      aria-label={`Open album: ${title}`}
    >
      <div className="aspect-video overflow-hidden bg-cream-200">
        <img
          src={album.coverUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-900 leading-tight">{title}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">{album.year}</p>
          <p className="text-xs text-terracotta font-medium">
            ~{album.photoCount} photos
          </p>
        </div>
      </div>
    </button>
  )
}

export default function GalleryPage() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()

  const [albums,        setAlbums]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [activeAlbum,   setActiveAlbum]   = useState(null) // { album, photos }
  const [albumLoading,  setAlbumLoading]  = useState(false)
  const [lightbox,      setLightbox]      = useState(null) // { photos, index }

  useEffect(() => {
    document.title = `${t('gallery.pageTitle')} — Lagwankar Family`
    getAlbums().then((data) => { setAlbums(data); setLoading(false) })
  }, [t])

  const openAlbum = async (album) => {
    setAlbumLoading(true)
    const full = await getAlbumById(album.id)
    setActiveAlbum(full)
    setAlbumLoading(false)
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark mb-2">
        {t('gallery.pageTitle')}
      </h1>
      <p className="text-gray-500 mb-8">{t('gallery.albums')}</p>

      {/* Album browser */}
      {!activeAlbum && (
        <>
          {albums.length === 0 ? (
            <p className="text-center text-gray-400 py-20">{t('gallery.noAlbums')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  lang={lang}
                  onClick={() => openAlbum(album)}
                />
              ))}
            </div>
          )}

          {albumLoading && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
              <Spinner />
            </div>
          )}
        </>
      )}

      {/* Album detail */}
      {activeAlbum && (
        <div>
          {/* Back + title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => setActiveAlbum(null)}
                className="text-sm text-terracotta hover:underline mb-1 flex items-center gap-1"
              >
                {t('gallery.backToAlbums')}
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {lang === 'kn' && activeAlbum.titleKn ? activeAlbum.titleKn : activeAlbum.title}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{activeAlbum.year}</p>
            </div>
            {activeAlbum.eventId && (
              <Link
                to={`/events/${activeAlbum.eventId}`}
                className="text-xs text-terracotta border border-terracotta/30 px-3 py-1.5 rounded-full hover:bg-terracotta/10 transition-colors"
              >
                {t('gallery.viewEvent')} →
              </Link>
            )}
          </div>

          {/* Photos grid */}
          {activeAlbum.photos && activeAlbum.photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activeAlbum.photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox({ photos: activeAlbum.photos, index: idx })}
                  className="group aspect-square overflow-hidden rounded-xl bg-cream-200 focus:outline-none focus:ring-2 focus:ring-terracotta"
                  aria-label={`View photo: ${photo.alt || idx + 1}`}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📷</p>
              <p>Photos coming soon</p>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}
