// Focused tests for calculation and rule helpers. Run with: npm test  (uses Node's built-in test runner)
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatCurrency, nextReference } from './format.js'
import { acceptsQuotations, calcQuotationTotals, canEditQuotation, canReviseQuotation, opportunityStatus, orderTotal } from './quotation.js'

test('quotation totals: subtotal, tax and additional costs', () => {
  assert.deepEqual(calcQuotationTotals({ unitPrice: 1.32, quantity: 48000, taxRate: 0, additionalCosts: 4200 }), { subtotal: 63360, tax: 0, additional: 4200, total: 67560 })
  assert.deepEqual(calcQuotationTotals({ unitPrice: 4200000, quantity: 3, taxRate: 10, additionalCosts: 350000 }), { subtotal: 12600000, tax: 1260000, additional: 350000, total: 14210000 })
})

test('quotation totals: decimals are rounded to cents', () => {
  const r = calcQuotationTotals({ unitPrice: 0.1, quantity: 3, taxRate: 7.5, additionalCosts: 0.005 })
  assert.equal(r.subtotal, 0.3)
  assert.equal(r.tax, 0.02)
  assert.equal(r.total, 0.33)
})

test('quotation totals: negative, empty and invalid values count as zero', () => {
  assert.deepEqual(calcQuotationTotals({ unitPrice: -5, quantity: 10, taxRate: -3, additionalCosts: -1 }), { subtotal: 0, tax: 0, additional: 0, total: 0 })
  assert.deepEqual(calcQuotationTotals({ unitPrice: '', quantity: 'abc' }), { subtotal: 0, tax: 0, additional: 0, total: 0 })
  assert.deepEqual(calcQuotationTotals(), { subtotal: 0, tax: 0, additional: 0, total: 0 })
})

test('order total sums item lines', () => {
  assert.equal(orderTotal({ items: [{ quantity: 12000, unitPrice: 1.38 }, { quantity: 12000, unitPrice: 1.26 }, { quantity: 300, unitPrice: 14.5 }] }), 36030)
})

test('opportunity status: closing soon, past closing date, closed and awarded', () => {
  const today = '2026-10-16'
  assert.equal(opportunityStatus({ status: 'Open', closingDate: '2026-11-30' }, today), 'Open')
  assert.equal(opportunityStatus({ status: 'Open', closingDate: '2026-10-20' }, today), 'Closing Soon')
  assert.equal(opportunityStatus({ status: 'Open', closingDate: '2026-10-15' }, today), 'Closed')
  assert.equal(opportunityStatus({ status: 'Awarded', closingDate: '2026-12-01' }, today), 'Awarded')
  assert.equal(acceptsQuotations({ status: 'Open', closingDate: '2026-10-20' }, today), true)
  assert.equal(acceptsQuotations({ status: 'Closed', closingDate: '2026-12-01' }, today), false)
})

test('quotation edit rules: only drafts are editable, only revision requests can be revised', () => {
  assert.equal(canEditQuotation({ status: 'Draft' }), true)
  for (const status of ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Expired']) assert.equal(canEditQuotation({ status }), false)
  assert.equal(canReviseQuotation({ status: 'Revision Requested' }), true)
  assert.equal(canReviseQuotation({ status: 'Accepted' }), false)
})

test('currency formatting follows the selected currency without conversion', () => {
  assert.equal(formatCurrency(1234.5, 'USD'), '$1,234.50')
  assert.equal(formatCurrency(1234.5, 'EUR'), '€1,234.50')
  assert.match(formatCurrency(14210000, 'DJF'), /^DJF\s14,210,000$/)
  assert.equal(formatCurrency(null, 'USD'), '—')
})

test('reference generation continues the highest number for the prefix', () => {
  assert.equal(nextReference('QUO', [{ id: 'QUO-2026-009' }, { id: 'QUO-2026-011' }, { id: 'ORD-2026-050' }], 2026), 'QUO-2026-012')
  assert.equal(nextReference('SUP', [], 2026), 'SUP-2026-001')
})
