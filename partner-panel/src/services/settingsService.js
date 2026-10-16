import { defaultSettings } from '../data/seed'
import { store } from '../lib/store'
import { DEMO_PASSWORD } from './authService'
import { commit, currentUser, getState, pause, replaceById, ServiceError } from './base'

/**
 * Personal settings kept in the demo store. Nothing here changes a real
 * account, email preference or password.
 * Integration points: PATCH /api/me/settings, Supabase Auth updateUser (password).
 */
export const languages = ['English', 'Français', 'العربية']
export const timeZones = ['Africa/Djibouti', 'Africa/Nairobi', 'Africa/Addis_Ababa', 'Asia/Dubai', 'Europe/Paris', 'UTC']

const settingsFor = (s, userId) => s.settings[userId] ?? defaultSettings(s.users.find((u) => u.id === userId))

function save(patch, activity) {
  const me = currentUser()
  commit((s) => ({ ...s, settings: { ...s.settings, [me.id]: { ...settingsFor(s, me.id), ...patch } } }), activity)
}

export async function updateAccount({ displayName, language, timeZone }) {
  await pause()
  const me = currentUser()
  if (displayName.trim().length < 2) throw new ServiceError('Display name is required.')
  if (!languages.includes(language) || !timeZones.includes(timeZone)) throw new ServiceError('Select a valid language and time zone.')
  store.setState((s) => ({ ...s, users: replaceById(s.users, me.id, { name: displayName.trim() }) }))
  save({ displayName: displayName.trim(), language, timeZone }, { message: 'Account settings updated', status: 'Saved', link: '/settings' })
}

export async function updateNotificationPreferences(notifications) {
  await pause()
  save({ notifications }, { message: 'Notification preferences updated', status: 'Saved', link: '/settings' })
}

export async function updatePreferences({ density }) {
  await pause()
  if (!['comfortable', 'compact'].includes(density)) throw new ServiceError('Select a display option.')
  save({ density })
}

/** Demo only: checks the form and the public demo password, but never stores or changes any password. */
export async function changePasswordDemo({ currentPassword, newPassword }) {
  await pause(500)
  if (currentPassword !== DEMO_PASSWORD) throw new ServiceError('The current password is incorrect.')
  if (newPassword === currentPassword) throw new ServiceError('The new password must be different from the current one.')
  return { demo: true }
}

export const getSettings = () => settingsFor(getState(), currentUser().id)

export async function resetDemoData() {
  await pause(400)
  store.reset()
}
