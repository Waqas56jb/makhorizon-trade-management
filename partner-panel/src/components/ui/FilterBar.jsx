import { RotateCcw, Search, X } from 'lucide-react'

export function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  return (
    <div className="relative min-w-0 flex-1 basis-full sm:basis-auto sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="field-control pl-9 pr-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink" aria-label="Clear search">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/** Compact select used in filter bars. options: strings or {value,label}. */
export function FilterSelect({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="field-control w-auto min-w-[9rem] flex-none">
      <option value="">
        {label}: {allLabel}
      </option>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      })}
    </select>
  )
}

export function DateRange({ from, to, onFrom, onTo }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} aria-label="From date" max={to || undefined} className="field-control w-auto" />
      <span className="text-xs text-muted">to</span>
      <input type="date" value={to} onChange={(e) => onTo(e.target.value)} aria-label="To date" min={from || undefined} className="field-control w-auto" />
    </div>
  )
}

export function FilterBar({ children, active, onReset, resultCount }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line px-4 py-3 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        {resultCount !== undefined && <span className="num text-xs text-muted">{resultCount} result{resultCount === 1 ? '' : 's'}</span>}
        {active && (
          <button type="button" onClick={onReset} className="btn btn-ghost btn-sm">
            <RotateCcw aria-hidden="true" />
            Reset filters
          </button>
        )}
      </div>
    </div>
  )
}
