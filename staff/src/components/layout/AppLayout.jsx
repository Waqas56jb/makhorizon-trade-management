import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '../ui/States'
import Header from './Header'
import Sidebar from './Sidebar'

function MobileDrawer({ open, onClose }) {
  const panelRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    const panel = panelRef.current
    panel?.querySelector('a, button')?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel) return
      const nodes = [...panel.querySelectorAll('a, button')]
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-midnight/60" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation" className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-pop">
        <Sidebar onNavigate={onClose} />
        <button type="button" onClick={onClose} aria-label="Close navigation" className="absolute right-3 top-5 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const closeNav = useCallback(() => setNavOpen(false), [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only z-[100] rounded bg-gold px-3 py-2 font-semibold text-midnight focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-w)] lg:block">
        <Sidebar />
      </aside>
      <MobileDrawer open={navOpen} onClose={closeNav} />
      <div className="lg:pl-[var(--sidebar-w)]">
        <Header onOpenNav={() => setNavOpen(true)} navOpen={navOpen} />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[84rem] px-3 py-5 outline-none sm:px-5 lg:px-7 lg:py-7">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
