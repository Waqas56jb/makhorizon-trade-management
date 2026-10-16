import { addDays, todayISO } from '../lib/dates'
import { movementDelta } from '../lib/calc'
import { clients } from './clients'
import { suppliers } from './suppliers'
import { quotations } from './quotations'
import { orders } from './orders'
import { shipments } from './shipments'
import { inventory, movements } from './inventory'
import { invoices, payments, records } from './finances'
import { documents } from './documents'
import { partners } from './partners'

export const DEMO_EMAIL = 'admin@makhorizon.demo'

export const defaultSettings = {
  company: {
    name: 'MAKHORIZON Logistics & Trade',
    ceo: 'Mako Mohamed Bouh',
    address: 'Salam Tower, 5th Floor, Djibouti',
    currency: 'DJF',
    description: 'Djibouti-based company focused on logistics coordination, import-export, supplier and buyer connections, and business partnerships.',
  },
  preferences: {
    defaultCurrency: 'DJF',
    dateFormat: 'D MMM YYYY',
    notify: { overdue: true, delayed: true, arriving: true, lowStock: true, expiring: true },
  },
  profile: { name: 'Mako Mohamed Bouh', email: DEMO_EMAIL, role: 'CEO / Administrator' },
  // Illustrative fixed conversion rates (DJF per unit). Not live exchange rates.
  rates: { USD: 177.72, EUR: 193.5 },
}

/** Builds a fresh demo dataset with dates relative to today. */
export function buildSeed() {
  const today = todayISO()
  const d = (days) => addDays(today, days)

  const items = inventory(d)
  const later = movements(d)
  // Opening balances make each item's movement history sum to its current quantity.
  const opening = items
    .map((item) => {
      const net = later.filter((m) => m.itemId === item.id).reduce((s, m) => s + movementDelta(m), 0)
      const qty = item.quantity - net
      return qty > 0 ? { itemId: item.id, date: d(-180), type: 'Received', quantity: qty, reason: 'Opening balance (demo data)', reference: 'OPENING' } : null
    })
    .filter(Boolean)
  const allMovements = [...opening, ...later]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m, i) => ({ id: `MV-${String(i + 1).padStart(3, '0')}`, ...m }))

  const pays = payments(d)
  const invs = invoices(d)
  // Payments are mirrored as income records so "recorded income" has one source.
  const paymentIncome = pays.map((p, i) => {
    const inv = invs.find((x) => x.id === p.invoiceId)
    return {
      id: `FR-P${String(i + 1).padStart(2, '0')}`,
      date: p.date,
      type: 'Income',
      category: 'Invoice Payment',
      description: `Payment for ${inv.number}`,
      clientId: inv.clientId,
      supplierId: '',
      amount: p.amount,
      currency: inv.currency,
      method: p.method,
      reference: p.reference,
      status: 'Received',
      notes: '',
      paymentId: p.id,
    }
  })

  const at = (days, time) => `${d(days)}T${time}`
  const activity = [
    { id: 'AC-008', at: at(-1, '16:20'), message: 'Invoice INV-2026-011 created for Sahel Commodities SARL', link: '/finances/invoices/IN-011', simulated: true },
    { id: 'AC-007', at: at(-2, '10:05'), message: 'Shipment SHP-2026-003 marked Ready for Dispatch', link: '/shipments/SH-003', simulated: true },
    { id: 'AC-006', at: at(-3, '09:40'), message: 'Quotation QT-2026-006 drafted for Gulf Coast Foods LLC', link: '/quotations/QT-006', simulated: true },
    { id: 'AC-005', at: at(-6, '14:12'), message: 'Stock issued: 12 cartons of assorted fasteners', link: '/inventory/IT-016', simulated: true },
    { id: 'AC-004', at: at(-7, '11:30'), message: 'Shipment SHP-2026-005 marked Delayed', link: '/shipments/SH-005', simulated: true },
    { id: 'AC-003', at: at(-9, '15:45'), message: 'Order ORD-2026-004 confirmed from QT-2026-009', link: '/orders/OR-004', simulated: true },
    { id: 'AC-002', at: at(-11, '08:55'), message: 'Shipment SHP-2026-004 departed Kochi', link: '/shipments/SH-004', simulated: true },
    { id: 'AC-001', at: at(-15, '13:10'), message: 'Payment of DJF 1,000,000 recorded on INV-2026-003', link: '/finances/invoices/IN-003', simulated: true },
  ]

  return {
    version: 1,
    seededOn: today,
    clients: clients(d),
    suppliers: suppliers(d),
    quotations: quotations(d),
    orders: orders(d),
    shipments: shipments(d),
    inventory: items,
    movements: allMovements,
    invoices: invs,
    payments: pays,
    records: [...records(d), ...paymentIncome],
    documents: documents(d),
    partners: partners(d),
    activity,
    readNotifications: [],
    settings: structuredClone(defaultSettings),
  }
}
