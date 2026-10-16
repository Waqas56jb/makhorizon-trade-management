import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Bell, CheckCheck, LifeBuoy, LogOut, Menu, Search, UserRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fmtDateTime } from '../../hooks/useFormat'
import useDismiss from '../../hooks/useDismiss'
import useMine from '../../hooks/useMine'
import { useAuth } from '../../lib/auth'
import { cn, initials, matchesSearch } from '../../lib/utils'
import { markNotificationRead, markNotificationsRead } from '../../services/accountService'
import { sectionFor } from './nav'

/** Searches the employee's own tasks, orders, shipments and documents. Shortcut: "/". */
function QuickSearch() {
  const mine = useMine()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inputRef = useRef(null)
  const listId = useId()
  useDismiss(ref, open, () => setOpen(false))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    return [
      ...mine.tasks.map((t) => ({ type: 'Task', label: t.title, sub: t.reference, to: `/tasks/${t.id}`, hay: [t.title, t.reference] })),
      ...mine.orders.map((o) => ({ type: 'Order', label: o.number, sub: o.client.company, to: `/orders/${o.id}`, hay: [o.number, o.client.company, o.cargo] })),
      ...mine.shipments.map((s) => ({ type: 'Shipment', label: s.reference, sub: `${s.origin} → ${s.destination}`, to: `/shipments/${s.id}`, hay: [s.reference, s.trackingRef, s.destination] })),
      ...mine.documents.map((d) => ({ type: 'Document', label: d.name, sub: d.reference, to: `/documents/${d.id}`, hay: [d.name, d.reference, d.fileName] })),
    ]
      .filter((r) => matchesSearch(r.hay, query))
      .slice(0, 8)
  }, [query, mine])

  const go = (r) => {
    navigate(r.to)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }
  const show = open && query.trim().length >= 2

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={show && results[active] ? `${listId}-${active}` : undefined}
        aria-label="Search my tasks, orders, shipments and documents"
        placeholder="Search my work…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
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
        }}
        className="field-control h-9 min-h-9 bg-canvas pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-white px-1.5 text-[0.65rem] font-semibold text-muted sm:block">/</kbd>
      {show && (
        <ul id={listId} role="listbox" aria-label="Search results" className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-pop">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">Nothing in your work matches “{query}”.</li>
          ) : (
            results.map((r, i) => (
              <li key={r.to} id={`${listId}-${i}`} role="option" aria-selected={i === active} onMouseDown={(e) => e.preventDefault()} onClick={() => go(r)} onMouseEnter={() => setActive(i)} className={cn('flex cursor-pointer items-center gap-3 px-3 py-2', i === active && 'bg-canvas')}>
                <span className="w-[4.5rem] shrink-0 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{r.type}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{r.label}</span>
                  <span className="block truncate text-xs text-muted">{r.sub}</span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

function NotificationsMenu() {
  const { notifications } = useMine()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close, btnRef)
  const unread = notifications.filter((n) => !n.read)

  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="true" aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ''}`} className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-canvas">
        <Bell className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
        {unread.length > 0 && <span className="num absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.6rem] font-bold text-white">{unread.length}</span>}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-[calc(var(--header-h)-0.25rem)] z-50 rounded-xl border border-line bg-white shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <button type="button" onClick={() => markNotificationsRead(notifications.map((n) => n.id))} disabled={!unread.length} className="btn btn-ghost btn-sm">
              <CheckCheck aria-hidden="true" />
              Mark all read
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">You’re all caught up.</p>
          ) : (
            <ul className="max-h-[55vh] divide-y divide-line overflow-y-auto">
              {notifications.slice(0, 6).map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markNotificationRead(n.id)
                      setOpen(false)
                      navigate(n.link || '/notifications')
                    }}
                    className={cn('flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-canvas', !n.read && 'bg-[#fbf8f1]')}
                  >
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-gold')} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className={cn('block text-sm', n.read ? 'text-muted' : 'font-semibold')}>
                        {n.title}
                        {!n.read && <span className="sr-only"> (unread)</span>}
                      </span>
                      <span className="block truncate text-xs text-muted">{n.description}</span>
                      <span className="num block text-[0.68rem] text-muted">{fmtDateTime(n.at)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-line p-2">
            <Link to="/notifications" onClick={close} className="btn btn-ghost btn-sm w-full">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileMenu() {
  const { logout } = useAuth()
  const { employee } = useMine()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close, btnRef)
  if (!employee) return null
  const itemCls = 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink hover:bg-canvas focus-visible:bg-canvas'

  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={(e) => {
        if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return
        const items = [...ref.current.querySelectorAll('[role=menuitem]')]
        if (!items.length) return
        e.preventDefault()
        const i = items.indexOf(document.activeElement)
        items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus()
      }}
    >
      <button ref={btnRef} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu" aria-label={`Account menu for ${employee.name}`} className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-canvas">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">{initials(employee.name)}</span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[0.82rem] font-semibold">{employee.name}</span>
          <span className="block text-[0.7rem] text-muted">{employee.role}</span>
        </span>
      </button>
      {open && (
        <div role="menu" aria-label="Account" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-line bg-white p-1.5 shadow-pop">
          <div className="border-b border-line px-3 pb-2.5 pt-1.5">
            <p className="text-sm font-semibold">{employee.name}</p>
            <p className="truncate text-xs text-muted">{employee.email}</p>
          </div>
          <div className="pt-1.5">
            <Link role="menuitem" to="/profile" onClick={close} className={itemCls} autoFocus>
              <UserRound className="h-4 w-4 text-muted" aria-hidden="true" />
              My profile
            </Link>
            <Link role="menuitem" to="/help" onClick={close} className={itemCls}>
              <LifeBuoy className="h-4 w-4 text-muted" aria-hidden="true" />
              Help & instructions
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                close()
                logout()
              }}
              className={cn(itemCls, 'text-danger')}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header({ onOpenNav, navOpen }) {
  const { pathname } = useLocation()
  const section = sectionFor(pathname)?.label ?? ''
  return (
    <header className="sticky top-0 z-30 flex h-[var(--header-h)] items-center gap-3 border-b border-line bg-white/95 px-3 backdrop-blur sm:px-5">
      <button type="button" onClick={onOpenNav} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-canvas lg:hidden" aria-label="Open navigation" aria-expanded={navOpen}>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="hidden shrink-0 text-sm font-semibold xl:block">{section}</p>
      <div className="min-w-0 flex-1 xl:flex xl:justify-center">
        <QuickSearch />
      </div>
      <NotificationsMenu />
      <ProfileMenu />
    </header>
  )
}
