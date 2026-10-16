import { useSyncExternalStore } from 'react'
import { buildSeed } from '../data/seed'

/**
 * Tiny external store holding the demo data.
 *
 * DEMO ONLY: persisted to localStorage so updates survive navigation and
 * reloads. It holds fictional operational records only — never passwords,
 * tokens or file contents. "Reset demo data" (Profile / Help) restores the
 * original sample. Nothing here is synchronised with the admin panel.
 */
const STORAGE_KEY = 'mkh-staff-demo-data'
const VERSION = 1

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.version === VERSION) return parsed
    }
  } catch {
    // Storage unavailable or corrupted — use a fresh seed.
  }
  return buildSeed()
}

let state = load()
const listeners = new Set()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode or quota exceeded: keep working in memory.
  }
}

export const store = {
  getState: () => state,
  setState(updater) {
    state = typeof updater === 'function' ? updater(state) : updater
    persist()
    listeners.forEach((l) => l())
  },
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  reset() {
    this.setState(buildSeed())
  },
}

/** Subscribe to state. Selectors must return stable references. */
export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(state))
}

export const useAppState = () => useStore((s) => s)
