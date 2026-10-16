import { store } from '../lib/store'
import { pause, ServiceError } from './base'

/**
 * DEMO AUTHENTICATION — NOT SECURE, NOT FOR PRODUCTION.
 * Credentials are checked in the browser; the "session" stores only the demo
 * employee id in localStorage. No password or token is stored. Replace with
 * real backend authentication (Node.js server / Supabase Auth) later — the UI
 * only uses `login`, `logout` and `getSession`.
 */
export const DEMO_EMAIL = 'staff@makhorizon.demo'
export const DEMO_PASSWORD = 'StaffDemo123!'
const SESSION_KEY = 'mkh-staff-demo-session'

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    const s = raw ? JSON.parse(raw) : null
    return s && store.getState().employees.some((e) => e.id === s.employeeId) ? s : null
  } catch {
    return null
  }
}

export async function login(email, password) {
  await pause(500)
  const employee = store.getState().employees.find((e) => e.isStaff && e.email.toLowerCase() === email.trim().toLowerCase())
  if (!employee || employee.email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    throw new ServiceError('The email or password is incorrect. Use the demo credentials shown below.')
  }
  const session = { employeeId: employee.id, startedAt: new Date().toISOString(), demo: true }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Session lasts for this page view only.
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
