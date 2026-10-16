// Quotations, orders and shipments.
import { todayISO } from '../lib/dates'
import { nextId, nextNumber } from '../lib/utils'
import { commit, pause, findOrThrow, getState, relatedMessage, removeById, replaceById, ServiceError } from './base'

// ---------------- Quotations ----------------
export const quotationService = {
  async create(data) {
    await pause()
    const s = getState()
    const id = nextId('QT', s.quotations)
    const number = nextNumber('QT', s.quotations)
    commit((st) => ({ ...st, quotations: [...st.quotations, { ...data, id, number }] }), { message: `Quotation ${number} created`, link: `/quotations/${id}` })
    return id
  },
  async update(id, data) {
    await pause()
    const q = findOrThrow('quotations', id, 'Quotation')
    commit((s) => ({ ...s, quotations: replaceById(s.quotations, id, data) }), { message: `Quotation ${q.number} updated`, link: `/quotations/${id}` })
    return id
  },
  async setStatus(id, status) {
    await pause()
    const q = findOrThrow('quotations', id, 'Quotation')
    commit((s) => ({ ...s, quotations: replaceById(s.quotations, id, { status }) }), { message: `Quotation ${q.number} marked ${status}`, link: `/quotations/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const s = getState()
    const q = findOrThrow('quotations', id, 'Quotation')
    const blocked = relatedMessage(`Quotation ${q.number}`, [[s.orders.filter((o) => o.quotationId === id).length, 'linked order']])
    if (blocked) throw new ServiceError(blocked)
    commit((st) => ({ ...st, quotations: removeById(st.quotations, id) }), { message: `Quotation ${q.number} deleted` })
    return true
  },
}

// ---------------- Orders ----------------
export const orderService = {
  async create(data) {
    await pause()
    const s = getState()
    const id = nextId('OR', s.orders)
    const number = nextNumber('ORD', s.orders)
    const quote = data.quotationId ? s.quotations.find((q) => q.id === data.quotationId) : null
    const history = [{ date: todayISO(), status: data.status, note: quote ? `Created from ${quote.number}` : 'Order created' }]
    commit((st) => ({ ...st, orders: [...st.orders, { ...data, id, number, history }] }), { message: `Order ${number} created`, link: `/orders/${id}` })
    return id
  },
  async update(id, data) {
    await pause()
    const o = findOrThrow('orders', id, 'Order')
    const history = data.status !== o.status ? [...o.history, { date: todayISO(), status: data.status, note: 'Status changed while editing' }] : o.history
    commit((s) => ({ ...s, orders: replaceById(s.orders, id, { ...data, history }) }), { message: `Order ${o.number} updated`, link: `/orders/${id}` })
    return id
  },
  async setStatus(id, status, note = '') {
    await pause()
    const o = findOrThrow('orders', id, 'Order')
    if (o.status === status) throw new ServiceError(`Order is already ${status}.`)
    commit((s) => ({ ...s, orders: replaceById(s.orders, id, { status, history: [...o.history, { date: todayISO(), status, note }] }) }), { message: `Order ${o.number} marked ${status}`, link: `/orders/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const s = getState()
    const o = findOrThrow('orders', id, 'Order')
    const blocked = relatedMessage(`Order ${o.number}`, [
      [s.shipments.filter((x) => x.orderId === id).length, 'shipment'],
      [s.invoices.filter((x) => x.orderId === id).length, 'invoice'],
    ])
    if (blocked) throw new ServiceError(`${blocked} Cancel the order instead.`)
    commit((st) => ({ ...st, orders: removeById(st.orders, id) }), { message: `Order ${o.number} deleted` })
    return true
  },
}

// ---------------- Shipments ----------------
export const shipmentService = {
  async create(data) {
    await pause()
    const s = getState()
    if (!s.orders.some((o) => o.id === data.orderId)) throw new ServiceError('Please select an existing order.')
    const id = nextId('SH', s.shipments)
    const reference = data.reference?.trim() || nextNumber('SHP', s.shipments, 'reference')
    if (s.shipments.some((x) => x.reference === reference)) throw new ServiceError(`Reference ${reference} is already used.`)
    const history = [{ date: todayISO(), status: data.status, note: 'Shipment created' }]
    commit((st) => ({ ...st, shipments: [...st.shipments, { ...data, id, reference, history }] }), { message: `Shipment ${reference} created`, link: `/shipments/${id}` })
    return id
  },
  async update(id, data) {
    await pause()
    const sh = findOrThrow('shipments', id, 'Shipment')
    const s = getState()
    if (data.reference && s.shipments.some((x) => x.reference === data.reference && x.id !== id)) throw new ServiceError(`Reference ${data.reference} is already used.`)
    const history = data.status !== sh.status ? [...sh.history, { date: todayISO(), status: data.status, note: 'Status changed while editing' }] : sh.history
    commit((st) => ({ ...st, shipments: replaceById(st.shipments, id, { ...data, history }) }), { message: `Shipment ${sh.reference} updated`, link: `/shipments/${id}` })
    return id
  },
  /** Status change with optional note; Arrived/Delivered records the actual date if missing. */
  async updateStatus(id, status, note = '') {
    await pause()
    const sh = findOrThrow('shipments', id, 'Shipment')
    const patch = { status, history: [...sh.history, { date: todayISO(), status, note }] }
    if ((status === 'Arrived' || status === 'Delivered') && !sh.actualArrival) patch.actualArrival = todayISO()
    commit((s) => ({ ...s, shipments: replaceById(s.shipments, id, patch) }), { message: `Shipment ${sh.reference} marked ${status}`, link: `/shipments/${id}` })
    return id
  },
  async addNote(id, note) {
    await pause()
    const sh = findOrThrow('shipments', id, 'Shipment')
    commit((s) => ({ ...s, shipments: replaceById(s.shipments, id, { history: [...sh.history, { date: todayISO(), status: sh.status, note, isNote: true }] }) }), { message: `Note added to shipment ${sh.reference}`, link: `/shipments/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const sh = findOrThrow('shipments', id, 'Shipment')
    commit((s) => ({ ...s, shipments: removeById(s.shipments, id) }), { message: `Shipment ${sh.reference} deleted` })
    return true
  },
}
