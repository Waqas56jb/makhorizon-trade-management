import { documentTotals, invoiceOutstanding, invoicePaid } from '../lib/calc'
import { nextId, nextNumber } from '../lib/utils'
import { commit, pause, findOrThrow, getState, removeById, replaceById, ServiceError } from './base'

const money = (n, c) => `${c} ${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}`

export const financeService = {
  // -------- Income / expense records --------
  async createRecord(data) {
    await pause()
    const id = nextId('FR', getState().records.filter((r) => !r.paymentId))
    commit((s) => ({ ...s, records: [...s.records, { ...data, id }] }), { message: `${data.type} recorded: ${data.description}`, link: '/finances?tab=records' })
    return id
  },
  async updateRecord(id, data) {
    await pause()
    const r = findOrThrow('records', id, 'Record')
    if (r.paymentId) throw new ServiceError('This income record is linked to an invoice payment. Manage it from the invoice.')
    commit((s) => ({ ...s, records: replaceById(s.records, id, data) }), { message: `${data.type} record updated: ${data.description}`, link: '/finances?tab=records' })
    return id
  },
  async removeRecord(id) {
    await pause()
    const r = findOrThrow('records', id, 'Record')
    if (r.paymentId) throw new ServiceError('This income record is linked to an invoice payment. Remove the payment from the invoice instead.')
    commit((s) => ({ ...s, records: removeById(s.records, id) }), { message: `${r.type} record deleted: ${r.description}` })
    return true
  },

  // -------- Invoices --------
  async createInvoice(data) {
    await pause()
    const s = getState()
    const id = nextId('IN', s.invoices)
    const number = nextNumber('INV', s.invoices)
    commit((st) => ({ ...st, invoices: [...st.invoices, { ...data, id, number }] }), { message: `Invoice ${number} created`, link: `/finances/invoices/${id}` })
    return id
  },
  async updateInvoice(id, data) {
    await pause()
    const inv = findOrThrow('invoices', id, 'Invoice')
    const paid = invoicePaid(inv, getState().payments)
    if (documentTotals(data).total < paid) throw new ServiceError(`The new total is less than the ${money(paid, inv.currency)} already paid.`)
    if (paid > 0 && data.currency !== inv.currency) throw new ServiceError('Currency cannot change after payments are recorded.')
    commit((s) => ({ ...s, invoices: replaceById(s.invoices, id, data) }), { message: `Invoice ${inv.number} updated`, link: `/finances/invoices/${id}` })
    return id
  },
  async setInvoiceStatus(id, status) {
    await pause()
    const inv = findOrThrow('invoices', id, 'Invoice')
    if (status === 'Draft' && invoicePaid(inv, getState().payments) > 0) throw new ServiceError('An invoice with payments cannot return to Draft.')
    commit((s) => ({ ...s, invoices: replaceById(s.invoices, id, { status }) }), { message: `Invoice ${inv.number} marked ${status === 'Unpaid' ? 'as issued' : status}`, link: `/finances/invoices/${id}` })
    return id
  },
  async removeInvoice(id) {
    await pause()
    const inv = findOrThrow('invoices', id, 'Invoice')
    if (getState().payments.some((p) => p.invoiceId === id)) throw new ServiceError(`Invoice ${inv.number} has recorded payments. Cancel it instead of deleting.`)
    commit((s) => ({ ...s, invoices: removeById(s.invoices, id) }), { message: `Invoice ${inv.number} deleted` })
    return true
  },

  // -------- Payments --------
  /** Records a payment; it may not exceed the outstanding balance. Also creates the linked income record. */
  async recordPayment(invoiceId, { date, amount, method, reference }) {
    await pause()
    const s = getState()
    const inv = findOrThrow('invoices', invoiceId, 'Invoice')
    if (inv.status === 'Cancelled') throw new ServiceError('Payments cannot be recorded on a cancelled invoice.')
    if (inv.status === 'Draft') throw new ServiceError('Issue the invoice before recording payments.')
    const amt = Math.round(Number(amount) * 100) / 100
    const outstanding = invoiceOutstanding(inv, s.payments)
    if (!(amt > 0)) throw new ServiceError('Payment amount must be greater than zero.')
    if (amt > outstanding + 0.001) throw new ServiceError(`Payment exceeds the outstanding balance of ${money(outstanding, inv.currency)}.`)
    const id = nextId('PY', s.payments)
    const payment = { id, invoiceId, date, amount: amt, method, reference }
    const income = {
      id: `FR-P${id.slice(3)}`,
      date,
      type: 'Income',
      category: 'Invoice Payment',
      description: `Payment for ${inv.number}`,
      clientId: inv.clientId,
      supplierId: '',
      amount: amt,
      currency: inv.currency,
      method,
      reference,
      status: 'Received',
      notes: '',
      paymentId: id,
    }
    commit((st) => ({ ...st, payments: [...st.payments, payment], records: [...st.records, income] }), { message: `Payment of ${money(amt, inv.currency)} recorded on ${inv.number}`, link: `/finances/invoices/${invoiceId}` })
    return id
  },
  async removePayment(paymentId) {
    await pause()
    const p = findOrThrow('payments', paymentId, 'Payment')
    const inv = findOrThrow('invoices', p.invoiceId, 'Invoice')
    commit((s) => ({ ...s, payments: removeById(s.payments, paymentId), records: s.records.filter((r) => r.paymentId !== paymentId) }), { message: `Payment removed from ${inv.number}`, link: `/finances/invoices/${inv.id}` })
    return true
  },
}
