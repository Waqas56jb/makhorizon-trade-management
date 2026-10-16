import { store } from '../lib/store'
import { commit, pause } from './base'

export const settingsService = {
  async update(section, values) {
    await pause()
    commit((s) => ({ ...s, settings: { ...s.settings, [section]: { ...s.settings[section], ...values } } }))
    return true
  },
  async resetDemoData() {
    await pause()
    store.reset()
    return true
  },
}

export const notificationService = {
  markRead(id) {
    commit((s) => (s.readNotifications.includes(id) ? s : { ...s, readNotifications: [...s.readNotifications, id] }))
  },
  markAllRead(ids) {
    commit((s) => ({ ...s, readNotifications: [...new Set([...s.readNotifications, ...ids])] }))
  },
}
