import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllEventsAdmin, addPhoto, deletePhoto } from '../services/api.js'
import { store } from '../mock/store.js'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import Toast from '../components/ui/Toast.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Badge from '../components/ui/Badge.jsx'

function PhotoGrid({ photos, onDelete }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={photo.url}
            alt={photo.alt || ''}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              onClick={() => onDelete(photo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-700"
              aria-label="Delete photo"
            >✕</button>
          </div>
          {photo.alt && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {photo.alt}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function UploadModal({ event, onClose, onUploaded }) {
  const [url,     setUrl]     = useState('')
  const [alt,     setAlt]     = useState('')
  const [preview, setPreview] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
    setUrl('')
  }

  const handleSave = async () => {
    const src = preview || url.trim()
    if (!src) return
    setSaving(true)
    const photo = await addPhoto(event.id, { url: src, alt })
    onUploaded(photo)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Add Photo to "{event.title}"</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* File picker */}
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-terracotta hover:bg-terracotta/5 transition-colors mb-4"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
          ) : (
            <>
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm text-gray-500">Click to upload a photo</p>
              <p className="text-xs text-gray-400 mt-1">(mock — stored as base64 in session)</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {/* Or URL */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 text-center mb-2">— or paste a URL —</p>
          <input
            type="url" value={url} onChange={(e) => { setUrl(e.target.value); setPreview(null) }}
            placeholder="https://…"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
        </div>

        {/* Caption */}
        <div className="mb-5">
          <input
            type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
            placeholder="Caption / alt text (optional)"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || (!preview && !url.trim())}
            className="flex-1 py-2.5 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-dark disabled:opacity-50 transition-colors"
          >
            {saving ? 'Adding…' : 'Add Photo'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminGalleryPage() {
  const { t } = useTranslation()
  const [events,      setEvents]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [activeEvent, setActiveEvent] = useState(null)
  const [uploading,   setUploading]   = useState(false)
  const [toast,       setToast]       = useState(null)
  const [confirmDel,  setConfirmDel]  = useState(null) // { eventId, photoId }

  const loadEvents = () => {
    getAllEventsAdmin().then((data) => {
      const withPhotos = data.filter((e) => e.status !== 'deleted')
      setEvents(withPhotos)
      // Refresh active event photos from store
      if (activeEvent) {
        const refreshed = store.events.find((e) => e.id === activeEvent.id)
        if (refreshed) setActiveEvent(refreshed)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    document.title = 'Manage Gallery — Lagwankar Admin'
    loadEvents()
  }, [])

  const handleDeletePhoto = async () => {
    if (!confirmDel) return
    await deletePhoto(confirmDel.eventId, confirmDel.photoId)
    // Update local state
    setEvents((prev) => prev.map((e) =>
      e.id === confirmDel.eventId
        ? { ...e, photos: e.photos.filter((p) => p.id !== confirmDel.photoId) }
        : e
    ))
    if (activeEvent?.id === confirmDel.eventId) {
      setActiveEvent((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== confirmDel.photoId),
      }))
    }
    setConfirmDel(null)
    setToast({ message: 'Photo deleted.', type: 'info' })
  }

  const handleUploaded = (photo) => {
    setActiveEvent((prev) => ({ ...prev, photos: [...(prev.photos || []), photo] }))
    setEvents((prev) => prev.map((e) =>
      e.id === activeEvent.id
        ? { ...e, photos: [...(e.photos || []), photo] }
        : e
    ))
    setToast({ message: 'Photo added!', type: 'success' })
  }

  if (loading) return <AdminLayout><div className="flex justify-center py-24"><Spinner /></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.manageGallery')}</h1>

        {!activeEvent ? (
          /* ── Event list ── */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setActiveEvent(event)}
                className="group text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-terracotta"
              >
                <div className="h-32 overflow-hidden bg-gray-100">
                  {event.coverPhoto ? (
                    <img src={event.coverPhoto} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📷</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge category={event.category} />
                    <span className="text-xs text-gray-400">{(event.photos || []).length} photos</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ── Album detail ── */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <button
                  onClick={() => setActiveEvent(null)}
                  className="text-sm text-terracotta hover:underline mb-1 flex items-center gap-1"
                >
                  ← All Events
                </button>
                <h2 className="text-lg font-bold text-gray-900">{activeEvent.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{(activeEvent.photos || []).length} photos</p>
              </div>
              <button
                onClick={() => setUploading(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-dark transition-colors"
              >
                <span aria-hidden="true">+</span> Add Photo
              </button>
            </div>

            {/* Photos */}
            {(activeEvent.photos || []).length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📷</p>
                <p>No photos yet. Add the first one!</p>
              </div>
            ) : (
              <PhotoGrid
                photos={activeEvent.photos}
                onDelete={(photoId) => setConfirmDel({ eventId: activeEvent.id, photoId })}
              />
            )}
          </div>
        )}
      </div>

      {/* Upload modal */}
      {uploading && activeEvent && (
        <UploadModal
          event={activeEvent}
          onClose={() => setUploading(false)}
          onUploaded={handleUploaded}
        />
      )}

      {/* Delete confirmation */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setConfirmDel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Delete photo?</h3>
            <p className="text-sm text-gray-500 mb-5">This photo will be permanently removed from this event.</p>
            <div className="flex gap-3">
              <button onClick={handleDeletePhoto}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => setConfirmDel(null)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  )
}
