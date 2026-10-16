import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import * as authService from '../services/authService'
import { useStore } from './store'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession())
  // Lets the route guard show a "signed out" message rather than a plain redirect.
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

/** The signed-in demo employee record. */
// eslint-disable-next-line react-refresh/only-export-components
export function useEmployee() {
  const { session } = useAuth()
  const employees = useStore((s) => s.employees)
  return employees.find((e) => e.id === session?.employeeId) ?? null
}

export function RequireAuth({ children }) {
  const { session, signedOut } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={signedOut ? { signedOut: true } : { from: location.pathname + location.search }} />
  return children
}
