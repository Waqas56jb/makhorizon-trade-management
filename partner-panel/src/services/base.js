import { store } from '../lib/store'
import { getSession } from './authService'

/**
 * Mock service helpers. Every service function returns a Promise, simulates a
 * network round-trip, then validates and commits — like an API would. To
 * connect the Node.js / Supabase backend, replace each function body with an
 * HTTP call and keep the signatures.
 *
 * Ownership checks here are DEMO UI behaviour only. Frontend filtering is not
 * security: the backend must authorise every request using the authenticated
 * user's identity and server-side rules (e.g. Supabase Row Level Security).
 */
const LATENCY_MS = 300

export const pause = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

export class ServiceError extends Error {}

export const getState = () => store.getState()

/** Local "YYYY-MM-DDTHH:mm" timestamp. */
export function nowStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function currentUser() {
  const session = getSession()
  const user = session && getState().users.find((u) => u.id === session.userId)
  if (!user) throw new ServiceError('Your demo session has ended. Please sign in again.')
  return user
}

export const currentPartnerId = () => currentUser().partnerId

/** Throws unless the record belongs to the signed-in partner. Unknown and foreign records look the same. */
export function assertOwn(record, label) {
  if (!record || record.partnerId !== currentPartnerId()) throw new ServiceError(`${label} not found.`)
  return record
}

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

/** Applies a change and records an activity entry for the current partner. */
export function commit(updater, activity) {
  const partnerId = currentPartnerId()
  store.setState((s) => {
    const next = updater(s)
    if (!activity) return next
    const entry = { id: uid('AC'), partnerId, at: nowStamp(), message: activity.message, status: activity.status ?? '', link: activity.link ?? '' }
    return { ...next, activity: [entry, ...next.activity].slice(0, 100) }
  })
}

export const replaceById = (list, id, patch) => list.map((x) => (x.id === id ? { ...x, ...(typeof patch === 'function' ? patch(x) : patch) } : x))

/** Records owned by the signed-in partner (the backend will do this server-side). */
export const own = (list) => {
  const pid = currentPartnerId()
  return list.filter((x) => x.partnerId === pid)
}
