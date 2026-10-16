import { useMemo, useState } from 'react'
import { matchesSearch } from '../lib/utils'

/**
 * Search + filter state for list pages.
 * @param rows        source rows
 * @param searchFields row => array of searchable values
 * @param predicates   { filterName: (row, value) => boolean }
 */
export default function useListState(rows, searchFields, predicates = {}, initialFilters = {}) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(initialFilters)

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (!matchesSearch(searchFields(row), query)) return false
        return Object.entries(filters).every(([k, v]) => !v || !predicates[k] || predicates[k](row, v))
      }),
    // predicates/searchFields are defined inline by callers; rows/query/filters drive recomputation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, query, filters],
  )

  const setFilter = (name, value) => setFilters((f) => ({ ...f, [name]: value }))
  const reset = () => {
    setQuery('')
    setFilters({})
  }
  const active = !!query || Object.values(filters).some(Boolean)
  const resetKey = `${query}|${JSON.stringify(filters)}|${rows.length}`

  return { query, setQuery, filters, setFilter, reset, filtered, active, resetKey }
}
