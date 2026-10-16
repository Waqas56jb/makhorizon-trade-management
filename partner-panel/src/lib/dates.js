// Dates are stored as ISO "YYYY-MM-DD" strings (local calendar dates, no time zone shifts).

const pad = (n) => String(n).padStart(2, '0')

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO() {
  return toISO(new Date())
}

export function parseISO(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso, days) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

/** Whole days from `a` to `b` (positive when b is later). */
export function daysBetween(a, b) {
  return Math.round((parseISO(b) - parseISO(a)) / 86400000)
}

export const isPast = (iso) => !!iso && iso < todayISO()

export function monthKey(iso) {
  return iso.slice(0, 7)
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

/** The last `count` month keys ending with the current month. */
export function recentMonths(count) {
  const now = new Date()
  const keys = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`)
  }
  return keys
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'D MMM YYYY']

export function formatDate(iso, format = 'D MMM YYYY') {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  switch (format) {
    case 'DD/MM/YYYY':
      return `${d}/${m}/${y}`
    case 'MM/DD/YYYY':
      return `${m}/${d}/${y}`
    case 'YYYY-MM-DD':
      return iso
    default:
      return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
  }
}

/** Human relative phrase used in deadlines and notifications. */
export function relativeDays(iso) {
  const diff = daysBetween(todayISO(), iso)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff === -1) return 'yesterday'
  return diff > 0 ? `in ${diff} days` : `${-diff} days ago`
}
