// Notifications and profile.
import { myNotifications } from '../lib/selectors'
import { store } from '../lib/store'
import { commit, currentEmployee, getState, pause, replaceById, ServiceError } from './base'

export async function getNotifications() {
  await pause()
  return myNotifications(getState(), currentEmployee().id)
}

/** Marks stored or generated notifications as read. */
export function markNotificationsRead(ids) {
  const set = new Set(ids)
  commit((s) => ({
    ...s,
    notifications: s.notifications.map((n) => (set.has(n.id) ? { ...n, read: true } : n)),
    readNotifications: [...new Set([...s.readNotifications, ...ids.filter((id) => id.startsWith('gen-'))])],
  }))
}

export const markNotificationRead = (id) => markNotificationsRead([id])

export async function getCurrentEmployee() {
  await pause()
  return currentEmployee()
}

/** Only safe fields can change: display name and phone. Role, department and access are read-only. */
export async function updateProfile({ name, phone }) {
  await pause()
  const emp = currentEmployee()
  if (!name?.trim()) throw new ServiceError('Display name is required.')
  commit((s) => ({ ...s, employees: replaceById(s.employees, emp.id, { name: name.trim(), phone: phone?.trim() ?? '' }) }), { message: 'Updated profile details', link: '/profile' })
  return true
}

export async function resetDemoData() {
  await pause()
  store.reset()
  return true
}
