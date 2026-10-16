export const cn = (...c) => c.filter(Boolean).join(' ')

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

/** Next sequential id such as CL-011 based on existing ids with the prefix. */
export function nextId(prefix, list, width = 3) {
  const max = list.reduce((m, x) => {
    const n = Number(String(x.id).replace(`${prefix}-`, ''))
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `${prefix}-${String(max + 1).padStart(width, '0')}`
}

/** Next human-readable document number, e.g. QT-2026-011. */
export function nextNumber(prefix, list, field = 'number') {
  const year = new Date().getFullYear()
  const max = list.reduce((m, x) => {
    const parts = String(x[field] ?? '').split('-')
    const n = Number(parts[parts.length - 1])
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `${prefix}-${year}-${String(max + 1).padStart(3, '0')}`
}

export function matchesSearch(values, query) {
  if (!query) return true
  const q = query.trim().toLowerCase()
  return values.some((v) => v != null && String(v).toLowerCase().includes(q))
}

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
