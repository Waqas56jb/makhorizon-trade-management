// Aggregations shared by the dashboard and reports.
import { orderStatuses } from '../data/orders'
import { shipmentStatuses } from '../data/shipments'
import { invoiceOutstanding, invoiceStatus, quotationStatus, toPrimary } from './calc'
import { daysBetween, monthKey, monthLabel, todayISO } from './dates'

/** Income vs expenses per month (primary currency). Pending records are excluded. */
export function monthlyIncomeExpense(state, months, records = state.records) {
  const rows = months.map((m) => ({ month: m, label: monthLabel(m), income: 0, expenses: 0 }))
  const idx = Object.fromEntries(months.map((m, i) => [m, i]))
  records.forEach((r) => {
    const i = idx[monthKey(r.date)]
    if (i === undefined || r.status === 'Pending') return
    const v = toPrimary(r.amount, r.currency, state.settings)
    if (r.type === 'Income') rows[i].income += v
    else rows[i].expenses += v
  })
  return rows.map((r) => ({ ...r, income: Math.round(r.income), expenses: Math.round(r.expenses) }))
}

export const countBy = (list, statuses, get = (x) => x.status) => statuses.map((name) => ({ name, count: list.filter((x) => get(x) === name).length }))

export const ordersByStatus = (orders) => countBy(orders, orderStatuses)
export const shipmentsByStatus = (shipments) => countBy(shipments, shipmentStatuses)

/** Dated items needing attention: payments due, arrivals, quotation expiries. */
export function upcomingDeadlines(state, horizonDays = 30) {
  const today = todayISO()
  const client = (id) => state.clients.find((c) => c.id === id)?.company ?? ''
  const within = (iso) => daysBetween(today, iso) <= horizonDays
  const list = []

  state.invoices.forEach((inv) => {
    const st = invoiceStatus(inv, state.payments)
    if (['Unpaid', 'Partially Paid', 'Overdue'].includes(st) && within(inv.dueDate)) {
      list.push({ id: `inv-${inv.id}`, date: inv.dueDate, kind: 'Payment due', title: `${inv.number} · ${client(inv.clientId)}`, amount: invoiceOutstanding(inv, state.payments), currency: inv.currency, overdue: st === 'Overdue', to: `/finances/invoices/${inv.id}` })
    }
  })
  state.shipments.forEach((s) => {
    if (['Planned', 'Ready for Dispatch', 'In Transit', 'Delayed'].includes(s.status) && s.expectedArrival && within(s.expectedArrival)) {
      list.push({ id: `sh-${s.id}`, date: s.expectedArrival, kind: s.status === 'Delayed' ? 'Delayed arrival' : 'Expected arrival', title: `${s.reference} · ${s.destination}`, overdue: s.status === 'Delayed' || s.expectedArrival < today, to: `/shipments/${s.id}` })
    }
  })
  state.quotations.forEach((q) => {
    if (quotationStatus(q) === 'Sent' && within(q.expiryDate)) {
      list.push({ id: `qt-${q.id}`, date: q.expiryDate, kind: 'Quotation expiry', title: `${q.number} · ${client(q.clientId)}`, overdue: false, to: `/quotations/${q.id}` })
    }
  })
  return list.sort((a, b) => a.date.localeCompare(b.date))
}

export const inRange = (iso, from, to) => (!from || iso >= from) && (!to || iso <= to)

export function outstandingInvoices(state) {
  return state.invoices
    .map((inv) => ({ inv, status: invoiceStatus(inv, state.payments), outstanding: invoiceOutstanding(inv, state.payments) }))
    .filter((x) => x.outstanding > 0)
    .sort((a, b) => a.inv.dueDate.localeCompare(b.inv.dueDate))
}
