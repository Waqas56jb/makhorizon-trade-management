import { commit, currentPartnerId, getState, pause, replaceById, ServiceError } from './base'

/**
 * The partner's own company profile. MAKHORIZON's identity is never editable here.
 * Changes are saved to the demo store in this browser only — not to a server.
 * Integration points: GET /api/partner/profile, PATCH /api/partner/profile,
 * logo upload to Supabase Storage.
 */
const EDITABLE = ['companyName', 'registrationNumber', 'country', 'city', 'address', 'contactName', 'email', 'phone', 'website', 'category', 'description', 'preferredContact', 'logoName']

export async function getPartnerProfile() {
  await pause()
  return getState().partners.find((p) => p.id === currentPartnerId())
}

export async function updatePartnerProfile(values) {
  await pause(450)
  const pid = currentPartnerId()
  if (!values.companyName?.trim()) throw new ServiceError('Company name is required.')
  if (/makhorizon/i.test(values.companyName)) throw new ServiceError('The company name cannot be MAKHORIZON’s own identity.')
  const patch = Object.fromEntries(EDITABLE.filter((k) => k in values).map((k) => [k, typeof values[k] === 'string' ? values[k].trim() : values[k]]))
  commit((s) => ({ ...s, partners: replaceById(s.partners, pid, patch) }), { message: 'Company profile updated', status: 'Saved', link: '/company-profile' })
}
