import { formatDate } from '../lib/dates'

/** Date helpers (portal uses one readable format). */
export const fmtDate = (iso) => formatDate(iso, 'D MMM YYYY')
export function fmtDateTime(stamp) {
  if (!stamp) return '—'
  const [d, t] = stamp.split('T')
  return `${formatDate(d, 'D MMM YYYY')}${t ? ` · ${t.slice(0, 5)}` : ''}`
}
export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
