import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getEventById, createEvent, updateEvent } from '../services/api.js'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import Toast from '../components/ui/Toast.jsx'
import Spinner from '../components/ui/Spinner.jsx'

const CATEGORIES = ['puja', 'ceremony', 'reunion', 'celebration']
const EMPTY_FORM = {
  title: '', titleKn: '',
  date: '', category: 'puja', location: '',
  description: '', descriptionKn: '',
  coverPhoto: '', published: false,
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta bg-white'
const textareaCls = inputCls + ' resize-y min-h-[100px]'

export default function AdminPostFormPage() {
  const { t }   = useTranslation()
  const { id }  = useParams()            // undefined → new post
  const navigate = useNavigate()

  const isEdit = Boolean(id)

  const [form,    setForm]    = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)
  const [errors,  setErrors]  = useState({})

  // Load event for editing
  useEffect(() => {
    document.title = `${isEdit ? 'Edit Post' : 'New Post'} — Lagwankar Admin`
    if (!isEdit) return
    getEventById(id).then((event) => {
      if (event) {
        setForm({
          title:        event.title       || '',
          titleKn:      event.titleKn     || '',
          date:         event.date        || '',
          category:     event.category    || 'puja',
          location:     event.location    || '',
          description:  event.description || '',
          descriptionKn: event.descriptionKn || '',
          coverPhoto:   event.coverPhoto  || '',
          published:    event.published   || false,
        })
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.title.trim())    errs.title    = 'Title is required'
    if (!form.date)            errs.date     = 'Date is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    return errs
  }

  const handleSave = async (publishedOverride) => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    const payload = { ...form, published: publishedOverride ?? form.published }
    try {
      if (isEdit) {
        await updateEvent(id, payload)
        setToast({ message: 'Event updated!', type: 'success' })
      } else {
        const created = await createEvent(payload)
        setToast({ message: 'Event created!', type: 'success' })
        setTimeout(() => navigate(`/admin/posts/${created.id}/edit`), 1200)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center py-24"><Spinner /></div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/admin/dashboard"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >← Dashboard</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Post' : t('admin.newPost')}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Status banner */}
          {isEdit && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
              form.published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}>
              <span>{form.published ? '✓ Published' : '○ Draft'}</span>
            </div>
          )}

          {/* Titles */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title (English)" required>
              <input type="text" value={form.title} onChange={set('title')}
                className={`${inputCls} ${errors.title ? 'border-red-400' : ''}`}
                placeholder="Saraswati Puja 2026" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </Field>
            <Field label="Title (Kannada)">
              <input type="text" value={form.titleKn} onChange={set('titleKn')}
                className={inputCls} placeholder="ಸರಸ್ವತಿ ಪೂಜೆ 2026" />
            </Field>
          </div>

          {/* Date + Category + Location */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Date" required>
              <input type="date" value={form.date} onChange={set('date')}
                className={`${inputCls} ${errors.date ? 'border-red-400' : ''}`} />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={set('category')} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Location" required>
              <input type="text" value={form.location} onChange={set('location')}
                className={`${inputCls} ${errors.location ? 'border-red-400' : ''}`}
                placeholder="Bengaluru" />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </Field>
          </div>

          {/* Cover photo URL */}
          <Field label="Cover Photo URL">
            <input type="url" value={form.coverPhoto} onChange={set('coverPhoto')}
              className={inputCls} placeholder="https://…" />
            {form.coverPhoto && (
              <img src={form.coverPhoto} alt="Cover preview"
                className="mt-2 h-28 w-full object-cover rounded-lg border border-gray-200" />
            )}
          </Field>

          {/* Descriptions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Description (English)" required>
              <textarea value={form.description} onChange={set('description')}
                className={`${textareaCls} ${errors.description ? 'border-red-400' : ''}`}
                placeholder="Describe the event…" />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </Field>
            <Field label="Description (Kannada)">
              <textarea value={form.descriptionKn} onChange={set('descriptionKn')}
                className={textareaCls} placeholder="ಕಾರ್ಯಕ್ರಮದ ವಿವರ…" />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : t('admin.saveDraft')}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : t('admin.publish')}
            </button>
            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              {t('common.cancel')}
            </Link>

            {/* Preview link */}
            {isEdit && (
              <Link
                to={`/events/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-terracotta hover:underline"
              >
                Preview →
              </Link>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </AdminLayout>
  )
}
