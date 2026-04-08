import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getMembersAdmin, createMember, updateMember, deleteMember } from '../services/api.js'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import Toast from '../components/ui/Toast.jsx'
import Spinner from '../components/ui/Spinner.jsx'

const GENERATIONS = [1, 2, 3, 4, 5]
const GENDERS = ['male', 'female']

const EMPTY = {
  name: '', nameKn: '',
  role: '', roleKn: '',
  gender: 'male', generation: 3,
  dob: '', isDeceased: false, yearDeceased: '',
  photo: '',
  bio: '', bioKn: '',
  parentIds: [], spouseId: '',
  contactEmail: '', isContactPublic: false,
}

const inputCls = 'w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta bg-white'

function MemberForm({ initial, allMembers, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60"
      onClick={onCancel}>
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial.id ? 'Edit Member' : 'Add Member'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (English) *</label>
              <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (Kannada)</label>
              <input value={form.nameKn} onChange={set('nameKn')} className={inputCls} placeholder="ಹೆಸರು" />
            </div>
          </div>

          {/* Role */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role (English)</label>
              <input value={form.role} onChange={set('role')} className={inputCls} placeholder="e.g. Patriarch" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role (Kannada)</label>
              <input value={form.roleKn} onChange={set('roleKn')} className={inputCls} placeholder="ಕುಲಪಿತ" />
            </div>
          </div>

          {/* Gender + Generation */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={set('gender')} className={inputCls}>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Generation</label>
              <select value={form.generation} onChange={set('generation')} className={inputCls}>
                {GENERATIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth</label>
              <input type="date" value={form.dob} onChange={set('dob')} className={inputCls} />
            </div>
          </div>

          {/* Deceased */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isDeceased} onChange={set('isDeceased')}
                className="w-4 h-4 rounded border-gray-300 text-terracotta focus:ring-terracotta" />
              Deceased
            </label>
            {form.isDeceased && (
              <div className="flex-1">
                <input type="number" value={form.yearDeceased} onChange={set('yearDeceased')}
                  className={inputCls} placeholder="Year of passing" />
              </div>
            )}
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Photo URL</label>
            <input type="url" value={form.photo} onChange={set('photo')} className={inputCls}
              placeholder="https://…" />
            {form.photo && (
              <img src={form.photo} alt="" className="mt-2 h-16 w-16 rounded-full object-cover border" />
            )}
          </div>

          {/* Bio */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bio (English)</label>
              <textarea value={form.bio} onChange={set('bio')} className={`${inputCls} min-h-[80px] resize-y`}
                placeholder="A short biography…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bio (Kannada)</label>
              <textarea value={form.bioKn} onChange={set('bioKn')} className={`${inputCls} min-h-[80px] resize-y`}
                placeholder="ಪರಿಚಯ…" />
            </div>
          </div>

          {/* Relations */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Spouse</label>
              <select value={form.spouseId || ''} onChange={set('spouseId')} className={inputCls}>
                <option value="">— none —</option>
                {allMembers.filter(m => m.id !== form.id).map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact Email</label>
              <input type="email" value={form.contactEmail || ''} onChange={set('contactEmail')}
                className={inputCls} placeholder="optional" />
            </div>
          </div>

          {/* Public contact */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isContactPublic} onChange={set('isContactPublic')}
              className="w-4 h-4 rounded border-gray-300 text-terracotta focus:ring-terracotta" />
            Show contact email publicly
          </label>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim()}
            className="px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Member'}
          </button>
          <button onClick={onCancel}
            className="px-5 py-2.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminMembersPage() {
  const { t } = useTranslation()
  const [members,  setMembers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)   // member object or {} for new
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState(null)
  const [search,   setSearch]   = useState('')
  const [genFilter, setGenFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    document.title = 'Manage Members — Lagwankar Admin'
    getMembersAdmin().then((data) => { setMembers(data); setLoading(false) })
  }, [])

  const filtered = members
    .filter((m) => !m.deleted)
    .filter((m) => genFilter === 'all' || m.generation === Number(genFilter))
    .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || (m.nameKn && m.nameKn.includes(search)))
    .sort((a, b) => a.generation - b.generation || a.name.localeCompare(b.name))

  const handleSave = async (form) => {
    setSaving(true)
    try {
      let updated
      if (form.id) {
        updated = await updateMember(form.id, form)
        setMembers((prev) => prev.map((m) => m.id === form.id ? updated : m))
        setToast({ message: 'Member updated!', type: 'success' })
      } else {
        updated = await createMember(form)
        setMembers((prev) => [...prev, updated])
        setToast({ message: 'Member added!', type: 'success' })
      }
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    await deleteMember(id)
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, deleted: true } : m))
    setConfirmDelete(null)
    setToast({ message: 'Member removed.', type: 'info' })
  }

  const generations = ['all', 1, 2, 3, 4, 5]

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-xl font-bold text-gray-900">{t('admin.manageMembers')}</h1>
          <button
            onClick={() => setEditing({})}
            className="flex items-center gap-2 px-4 py-2.5 bg-warmgreen text-white rounded-xl text-sm font-semibold hover:bg-warmgreen-dark transition-colors"
          >
            <span aria-hidden="true">+</span> {t('admin.addMember')}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta bg-white w-56"
          />
          <div className="flex gap-1">
            {generations.map((g) => (
              <button key={g}
                onClick={() => setGenFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  genFilter === g
                    ? 'bg-terracotta text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-terracotta'
                }`}>
                {g === 'all' ? 'All' : `Gen ${g}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-sm">No members found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Gen</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">DOB</th>
                    <th className="px-4 py-3 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={m.photo || `https://picsum.photos/seed/${m.id}/60/60`}
                            alt={m.name}
                            className={`w-9 h-9 rounded-full object-cover shrink-0 ${m.isDeceased ? 'grayscale' : ''}`} />
                          <div>
                            <p className="font-medium text-gray-900">{m.name}</p>
                            {m.nameKn && <p className="text-xs text-gray-400">{m.nameKn}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{m.generation}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.role || '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                        {m.dob ? new Date(m.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        {m.isDeceased && <span className="ml-1 text-gray-400">(Late)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setEditing(m)}
                            className="p-1.5 text-gray-400 hover:text-terracotta rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Edit">
                            ✏️
                          </button>
                          <button onClick={() => setConfirmDelete(m)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Member form modal */}
      {editing !== null && (
        <MemberForm
          initial={editing}
          allMembers={members.filter(m => !m.deleted)}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Remove member?</h3>
            <p className="text-sm text-gray-500 mb-5">
              "{confirmDelete.name}" will be soft-deleted and hidden from the public site.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
                Remove
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
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
