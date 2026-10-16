import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useDismiss from '../../hooks/useDismiss'
import { useAppState } from '../../lib/store'
import { cn, matchesSearch } from '../../lib/utils'

/** Searches across all modules and jumps to the matching record. Shortcut: "/". */
export default function GlobalSearch() {
  const s = useAppState()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const listId = useId()
  useDismiss(wrapRef, open, () => setOpen(false))

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const clientName = (id) => s.clients.find((c) => c.id === id)?.company ?? ''
    const sources = [
      ...s.clients.map((c) => ({ type: 'Client', label: c.company, sub: c.name, to: `/clients/${c.id}`, hay: [c.company, c.name, c.email, c.country] })),
      ...s.suppliers.map((x) => ({ type: 'Supplier', label: x.company, sub: x.category, to: `/suppliers/${x.id}`, hay: [x.company, x.contactName, x.email, x.country, x.category] })),
      ...s.quotations.map((q) => ({ type: 'Quotation', label: q.number, sub: clientName(q.clientId), to: `/quotations/${q.id}`, hay: [q.number, clientName(q.clientId), q.description] })),
      ...s.orders.map((o) => ({ type: 'Order', label: o.number, sub: `${clientName(o.clientId)} · ${o.cargo}`, to: `/orders/${o.id}`, hay: [o.number, clientName(o.clientId), o.cargo, o.origin, o.destination] })),
      ...s.shipments.map((x) => ({ type: 'Shipment', label: x.reference, sub: `${x.origin} → ${x.destination}`, to: `/shipments/${x.id}`, hay: [x.reference, x.trackingRef, x.carrier, x.origin, x.destination] })),
      ...s.invoices.map((i) => ({ type: 'Invoice', label: i.number, sub: clientName(i.clientId), to: `/finances/invoices/${i.id}`, hay: [i.number, clientName(i.clientId)] })),
      ...s.inventory.map((i) => ({ type: 'Inventory', label: i.name, sub: i.sku, to: `/inventory/${i.id}`, hay: [i.name, i.sku, i.category] })),
      ...s.documents.map((d) => ({ type: 'Document', label: d.name, sub: d.fileName, to: `/documents/${d.id}`, hay: [d.name, d.fileName, d.type] })),
      ...s.partners.map((p) => ({ type: 'Partner', label: p.company, sub: p.type, to: `/partners/${p.id}`, hay: [p.company, p.contact, p.country] })),
    ]
    return sources.filter((r) => matchesSearch(r.hay, query)).slice(0, 8)
  }, [query, s])

  const go = (r) => {
    navigate(r.to)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (e) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[Math.min(active, results.length - 1)])
    }
  }

  const showList = open && query.trim().length >= 2

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        aria-label="Search all records"
        placeholder="Search records…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="field-control h-9 min-h-9 bg-canvas pl-9 pr-10 [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-white px-1.5 text-[0.65rem] font-semibold text-muted sm:block">/</kbd>
      {showList && (
        <ul id={listId} role="listbox" aria-label="Search results" className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-pop">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">No records match “{query}”.</li>
          ) : (
            results.map((r, i) => (
              <li
                key={r.to}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r)}
                onMouseEnter={() => setActive(i)}
                className={cn('flex cursor-pointer items-center gap-3 px-3 py-2', i === active && 'bg-canvas')}
              >
                <span className="w-[4.5rem] shrink-0 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{r.type}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{r.label}</span>
                  {r.sub && <span className="block truncate text-xs text-muted">{r.sub}</span>}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
