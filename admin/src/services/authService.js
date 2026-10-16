import { store } from '../lib/store'
import { pause, ServiceError } from './base'

/**
 * DEMO AUTHENTICATION — NOT SECURE, NOT FOR PRODUCTION.
 * Credentials are checked in the browser and the "session" is a flag in
 * localStorage. No password is stored. Replace this module with real backend
 * authentication (e.g. Supabase Auth) before going live; the rest of the app
 * only uses `login`, `logout` and `getSession`.
 */
export const DEMO_PASSWORD = 'DemoAdmin123!'
const SESSION_KEY = 'mkh-admin-demo-session'

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function login(email, password) {
  await pause(500)
  const profile = store.getState().settings.profile
  if (email.trim().toLowerCase() !== profile.email.toLowerCase() || password !== DEMO_PASSWORD) {
    throw new ServiceError('The email or password is incorrect. Use the demo credentials shown below.')
  }
  const session = { email: profile.email, startedAt: new Date().toISOString(), demo: true }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Session will last for this page view only.
  }
  return session
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}
