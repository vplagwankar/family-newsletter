/**
 * authService.js — Authentication abstraction layer.
 *
 * Currently backed by mock data + localStorage.
 * Replace the internals here to swap in Firebase Auth, JWT, etc.
 * The interface (login / logout / getSession / isAuthenticated) stays the same.
 */

import { ADMINS } from '../mock/admins.js'

const SESSION_KEY = 'family_admin_session'
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

export const authService = {
  /**
   * Attempt login. Resolves with session object on success, rejects on failure.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{id, name, email, role}>}
   */
  async login(email, password) {
    await delay()
    const admin = ADMINS.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password
    )
    if (!admin) {
      throw new Error('Invalid email or password.')
    }
    const session = { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch {
      // ignore storage errors (private browsing, quota exceeded)
    }
    return session
  },

  /** Clear the admin session */
  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  /**
   * Restore session from localStorage (called on app mount).
   * @returns {{id, name, email, role} | null}
   */
  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  /** @returns {boolean} */
  isAuthenticated() {
    return !!this.getSession()
  },

  /**
   * Check if the current session has a specific role.
   * @param {'super'|'editor'} role
   * @returns {boolean}
   */
  checkRole(role) {
    const session = this.getSession()
    if (!session) return false
    return session.role === role || session.role === 'super'
  },
}
