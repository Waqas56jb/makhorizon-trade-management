import { useCallback, useMemo, useRef, useState } from 'react'
import { Bell, CheckCheck, LogOut, Settings, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useDismiss from '../../hooks/useDismiss'
import { useAuth } from '../../lib/auth'
import { computeNotifications } from '../../lib/notifications'
import { useAppState } from '../../lib/store'
import { cn, initials } from '../../lib/utils'
import { notificationService } from '../../services/settingsService'

const DOT = { danger: 'bg-danger', warning: 'bg-warning', info: 'bg-info' }

export function NotificationsMenu() {
  const state = useAppState()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close, btnRef)

  const items = useMemo(() => computeNotifications(state), [state])
  const unread = items.filter((n) => !n.read)

  const openItem = (n) => {
    notificationService.markRead(n.id)
    setOpen(false)
    navigate(n.link)
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ''}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-canvas"
      >
        <Bell className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
        {unread.length > 0 && <span className="num absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.6rem] font-bold text-white">{unread.length}</span>}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-[calc(var(--header-h)-0.25rem)] z-50 rounded-xl border border-line bg-white shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted">Generated from current demo records</p>
            </div>
            <button
              type="button"
              onClick={() => notificationService.markAllRead(items.map((n) => n.id))}
              disabled={unread.length === 0}
              className="btn btn-ghost btn-sm"
            >
              <CheckCheck aria-hidden="true" />
              Mark all read
            </button>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">You’re all caught up. No alerts right now.</p>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto">
              {items.map((n) => (
                <li key={n.id} className="flex items-start">
                  <button type="button" onClick={() => openItem(n)} className={cn('flex flex-1 items-start gap-3 px-4 py-3 text-left hover:bg-canvas', !n.read && 'bg-[#fbf8f1]')}>
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', DOT[n.severity])} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className={cn('block text-sm', n.read ? 'text-muted' : 'font-semibold text-ink')}>{n.title}</span>
                      <span className="block truncate text-xs text-muted">{n.message}</span>
                    </span>
                    {!n.read && <span className="sr-only">(unread)</span>}
                  </button>
                  {!n.read && (
                    <button type="button" onClick={() => notificationService.markRead(n.id)} className="m-2 shrink-0 rounded px-1.5 py-1 text-[0.7rem] font-semibold text-muted hover:bg-canvas hover:text-ink" aria-label={`Mark "${n.title}" as read`}>
                      Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export function ProfileMenu() {
  const { logout } = useAuth()
  const profile = useAppState().settings.profile
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close, btnRef)

  // The route guard redirects to /login with a signed-out message.
  const signOut = () => {
    setOpen(false)
    logout()
  }

  const onMenuKey = (e) => {
    const items = [...ref.current.querySelectorAll('[role=menuitem]')]
    const i = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length]?.focus()
    }
  }

  const itemCls = 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink hover:bg-canvas focus-visible:bg-canvas'

  return (
    <div ref={ref} className="relative" onKeyDown={onMenuKey}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${profile.name}`}
        className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-canvas"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">{initials(profile.name)}</span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[0.82rem] font-semibold text-ink">{profile.name}</span>
          <span className="block text-[0.7rem] text-muted">{profile.role}</span>
        </span>
      </button>
      {open && (
        <div role="menu" aria-label="Account" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-line bg-white p-1.5 shadow-pop">
          <div className="border-b border-line px-3 pb-2.5 pt-1.5">
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="truncate text-xs text-muted">{profile.email}</p>
          </div>
          <div className="pt-1.5">
            <Link role="menuitem" to="/settings#profile" onClick={close} className={itemCls} autoFocus>
              <User className="h-4 w-4 text-muted" aria-hidden="true" />
              Profile
            </Link>
            <Link role="menuitem" to="/settings" onClick={close} className={itemCls}>
              <Settings className="h-4 w-4 text-muted" aria-hidden="true" />
              Settings
            </Link>
            <button role="menuitem" type="button" onClick={signOut} className={cn(itemCls, 'text-danger')}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
