import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown, MapPin, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { company } from '../../data/company'
import { mainNav } from '../../data/navigation'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'
import { EASE } from '../../lib/motion'
import { cn } from '../../lib/utils'
import Logo from '../common/Logo'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function MobileNavigation({ open, onClose }) {
  const { pathname } = useLocation()
  const panelRef = useRef(null)
  const [servicesOpen, setServicesOpen] = useState(pathname.startsWith('/services'))
  useLockBodyScroll(open)

  // Close on route change.
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname
      onClose()
    }
  }, [pathname, onClose])

  // Close when resized to desktop.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 1280px)')
    const onChange = (e) => e.matches && onClose()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open, onClose])

  // Focus management + Escape + focus trap.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const panel = panelRef.current
    const timer = setTimeout(() => panel?.querySelector(FOCUSABLE)?.focus(), 50)

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel) return
      const nodes = [...panel.querySelectorAll(FOCUSABLE)]
      if (!nodes.length) return
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
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[var(--z-drawer)] xl:hidden">
          <motion.div
            className="absolute inset-0 bg-midnight/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            id="mobile-navigation"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="on-dark absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-midnight text-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-8">
              <Logo onClick={onClose} imgClassName="h-12" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 px-5 py-6 sm:px-8">
              <ul className="divide-y divide-white/10">
                {mainNav.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: EASE }}
                  >
                    {item.children ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <NavLink
                            to={item.to}
                            end
                            className={({ isActive }) =>
                              cn('block py-4 font-display text-[1.9rem] leading-none transition-colors hover:text-gold', isActive && 'text-gold')
                            }
                          >
                            {item.label}
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => setServicesOpen((v) => !v)}
                            aria-expanded={servicesOpen}
                            aria-controls="mobile-services"
                            aria-label={`${servicesOpen ? 'Collapse' : 'Expand'} services list`}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            <ChevronDown className={cn('h-5 w-5 transition-transform duration-300', servicesOpen && 'rotate-180')} aria-hidden="true" />
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {servicesOpen && (
                            <motion.ul
                              id="mobile-services"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: EASE }}
                              className="overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <li key={child.to}>
                                  <NavLink
                                    to={child.to}
                                    className={({ isActive }) =>
                                      cn(
                                        'block border-l border-white/15 py-2.5 pl-4 text-[0.95rem] text-white/75 transition-colors hover:border-gold hover:text-white',
                                        isActive && 'border-gold text-white',
                                      )
                                    }
                                  >
                                    {child.label}
                                  </NavLink>
                                </li>
                              ))}
                              <li className="h-4" aria-hidden="true" />
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          cn('block py-4 font-display text-[1.9rem] leading-none transition-colors hover:text-gold', isActive && 'text-gold')
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 space-y-5 border-t border-white/10 px-5 py-6 sm:px-8">
              <Link to="/request-quote" className="btn btn-gold w-full">
                Request a Quote
                <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
              </Link>
              <p className="flex items-start gap-2.5 text-sm text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {company.address.full}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
