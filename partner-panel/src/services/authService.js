import { store } from '../lib/store'
import { pause, ServiceError } from './base'

/**
 * DEMO AUTHENTICATION — NOT SECURE, NOT FOR PRODUCTION.
 *
 * Credentials are checked in the browser. The "session" stores only the demo
 * user id and partner id — no password or token. With "Remember me" it is kept
 * in localStorage, otherwise in sessionStorage (cleared when the tab closes).
 *
 * Integration point: replace these functions with Supabase Auth (signInWithPassword,
 * signOut, getSession, resetPasswordForEmail). The UI only uses this module.
 */
export const DEMO_EMAIL = 'partner@makhorizon.demo'
export const DEMO_PASSWORD = 'PartnerDemo123!'
const SESSION_KEY = 'mkh-partner-demo-session'

function read(storage) {
  try {
    const raw = storage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getSession() {
  const s = read(localStorage) ?? read(sessionStorage)
  return s && store.getState().users.some((u) => u.id === s.userId && u.partnerId === s.partnerId) ? s : null
}

export async function login(email, password, remember = false) {
  await pause(550)
  const normalized = email.trim().toLowerCase()
  const user = store.getState().users.find((u) => u.email.toLowerCase() === normalized)
  if (!user || normalized !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    throw new ServiceError('The email or password is incorrect. Check the demo credentials and try again.')
  }
  const session = { userId: user.id, partnerId: user.partnerId, startedAt: new Date().toISOString(), demo: true }
  try {
    ;(remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Session lasts for this page view only.
  }
  return session
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

/** Demo only — validates the address and pretends a reset link was sent. No email is sent. */
export async function requestPasswordReset(email) {
  await pause(600)
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new ServiceError('Enter a valid email address.')
  return { email: email.trim(), demo: true }
}
