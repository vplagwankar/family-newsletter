/**
 * store.js — In-memory mutable store for mock admin CRUD.
 *
 * Public pages (api.js reads) use these arrays so edits made in admin
 * immediately reflect in the public site within the same session.
 * On page refresh everything resets to the original mock data — appropriate for mock mode.
 */

import { EVENTS }        from './events.js'
import { MEMBERS }       from './members.js'
import { ALBUMS }        from './albums.js'
import { ANNOUNCEMENTS } from './announcements.js'

// ── Live arrays (shallow-cloned so we don't mutate the imported constants) ──

export const store = {
  events:        EVENTS.map((e) => ({ ...e })),
  members:       MEMBERS.map((m) => ({ ...m })),
  albums:        ALBUMS.map((a) => ({ ...a })),
  announcements: ANNOUNCEMENTS.map((a) => ({ ...a })),
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ── Event CRUD ────────────────────────────────────────────────────────────────

export function storeCreateEvent(data) {
  const event = {
    ...data,
    id: uid('evt'),
    photos: data.photos ?? [],
    attendeeCount: 0,
    createdAt: new Date().toISOString(),
  }
  store.events.unshift(event)
  return event
}

export function storeUpdateEvent(id, patch) {
  const idx = store.events.findIndex((e) => e.id === id)
  if (idx === -1) return null
  store.events[idx] = { ...store.events[idx], ...patch }
  return store.events[idx]
}

/** Soft delete — sets status: 'deleted' and published: false */
export function storeDeleteEvent(id) {
  const idx = store.events.findIndex((e) => e.id === id)
  if (idx === -1) return false
  store.events[idx] = { ...store.events[idx], published: false, status: 'deleted' }
  return true
}

// ── Member CRUD ───────────────────────────────────────────────────────────────

export function storeCreateMember(data) {
  const member = {
    ...data,
    id: uid('mem'),
    parentIds: data.parentIds ?? [],
    isDeceased: data.isDeceased ?? false,
  }
  store.members.push(member)
  return member
}

export function storeUpdateMember(id, patch) {
  const idx = store.members.findIndex((m) => m.id === id)
  if (idx === -1) return null
  store.members[idx] = { ...store.members[idx], ...patch }
  return store.members[idx]
}

export function storeDeleteMember(id) {
  const idx = store.members.findIndex((m) => m.id === id)
  if (idx === -1) return false
  store.members[idx] = { ...store.members[idx], deleted: true }
  return true
}

// ── Photo / Album management ──────────────────────────────────────────────────

/** Add a photo (base64 or URL) to an event's photo array */
export function storeAddPhoto(eventId, photo) {
  const idx = store.events.findIndex((e) => e.id === eventId)
  if (idx === -1) return null
  const newPhoto = { id: uid('ph'), ...photo }
  store.events[idx] = {
    ...store.events[idx],
    photos: [...(store.events[idx].photos ?? []), newPhoto],
  }
  return newPhoto
}

export function storeDeletePhoto(eventId, photoId) {
  const idx = store.events.findIndex((e) => e.id === eventId)
  if (idx === -1) return false
  store.events[idx] = {
    ...store.events[idx],
    photos: store.events[idx].photos.filter((p) => p.id !== photoId),
  }
  return true
}
