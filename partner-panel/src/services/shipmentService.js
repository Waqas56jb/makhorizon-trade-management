import { assertOwn, getState, own, pause } from './base'

/**
 * Shipment records maintained by the MAKHORIZON team — read-only for partners.
 * No live GPS or carrier integration exists. Integration points:
 * GET /api/shipments, GET /api/shipments/:id (later fed by logistics integrations).
 */
export async function getShipments() {
  await pause()
  return own(getState().shipments)
}

export async function getShipmentById(id) {
  await pause()
  return assertOwn(getState().shipments.find((s) => s.id === id), 'Shipment')
}
