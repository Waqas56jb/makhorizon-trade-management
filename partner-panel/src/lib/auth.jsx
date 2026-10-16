import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import * as authService from '../services/authService'
import { useStore } from './store'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession())
  // Lets the login page show a "signed out" message rather than a plain redirect.
  const [signedOut, setSignedOut] = useState(false)

  const login = useCallback(async (email, password, remember) => {
    const s = await authService.login(email, password, remember)
    setSignedOut(false)
    setSession(s)
    return s
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setSignedOut(true)
    setSession(null)
  }, [])

  const value = useMemo(() => ({ session, signedOut, login, logout }), [session, signedOut, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

/** The signed-in demo user and their partner company. */
// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentUser() {
  const { session } = useAuth()
  const users = useStore((s) => s.users)
  const partners = useStore((s) => s.partners)
  return useMemo(() => {
    const user = users.find((u) => u.id === session?.userId) ?? null
    return { user, partner: partners.find((p) => p.id === user?.partnerId) ?? null }
  }, [users, partners, session])
}

/** Redirects to /login without a demo session. Frontend-only — not a security boundary. */
export function ProtectedRoute({ children }) {
  const { session, signedOut } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={signedOut ? { signedOut: true } : { from: location.pathname + location.search }} />
  return children
}
