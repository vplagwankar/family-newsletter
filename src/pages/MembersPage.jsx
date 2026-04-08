import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getMembers, getBirthdayMembers } from '../services/api.js'
import MemberCard    from '../components/members/MemberCard.jsx'
import MemberProfile from '../components/members/MemberProfile.jsx'
import Spinner from '../components/ui/Spinner.jsx'

export default function MembersPage() {
  const { t } = useTranslation()

  const [members,  setMembers]  = useState([])
  const [birthdays, setBirthdays] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const [genFilter, setGenFilter] = useState('all')

  useEffect(() => {
    document.title = `${t('members.pageTitle')} — Lagwankar Family`
    Promise.all([getMembers(), getBirthdayMembers()]).then(([mem, bday]) => {
      setMembers(mem)
      setBirthdays(bday)
      setLoading(false)
    })
  }, [t])

  const generations = useMemo(() => {
    const set = new Set(members.map((m) => m.generation))
    return ['all', ...Array.from(set).sort((a, b) => a - b)]
  }, [members])

  const birthdayIds = useMemo(() => new Set(birthdays.map((m) => m.id)), [birthdays])

  const filtered = useMemo(() => {
    if (genFilter === 'all') return members
    return members.filter((m) => m.generation === Number(genFilter))
  }, [members, genFilter])

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark mb-8">
        {t('members.pageTitle')}
      </h1>

      {/* Birthdays this month */}
      {birthdays.length > 0 && (
        <section className="mb-8 bg-saffron/10 border border-saffron/30 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-saffron-dark mb-3 flex items-center gap-2">
            <span aria-hidden="true">🎂</span>
            {t('members.birthdays')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {birthdays.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="font-medium text-gray-800">{m.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Generation filter */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by generation">
        {generations.map((gen) => (
          <button
            key={gen}
            onClick={() => setGenFilter(gen)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              genFilter === gen
                ? 'bg-terracotta text-white border-terracotta'
                : 'border-gray-300 text-gray-600 hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {gen === 'all' ? t('members.allGenerations') : t('members.generation', { gen })}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-16">{t('members.noMembers')}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onSelect={setSelected}
              isBirthday={birthdayIds.has(member.id)}
            />
          ))}
        </div>
      )}

      {/* Profile modal */}
      {selected && (
        <MemberProfile member={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
