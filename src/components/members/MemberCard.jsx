import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage.js'

export default function MemberCard({ member, onSelect, isBirthday = false }) {
  const { t }    = useTranslation()
  const { lang } = useLanguage()

  const name       = lang === 'kn' && member.nameKn  ? member.nameKn  : member.name
  const role       = lang === 'kn' && member.roleKn  ? member.roleKn  : member.role

  return (
    <button
      onClick={() => onSelect?.(member)}
      className={`group relative w-full text-left bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-terracotta ${
        isBirthday ? 'border-saffron' : 'border-transparent'
      }`}
      aria-label={`${t('members.viewProfile')}: ${name}`}
    >
      {/* Birthday ribbon */}
      {isBirthday && (
        <span className="absolute top-2 right-2 bg-saffron text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
          🎂
        </span>
      )}

      {/* Deceased overlay */}
      {member.isDeceased && (
        <span className="absolute top-2 left-2 bg-gray-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
          {t('members.deceased')}
        </span>
      )}

      {/* Photo */}
      <div className="aspect-square overflow-hidden bg-cream-200">
        <img
          src={member.photo}
          alt={name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            member.isDeceased ? 'grayscale' : ''
          }`}
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{name}</p>
        {role && (
          <p className="text-xs text-terracotta mt-0.5 truncate">{role}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {t('members.generation', { gen: member.generation })}
        </p>
      </div>
    </button>
  )
}
