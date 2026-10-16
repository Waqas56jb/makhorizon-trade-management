// Clients, suppliers and partners.
import { todayISO } from '../lib/dates'
import { nextId } from '../lib/utils'
import { commit, pause, findOrThrow, getState, relatedMessage, removeById, replaceById, ServiceError } from './base'

// ---------------- Clients ----------------
export const clientService = {
  async create(data) {
    await pause()
    const id = nextId('CL', getState().clients)
    commit((s) => ({ ...s, clients: [...s.clients, { ...data, id, createdAt: todayISO() }] }), { message: `Client ${data.company} added`, link: `/clients/${id}` })
    return id
  },
  async update(id, data) {
    await pause()
    findOrThrow('clients', id, 'Client')
    commit((s) => ({ ...s, clients: replaceById(s.clients, id, data) }), { message: `Client ${data.company} updated`, link: `/clients/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const s = getState()
    const client = findOrThrow('clients', id, 'Client')
    const blocked = relatedMessage(client.company, [
      [s.orders.filter((o) => o.clientId === id).length, 'order'],
      [s.invoices.filter((i) => i.clientId === id).length, 'invoice'],
      [s.quotations.filter((q) => q.clientId === id).length, 'quotation'],
    ])
    if (blocked) throw new ServiceError(`${blocked} Mark the client as Inactive instead.`)
    commit((st) => ({ ...st, clients: removeById(st.clients, id) }), { message: `Client ${client.company} deleted` })
    return true
  },
}

// ---------------- Suppliers ----------------
export const supplierService = {
  async create(data) {
    await pause()
    const id = nextId('SP', getState().suppliers)
    commit((s) => ({ ...s, suppliers: [...s.suppliers, { ...data, id, createdAt: todayISO() }] }), { message: `Supplier ${data.company} added`, link: `/suppliers/${id}` })
    return id
  },
  async update(id, data) {
    await pause()
    findOrThrow('suppliers', id, 'Supplier')
    commit((s) => ({ ...s, suppliers: replaceById(s.suppliers, id, data) }), { message: `Supplier ${data.company} updated`, link: `/suppliers/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const s = getState()
    const sup = findOrThrow('suppliers', id, 'Supplier')
    const blocked = relatedMessage(sup.company, [
      [s.inventory.filter((i) => i.supplierId === id).length, 'inventory item'],
      [s.records.filter((r) => r.supplierId === id).length, 'financial record'],
    ])
    if (blocked) throw new ServiceError(`${blocked} Mark the supplier as Inactive instead.`)
    commit((st) => ({ ...st, suppliers: removeById(st.suppliers, id) }), { message: `Supplier ${sup.company} deleted` })
    return true
  },
}

// ---------------- Partners ----------------
export const partnerService = {
  async create(data) {
    await pause()
    const id = nextId('PT', getState().partners)
    commit((s) => ({ ...s, partners: [...s.partners, { ...data, id, createdAt: todayISO(), opportunities: [] }] }), { message: `Partner ${data.company} added`, link: `/partners/${id}` })
    return id
  },
  async update(id, data) {
    await pause()
    findOrThrow('partners', id, 'Partner')
    commit((s) => ({ ...s, partners: replaceById(s.partners, id, data) }), { message: `Partner ${data.company} updated`, link: `/partners/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const p = findOrThrow('partners', id, 'Partner')
    commit((s) => ({ ...s, partners: removeById(s.partners, id) }), { message: `Partner ${p.company} deleted` })
    return true
  },
  async addOpportunity(id, { title, note, date }) {
    await pause()
    const p = findOrThrow('partners', id, 'Partner')
    const opp = { id: `OP-${Date.now().toString(36)}`, title, note, date }
    commit((s) => ({ ...s, partners: replaceById(s.partners, id, { opportunities: [opp, ...p.opportunities] }) }), { message: `Opportunity added for ${p.company}`, link: `/partners/${id}` })
    return opp.id
  },
  async removeOpportunity(id, oppId) {
    await pause()
    const p = findOrThrow('partners', id, 'Partner')
    commit((s) => ({ ...s, partners: replaceById(s.partners, id, { opportunities: p.opportunities.filter((o) => o.id !== oppId) }) }))
    return true
  },
}
