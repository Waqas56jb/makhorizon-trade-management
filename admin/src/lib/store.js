import { useSyncExternalStore } from 'react'
import { buildSeed } from '../data/seed'

/**
 * Tiny external store holding all demo data.
 *
 * DEMO ONLY: the dataset is persisted to localStorage so changes survive page
 * reloads. It contains fictional sample records and settings only — never
 * passwords, files or real customer data. Settings → "Reset demo data"
 * restores the original sample dataset.
 */
const STORAGE_KEY = 'mkh-admin-demo-data'
const VERSION = 1

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.version === VERSION) return parsed
    }
  } catch {
    // Storage unavailable or corrupted — fall back to a fresh seed.
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

/** Subscribe to a slice of state. Selectors must return stable references (e.g. `s => s.clients`). */
export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(state))
}

export const useAppState = () => useStore((s) => s)
export const useSettings = () => useStore((s) => s.settings)
