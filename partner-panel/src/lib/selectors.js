import { ACTIVE_ORDER_STATUSES } from '../data/orders'
import { defaultSettings } from '../data/seed'
import { opportunityStatus, PENDING_QUOTATION_STATUSES } from './quotation'

const byDateDesc = (field) => (a, b) => String(b[field] ?? '').localeCompare(String(a[field] ?? ''))
export const lastMessage = (c) => c.messages[c.messages.length - 1]

/**
 * Everything the signed-in partner may see, derived from the demo store.
 * In production the backend returns only the partner's own records; this
 * filtering mirrors that for the demo and is not a security control.
 */
export function selectPartnerData(s, userId, today) {
  const user = s.users.find((u) => u.id === userId) ?? null
  const pid = user?.partnerId
  const mine = (list) => list.filter((x) => x.partnerId === pid)

  const opportunities = s.opportunities.map((o) => ({ ...o, displayStatus: opportunityStatus(o, today) }))
  const quotations = mine(s.quotations).sort(byDateDesc('updatedAt'))
  const orders = mine(s.orders).sort(byDateDesc('orderDate'))
  const shipments = mine(s.shipments).sort(byDateDesc('dispatchDate'))
  const documents = mine(s.documents)
  const conversations = mine(s.conversations).sort((a, b) => String(lastMessage(b)?.at).localeCompare(String(lastMessage(a)?.at)))
  const notifications = mine(s.notifications).sort(byDateDesc('at'))
  const activity = mine(s.activity).sort(byDateDesc('at'))

  const unreadMessages = conversations.reduce((n, c) => n + (c.unread || 0), 0)
  const unreadNotifications = notifications.filter((n) => !n.read).length

  const drafts = quotations.filter((q) => q.status === 'Draft')
  const revisions = quotations.filter((q) => q.status === 'Revision Requested')
  const requestedDocs = documents.filter((d) => ['Requested', 'Revision Required'].includes(d.status))
  const toConfirm = orders.filter((o) => o.status === 'Awaiting Confirmation')

  const pendingActions = [
    ...revisions.map((q) => ({ id: q.id, kind: 'Quotation', label: `Revise ${q.id}`, description: 'MAKHORIZON requested a revision', to: `/quotations/${q.id}`, tone: 'warning' })),
    ...drafts.map((q) => ({ id: q.id, kind: 'Quotation', label: `Submit draft ${q.id}`, description: q.title, to: `/quotations/${q.id}`, tone: 'neutral' })),
    ...requestedDocs.map((d) => ({ id: d.id, kind: 'Document', label: d.status === 'Requested' ? `Provide: ${d.name}` : `Resubmit: ${d.name}`, description: d.status === 'Requested' ? 'Requested by MAKHORIZON' : 'Revision required', to: `/documents?doc=${d.id}`, tone: d.status === 'Requested' ? 'warning' : 'danger' })),
    ...toConfirm.map((o) => ({ id: o.id, kind: 'Order', label: `Confirm ${o.id}`, description: o.title, to: `/orders/${o.id}`, tone: 'info' })),
    ...(unreadMessages ? [{ id: 'messages', kind: 'Messages', label: `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`, description: 'From the MAKHORIZON team', to: '/messages', tone: 'gold' }] : []),
  ]

  return {
    user,
    partner: s.partners.find((p) => p.id === pid) ?? null,
    settings: s.settings[userId] ?? defaultSettings(user),
    opportunities,
    quotations,
    orders,
    shipments,
    documents,
    conversations,
    notifications,
    activity,
    supportRequests: mine(s.supportRequests),
    team: mine(s.users),
    unreadMessages,
    unreadNotifications,
    pendingActions,
    kpis: {
      activeOrders: orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length,
      pendingQuotations: quotations.filter((q) => PENDING_QUOTATION_STATUSES.includes(q.status)).length,
      activeShipments: shipments.filter((x) => x.status !== 'Delivered').length,
      openRequests: revisions.length + requestedDocs.length + toConfirm.length,
      revisions: revisions.length,
      toConfirm: toConfirm.length,
      requestedDocs: requestedDocs.length,
      delayed: shipments.filter((x) => x.status === 'Delayed').length,
    },
  }
}

/** Human label + link for a document/conversation "related" reference. */
export function relatedInfo(related, data) {
  if (!related) return null
  switch (related.kind) {
    case 'order': {
      const o = data.orders.find((x) => x.id === related.id)
      return { label: `Order ${related.id}`, short: related.id, title: o?.title, to: `/orders/${related.id}` }
    }
    case 'shipment':
      return { label: `Shipment ${related.id}`, short: related.id, to: `/shipments/${related.id}` }
    case 'quotation': {
      const q = data.quotations.find((x) => x.id === related.id)
      return { label: `Quotation ${related.id}`, short: related.id, title: q?.title, to: `/quotations/${related.id}` }
    }
    case 'company':
      return { label: 'Company record', short: 'Company', to: '/company-profile' }
    default:
      return null
  }
}

/** Options for "related record": company, quotations, orders and shipments of this partner. */
export function relatedOptions(data) {
  return [
    { value: `company:${data.partner?.id}`, label: `Company record — ${data.partner?.companyName}` },
    ...data.quotations.map((q) => ({ value: `quotation:${q.id}`, label: `Quotation ${q.id} — ${q.title}` })),
    ...data.orders.map((o) => ({ value: `order:${o.id}`, label: `Order ${o.id} — ${o.title}` })),
    ...data.shipments.map((s) => ({ value: `shipment:${s.id}`, label: `Shipment ${s.id} — ${s.origin} → ${s.destination}` })),
  ]
}
