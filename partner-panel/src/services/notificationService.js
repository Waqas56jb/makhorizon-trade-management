import { commit, currentPartnerId, getState, own, replaceById } from './base'

/**
 * Notifications for the signed-in partner. Read state is kept in the demo store.
 * Integration points: GET /api/notifications, POST /api/notifications/read
 * (later delivered in realtime by the backend).
 */
export const getNotifications = () => Promise.resolve(own(getState().notifications))

export function markNotificationRead(id) {
  const n = getState().notifications.find((x) => x.id === id)
  if (!n || n.partnerId !== currentPartnerId() || n.read) return
  commit((s) => ({ ...s, notifications: replaceById(s.notifications, id, { read: true }) }))
}

export function markNotificationUnread(id) {
  const n = getState().notifications.find((x) => x.id === id)
  if (!n || n.partnerId !== currentPartnerId() || !n.read) return
  commit((s) => ({ ...s, notifications: replaceById(s.notifications, id, { read: false }) }))
}

export function markAllNotificationsRead() {
  const pid = currentPartnerId()
  commit((s) => ({ ...s, notifications: s.notifications.map((n) => (n.partnerId === pid ? { ...n, read: true } : n)) }))
}
