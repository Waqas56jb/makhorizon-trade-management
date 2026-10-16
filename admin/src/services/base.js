import { store } from '../lib/store'

/**
 * Mock service helpers. Each service function returns a Promise and simulates
 * network latency so the UI already handles loading/error states. To connect
 * the backend, replace the bodies of the service functions with HTTP calls and
 * keep the same signatures.
 */
const LATENCY_MS = 280

/** Simulated round-trip; mutations validate and commit after it, as a server would. */
export const pause = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

export class ServiceError extends Error {}

export const getState = () => store.getState()

/** Local "YYYY-MM-DDTHH:mm" timestamp. */
function localStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

/** Applies a state change and records an activity entry. */
export function commit(updater, activity) {
  store.setState((s) => {
    const next = updater(s)
    if (!activity) return next
    const entry = {
      id: `AC-${Date.now().toString(36)}`,
      at: localStamp(),
      message: activity.message,
      link: activity.link ?? '',
      simulated: false,
    }
    return { ...next, activity: [entry, ...next.activity].slice(0, 60) }
  })
}

export function findOrThrow(collection, id, label) {
  const item = getState()[collection].find((x) => x.id === id)
  if (!item) throw new ServiceError(`${label} not found.`)
  return item
}

export const replaceById = (list, id, patch) => list.map((x) => (x.id === id ? { ...x, ...patch } : x))
export const removeById = (list, id) => list.filter((x) => x.id !== id)

/** Builds a "has related records" message for blocked deletes. */
export function relatedMessage(name, parts) {
  const items = parts.filter(([n]) => n > 0).map(([n, label]) => `${n} ${label}${n === 1 ? '' : 's'}`)
  return items.length ? `${name} cannot be deleted because it has ${items.join(' and ')}.` : null
}
