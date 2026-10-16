import { addDays, todayISO } from '../lib/dates.js'
import { activity, conversations, notifications } from './communications.js'
import { documents } from './documents.js'
import { opportunities } from './opportunities.js'
import { orders } from './orders.js'
import { partners, users } from './partners.js'
import { quotations } from './quotations.js'
import { shipments } from './shipments.js'

export const SEED_VERSION = 1

export const defaultSettings = (user) => ({
  displayName: user?.name ?? '',
  language: 'English',
  timeZone: 'Africa/Djibouti',
  notifications: { email: true, orders: true, shipments: true, quotations: true, messages: true },
  density: 'comfortable',
})

/** Builds a fresh demo dataset with dates relative to today. */
export function buildSeed() {
  const today = todayISO()
  const d = (days) => addDays(today, days)
  const t = (days, time) => `${d(days)}T${time}`
  const userList = users(d)

  return {
    version: SEED_VERSION,
    seededOn: today,
    partners: partners(),
    users: userList,
    opportunities: opportunities(d),
    quotations: quotations(d, t),
    orders: orders(d, t),
    shipments: shipments(d, t),
    documents: documents(d),
    conversations: conversations(t),
    notifications: notifications(t),
    activity: activity(t),
    supportRequests: [],
    settings: Object.fromEntries(userList.map((u) => [u.id, defaultSettings(u)])),
  }
}
