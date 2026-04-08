export default function PhotoGrid({ photos, onPhotoClick }) {
  if (!photos || photos.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {photos.map((photo, idx) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick(idx)}
          className="aspect-square overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none group"
          aria-label={photo.alt || `Photo ${idx + 1}`}
        >
          <img
            src={photo.url}
            alt={photo.alt || ''}
            loading="lazy"
            className="w-full h-full object-cover group-hover:opacity-90 group-hover:scale-105 transition-all duration-200"
          />
        </button>
      ))}
    </div>
  )
}
