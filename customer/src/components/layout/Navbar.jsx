import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, Menu } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { mainNav } from '../../data/navigation'
import { images } from '../../data/images'
import useScrolled from '../../hooks/useScrolled'
import { EASE } from '../../lib/motion'
import { cn } from '../../lib/utils'
import Logo from '../common/Logo'
import SmartImage from '../common/SmartImage'
import MobileNavigation from './MobileNavigation'

function DesktopDropdown({ item }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const menuId = useId()
  const wrapRef = useRef(null)
  const closeTimer = useRef(0)
  // Set when the pointer opened the menu, so a click that follows a hover doesn't immediately close it.
  const openedByHover = useRef(false)
  const active = pathname.startsWith(item.to)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        wrapRef.current?.querySelector('button')?.focus()
      }
    }
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const show = () => {
    clearTimeout(closeTimer.current)
    if (!open) openedByHover.current = true
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <div className="flex items-center">
        <NavLink to={item.to} className={cn('nav-link', active && 'is-active')}>
          {item.label}
        </NavLink>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={`${open ? 'Hide' : 'Show'} ${item.label} menu`}
          onClick={() => {
            if (openedByHover.current) {
              openedByHover.current = false
              setOpen(true)
              return
            }
            setOpen((v) => !v)
          }}
          className="ml-0.5 flex h-8 w-6 items-center justify-center rounded text-white/70 transition-colors hover:text-white"
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            // Close after choosing any link inside the panel.
            onClick={(e) => e.target.closest('a') && setOpen(false)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute left-1/2 top-full z-10 w-[min(44rem,calc(100vw-4rem))] -translate-x-1/2 pt-4"
          >
            <div className="grid grid-cols-[1fr_15rem] overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-lift">
              <ul className="grid grid-cols-2 gap-1 p-4">
                {item.children.map((child) => (
                  <li key={child.to}>
                    <NavLink
                      to={child.to}
                      className={({ isActive }) =>
                        cn(
                          'block rounded px-4 py-3 transition-colors hover:bg-ivory focus-visible:bg-ivory',
                          isActive && 'bg-ivory',
                        )
                      }
                    >
                      <span className="block text-sm font-semibold text-navy">{child.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-body">{child.description}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Link to={item.to} className="group relative block min-h-56 overflow-hidden">
                <SmartImage image={images.portCranes} decorative width={480} sizes="240px" className="absolute inset-0 media-zoom" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold">Overview</p>
                  <p className="mt-1 flex items-center justify-between font-display text-2xl">
                    All services
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(140)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const solid = scrolled

  return (
    <>
      <motion.header
        key={solid ? 'fixed' : 'overlay'}
        initial={solid ? { y: '-100%' } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={cn(
          'inset-x-0 z-[var(--z-header)]',
          solid
            ? 'fixed top-0 border-b border-white/10 bg-midnight/90 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl'
            : 'absolute top-full border-b border-white/10 bg-transparent',
        )}
        data-solid={solid || undefined}
      >
        <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo imgClassName={solid ? 'h-12 lg:h-[3.25rem]' : 'h-12 sm:h-[3.25rem] lg:h-[3.75rem]'} />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="nav-list nav-overlay flex items-center gap-7">
              {mainNav.map((item) =>
                item.children ? (
                  <DesktopDropdown key={item.to} item={item} />
                ) : (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => cn('nav-link', isActive && 'is-active')}>
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/request-quote" className="btn btn-gold btn-sm hidden sm:inline-flex">
              Request a Quote
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 xl:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNavigation open={mobileOpen} onClose={closeMobile} />
    </>
  )
}
