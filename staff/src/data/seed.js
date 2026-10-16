import { addDays, todayISO } from '../lib/dates'
import { documents } from './documents'
import { employees } from './employees'
import { notifications } from './notifications'
import { orders } from './orders'
import { shipments } from './shipments'
import { tasks } from './tasks'

/** Builds a fresh demo dataset with dates relative to today. */
export function buildSeed() {
  const today = todayISO()
  const d = (days) => addDays(today, days)
  const t = (days, time) => `${d(days)}T${time}`

  return {
    version: 1,
    seededOn: today,
    employees: employees(),
    tasks: tasks(d, t),
    orders: orders(d, t),
    shipments: shipments(d, t),
    documents: documents(d),
    notifications: notifications(t),
    // Read state for generated (non-stored) notifications.
    readNotifications: [],
    activity: [
      { id: 'AC-03', employeeId: 'EM-001', at: t(-1, '15:20'), message: 'Added an update to ORD-2026-041', link: '/orders/OR-101', simulated: true },
      { id: 'AC-02', employeeId: 'EM-001', at: t(-2, '10:05'), message: 'Marked SHP-2026-063 Ready for Dispatch', link: '/shipments/SH-203', simulated: true },
      { id: 'AC-01', employeeId: 'EM-001', at: t(-2, '10:30'), message: 'Started TSK-1102', link: '/tasks/TK-02', simulated: true },
    ],
  }
}
