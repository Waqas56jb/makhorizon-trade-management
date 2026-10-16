// Orders and shipments — read access plus permitted operational updates.
import { staffOrderTransitions } from '../data/orders'
import { staffShipmentTransitions } from '../data/shipments'
import { todayISO } from '../lib/dates'
import { myOrders, myShipments } from '../lib/selectors'
import { assertAssigned, commit, currentEmployee, getState, nowStamp, pause, replaceById, ServiceError, uid } from './base'

// ---------------- Orders ----------------
const findOrder = (id) => assertAssigned(getState().orders.find((o) => o.id === id), 'Order')

export async function getMyOrders() {
  await pause()
  return myOrders(getState(), currentEmployee().id)
}

export async function getOrderById(id) {
  await pause()
  return findOrder(id)
}

/** Adds an operational note to an order (no commercial fields can change). */
export async function addOrderUpdate(id, text) {
  await pause()
  const order = findOrder(id)
  const clean = text.trim()
  if (!clean) throw new ServiceError('Update cannot be empty.')
  const at = nowStamp()
  const update = { id: uid('U'), at, by: currentEmployee().name, text: clean }
  commit((s) => ({ ...s, orders: replaceById(s.orders, id, { updates: [...order.updates, update], updatedAt: at }) }), { message: `Added an update to ${order.number}`, link: `/orders/${id}` })
  return update.id
}

/** Operational status change limited to staffOrderTransitions. */
export async function updateOrderStatus(id, status, note = '') {
  await pause()
  const order = findOrder(id)
  if (!staffOrderTransitions[order.status]?.includes(status)) throw new ServiceError(`Staff cannot change an order from ${order.status} to ${status}.`)
  const at = nowStamp()
  commit(
    (s) => ({ ...s, orders: replaceById(s.orders, id, { status, updatedAt: at, history: [...order.history, { at, status, by: currentEmployee().name, note: note.trim() }] }) }),
    { message: `Marked ${order.number} ${status}`, link: `/orders/${id}` },
  )
  return status
}

// ---------------- Shipments ----------------
const findShipment = (id) => assertAssigned(getState().shipments.find((x) => x.id === id), 'Shipment')

export async function getMyShipments() {
  await pause()
  return myShipments(getState(), currentEmployee().id)
}

export async function getShipmentById(id) {
  await pause()
  return findShipment(id)
}

/**
 * Records a permitted status update with previous/new status, time, employee
 * and note. Delays require a reason; Arrived/Delivered record today's date.
 */
export async function updateShipmentStatus(id, status, note = '') {
  await pause()
  const sh = findShipment(id)
  if (!staffShipmentTransitions[sh.status]?.includes(status)) throw new ServiceError(`A shipment that is ${sh.status} cannot be changed to ${status} by staff.`)
  if (status === 'Delayed' && !note.trim()) throw new ServiceError('Please give a short reason for the delay.')
  const patch = { status, events: [...sh.events, { at: nowStamp(), from: sh.status, to: status, by: currentEmployee().name, note: note.trim() }] }
  if ((status === 'Arrived' || status === 'Delivered') && !sh.actualArrival) patch.actualArrival = todayISO()
  commit((s) => ({ ...s, shipments: replaceById(s.shipments, id, patch) }), { message: `Updated ${sh.reference}: ${sh.status} → ${status}`, link: `/shipments/${id}` })
  return status
}

export async function addShipmentNote(id, text) {
  await pause()
  const sh = findShipment(id)
  const clean = text.trim()
  if (!clean) throw new ServiceError('Note cannot be empty.')
  const event = { at: nowStamp(), from: sh.status, to: sh.status, by: currentEmployee().name, note: clean, isNote: true }
  commit((s) => ({ ...s, shipments: replaceById(s.shipments, id, { events: [...sh.events, event] }) }), { message: `Added a note to ${sh.reference}`, link: `/shipments/${id}` })
  return true
}
