import { assertOwn, commit, currentUser, getState, nowStamp, own, pause, replaceById, ServiceError, uid } from './base'

/**
 * Orders issued by MAKHORIZON to the partner. Partners can confirm an order
 * awaiting confirmation and add notes or clarification requests. They cannot
 * change amounts, terms or internal statuses.
 * Integration points: GET /api/orders, GET /api/orders/:id,
 * POST /api/orders/:id/confirm, POST /api/orders/:id/notes.
 */
export async function getOrders() {
  await pause()
  return own(getState().orders)
}

export async function getOrderById(id) {
  await pause()
  return assertOwn(getState().orders.find((o) => o.id === id), 'Order')
}

export async function confirmOrder(id) {
  await pause(450)
  const user = currentUser()
  const order = assertOwn(getState().orders.find((o) => o.id === id), 'Order')
  if (order.status !== 'Awaiting Confirmation') throw new ServiceError('Only orders awaiting confirmation can be confirmed.')
  const stamp = nowStamp()
  commit(
    (s) => ({ ...s, orders: replaceById(s.orders, id, (o) => ({ status: 'Confirmed', confirmedAt: stamp, history: [...o.history, { at: stamp, status: 'Confirmed', note: `Confirmed by ${user.name}` }] })) }),
    { message: `Order ${id} confirmed`, status: 'Confirmed', link: `/orders/${id}` },
  )
}

/**
 * Adds a note to the order. A clarification request is also posted to the
 * related conversation (or starts one with the Operations Team), so it is
 * visible in Messages. No message leaves the browser.
 */
export async function addOrderNote(id, message, type = 'note') {
  await pause()
  const user = currentUser()
  const order = assertOwn(getState().orders.find((o) => o.id === id), 'Order')
  const text = message.trim()
  if (text.length < 3) throw new ServiceError('Please enter a message of at least 3 characters.')
  const stamp = nowStamp()
  const note = { id: uid('ON'), at: stamp, author: 'partner', by: user.name, message: text, type }

  commit(
    (s) => {
      let conversations = s.conversations
      if (type === 'clarification') {
        const body = `Clarification request for ${order.id}: ${text}`
        const msg = { id: uid('MS'), at: stamp, from: 'partner', senderName: user.name, body }
        const existing = conversations.find((c) => c.partnerId === user.partnerId && c.related?.kind === 'order' && c.related.id === order.id)
        conversations = existing
          ? replaceById(conversations, existing.id, (c) => ({ messages: [...c.messages, msg] }))
          : [{ id: uid('CV'), partnerId: user.partnerId, contact: 'Operations Team', department: 'Logistics operations', related: { kind: 'order', id: order.id }, unread: 0, messages: [msg] }, ...conversations]
      }
      return { ...s, conversations, orders: replaceById(s.orders, id, (o) => ({ notes: [...o.notes, note] })) }
    },
    { message: type === 'clarification' ? `Clarification requested on ${id}` : `Note added to ${id}`, status: order.status, link: `/orders/${id}` },
  )
  return note
}
