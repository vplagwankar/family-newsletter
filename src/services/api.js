/**
 * api.js — Central data-access layer.
 *
 * All components MUST import from here, never directly from src/mock/.
 * When replacing the mock with a real API (REST / Firebase), only this file changes.
 *
 * Every exported function returns a Promise to simulate real async behaviour.
 */

import {
  store,
  storeCreateEvent, storeUpdateEvent, storeDeleteEvent,
  storeCreateMember, storeUpdateMember, storeDeleteMember,
  storeAddPhoto, storeDeletePhoto,
} from '../mock/store.js'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

// ─── Events ──────────────────────────────────────────────────────────────────

/** All published (past) events, newest first */
export async function getPublishedEvents() {
  await delay()
  return store.events
    .filter((e) => e.published && e.status !== 'deleted')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

/** N most-recent published events (default 3) */
export async function getRecentEvents(n = 3) {
  await delay()
  return store.events
    .filter((e) => e.published && e.status !== 'deleted')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n)
}

/** Upcoming events within the next `withinDays` days (default 30) */
export async function getUpcomingEvents(withinDays = 30) {
  await delay()
  const now   = new Date()
  const limit = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000)
  return store.events
    .filter((e) => {
      const d = new Date(e.date)
      return !e.published && e.status !== 'deleted' && d > now && d <= limit
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

/** All events (published + upcoming, excl. deleted), newest first */
export async function getAllEvents() {
  await delay()
  return store.events
    .filter((e) => e.status !== 'deleted')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

/** All events including deleted — for admin views */
export async function getAllEventsAdmin() {
  await delay()
  return [...store.events].sort((a, b) => new Date(b.date) - new Date(a.date))
}

/** Single event by ID; returns null if not found */
export async function getEventById(id) {
  await delay(200)
  return store.events.find((e) => e.id === id) ?? null
}

/** Create a new event (admin) */
export async function createEvent(data) {
  await delay(400)
  return storeCreateEvent(data)
}

/** Update an existing event (admin) */
export async function updateEvent(id, patch) {
  await delay(400)
  return storeUpdateEvent(id, patch)
}

/** Soft-delete an event (admin) */
export async function deleteEvent(id) {
  await delay(300)
  return storeDeleteEvent(id)
}

// ─── Members ─────────────────────────────────────────────────────────────────

/** All family members (excl. soft-deleted) */
export async function getMembers() {
  await delay()
  return store.members.filter((m) => !m.deleted)
}

/** All members including deleted — for admin views */
export async function getMembersAdmin() {
  await delay()
  return [...store.members]
}

/** A random living member for the Family Spotlight section */
export async function getSpotlightMember() {
  await delay(150)
  const living = store.members.filter((m) => !m.isDeceased && !m.deleted)
  return living[Math.floor(Math.random() * living.length)]
}

/** Members with birthdays in the current month */
export async function getBirthdayMembers() {
  await delay()
  const month = new Date().getMonth() + 1
  return store.members.filter((m) => {
    if (!m.dob || m.isDeceased || m.deleted) return false
    return parseInt(m.dob.split('-')[1], 10) === month
  })
}

/** Create a new member (admin) */
export async function createMember(data) {
  await delay(400)
  return storeCreateMember(data)
}

/** Update a member (admin) */
export async function updateMember(id, patch) {
  await delay(400)
  return storeUpdateMember(id, patch)
}

/** Soft-delete a member (admin) */
export async function deleteMember(id) {
  await delay(300)
  return storeDeleteMember(id)
}

// ─── Announcements ───────────────────────────────────────────────────────────

/** All announcements, newest first */
export async function getAnnouncements() {
  await delay()
  return [...store.announcements].sort((a, b) => new Date(b.date) - new Date(a.date))
}

// ─── Albums ──────────────────────────────────────────────────────────────────

/** All albums */
export async function getAlbums() {
  await delay()
  return store.albums
}

/** Single album by ID, including its photos (sourced from the linked event) */
export async function getAlbumById(id) {
  await delay(200)
  const album = store.albums.find((a) => a.id === id) ?? null
  if (!album) return null
  const event = album.eventId ? store.events.find((e) => e.id === album.eventId) : null
  return { ...album, photos: event?.photos ?? [] }
}

/** All photos across all published events */
export async function getAllPhotos() {
  await delay()
  return store.events
    .filter((e) => e.published && e.status !== 'deleted')
    .flatMap((e) =>
      (e.photos ?? []).map((p) => ({ ...p, eventId: e.id, eventTitle: e.title }))
    )
}

/** Add a photo to an event (admin) */
export async function addPhoto(eventId, photo) {
  await delay(400)
  return storeAddPhoto(eventId, photo)
}

/** Delete a photo from an event (admin) */
export async function deletePhoto(eventId, photoId) {
  await delay(300)
  return storeDeletePhoto(eventId, photoId)
}

// ─── Family Tree ─────────────────────────────────────────────────────────────

export async function getFamilyTree() {
  await delay()
  const MEMBERS = store.members.filter((m) => !m.deleted)

  const nodes = Object.fromEntries(
    MEMBERS.map((m) => [m.id, { ...m, spouse: null, children: [] }])
  )

  const spouseLinked = new Set()
  MEMBERS.forEach((m) => {
    if (m.spouseId && !spouseLinked.has(m.id)) {
      nodes[m.id].spouse = nodes[m.spouseId] ?? null
      if (nodes[m.spouseId]) nodes[m.spouseId].spouse = nodes[m.id]
      spouseLinked.add(m.id)
      spouseLinked.add(m.spouseId)
    }
  })

  MEMBERS.forEach((m) => {
    if (m.parentIds && m.parentIds.length > 0) {
      const fatherId = m.parentIds.find((pid) => nodes[pid]?.gender === 'male')
      const attachTo = fatherId ?? m.parentIds[0]
      if (nodes[attachTo]) nodes[attachTo].children.push(nodes[m.id])
    }
  })

  const rootIds = new Set(
    MEMBERS
      .filter((m) => (!m.parentIds || m.parentIds.length === 0) && m.generation === 1 && m.gender === 'male')
      .map((m) => m.id)
  )

  const allSpouseIds = new Set(MEMBERS.map((m) => m.spouseId).filter(Boolean))
  const orphans = MEMBERS.filter(
    (m) =>
      (!m.parentIds || m.parentIds.length === 0) &&
      !rootIds.has(m.id) &&
      !allSpouseIds.has(m.id)
  )

  return { roots: [...rootIds].map((id) => nodes[id]), orphans }
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchAll(query) {
  await delay(400)
  const q = query.toLowerCase().trim()
  if (!q) return { events: [], members: [], announcements: [] }

  const events = store.events.filter(
    (e) =>
      e.status !== 'deleted' &&
      (e.title.toLowerCase().includes(q) ||
        (e.titleKn && e.titleKn.includes(q)) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q))
  )

  const members = store.members.filter(
    (m) =>
      !m.deleted &&
      (m.name.toLowerCase().includes(q) ||
        (m.nameKn && m.nameKn.includes(q)) ||
        (m.bio && m.bio.toLowerCase().includes(q)))
  )

  const announcements = store.announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      (a.titleKn && a.titleKn.includes(q)) ||
      (a.body && a.body.toLowerCase().includes(q))
  )

  return { events, members, announcements }
}
