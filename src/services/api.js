/**
 * api.js — Central data-access layer.
 *
 * All components MUST import from here, never directly from src/mock/.
 * This version calls the .NET backend at http://localhost:5000/api.
 * To point at a deployed backend, change API_BASE only.
 */

import { authService } from './authService.js'

const API_BASE = 'http://localhost:5000/api'

// ── Fetch helpers ─────────────────────────────────────────────────────────────

function authHeaders() {
  const token = authService.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

async function authGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

async function authPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}

async function authPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`)
  return res.json()
}

async function authDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok && res.status !== 204) throw new Error(`DELETE ${path} failed: ${res.status}`)
}

// ─── Events ──────────────────────────────────────────────────────────────────

/** All published (past) events, newest first */
export async function getPublishedEvents() {
  return get('/events')
}

/** N most-recent published events (default 3) */
export async function getRecentEvents(n = 3) {
  return get(`/events/recent?n=${n}`)
}

/** Upcoming events within the next `withinDays` days (default 30) */
export async function getUpcomingEvents(withinDays = 30) {
  return get(`/events/upcoming?withinDays=${withinDays}`)
}

/** All events (published + upcoming, excl. deleted), newest first */
export async function getAllEvents() {
  return get('/events/all')
}

/** All events including deleted — for admin views */
export async function getAllEventsAdmin() {
  return authGet('/events/admin')
}

/** Single event by ID; returns null if not found */
export async function getEventById(id) {
  try {
    return await get(`/events/${id}`)
  } catch {
    return null
  }
}

/** Create a new event (admin) */
export async function createEvent(data) {
  return authPost('/events', data)
}

/** Update an existing event (admin) */
export async function updateEvent(id, patch) {
  return authPut(`/events/${id}`, patch)
}

/** Soft-delete an event (admin) */
export async function deleteEvent(id) {
  return authDelete(`/events/${id}`)
}

// ─── Members ─────────────────────────────────────────────────────────────────

/** All family members (excl. soft-deleted) */
export async function getMembers() {
  return get('/members')
}

/** All members including deleted — for admin views */
export async function getMembersAdmin() {
  return authGet('/members/admin')
}

/** A random living member for the Family Spotlight section */
export async function getSpotlightMember() {
  return get('/members/spotlight')
}

/** Members with birthdays in the current month */
export async function getBirthdayMembers() {
  return get('/members/birthdays')
}

/** Create a new member (admin) */
export async function createMember(data) {
  return authPost('/members', data)
}

/** Update a member (admin) */
export async function updateMember(id, patch) {
  return authPut(`/members/${id}`, patch)
}

/** Soft-delete a member (admin) */
export async function deleteMember(id) {
  return authDelete(`/members/${id}`)
}

// ─── Announcements ───────────────────────────────────────────────────────────

/** All announcements, newest first */
export async function getAnnouncements() {
  return get('/announcements')
}

// ─── Albums ──────────────────────────────────────────────────────────────────

/** All albums */
export async function getAlbums() {
  return get('/albums')
}

/** Single album by ID, including its photos */
export async function getAlbumById(id) {
  try {
    return await get(`/albums/${id}`)
  } catch {
    return null
  }
}

/** All photos across all published events */
export async function getAllPhotos() {
  return get('/events/photos')
}

/** Add a photo to an event (admin) */
export async function addPhoto(eventId, photo) {
  return authPost(`/events/${eventId}/photos`, photo)
}

/** Delete a photo from an event (admin) */
export async function deletePhoto(eventId, photoId) {
  return authDelete(`/events/${eventId}/photos/${photoId}`)
}

// ─── Family Tree ─────────────────────────────────────────────────────────────

/**
 * The .NET API returns TreeNode objects shaped as { member, spouse, children }.
 * FamilyTreePage.jsx was written against the JS mock, which spread member fields
 * directly into the node (node.id, node.name, node.generation, …).
 * This helper recursively normalises .NET nodes → JS-mock shape.
 */
function normalizeNode(node) {
  if (!node) return null
  return {
    ...node.member,                                          // spread id, name, generation, etc.
    spouse:   normalizeNode(node.spouse),
    children: (node.children ?? []).map(normalizeNode),
  }
}

/**
 * Fetch the pre-built family tree from the .NET backend and normalise it
 * so FamilyTreePage.jsx can use nodes exactly as before (node.id, node.spouse, …).
 */
export async function getFamilyTree() {
  const data = await get('/family-tree')
  const roots   = (data.roots   ?? []).map(normalizeNode)
  const orphans = (data.orphans ?? []).map(normalizeNode)
  return { roots, orphans }
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchAll(query) {
  if (!query?.trim()) return { events: [], members: [], announcements: [] }
  return get(`/search?q=${encodeURIComponent(query.trim())}`)
}
