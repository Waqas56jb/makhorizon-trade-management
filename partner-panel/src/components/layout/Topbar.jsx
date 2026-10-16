import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Bell, Building2, CheckCheck, LogOut, Menu, Search, Settings } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useDismiss from '../../hooks/useDismiss'
import usePartnerData from '../../hooks/usePartnerData'
import { useAuth } from '../../lib/auth'
import { formatDateTime } from '../../lib/format'
import { cn, initials, matchesSearch } from '../../lib/utils'
import { markAllNotificationsRead, markNotificationRead } from '../../services/notificationService'
import { sectionFor } from './nav'

/** Searches the partner's own records and published opportunities. Shortcut: "/". */
function QuickSearch() {
  const data = usePartnerData()
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
      ...data.opportunities.map((o) => ({ type: 'Opportunity', label: o.title, sub: o.id, to: `/opportunities/${o.id}`, hay: [o.title, o.id, o.category] })),
      ...data.quotations.map((q) => ({ type: 'Quotation', label: q.title, sub: q.id, to: `/quotations/${q.id}`, hay: [q.title, q.id, q.opportunityId] })),
      ...data.orders.map((o) => ({ type: 'Order', label: o.title, sub: o.id, to: `/orders/${o.id}`, hay: [o.title, o.id, o.quotationId] })),
      ...data.shipments.map((s) => ({ type: 'Shipment', label: s.id, sub: `${s.origin} → ${s.destination}`, to: `/shipments/${s.id}`, hay: [s.id, s.trackingRef, s.orderId, s.destination] })),
      ...data.documents.map((d) => ({ type: 'Document', label: d.name, sub: d.id, to: `/documents?doc=${d.id}`, hay: [d.name, d.id, d.fileName] })),
    ]
      .filter((r) => matchesSearch(r.hay, query))
      .slice(0, 8)
  }, [query, data])

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
        aria-label="Search opportunities, quotations, orders, shipments and documents"
        placeholder="Search…"
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
            <li className="px-4 py-3 text-sm text-muted">No results for “{query}”.</li>
          ) : (
            results.map((r, i) => (
              <li key={r.to} id={`${listId}-${i}`} role="option" aria-selected={i === active} onMouseDown={(e) => e.preventDefault()} onClick={() => go(r)} onMouseEnter={() => setActive(i)} className={cn('flex cursor-pointer items-center gap-3 px-3 py-2', i === active && 'bg-canvas')}>
                <span className="w-[5.5rem] shrink-0 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{r.type}</span>
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

function NotificationMenu() {
  const { notifications, unreadNotifications } = usePartnerData()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close, btnRef)

  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="true" aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`} className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-canvas">
        <Bell className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
        {unreadNotifications > 0 && (
          <span data-testid="notification-count" className="num absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.6rem] font-bold text-white">
            {unreadNotifications}
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-[calc(var(--header-h)-0.25rem)] z-50 rounded-xl border border-line bg-white shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <button type="button" onClick={markAllNotificationsRead} disabled={!unreadNotifications} className="btn btn-ghost btn-sm">
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
                      <span className="num block text-[0.68rem] text-muted">{formatDateTime(n.at)}</span>
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

function UserMenu() {
  const { logout } = useAuth()
  const { user, partner } = usePartnerData()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close, btnRef)
  if (!user) return null
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
      <button ref={btnRef} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu" aria-label={`Account menu for ${user.name}`} className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-canvas">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">{initials(user.name)}</span>
        <span className="hidden max-w-[11rem] text-left leading-tight md:block">
          <span className="block truncate text-[0.82rem] font-semibold">{user.name}</span>
          <span className="block truncate text-[0.7rem] text-muted">{user.role}</span>
        </span>
      </button>
      {open && (
        <div role="menu" aria-label="Account" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-white p-1.5 shadow-pop">
          <div className="border-b border-line px-3 pb-2.5 pt-1.5">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <p className="mt-1 truncate text-xs text-muted">{partner?.companyName}</p>
          </div>
          <div className="pt-1.5">
            <Link role="menuitem" to="/company-profile" onClick={close} className={itemCls} autoFocus>
              <Building2 className="h-4 w-4 text-muted" aria-hidden="true" />
              Company profile
            </Link>
            <Link role="menuitem" to="/settings" onClick={close} className={itemCls}>
              <Settings className="h-4 w-4 text-muted" aria-hidden="true" />
              Settings
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
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Topbar({ onOpenNav, navOpen }) {
  const { pathname } = useLocation()
  const { partner } = usePartnerData()
  const section = sectionFor(pathname)?.label ?? ''
  return (
    <header className="no-print sticky top-0 z-30 flex h-[var(--header-h)] items-center gap-2 border-b border-line bg-white/95 px-3 backdrop-blur sm:gap-3 sm:px-5">
      <button type="button" onClick={onOpenNav} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-canvas lg:hidden" aria-label="Open navigation" aria-expanded={navOpen}>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="hidden shrink-0 text-sm font-semibold xl:block">{section}</p>
      <div className="min-w-0 flex-1 xl:flex xl:justify-center">
        <QuickSearch />
      </div>
      {partner && (
        <Link to="/company-profile" className="hidden items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-canvas 2xl:flex" title="Your company">
          <Building2 className="h-3.5 w-3.5 text-gold-deep" aria-hidden="true" />
          <span className="max-w-[14rem] truncate">{partner.companyName}</span>
        </Link>
      )}
      <NotificationMenu />
      <UserMenu />
    </header>
  )
}
