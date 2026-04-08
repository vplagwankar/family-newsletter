/**
 * Badge — coloured pill for event categories and announcement types.
 *
 * Accepts either:
 *   <Badge category="puja" />            — auto-labels from category
 *   <Badge label="Puja" type="puja" />   — explicit label + type
 */

const colorMap = {
  puja:        'bg-warmgreen/10 text-warmgreen-dark border-warmgreen/30',
  ceremony:    'bg-terracotta/10 text-terracotta-dark border-terracotta/30',
  reunion:     'bg-saffron/10 text-saffron-dark border-saffron/30',
  celebration: 'bg-purple-50 text-purple-700 border-purple-200',
  birth:       'bg-pink-50 text-pink-700 border-pink-200',
  marriage:    'bg-red-50 text-red-700 border-red-200',
  achievement: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  memorial:    'bg-gray-100 text-gray-600 border-gray-300',
  draft:       'bg-gray-100 text-gray-500 border-gray-200',
  published:   'bg-green-50 text-green-700 border-green-200',
  deleted:     'bg-red-50 text-red-400 border-red-200',
}

const autoLabel = {
  puja: 'Puja', ceremony: 'Ceremony', reunion: 'Reunion', celebration: 'Celebration',
  birth: 'Birth', marriage: 'Marriage', achievement: 'Achievement', memorial: 'Memorial',
  draft: 'Draft', published: 'Published', deleted: 'Deleted',
}

export default function Badge({ label, type, category, className = '' }) {
  // Support both APIs: category shorthand or explicit type+label
  const resolvedType  = type ?? category ?? 'ceremony'
  const resolvedLabel = label ?? autoLabel[resolvedType] ?? resolvedType
  const colors = colorMap[resolvedType] ?? colorMap.ceremony
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${colors} ${className}`}
    >
      {resolvedLabel}
    </span>
  )
}
