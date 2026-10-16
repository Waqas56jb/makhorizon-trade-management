// Pure functions defining what the signed-in employee sees and what needs attention.
import { PRIORITY_RANK } from '../data/tasks'
import { daysBetween, relativeDays, todayISO } from './dates'

export const employeeName = (state, id) => state.employees.find((e) => e.id === id)?.name ?? 'Unknown'

// ---------- Tasks ----------
export const isOpen = (task) => task.status !== 'Completed'
export const isDueToday = (task) => isOpen(task) && task.dueDate === todayISO()
export const isOverdue = (task) => isOpen(task) && task.dueDate < todayISO()

/** Completed tasks that need administrator review show as Pending Review. */
export const taskDisplayStatus = (task) => (task.status === 'Completed' && task.requiresApproval && task.reviewState === 'pending' ? 'Pending Review' : task.status)

export const myTasks = (state, empId) => state.tasks.filter((t) => t.assignedTo === empId)

/** Overdue first, then due date, then priority. Completed last. */
export function sortTasks(list) {
  return [...list].sort((a, b) => {
    if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1
    if (isOverdue(a) !== isOverdue(b)) return isOverdue(a) ? -1 : 1
    return a.dueDate.localeCompare(b.dueDate) || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  })
}

// ---------- Orders & shipments ----------
export const myOrders = (state, empId) => state.orders.filter((o) => o.assignedTo === empId)
export const myShipments = (state, empId) => state.shipments.filter((s) => s.assignedTo === empId)

const ACTIVE_SHIPMENT = ['Planned', 'Ready for Dispatch', 'In Transit', 'Arrived', 'Delayed']

/** Why a shipment needs the employee's attention, or null. */
export function shipmentAttention(shipment, state) {
  if (!ACTIVE_SHIPMENT.includes(shipment.status)) return null
  const today = todayISO()
  if (shipment.status === 'Delayed') return 'Delayed — update required'
  if (shipment.status === 'In Transit' && shipment.expectedArrival && shipment.expectedArrival < today) return 'Arrival update needed'
  if (shipment.status === 'Planned' && shipment.departureDate && daysBetween(today, shipment.departureDate) <= 7) return 'Awaiting confirmation'
  const missing = shipment.requiredDocs.filter((r) => !r.documentId || !state.documents.some((d) => d.id === r.documentId && d.fileName))
  if (missing.length) return `${missing.length} document${missing.length > 1 ? 's' : ''} missing`
  return null
}

// ---------- Documents ----------
/** Documents linked to the employee's orders/shipments, or added by them. */
export function myDocuments(state, empId) {
  const orderIds = new Set(myOrders(state, empId).map((o) => o.id))
  const shipmentIds = new Set(myShipments(state, empId).map((s) => s.id))
  return state.documents.filter((d) => d.addedBy === empId || orderIds.has(d.orderId) || shipmentIds.has(d.shipmentId))
}

// ---------- Notifications ----------
/** Stored notifications plus alerts generated from current tasks and shipments. */
export function myNotifications(state, empId) {
  const today = todayISO()
  const at = `${today}T07:00`
  const read = new Set(state.readNotifications)
  const generated = []
  myTasks(state, empId).forEach((t) => {
    if (isOverdue(t)) generated.push({ id: `gen-overdue-${t.id}-${t.dueDate}`, at, type: 'overdue', title: 'Task overdue', description: `${t.reference} · ${t.title} (due ${relativeDays(t.dueDate)})`, link: `/tasks/${t.id}` })
    else if (isDueToday(t)) generated.push({ id: `gen-today-${t.id}-${today}`, at, type: 'due', title: 'Task due today', description: `${t.reference} · ${t.title}`, link: `/tasks/${t.id}` })
  })
  myShipments(state, empId).forEach((s) => {
    const reason = shipmentAttention(s, state)
    if (reason) generated.push({ id: `gen-ship-${s.id}-${s.status}-${reason}`, at, type: 'shipment', title: 'Shipment update needed', description: `${s.reference} · ${reason}`, link: `/shipments/${s.id}` })
  })
  return [
    ...state.notifications.filter((n) => n.employeeId === empId),
    ...generated.map((n) => ({ ...n, read: read.has(n.id), generated: true })),
  ].sort((a, b) => b.at.localeCompare(a.at))
}
