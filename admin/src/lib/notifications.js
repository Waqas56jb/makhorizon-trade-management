import { quotationStatus, invoiceOutstanding, invoiceStatus, stockStatus } from './calc'
import { daysBetween, relativeDays, todayISO } from './dates'

/**
 * Notifications are generated from the current data (no messaging services).
 * Ids are deterministic so read state survives re-computation.
 */
export function computeNotifications(state) {
  const today = todayISO()
  const prefs = state.settings.preferences.notify
  const clientName = (id) => state.clients.find((c) => c.id === id)?.company ?? 'Unknown client'
  const list = []

  if (prefs.overdue) {
    state.invoices.forEach((inv) => {
      if (invoiceStatus(inv, state.payments) === 'Overdue' && invoiceOutstanding(inv, state.payments) > 0) {
        list.push({ id: `overdue-${inv.id}-${inv.dueDate}`, kind: 'overdue', severity: 'danger', title: `Invoice ${inv.number} is overdue`, message: `${clientName(inv.clientId)} · due ${relativeDays(inv.dueDate)}`, link: `/finances/invoices/${inv.id}`, date: inv.dueDate })
      }
    })
  }
  if (prefs.delayed) {
    state.shipments
      .filter((s) => s.status === 'Delayed')
      .forEach((s) => list.push({ id: `delayed-${s.id}`, kind: 'delayed', severity: 'warning', title: `Shipment ${s.reference} is delayed`, message: `${s.origin} → ${s.destination}`, link: `/shipments/${s.id}`, date: s.expectedArrival }))
  }
  if (prefs.arriving) {
    state.shipments
      .filter((s) => ['In Transit', 'Ready for Dispatch'].includes(s.status) && s.expectedArrival >= today && daysBetween(today, s.expectedArrival) <= 7)
      .forEach((s) => list.push({ id: `arriving-${s.id}-${s.expectedArrival}`, kind: 'arriving', severity: 'info', title: `Shipment ${s.reference} expected soon`, message: `Expected arrival ${relativeDays(s.expectedArrival)}`, link: `/shipments/${s.id}`, date: s.expectedArrival }))
  }
  if (prefs.lowStock) {
    state.inventory.forEach((item) => {
      const st = stockStatus(item)
      if (st !== 'In Stock') {
        list.push({ id: `stock-${item.id}-${st}`, kind: 'lowStock', severity: st === 'Out of Stock' ? 'danger' : 'warning', title: `${item.name}: ${st.toLowerCase()}`, message: `${item.quantity} ${item.unit} available (minimum ${item.minStock})`, link: `/inventory/${item.id}`, date: today })
      }
    })
  }
  if (prefs.expiring) {
    state.quotations
      .filter((q) => quotationStatus(q) === 'Sent' && daysBetween(today, q.expiryDate) <= 7)
      .forEach((q) => list.push({ id: `expiring-${q.id}-${q.expiryDate}`, kind: 'expiring', severity: 'warning', title: `Quotation ${q.number} expires ${relativeDays(q.expiryDate)}`, message: clientName(q.clientId), link: `/quotations/${q.id}`, date: q.expiryDate }))
  }

  const read = new Set(state.readNotifications)
  return list.map((n) => ({ ...n, read: read.has(n.id) }))
}
