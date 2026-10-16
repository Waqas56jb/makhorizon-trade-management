import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession())
  // Lets the route guard show a "signed out" message instead of a plain redirect.
  const [signedOut, setSignedOut] = useState(false)

  const login = useCallback(async (email, password) => {
    const s = await authService.login(email, password)
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

/** Redirects to /login when there is no demo session. */
export function RequireAuth({ children }) {
  const { session, signedOut } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={signedOut ? { signedOut: true } : { from: location.pathname + location.search }} />
  return children
}
