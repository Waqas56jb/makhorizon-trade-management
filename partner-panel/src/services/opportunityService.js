import { todayISO } from '../lib/dates'
import { acceptsQuotations, opportunityStatus } from '../lib/quotation'
import { getState, pause, ServiceError } from './base'

/**
 * Opportunities are published by MAKHORIZON and visible to every approved partner.
 * Integration point: GET /api/opportunities, GET /api/opportunities/:id
 */
export async function getOpportunities() {
  await pause()
  const today = todayISO()
  return getState().opportunities.map((o) => ({ ...o, displayStatus: opportunityStatus(o, today) }))
}

export async function getOpportunityById(id) {
  await pause()
  const opp = getState().opportunities.find((o) => o.id === id)
  if (!opp) throw new ServiceError('Opportunity not found.')
  return { ...opp, displayStatus: opportunityStatus(opp, todayISO()) }
}

/** Used by quotation submission to enforce that the opportunity is still open. */
export function assertOpenOpportunity(id) {
  const opp = getState().opportunities.find((o) => o.id === id)
  if (!opp) throw new ServiceError('Please select an available opportunity.')
  if (!acceptsQuotations(opp, todayISO())) throw new ServiceError(`${opp.id} is no longer accepting quotations.`)
  return opp
}
