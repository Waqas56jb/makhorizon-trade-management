import { store } from '../lib/store'
import { getSession } from './authService'

/**
 * Mock service helpers. Service functions return Promises and simulate a
 * network round-trip, then validate and commit — like a server would. To
 * connect the Node.js backend, replace each function body with an HTTP call
 * and keep the signatures.
 *
 * Permission checks here are DEMO UI behaviour only. In production the
 * backend and Supabase Row Level Security must enforce authorization.
 */
const LATENCY_MS = 280

export const pause = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

export class ServiceError extends Error {}

export const getState = () => store.getState()

/** Local "YYYY-MM-DDTHH:mm" timestamp. */
export function nowStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function currentEmployee() {
  const session = getSession()
  const emp = session && getState().employees.find((e) => e.id === session.employeeId)
  if (!emp) throw new ServiceError('Your demo session has ended. Please sign in again.')
  return emp
}

/** Throws unless the record is assigned to the signed-in employee. */
export function assertAssigned(record, label) {
  if (!record) throw new ServiceError(`${label} not found.`)
  if (record.assignedTo !== currentEmployee().id) throw new ServiceError(`This ${label.toLowerCase()} is not assigned to you.`)
  return record
}

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

/** Applies a change and records an activity entry for the current employee. */
export function commit(updater, activity) {
  store.setState((s) => {
    const next = updater(s)
    if (!activity) return next
    const entry = { id: uid('AC'), employeeId: currentEmployee().id, at: nowStamp(), message: activity.message, link: activity.link ?? '', simulated: false }
    return { ...next, activity: [entry, ...next.activity].slice(0, 80) }
  })
}

export const replaceById = (list, id, patch) => list.map((x) => (x.id === id ? { ...x, ...(typeof patch === 'function' ? patch(x) : patch) } : x))
