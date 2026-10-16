import { useMemo } from 'react'
import { useAppState } from '../lib/store'

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))

/** Id → record maps for resolving relationships in tables and details. */
export default function useLookups() {
  const s = useAppState()
  return useMemo(
    () => ({
      clients: byId(s.clients),
      suppliers: byId(s.suppliers),
      quotations: byId(s.quotations),
      orders: byId(s.orders),
      shipments: byId(s.shipments),
      inventory: byId(s.inventory),
      invoices: byId(s.invoices),
      partners: byId(s.partners),
    }),
    [s.clients, s.suppliers, s.quotations, s.orders, s.shipments, s.inventory, s.invoices, s.partners],
  )
}

/** Label + link for a document's related record. */
export function relatedRecord(relatedType, relatedId, lk) {
  const map = {
    client: [lk.clients[relatedId]?.company, `/clients/${relatedId}`],
    supplier: [lk.suppliers[relatedId]?.company, `/suppliers/${relatedId}`],
    order: [lk.orders[relatedId]?.number, `/orders/${relatedId}`],
    shipment: [lk.shipments[relatedId]?.reference, `/shipments/${relatedId}`],
    partner: [lk.partners[relatedId]?.company, `/partners/${relatedId}`],
  }
  const [label, to] = map[relatedType] ?? []
  return label ? { label, to } : null
}
