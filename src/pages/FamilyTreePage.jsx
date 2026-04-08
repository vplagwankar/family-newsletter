import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getFamilyTree } from '../services/api.js'
import { useLanguage } from '../hooks/useLanguage.js'
import Spinner from '../components/ui/Spinner.jsx'

// ─── Member bubble ────────────────────────────────────────────────────────────

function MemberBubble({ member, onSelect, isSelected, lang }) {
  const name = lang === 'kn' && member.nameKn ? member.nameKn : member.name
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(member) }}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all
        focus:outline-none focus:ring-2 focus:ring-terracotta w-[88px]
        ${isSelected ? 'bg-terracotta/20 ring-2 ring-terracotta' : 'hover:bg-terracotta/10'}`}
      aria-label={name}
    >
      <div className="relative">
        <img
          src={member.photo}
          alt={name}
          className={`w-14 h-14 rounded-full object-cover border-2 shadow-md
            ${isSelected ? 'border-terracotta' : 'border-white'}
            ${member.isDeceased ? 'grayscale' : ''}`}
          loading="lazy"
        />
        {member.isDeceased && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gray-500 text-white
            text-[9px] px-1.5 rounded-full whitespace-nowrap leading-4">
            Late
          </span>
        )}
      </div>
      <span className="text-[11px] font-medium text-gray-800 text-center leading-tight
        break-words w-full" style={{ wordBreak: 'break-word' }}>
        {name}
      </span>
    </button>
  )
}

// ─── Couple unit ─────────────────────────────────────────────────────────────

function CoupleUnit({ node, onSelect, selectedId, lang }) {
  return (
    <div className="flex items-center justify-center">
      <MemberBubble
        member={node}
        onSelect={onSelect}
        isSelected={selectedId === node.id}
        lang={lang}
      />
      {node.spouse && (
        <>
          <div className="flex flex-col items-center px-1" aria-hidden="true">
            <div className="w-5 h-px bg-terracotta/40" />
            <span className="text-terracotta text-[10px] leading-none">♥</span>
            <div className="w-5 h-px bg-terracotta/40" />
          </div>
          <MemberBubble
            member={node.spouse}
            onSelect={onSelect}
            isSelected={selectedId === node.spouse.id}
            lang={lang}
          />
        </>
      )}
    </div>
  )
}

// ─── Recursive tree node ──────────────────────────────────────────────────────

function TreeNode({ node, onSelect, selectedId, lang }) {
  const children = node.children || []

  return (
    <div className="flex flex-col items-center">
      {/* Couple / individual */}
      <CoupleUnit node={node} onSelect={onSelect} selectedId={selectedId} lang={lang} />

      {children.length > 0 && (
        <>
          {/* Vertical drop from this couple */}
          <div className="w-px h-8 bg-terracotta/30" aria-hidden="true" />

          {children.length === 1 ? (
            <TreeNode
              node={children[0]}
              onSelect={onSelect}
              selectedId={selectedId}
              lang={lang}
            />
          ) : (
            <div className="flex flex-col items-center">
              {/* Horizontal crossbar */}
              <div
                className="h-px bg-terracotta/30"
                style={{ width: `${(children.length - 1) * 230}px` }}
                aria-hidden="true"
              />
              {/* Drop lines + child subtrees */}
              <div className="flex" style={{ gap: '130px' }}>
                {children.map((child) => (
                  <div key={child.id} className="flex flex-col items-center">
                    <div className="w-px h-8 bg-terracotta/30" aria-hidden="true" />
                    <TreeNode
                      node={child}
                      onSelect={onSelect}
                      selectedId={selectedId}
                      lang={lang}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function MemberPanel({ member, onClose, lang, t }) {
  const name    = lang === 'kn' && member.nameKn    ? member.nameKn    : member.name
  const role    = lang === 'kn' && member.roleKn    ? member.roleKn    : member.role
  const bio     = lang === 'kn' && member.bioKn     ? member.bioKn     : member.bio
  const tribute = lang === 'kn' && member.tributeKn ? member.tributeKn : member.tribute

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-72 shrink-0">
      {/* Photo header */}
      <div className="relative h-44 bg-cream-200">
        <img
          src={member.photo}
          alt={name}
          className={`w-full h-full object-cover ${member.isDeceased ? 'grayscale' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/40 text-white rounded-full w-7 h-7
            flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
          aria-label={t('familyTree.closePanel')}
        >✕</button>
        <div className="absolute bottom-3 left-3">
          {member.isDeceased && (
            <span className="inline-block bg-gray-600/80 text-white text-[10px] px-2 py-0.5
              rounded-full mb-1">
              {t('familyTree.deceased')}
            </span>
          )}
          <p className="text-white font-bold text-sm leading-tight">{name}</p>
          {role && <p className="text-white/70 text-xs">{role}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 text-sm max-h-80 overflow-y-auto">
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-terracotta/10 text-terracotta text-xs px-2.5 py-0.5 rounded-full">
            {t('familyTree.generation', { gen: member.generation })}
          </span>
          <span className="bg-warmgreen/10 text-warmgreen text-xs px-2.5 py-0.5 rounded-full capitalize">
            {member.gender}
          </span>
        </div>

        {member.dob && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              {t('familyTree.born')}
            </p>
            <p className="text-gray-800 mt-0.5">
              {new Date(member.dob).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        )}

        {member.isDeceased && member.yearDeceased && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
              {t('familyTree.died')}
            </p>
            <p className="text-gray-800 mt-0.5">{member.yearDeceased}</p>
          </div>
        )}

        {bio && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">
              About
            </p>
            <p className="text-gray-600 leading-relaxed text-xs">{bio}</p>
          </div>
        )}

        {tribute && (
          <blockquote className="border-l-2 border-terracotta/40 pl-3 italic text-gray-500 text-xs">
            "{tribute}"
          </blockquote>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FamilyTreePage() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()

  const [treeData, setTreeData] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [scale,    setScale]    = useState(1)

  useEffect(() => {
    document.title = `${t('familyTree.pageTitle')} — Lagwankar Family`
    getFamilyTree()
      .then((data) => { setTreeData(data); setLoading(false) })
      .catch((err) => { setError(err.message || 'Failed to load'); setLoading(false) })
  }, [t])

  // Close panel on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>

  if (error) return (
    <div className="flex justify-center py-24 text-gray-400">
      <p>Could not load family tree: {error}</p>
    </div>
  )

  const { roots = [], orphans = [] } = treeData || {}

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark">
              {t('familyTree.pageTitle')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{t('familyTree.clickToView')}</p>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.min(1.8, +(s + 0.15).toFixed(2)))}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-600
                hover:border-terracotta hover:text-terracotta shadow-sm transition-colors
                text-lg font-bold flex items-center justify-center"
              aria-label={t('familyTree.zoomIn')}
            >+</button>
            <button
              onClick={() => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)))}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-600
                hover:border-terracotta hover:text-terracotta shadow-sm transition-colors
                text-lg font-bold flex items-center justify-center"
              aria-label={t('familyTree.zoomOut')}
            >−</button>
            <button
              onClick={() => setScale(1)}
              className="px-3 h-9 rounded-xl bg-white border border-gray-200 text-gray-600
                hover:border-terracotta hover:text-terracotta shadow-sm transition-colors
                text-xs font-medium"
              aria-label={t('familyTree.resetView')}
            >{t('familyTree.resetView')}</button>
            <span className="text-xs text-gray-400">{Math.round(scale * 100)}%</span>
          </div>
        </div>

        {/* Layout: tree + detail panel */}
        <div className="flex gap-6 items-start">
          {/* Tree canvas — scrollable */}
          <div
            className="flex-1 min-h-[520px] overflow-auto rounded-2xl bg-cream
              border border-cream-200"
            role="region"
            aria-label="Interactive family tree — scroll to explore"
          >
            {/* Scaled inner content */}
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                padding: '48px 80px',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100%',
                transition: 'transform 0.2s ease',
              }}
            >
              {roots.length === 0 ? (
                <p className="text-gray-400 text-sm">No family tree data found.</p>
              ) : (
                roots.map((root) => (
                  <TreeNode
                    key={root.id}
                    node={root}
                    onSelect={setSelected}
                    selectedId={selected?.id}
                    lang={lang}
                  />
                ))
              )}

              {/* Orphan / unlinked members */}
              {orphans.length > 0 && (
                <div className="mt-14 pt-8 border-t border-terracotta/15 w-full">
                  <p className="text-[11px] text-gray-400 text-center mb-5 font-medium
                    uppercase tracking-widest">
                    {t('familyTree.otherMembers')}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {orphans.map((m) => (
                      <MemberBubble
                        key={m.id}
                        member={m}
                        onSelect={setSelected}
                        isSelected={selected?.id === m.id}
                        lang={lang}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel (desktop sidebar) */}
          {selected && (
            <div className="hidden md:block sticky top-4">
              <MemberPanel
                member={selected}
                onClose={() => setSelected(null)}
                lang={lang}
                t={t}
              />
            </div>
          )}
        </div>

        {/* Mobile detail card */}
        {selected && (
          <div className="md:hidden mt-5 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="relative h-36 bg-cream-200">
              <img
                src={selected.photo}
                alt={lang === 'kn' && selected.nameKn ? selected.nameKn : selected.name}
                className={`w-full h-full object-cover ${selected.isDeceased ? 'grayscale' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 bg-black/40 text-white rounded-full w-7 h-7
                  flex items-center justify-center text-sm"
                aria-label="Close"
              >✕</button>
              <div className="absolute bottom-2 left-3">
                <p className="text-white font-bold text-sm">
                  {lang === 'kn' && selected.nameKn ? selected.nameKn : selected.name}
                </p>
                {(lang === 'kn' && selected.roleKn ? selected.roleKn : selected.role) && (
                  <p className="text-white/70 text-xs">
                    {lang === 'kn' && selected.roleKn ? selected.roleKn : selected.role}
                  </p>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex gap-1.5 flex-wrap mb-3">
                <span className="bg-terracotta/10 text-terracotta text-xs px-2.5 py-0.5 rounded-full">
                  {t('familyTree.generation', { gen: selected.generation })}
                </span>
              </div>
              {(lang === 'kn' && selected.bioKn ? selected.bioKn : selected.bio) && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {lang === 'kn' && selected.bioKn ? selected.bioKn : selected.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
