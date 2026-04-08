import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getMembersAdmin, updateMember } from '../services/api.js'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import Toast from '../components/ui/Toast.jsx'
import Spinner from '../components/ui/Spinner.jsx'

const inputCls = 'w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta bg-white'

function InlineEdit({ member, allMembers, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name:       member.name || '',
    nameKn:     member.nameKn || '',
    role:       member.role || '',
    roleKn:     member.roleKn || '',
    generation: member.generation || 1,
    spouseId:   member.spouseId || '',
    bio:        member.bio || '',
    bioKn:      member.bioKn || '',
    dob:        member.dob || '',
    isDeceased: member.isDeceased || false,
    yearDeceased: member.yearDeceased || '',
    photo:      member.photo || '',
    tribute:    member.tribute || '',
    tributeKn:  member.tributeKn || '',
  })

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="bg-saffron/5 border border-saffron/20 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <img src={form.photo || `https://picsum.photos/seed/${member.id}/80/80`}
          alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
        <div>
          <p className="font-semibold text-gray-900">{member.name}</p>
          <p className="text-xs text-gray-400">Gen {member.generation} · {member.id}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name (EN)</label>
          <input value={form.name} onChange={set('name')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name (KN)</label>
          <input value={form.nameKn} onChange={set('nameKn')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role (EN)</label>
          <input value={form.role} onChange={set('role')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role (KN)</label>
          <input value={form.roleKn} onChange={set('roleKn')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Generation</label>
          <select value={form.generation} onChange={set('generation')} className={inputCls}>
            {[1,2,3,4,5].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Spouse</label>
          <select value={form.spouseId} onChange={set('spouseId')} className={inputCls}>
            <option value="">— none —</option>
            {allMembers.filter(m => m.id !== member.id && !m.deleted).map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth</label>
          <input type="date" value={form.dob} onChange={set('dob')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Photo URL</label>
          <input type="url" value={form.photo} onChange={set('photo')} className={inputCls} placeholder="https://…" />
        </div>
      </div>

      {/* Deceased */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.isDeceased} onChange={set('isDeceased')}
            className="w-4 h-4 rounded" />
          Deceased
        </label>
        {form.isDeceased && (
          <input type="number" value={form.yearDeceased} onChange={set('yearDeceased')}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28" placeholder="Year" />
        )}
      </div>

      {/* Bio */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Bio (EN)</label>
          <textarea value={form.bio} onChange={set('bio')} rows={3} className={`${inputCls} resize-y`} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Bio (KN)</label>
          <textarea value={form.bioKn} onChange={set('bioKn')} rows={3} className={`${inputCls} resize-y`} />
        </div>
      </div>

      {/* Tribute (deceased) */}
      {form.isDeceased && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tribute (EN)</label>
            <input value={form.tribute} onChange={set('tribute')} className={inputCls} placeholder="A short tribute…" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tribute (KN)</label>
            <input value={form.tributeKn} onChange={set('tributeKn')} className={inputCls} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(member.id, form)}
          disabled={saving}
          className="px-5 py-2 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta-dark disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminTreeEditPage() {
  const { t } = useTranslation()
  const [members,  setMembers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState(null)
  const [genFilter, setGenFilter] = useState('all')

  useEffect(() => {
    document.title = 'Edit Family Tree — Lagwankar Admin'
    getMembersAdmin().then((data) => { setMembers(data); setLoading(false) })
  }, [])

  const filtered = members
    .filter((m) => !m.deleted)
    .filter((m) => genFilter === 'all' || m.generation === Number(genFilter))
    .sort((a, b) => a.generation - b.generation || a.name.localeCompare(b.name))

  const handleSave = async (id, patch) => {
    setSaving(true)
    try {
      const updated = await updateMember(id, patch)
      setMembers((prev) => prev.map((m) => m.id === id ? updated : m))
      setEditing(null)
      setToast({ message: 'Member updated!', type: 'success' })
    } finally {
      setSaving(false)
    }
  }

  const genCounts = {}
  members.filter(m => !m.deleted).forEach((m) => {
    genCounts[m.generation] = (genCounts[m.generation] || 0) + 1
  })

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">{t('admin.editTree')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit member details that appear in the Family Tree and Directory.
          </p>
        </div>

        {/* Generation tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 1, 2, 3, 4, 5].map((g) => (
            <button key={g}
              onClick={() => { setGenFilter(g); setEditing(null) }}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                genFilter === g
                  ? 'bg-terracotta text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-terracotta'
              }`}>
              {g === 'all'
                ? `All (${members.filter(m => !m.deleted).length})`
                : `Gen ${g} (${genCounts[g] || 0})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((member) => (
              <div key={member.id}>
                {editing === member.id ? (
                  <InlineEdit
                    member={member}
                    allMembers={members}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                    saving={saving}
                  />
                ) : (
                  <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <img
                      src={member.photo || `https://picsum.photos/seed/${member.id}/80/80`}
                      alt={member.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 border-white shadow shrink-0 ${member.isDeceased ? 'grayscale' : ''}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        {member.isDeceased && (
                          <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">Late</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {member.nameKn && <span className="mr-2">{member.nameKn}</span>}
                        Gen {member.generation}
                        {member.role && <span className="ml-2">· {member.role}</span>}
                        {member.spouseId && (
                          <span className="ml-2">
                            · ♥ {members.find(m => m.id === member.spouseId)?.name || member.spouseId}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline text-xs text-gray-300 border border-gray-100 rounded-full px-2 py-0.5">
                        {member.parentIds?.length ? `${member.parentIds.length} parent(s)` : 'Root'}
                      </span>
                      <button
                        onClick={() => setEditing(member.id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-terracotta/10 hover:text-terracotta rounded-lg text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </AdminLayout>
  )
}
