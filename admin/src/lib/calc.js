// Business rules. Every screen derives figures from these functions so that
// the dashboard, module pages and reports never disagree.
import { daysBetween, todayISO } from './dates'

export const CURRENCIES = ['DJF', 'USD', 'EUR']

const round2 = (n) => Math.round(n * 100) / 100

/** Convert to the primary currency using the illustrative rates in Settings (DJF per unit). */
export function toPrimary(amount, currency, settings) {
  const primary = settings.company.currency
  if (!amount) return 0
  if (currency === primary) return amount
  const rates = settings.rates // DJF per 1 unit of currency
  const inDJF = currency === 'DJF' ? amount : amount * (rates[currency] ?? 0)
  return primary === 'DJF' ? inDJF : inDJF / (rates[primary] || 1)
}

// ---------- Line-item documents (quotations, invoices) ----------
export function lineTotal(item) {
  return round2((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))
}

export function documentTotals(doc) {
  const subtotal = round2((doc.items ?? []).reduce((s, i) => s + lineTotal(i), 0))
  const tax = round2((subtotal * (Number(doc.taxRate) || 0)) / 100)
  const charge = round2(Number(doc.additionalCharge) || 0)
  return { subtotal, tax, charge, total: round2(subtotal + tax + charge) }
}

// ---------- Quotations ----------
/** A sent or draft quotation past its expiry date is shown as Expired. */
export function quotationStatus(q) {
  if ((q.status === 'Sent' || q.status === 'Draft') && q.expiryDate < todayISO()) return 'Expired'
  return q.status
}

// ---------- Invoices ----------
export function invoicePaid(invoice, payments) {
  return round2(payments.filter((p) => p.invoiceId === invoice.id).reduce((s, p) => s + Number(p.amount), 0))
}

export function invoiceOutstanding(invoice, payments) {
  if (invoice.status === 'Cancelled' || invoice.status === 'Draft') return 0
  return Math.max(0, round2(documentTotals(invoice).total - invoicePaid(invoice, payments)))
}

/**
 * Stored status is Draft, Unpaid or Cancelled. Paid, Partially Paid and
 * Overdue are derived from payments and the due date.
 */
export function invoiceStatus(invoice, payments) {
  if (invoice.status === 'Cancelled') return 'Cancelled'
  if (invoice.status === 'Draft') return 'Draft'
  const total = documentTotals(invoice).total
  const paid = invoicePaid(invoice, payments)
  if (paid >= total && total > 0) return 'Paid'
  if (invoice.dueDate < todayISO()) return 'Overdue'
  if (paid > 0) return 'Partially Paid'
  return 'Unpaid'
}

// ---------- Inventory ----------
export function stockStatus(item) {
  if (item.quantity <= 0) return 'Out of Stock'
  if (item.quantity <= item.minStock) return 'Low Stock'
  return 'In Stock'
}

/** Signed change a movement applies to stock. */
export function movementDelta(m) {
  if (m.type === 'Received') return Math.abs(m.quantity)
  if (m.type === 'Issued') return -Math.abs(m.quantity)
  return m.quantity // Adjustment is signed
}

// ---------- Relationships ----------
export function clientOutstanding(clientId, state) {
  return state.invoices
    .filter((i) => i.clientId === clientId)
    .reduce((s, i) => s + toPrimary(invoiceOutstanding(i, state.payments), i.currency, state.settings), 0)
}

export function supplierPayable(supplierId, state) {
  return state.records
    .filter((r) => r.supplierId === supplierId && r.type === 'Expense' && r.status === 'Pending')
    .reduce((s, r) => s + toPrimary(r.amount, r.currency, state.settings), 0)
}

// ---------- Finance summaries ----------
export function financeSummary(state, records = state.records) {
  const sum = (type, status) =>
    records
      .filter((r) => r.type === type && (status ? r.status === status : r.status !== 'Pending'))
      .reduce((s, r) => s + toPrimary(r.amount, r.currency, state.settings), 0)
  const income = sum('Income')
  const expenses = sum('Expense')
  const receivables = state.invoices.reduce(
    (s, i) => s + toPrimary(invoiceOutstanding(i, state.payments), i.currency, state.settings),
    0,
  )
  const payables = sum('Expense', 'Pending')
  return { income, expenses, net: income - expenses, receivables, payables }
}

export const isOverdueBy = (iso) => Math.max(0, daysBetween(iso, todayISO()))
