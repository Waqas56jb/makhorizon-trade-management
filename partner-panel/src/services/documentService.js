import { nextReference } from '../lib/format'
import { assertOwn, commit, currentUser, getState, nowStamp, own, pause, replaceById, ServiceError } from './base'

/**
 * Document metadata for files exchanged with MAKHORIZON.
 *
 * FRONTEND-ONLY PHASE: selected files are NOT uploaded anywhere. Only metadata
 * (name, type, size) is saved in the demo store. A file chosen in this browser
 * tab can be downloaded again through a temporary object URL until the page is
 * reloaded. File contents are never written to localStorage.
 *
 * Integration point: replace `attachFile` / `getFileUrl` with Supabase Storage
 * uploads and signed URLs, and the metadata calls with /api/documents.
 */
export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'jpg', 'jpeg', 'png', 'txt']
export const MAX_FILE_BYTES = 10 * 1024 * 1024

/** In-memory only: document id → object URL for files chosen in this tab. */
const sessionFiles = new Map()

export function validateFile(file) {
  if (!file) return 'Please choose a file.'
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : ''
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `This file type is not accepted. Allowed: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}.`
  if (file.size > MAX_FILE_BYTES) return 'The file is larger than 10 MB.'
  if (file.size === 0) return 'The file is empty.'
  return ''
}

function attachFile(id, file) {
  const prev = sessionFiles.get(id)
  if (prev) URL.revokeObjectURL(prev)
  sessionFiles.set(id, URL.createObjectURL(file))
  return { fileName: file.name, fileType: file.type || '', fileSize: file.size }
}

/** A download URL exists only for files selected in this browser tab. */
export const getFileUrl = (id) => sessionFiles.get(id) ?? null

/** Checks the related record belongs to the partner. */
function assertRelated(related) {
  const s = getState()
  const pid = currentUser().partnerId
  if (!related?.kind || !related.id) throw new ServiceError('Select the related record.')
  const lists = { order: s.orders, shipment: s.shipments, quotation: s.quotations }
  if (related.kind === 'company') {
    if (related.id !== pid) throw new ServiceError('Related record not found.')
    return
  }
  const rec = lists[related.kind]?.find((r) => r.id === related.id)
  if (!rec || rec.partnerId !== pid) throw new ServiceError('Related record not found.')
}

export async function getDocuments() {
  await pause()
  return own(getState().documents)
}

/** New document. `submit` requires a file; drafts may be saved without one. */
export async function createDocument({ name, type, related, notes }, file, { submit }) {
  await pause(450)
  const user = currentUser()
  if (!name?.trim()) throw new ServiceError('Document name is required.')
  assertRelated(related)
  if (submit && !file) throw new ServiceError('Choose a file before submitting.')
  if (file) {
    const err = validateFile(file)
    if (err) throw new ServiceError(err)
  }
  const id = nextReference('DOC', getState().documents)
  const meta = file ? attachFile(id, file) : { fileName: '', fileType: '', fileSize: null }
  const record = { id, partnerId: user.partnerId, name: name.trim(), type, related, notes: notes?.trim() ?? '', ...meta, uploadedAt: nowStamp().slice(0, 10), status: submit ? 'Submitted' : 'Draft', uploadedBy: user.name, reviewNote: '', localFile: !!file }
  commit((s) => ({ ...s, documents: [record, ...s.documents] }), { message: submit ? `Document ${id} submitted` : `Draft document ${id} saved`, status: record.status, link: `/documents?doc=${id}` })
  return record
}

/** Provide the file for a requested document, resubmit after a revision, or submit a draft. */
export async function submitDocumentFile(id, file, notes) {
  await pause(450)
  const doc = assertOwn(getState().documents.find((d) => d.id === id), 'Document')
  if (!['Requested', 'Revision Required', 'Draft'].includes(doc.status)) throw new ServiceError('This document is already submitted.')
  const err = validateFile(file)
  if (err) throw new ServiceError(err)
  const user = currentUser()
  const meta = attachFile(id, file)
  commit(
    (s) => ({ ...s, documents: replaceById(s.documents, id, (d) => ({ ...meta, notes: notes?.trim() || d.notes, status: 'Submitted', uploadedAt: nowStamp().slice(0, 10), uploadedBy: user.name, localFile: true })) }),
    { message: `${doc.status === 'Requested' ? 'Requested document' : 'Document'} ${id} submitted`, status: 'Submitted', link: `/documents?doc=${id}` },
  )
}

export async function deleteDraftDocument(id) {
  await pause()
  const doc = assertOwn(getState().documents.find((d) => d.id === id), 'Document')
  if (doc.status !== 'Draft') throw new ServiceError('Only draft documents can be deleted.')
  const url = sessionFiles.get(id)
  if (url) URL.revokeObjectURL(url)
  sessionFiles.delete(id)
  commit((s) => ({ ...s, documents: s.documents.filter((d) => d.id !== id) }), { message: `Draft document ${id} deleted`, status: 'Draft' })
}
