import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { EmptyState } from './States'

export function Pagination({ page, pageCount, total, pageSize, onPage }) {
  if (total === 0) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-muted">
      <p className="num">
        Showing {from}–{to} of {total}
      </p>
      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft aria-hidden="true" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1)
            .filter((p) => pageCount <= 7 || Math.abs(p - page) <= 1 || p === 1 || p === pageCount)
            .map((p, i, arr) => (
              <span key={p} className="flex items-center">
                {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1">…</span>}
                <button
                  type="button"
                  onClick={() => onPage(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn('num h-8 min-w-8 rounded-md px-2 font-semibold', p === page ? 'bg-navy text-white' : 'text-ink hover:bg-canvas')}
                >
                  {p}
                </button>
              </span>
            ))}
          <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={() => onPage(page + 1)} disabled={page === pageCount} aria-label="Next page">
            <ChevronRight aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  )
}

/**
 * Columns: { key, header, cell(row), sort?(row), align?, className?, mobile?: 'title' | 'subtitle' | true }
 * On phones the table becomes compact record cards built from the `mobile` columns.
 */
export default function DataTable({
  columns,
  rows,
  getRowKey = (r) => r.id,
  actions,
  pageSize = 10,
  initialSort,
  empty,
  caption,
  resetKey,
  footer,
}) {
  const [sort, setSort] = useState(initialSort ?? null)
  const [page, setPage] = useState(1)
  // Return to page 1 whenever the filtered result set changes.
  const key = resetKey ?? rows.length
  const [prevKey, setPrevKey] = useState(key)
  if (prevKey !== key) {
    setPrevKey(key)
    setPage(1)
  }

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col?.sort) return rows
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const va = col.sort(a)
      const vb = col.sort(b)
      if (va == null) return 1
      if (vb == null) return -1
      return (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))) * dir
    })
  }, [rows, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize)

  const toggleSort = (k) => setSort((s) => (s?.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }))

  if (rows.length === 0) return empty ?? <EmptyState title="No records found" message="Try adjusting your search or filters." />

  const titleCol = columns.find((c) => c.mobile === 'title') ?? columns[0]
  const subtitleCol = columns.find((c) => c.mobile === 'subtitle')
  const mobileCols = columns.filter((c) => c.mobile === true)

  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="table-base">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn(c.align === 'right' && 'text-right', c.className)} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {c.sort ? (
                    <button type="button" onClick={() => toggleSort(c.key)} className={cn('inline-flex items-center gap-1 uppercase hover:text-ink', c.align === 'right' && 'flex-row-reverse')}>
                      {c.header}
                      {sort?.key === c.key ? sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" /> : <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
              {actions && (
                <th scope="col" className="text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((c) => (
                  <td key={c.key} className={cn(c.align === 'right' && 'num text-right', c.className)}>
                    {c.cell ? c.cell(row) : row[c.key]}
                  </td>
                ))}
                {actions && (
                  <td className="text-right">
                    <div className="flex justify-end gap-1">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone record cards */}
      <ul className="divide-y divide-line md:hidden">
        {visible.map((row) => (
          <li key={getRowKey(row)} className="px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold">{titleCol.cell ? titleCol.cell(row) : row[titleCol.key]}</div>
                {subtitleCol && <div className="mt-0.5 text-xs text-muted">{subtitleCol.cell ? subtitleCol.cell(row) : row[subtitleCol.key]}</div>}
              </div>
              {actions && <div className="-mr-1 flex shrink-0 gap-1">{actions(row)}</div>}
            </div>
            {mobileCols.length > 0 && (
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {mobileCols.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <dt className="text-[0.68rem] uppercase tracking-wide text-muted">{c.header}</dt>
                    <dd className={cn('truncate text-[0.82rem]', c.align === 'right' && 'num')}>{c.cell ? c.cell(row) : row[c.key]}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>

      {footer}
      <Pagination page={current} pageCount={pageCount} total={sorted.length} pageSize={pageSize} onPage={setPage} />
    </div>
  )
}
