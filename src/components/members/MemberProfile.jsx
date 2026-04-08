import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage.js'
import { useEffect } from 'react'

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function MemberProfile({ member, onClose }) {
  const { t }    = useTranslation()
  const { lang } = useLanguage()

  const name = lang === 'kn' && member.nameKn ? member.nameKn : member.name
  const role = lang === 'kn' && member.roleKn ? member.roleKn : member.role
  const bio  = lang === 'kn' && member.bioKn  ? member.bioKn  : member.bio
  const tribute = lang === 'kn' && member.tributeKn ? member.tributeKn : member.tribute

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div
        className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header photo strip */}
        <div className="relative h-48 bg-cream-200 overflow-hidden">
          <img
            src={member.photo}
            alt={name}
            className={`w-full h-full object-cover ${member.isDeceased ? 'grayscale' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label={t('common.close')}
          >
            ✕
          </button>

          {/* Name overlay */}
          <div className="absolute bottom-3 left-4 right-12">
            {member.isDeceased && (
              <span className="inline-block bg-gray-600 text-white text-[11px] px-2 py-0.5 rounded-full mb-1">
                {t('members.deceased')}
              </span>
            )}
            <h2 className="text-white font-bold text-xl leading-tight">{name}</h2>
            {role && <p className="text-white/80 text-sm">{role}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Generation badge */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta text-xs font-medium px-3 py-1 rounded-full">
              {t('members.generation', { gen: member.generation })}
            </span>
            {member.gender && (
              <span className="inline-flex items-center gap-1 bg-warmgreen/10 text-warmgreen text-xs font-medium px-3 py-1 rounded-full capitalize">
                {member.gender}
              </span>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {member.dob && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('members.born')}</p>
                <p className="text-gray-800 mt-0.5">{formatDate(member.dob)}</p>
              </div>
            )}
            {member.isDeceased && member.yearDeceased && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('members.died')}</p>
                <p className="text-gray-800 mt-0.5">{member.yearDeceased}</p>
              </div>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t('members.bio')}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Tribute (for deceased) */}
          {tribute && (
            <blockquote className="border-l-4 border-terracotta/40 pl-4 italic text-gray-600 text-sm">
              "{tribute}"
            </blockquote>
          )}

          {/* Contact */}
          {member.isContactPublic && member.contactEmail && (
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t('members.contact')}</p>
              <a
                href={`mailto:${member.contactEmail}`}
                className="text-terracotta text-sm hover:underline"
              >
                {member.contactEmail}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
