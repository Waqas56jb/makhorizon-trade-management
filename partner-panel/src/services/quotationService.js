import { todayISO } from '../lib/dates'
import { nextReference } from '../lib/format'
import { calcQuotationTotals, canEditQuotation, canReviseQuotation } from '../lib/quotation'
import { assertOwn, commit, currentUser, getState, nowStamp, own, pause, replaceById, ServiceError } from './base'
import { assertOpenOpportunity } from './opportunityService'

/**
 * Quotations submitted by the signed-in partner.
 * Integration points: GET/POST /api/quotations, PATCH /api/quotations/:id,
 * POST /api/quotations/:id/submit, POST /api/quotations/:id/revisions.
 * Attachments are metadata only here; real files will go to Supabase Storage.
 */
const FIELDS = ['opportunityId', 'title', 'description', 'unitPrice', 'quantity', 'unit', 'currency', 'taxRate', 'additionalCosts', 'deliveryDuration', 'deliveryTerms', 'validUntil', 'paymentTerms', 'conditions', 'notes']

function pick(values) {
  const out = Object.fromEntries(FIELDS.map((f) => [f, values[f] ?? '']))
  for (const f of ['unitPrice', 'quantity', 'taxRate', 'additionalCosts']) out[f] = out[f] === '' || out[f] == null ? 0 : Number(out[f])
  out.attachments = (values.attachments ?? []).map(({ name, size, type }) => ({ name, size, type }))
  return out
}

/** Server-style validation for a submission (the form validates too). */
function validateForSubmit(v) {
  assertOpenOpportunity(v.opportunityId)
  if (!String(v.title).trim()) throw new ServiceError('Quotation title is required.')
  if (!(v.unitPrice > 0)) throw new ServiceError('Unit price must be greater than zero.')
  if (!(v.quantity > 0)) throw new ServiceError('Quantity must be greater than zero.')
  if ([v.taxRate, v.additionalCosts].some((n) => n < 0)) throw new ServiceError('Amounts cannot be negative.')
  if (!v.validUntil || v.validUntil < todayISO()) throw new ServiceError('The valid-until date must be today or later.')
}

export async function getQuotations() {
  await pause()
  return own(getState().quotations)
}

export async function getQuotationById(id) {
  await pause()
  return assertOwn(getState().quotations.find((q) => q.id === id), 'Quotation')
}

/** Creates a new draft, or updates an existing draft when `id` is given. Minimal validation so work isn't lost. */
export async function saveDraft(values, id) {
  await pause()
  const user = currentUser()
  const data = pick(values)
  if (!data.opportunityId) throw new ServiceError('Select an opportunity before saving a draft.')
  if ([data.unitPrice, data.quantity, data.taxRate, data.additionalCosts].some((n) => n < 0)) throw new ServiceError('Amounts cannot be negative.')
  const stamp = nowStamp()
  if (id) {
    const existing = assertOwn(getState().quotations.find((q) => q.id === id), 'Quotation')
    if (!canEditQuotation(existing)) throw new ServiceError('Only draft quotations can be edited.')
    commit((s) => ({ ...s, quotations: replaceById(s.quotations, id, { ...data, title: data.title || 'Untitled quotation', updatedAt: stamp }) }), { message: `Draft ${id} updated`, status: 'Draft', link: `/quotations/${id}` })
    return getState().quotations.find((q) => q.id === id)
  }
  const ref = nextReference('QUO', getState().quotations)
  const record = { id: ref, partnerId: user.partnerId, ...data, title: data.title || 'Untitled quotation', status: 'Draft', createdAt: stamp, submittedAt: '', updatedAt: stamp, version: 1, history: [{ at: stamp, status: 'Draft', by: user.name, note: 'Draft saved' }], feedback: [] }
  commit((s) => ({ ...s, quotations: [record, ...s.quotations] }), { message: `Draft quotation ${ref} saved`, status: 'Draft', link: `/quotations/${ref}` })
  return record
}

/** Submits a new quotation, or submits an existing draft when `id` is given. */
export async function submitQuotation(values, id) {
  await pause(450)
  const user = currentUser()
  const data = pick(values)
  validateForSubmit(data)
  const stamp = nowStamp()
  if (id) {
    const existing = assertOwn(getState().quotations.find((q) => q.id === id), 'Quotation')
    if (!canEditQuotation(existing)) throw new ServiceError('This quotation has already been submitted.')
    commit(
      (s) => ({ ...s, quotations: replaceById(s.quotations, id, (q) => ({ ...data, status: 'Submitted', submittedAt: stamp, updatedAt: stamp, history: [...q.history, { at: stamp, status: 'Submitted', by: user.name, note: '' }] })) }),
      { message: `Quotation ${id} submitted`, status: 'Submitted', link: `/quotations/${id}` },
    )
    return getState().quotations.find((q) => q.id === id)
  }
  const ref = nextReference('QUO', getState().quotations)
  const record = { id: ref, partnerId: user.partnerId, ...data, status: 'Submitted', createdAt: stamp, submittedAt: stamp, updatedAt: stamp, version: 1, history: [{ at: stamp, status: 'Submitted', by: user.name, note: '' }], feedback: [] }
  commit((s) => ({ ...s, quotations: [record, ...s.quotations] }), { message: `Quotation ${ref} submitted`, status: 'Submitted', link: `/quotations/${ref}` })
  return record
}

/**
 * Simulated revision workflow: only for "Revision Requested". The previous
 * commercial figures are kept in `versions` and the quotation returns to "Submitted".
 */
export async function submitRevision(id, values) {
  await pause(450)
  const user = currentUser()
  const existing = assertOwn(getState().quotations.find((q) => q.id === id), 'Quotation')
  if (!canReviseQuotation(existing)) throw new ServiceError('A revision can only be submitted when MAKHORIZON has requested one.')
  const data = { ...pick(values), opportunityId: existing.opportunityId }
  validateForSubmit(data)
  const stamp = nowStamp()
  const version = (existing.version ?? 1) + 1
  const snapshot = { version: existing.version ?? 1, submittedAt: existing.submittedAt, currency: existing.currency, unitPrice: existing.unitPrice, quantity: existing.quantity, total: calcQuotationTotals(existing).total }
  commit(
    (s) => ({
      ...s,
      quotations: replaceById(s.quotations, id, (q) => ({
        ...data,
        version,
        versions: [...(q.versions ?? []), snapshot],
        status: 'Submitted',
        submittedAt: stamp,
        updatedAt: stamp,
        history: [...q.history, { at: stamp, status: 'Submitted', by: user.name, note: `Version ${version} submitted in response to the revision request` }],
      })),
    }),
    { message: `Revised quotation ${id} (version ${version}) submitted`, status: 'Submitted', link: `/quotations/${id}` },
  )
  return getState().quotations.find((q) => q.id === id)
}

export async function deleteDraft(id) {
  await pause()
  const existing = assertOwn(getState().quotations.find((q) => q.id === id), 'Quotation')
  if (existing.status !== 'Draft') throw new ServiceError('Only drafts can be deleted.')
  commit((s) => ({ ...s, quotations: s.quotations.filter((q) => q.id !== id) }), { message: `Draft ${id} deleted`, status: 'Draft' })
}
