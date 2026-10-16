import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { PageLoader } from '../ui/States'
import GlobalSearch from './GlobalSearch'
import { NotificationsMenu, ProfileMenu } from './HeaderMenus'
import { NAV } from './nav'
import Sidebar from './Sidebar'

const COLLAPSE_KEY = 'mkh-admin-sidebar-collapsed'

function MobileDrawer({ open, onClose }) {
  const panelRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    panelRef.current?.querySelector('a, button')?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-midnight/60" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation" className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-pop">
        <button type="button" onClick={onClose} aria-label="Close navigation" className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <Sidebar mobile onNavigate={onClose} />
      </div>
    </div>
  )
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1'
    } catch {
      return false
    }
  })
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const section = NAV.find((n) => pathname.startsWith(n.to))?.label ?? ''

  const toggleCollapse = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1')
      } catch {
        // ignore
      }
      return !c
    })
  }

  // Scroll to top on route change (keep hash targets).
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only z-[100] rounded bg-gold px-3 py-2 font-semibold text-midnight focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>

      <aside
        className={cn(
          'no-print fixed inset-y-0 left-0 z-40 hidden md:block',
          'md:w-[var(--sidebar-w-collapsed)]',
          collapsed ? 'lg:w-[var(--sidebar-w-collapsed)]' : 'lg:w-[var(--sidebar-w)]',
        )}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </aside>
      <MobileDrawer open={mobileOpen} onClose={closeMobile} />

      <div className={cn('app-content md:pl-[var(--sidebar-w-collapsed)]', collapsed ? 'lg:pl-[var(--sidebar-w-collapsed)]' : 'lg:pl-[var(--sidebar-w)]')}>
        <header className="no-print sticky top-0 z-30 flex h-[var(--header-h)] items-center gap-3 border-b border-line bg-white/95 px-3 backdrop-blur sm:px-5">
          <button type="button" onClick={() => setMobileOpen(true)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-canvas md:hidden" aria-label="Open navigation" aria-expanded={mobileOpen}>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="hidden shrink-0 text-sm font-semibold text-ink lg:block" aria-hidden="true">{section}</p>
          <div className="min-w-0 flex-1 lg:flex lg:justify-center">
            <GlobalSearch />
          </div>
          <span className="hidden shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-gold-deep xl:inline" title="All records are fictional sample data. Changes are saved only in this browser.">
            Demo data
          </span>
          <NotificationsMenu />
          <ProfileMenu />
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-3 py-5 outline-none sm:px-5 lg:px-7 lg:py-7">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
