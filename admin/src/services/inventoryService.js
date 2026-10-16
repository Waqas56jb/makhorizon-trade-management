import { movementDelta } from '../lib/calc'
import { todayISO } from '../lib/dates'
import { nextId } from '../lib/utils'
import { commit, pause, findOrThrow, getState, removeById, replaceById, ServiceError } from './base'

export const inventoryService = {
  /** Creates an item. A starting quantity is recorded as an opening "Received" movement. */
  async create(data) {
    await pause()
    const s = getState()
    if (s.inventory.some((i) => i.sku.toLowerCase() === data.sku.toLowerCase())) throw new ServiceError(`SKU ${data.sku} is already in use.`)
    const id = nextId('IT', s.inventory)
    const qty = Number(data.quantity) || 0
    const movement = qty > 0 ? [{ id: nextId('MV', s.movements), itemId: id, date: todayISO(), type: 'Received', quantity: qty, reason: 'Opening stock', reference: '' }] : []
    commit((st) => ({ ...st, inventory: [...st.inventory, { ...data, id, quantity: qty, createdAt: todayISO() }], movements: [...st.movements, ...movement] }), { message: `Inventory item ${data.name} added`, link: `/inventory/${id}` })
    return id
  },
  /** Quantity is never edited directly — use stock movements. */
  async update(id, data) {
    await pause()
    findOrThrow('inventory', id, 'Item')
    const s = getState()
    if (s.inventory.some((i) => i.id !== id && i.sku.toLowerCase() === data.sku.toLowerCase())) throw new ServiceError(`SKU ${data.sku} is already in use.`)
    // eslint-disable-next-line no-unused-vars
    const { quantity, ...rest } = data
    commit((st) => ({ ...st, inventory: replaceById(st.inventory, id, rest) }), { message: `Inventory item ${data.name} updated`, link: `/inventory/${id}` })
    return id
  },
  /**
   * Records a stock movement. Received adds, Issued subtracts, Adjustment is
   * signed. No movement may take stock below zero.
   */
  async recordMovement(itemId, movement) {
    await pause()
    const item = findOrThrow('inventory', itemId, 'Item')
    const m = { ...movement, quantity: Number(movement.quantity) }
    if (!Number.isFinite(m.quantity) || m.quantity === 0) throw new ServiceError('Quantity must be a non-zero number.')
    if (m.type !== 'Adjustment' && m.quantity < 0) throw new ServiceError('Use a positive quantity for received or issued stock.')
    const newQty = item.quantity + movementDelta(m)
    if (newQty < 0) throw new ServiceError(`Only ${item.quantity} ${item.unit} available. This movement would make stock negative.`)
    const s = getState()
    const record = { id: nextId('MV', s.movements), itemId, ...m }
    const verb = m.type === 'Received' ? 'received' : m.type === 'Issued' ? 'issued' : 'adjusted'
    commit((st) => ({ ...st, inventory: replaceById(st.inventory, itemId, { quantity: newQty }), movements: [...st.movements, record] }), {
      message: `Stock ${verb}: ${Math.abs(m.quantity)} ${item.unit} of ${item.name}`,
      link: `/inventory/${itemId}`,
    })
    return newQty
  },
  async remove(id) {
    await pause()
    const item = findOrThrow('inventory', id, 'Item')
    commit((s) => ({ ...s, inventory: removeById(s.inventory, id), movements: s.movements.filter((m) => m.itemId !== id) }), { message: `Inventory item ${item.name} deleted` })
    return true
  },
}
