/** Escapes a value for CSV: quotes fields containing commas, quotes or line breaks. */
export function csvEscape(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * Builds CSV text from rows and explicit column definitions, so only the
 * intended fields are exported.
 * @param {Array<{header: string, value: (row) => any}>} columns
 */
export function toCSV(rows, columns) {
  const head = columns.map((c) => csvEscape(c.header)).join(',')
  const body = rows.map((row) => columns.map((c) => csvEscape(c.value(row))).join(','))
  return [head, ...body].join('\r\n')
}

export function downloadCSV(filename, rows, columns) {
  // BOM so Excel opens UTF-8 correctly.
  const blob = new Blob(['﻿' + toCSV(rows, columns)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
