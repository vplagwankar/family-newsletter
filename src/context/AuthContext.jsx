import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const session = authService.getSession()
    setAdmin(session)
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const session = await authService.login(email, password)
    setAdmin(session)
    return session
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
