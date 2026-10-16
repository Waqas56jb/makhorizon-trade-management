// Shared formatting helpers. Pure functions (no React / Vite imports) so they can be unit-tested with `node --test`.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Formats an amount in the record's own currency. No conversion is ever performed.
 * Uses Intl so symbols and decimals follow the currency (DJF has no minor unit).
 */
export function formatCurrency(amount, currency = 'USD', { compact = false } = {}) {
  if (amount == null || !Number.isFinite(Number(amount))) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: currency === 'DJF' ? 'code' : 'symbol',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : undefined,
    }).format(Number(amount))
  } catch {
    return `${currency} ${Number(amount).toLocaleString('en-US')}`
  }
}

/** Opportunity value range, e.g. "$60K – $85K". */
export const budgetLabel = (b) => (b ? `${formatCurrency(b.min, b.currency, { compact: true })} – ${formatCurrency(b.max, b.currency, { compact: true })}` : 'To be discussed')

export function formatNumber(n) {
  return n == null ? '—' : Number(n).toLocaleString('en-US')
}

/** "YYYY-MM-DD" → "4 Mar 2026". */
export function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

/** "YYYY-MM-DDTHH:mm" → "4 Mar 2026 · 14:05". */
export function formatDateTime(stamp) {
  if (!stamp) return '—'
  const [d, t] = stamp.split('T')
  return `${formatDate(d)}${t ? ` · ${t.slice(0, 5)}` : ''}`
}

export function formatFileSize(bytes) {
  if (bytes == null || bytes === '') return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** Short file type label from a MIME type or file name. */
export function fileTypeLabel(mime = '', name = '') {
  const ext = name.includes('.') ? name.split('.').pop().toUpperCase() : ''
  if (ext) return ext
  if (mime.includes('pdf')) return 'PDF'
  if (mime.includes('sheet') || mime.includes('excel')) return 'XLSX'
  if (mime.includes('word')) return 'DOCX'
  if (mime.startsWith('image/')) return mime.split('/')[1].toUpperCase()
  return '—'
}

/** Next sequential reference such as QUO-2026-012, based on every existing record (server-assigned in production). */
export function nextReference(prefix, list, year = new Date().getFullYear()) {
  const max = list.reduce((acc, x) => {
    const parts = String(x.id ?? '').split('-')
    const n = Number(parts[parts.length - 1])
    return parts[0] === prefix && Number.isFinite(n) && n > acc ? n : acc
  }, 0)
  return `${prefix}-${year}-${String(max + 1).padStart(3, '0')}`
}
