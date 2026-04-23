/**
 * authService.js — Authentication abstraction layer.
 *
 * Backed by the .NET API (POST /api/auth/login).
 * The interface (login / logout / getSession / isAuthenticated) is unchanged —
 * no other file needs to know about the implementation swap.
 */

const API_BASE    = 'http://localhost:5000/api'
const SESSION_KEY = 'family_admin_session'
const TOKEN_KEY   = 'family_admin_token'

export const authService = {
  /**
   * Attempt login against the .NET backend.
   * Resolves with { id, name, email, role } on success, rejects on failure.
   */
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: email.trim().toLowerCase(), password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Invalid email or password.')
    }

    const { token, admin } = await res.json()

    // Persist both the session info and the JWT for subsequent requests
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(admin))
      localStorage.setItem(TOKEN_KEY,   token)
    } catch {
      // ignore storage errors (private browsing, quota exceeded)
    }

    return admin
  },

  /** Clear the admin session and token. */
  logout() {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(TOKEN_KEY)
  },

  /**
   * Restore session from localStorage (called on app mount).
   * @returns {{ id, name, email, role } | null}
   */
  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  /** @returns {string | null} */
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY)
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
