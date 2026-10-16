import { PROTECTED_TYPES } from '../data/documents'
import { todayISO } from '../lib/dates'
import { myDocuments, myOrders, myShipments } from '../lib/selectors'
import { commit, currentEmployee, getState, pause, replaceById, ServiceError } from './base'

/**
 * Document register — DEMO MODE.
 * Only metadata is saved. A selected file lives in browser memory (an object
 * URL) for this tab only so it can be previewed; it is NOT uploaded and is
 * lost on reload. Swap `attachFile` / `getFileUrl` for Supabase Storage later.
 */
export const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt']
export const PREVIEWABLE = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'txt']
export const MAX_FILE_BYTES = 10 * 1024 * 1024

const sessionFiles = new Map() // documentId -> { url, type }

export const extOf = (name = '') => name.split('.').pop()?.toLowerCase() ?? ''

export function validateFile(file) {
  if (!file) return null
  if (!ALLOWED_EXTENSIONS.includes(extOf(file.name))) return `Files of type .${extOf(file.name)} are not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}.`
  if (file.size > MAX_FILE_BYTES) return 'The file is larger than 10 MB.'
  if (file.size === 0) return 'The file is empty.'
  return null
}

function attachFile(id, file) {
  if (!file) return
  const old = sessionFiles.get(id)
  if (old) URL.revokeObjectURL(old.url)
  sessionFiles.set(id, { url: URL.createObjectURL(file), type: file.type })
}

export const getFileUrl = (id) => sessionFiles.get(id)?.url ?? null
export const getFileType = (id) => sessionFiles.get(id)?.type ?? ''

/** Staff may edit or delete only their own Draft / Pending Review records that are not protected. */
export function canEditDocument(doc, empId) {
  return doc.addedBy === empId && !PROTECTED_TYPES.includes(doc.type) && ['Draft', 'Pending Review'].includes(doc.status)
}
export const canDeleteDocument = (doc, empId) => canEditDocument(doc, empId) && doc.status === 'Draft'

/** Staff may fill in a requested document (attach the received file). */
export const canFulfilRequest = (doc, empId) => doc.status === 'Requested' && myDocuments(getState(), empId).some((d) => d.id === doc.id)

function checkLinks(data, emp) {
  const s = getState()
  if (data.orderId && !myOrders(s, emp.id).some((o) => o.id === data.orderId)) throw new ServiceError('You can link documents only to your assigned orders.')
  if (data.shipmentId) {
    const sh = myShipments(s, emp.id).find((x) => x.id === data.shipmentId)
    if (!sh) throw new ServiceError('You can link documents only to your assigned shipments.')
    if (data.orderId && sh.orderId !== data.orderId) throw new ServiceError('The selected shipment belongs to a different order.')
  }
}

export async function getDocuments() {
  await pause()
  return myDocuments(getState(), currentEmployee().id)
}

export async function createDocumentMetadata(data, file) {
  await pause()
  const emp = currentEmployee()
  const err = validateFile(file)
  if (err) throw new ServiceError(err)
  checkLinks(data, emp)
  const s = getState()
  const max = s.documents.reduce((m, d) => Math.max(m, Number(d.id.split('-')[1]) || 0), 300)
  const id = `DC-${max + 1}`
  const doc = {
    ...data,
    id,
    reference: `DOC-${new Date().getFullYear()}-${max + 1}`,
    recordedAt: todayISO(),
    fileName: file?.name ?? '',
    fileSize: file?.size ?? null,
    // Records with a file go to review; without a file they stay as drafts.
    status: file ? 'Pending Review' : 'Draft',
    addedBy: emp.id,
  }
  attachFile(id, file)
  commit((st) => ({ ...st, documents: [doc, ...st.documents] }), { message: `Added document record “${doc.name}”`, link: `/documents/${id}` })
  return id
}

export async function updateDocumentMetadata(id, data, file) {
  await pause()
  const emp = currentEmployee()
  const doc = getState().documents.find((d) => d.id === id)
  if (!doc) throw new ServiceError('Document not found.')
  const fulfilling = canFulfilRequest(doc, emp.id)
  if (!canEditDocument(doc, emp.id) && !fulfilling) throw new ServiceError('This document is protected or was added by someone else, so it cannot be edited.')
  if (fulfilling && !file) throw new ServiceError('Attach the received file to complete this request.')
  const err = validateFile(file)
  if (err) throw new ServiceError(err)
  // A fulfilled request keeps its original links and category.
  const patch = fulfilling ? { documentDate: data.documentDate, description: data.description } : data
  if (!fulfilling) checkLinks(data, emp)
  if (file) Object.assign(patch, { fileName: file.name, fileSize: file.size, status: 'Pending Review' })
  attachFile(id, file)
  commit((s) => ({ ...s, documents: replaceById(s.documents, id, patch) }), { message: fulfilling ? `Provided requested document “${doc.name}”` : `Updated document record “${doc.name}”`, link: `/documents/${id}` })
  return id
}

export async function deleteDocumentMetadata(id) {
  await pause()
  const emp = currentEmployee()
  const doc = getState().documents.find((d) => d.id === id)
  if (!doc) throw new ServiceError('Document not found.')
  if (!canDeleteDocument(doc, emp.id)) throw new ServiceError('Only your own draft records can be deleted. Company documents are protected.')
  const f = sessionFiles.get(id)
  if (f) {
    URL.revokeObjectURL(f.url)
    sessionFiles.delete(id)
  }
  commit((s) => ({ ...s, documents: s.documents.filter((d) => d.id !== id) }), { message: `Deleted draft document “${doc.name}”` })
  return true
}
