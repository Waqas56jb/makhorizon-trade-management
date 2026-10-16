import { supportCategories } from '../data/communications'
import { nextReference } from '../lib/format'
import { commit, currentUser, getState, nowStamp, own, pause, ServiceError } from './base'

/**
 * Support requests — DEMO ONLY. Requests are saved in this browser and are
 * NOT sent to MAKHORIZON. Integration point: POST /api/support-requests.
 */
export async function getSupportRequests() {
  await pause()
  return own(getState().supportRequests)
}

export async function createSupportRequest({ category, subject, description, reference }) {
  await pause(450)
  const user = currentUser()
  if (!supportCategories.includes(category)) throw new ServiceError('Select a category.')
  if (subject.trim().length < 4) throw new ServiceError('Please enter a subject.')
  if (description.trim().length < 15) throw new ServiceError('Please describe the request in at least 15 characters.')
  const id = nextReference('SUP', getState().supportRequests)
  const request = { id, partnerId: user.partnerId, category, subject: subject.trim(), description: description.trim(), reference: reference?.trim() ?? '', status: 'Recorded (demo)', createdAt: nowStamp(), createdBy: user.name }
  commit((s) => ({ ...s, supportRequests: [request, ...s.supportRequests] }), { message: `Demo support request ${id} recorded`, status: 'Recorded (demo)', link: '/help' })
  return request
}
