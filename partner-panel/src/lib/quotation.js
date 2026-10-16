// Quotation and opportunity rules. Pure functions — unit-tested in quotation.test.js.

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100
const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * subtotal = unit price × quantity
 * tax      = subtotal × tax rate %
 * total    = subtotal + tax + additional costs
 * Negative or invalid inputs count as 0 (the form also rejects them).
 */
export function calcQuotationTotals({ unitPrice, quantity, taxRate, additionalCosts } = {}) {
  const subtotal = round2(num(unitPrice) * num(quantity))
  const tax = round2((subtotal * num(taxRate)) / 100)
  const additional = round2(num(additionalCosts))
  return { subtotal, tax, additional, total: round2(subtotal + tax + additional) }
}

export const orderTotal = (order) => round2(order.items.reduce((sum, i) => sum + num(i.quantity) * num(i.unitPrice), 0))

/** Status shown to partners. Open opportunities closing within 7 days show "Closing Soon". */
export function opportunityStatus(opp, today) {
  if (opp.status !== 'Open') return opp.status
  if (opp.closingDate && opp.closingDate < today) return 'Closed'
  if (opp.closingDate) {
    const days = Math.round((Date.parse(opp.closingDate) - Date.parse(today)) / 86400000)
    if (days <= 7) return 'Closing Soon'
  }
  return 'Open'
}

export const acceptsQuotations = (opp, today) => ['Open', 'Closing Soon'].includes(opportunityStatus(opp, today))

/** Partners can only change drafts, and resubmit after a revision request. Accepted / rejected / expired are locked. */
export const canEditQuotation = (q) => q.status === 'Draft'
export const canReviseQuotation = (q) => q.status === 'Revision Requested'

export const PENDING_QUOTATION_STATUSES = ['Submitted', 'Under Review', 'Revision Requested']
