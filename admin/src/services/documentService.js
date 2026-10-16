import { todayISO } from '../lib/dates'
import { nextId } from '../lib/utils'
import { commit, pause, findOrThrow, getState, removeById, replaceById, ServiceError } from './base'

/**
 * Document register — DEMO MODE.
 * Only metadata is saved (in the demo data store). A file chosen in the
 * browser is kept in memory for this tab only so it can be previewed; it is
 * NOT uploaded or stored anywhere and disappears on reload. Replace
 * `attachFile` / `getFileUrl` with Supabase Storage (or similar) later.
 */
export const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt']
export const MAX_FILE_BYTES = 10 * 1024 * 1024

const sessionFiles = new Map() // documentId -> object URL (memory only)

export function validateFile(file) {
  if (!file) return null
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `File type .${ext} is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}.`
  if (file.size > MAX_FILE_BYTES) return 'File is larger than 10 MB.'
  return null
}

function attachFile(id, file) {
  if (!file) return
  if (sessionFiles.has(id)) URL.revokeObjectURL(sessionFiles.get(id))
  sessionFiles.set(id, URL.createObjectURL(file))
}

export const getFileUrl = (id) => sessionFiles.get(id) ?? null

export const documentService = {
  async create(data, file) {
    await pause()
    const err = validateFile(file)
    if (err) throw new ServiceError(err)
    const id = nextId('DC', getState().documents)
    const meta = { ...data, id, uploadDate: todayISO(), fileName: file?.name ?? data.fileName ?? '', fileSize: file?.size ?? null }
    attachFile(id, file)
    commit((s) => ({ ...s, documents: [...s.documents, meta] }), { message: `Document "${data.name}" registered`, link: `/documents/${id}` })
    return id
  },
  async update(id, data, file) {
    await pause()
    findOrThrow('documents', id, 'Document')
    const err = validateFile(file)
    if (err) throw new ServiceError(err)
    const patch = file ? { ...data, fileName: file.name, fileSize: file.size } : data
    attachFile(id, file)
    commit((s) => ({ ...s, documents: replaceById(s.documents, id, patch) }), { message: `Document "${data.name}" updated`, link: `/documents/${id}` })
    return id
  },
  async remove(id) {
    await pause()
    const doc = findOrThrow('documents', id, 'Document')
    if (sessionFiles.has(id)) {
      URL.revokeObjectURL(sessionFiles.get(id))
      sessionFiles.delete(id)
    }
    commit((s) => ({ ...s, documents: removeById(s.documents, id) }), { message: `Document "${doc.name}" deleted` })
    return true
  },
}
