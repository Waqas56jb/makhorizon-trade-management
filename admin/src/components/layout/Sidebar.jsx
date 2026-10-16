import { useMemo } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logoSrc from '../../assets/brand/logo.webp'
import markSrc from '../../assets/brand/logo-mark.webp'
import { invoiceStatus, stockStatus } from '../../lib/calc'
import { useAppState } from '../../lib/store'
import { cn } from '../../lib/utils'
import { NAV } from './nav'


function useAttentionCounts() {
  const s = useAppState()
  return useMemo(
    () => ({
      shipments: s.shipments.filter((x) => x.status === 'Delayed').length,
      inventory: s.inventory.filter((i) => stockStatus(i) !== 'In Stock').length,
      finances: s.invoices.filter((i) => invoiceStatus(i, s.payments) === 'Overdue').length,
    }),
    [s.shipments, s.inventory, s.invoices, s.payments],
  )
}

const BADGE_LABEL = { shipments: 'delayed', inventory: 'low or out of stock', finances: 'overdue invoices' }

/**
 * @param collapsed icon-only rail (desktop toggle). Tablets (md–lg) always show the rail.
 * @param mobile    rendered inside the mobile drawer (always expanded).
 */
export default function Sidebar({ collapsed = false, onToggleCollapse, mobile = false, onNavigate }) {
  const counts = useAttentionCounts()
  const rail = !mobile && collapsed

  return (
    <div className="on-dark flex h-full flex-col bg-midnight text-white">
      <div className={cn('flex h-[var(--header-h)] shrink-0 items-center border-b border-white/10', rail ? 'justify-center px-2' : 'px-5', !mobile && 'max-lg:justify-center max-lg:px-2')}>
        <NavLink to="/dashboard" onClick={onNavigate} aria-label="MAKHORIZON Admin — dashboard" className="flex items-center">
          <img src={logoSrc} alt="" width="640" height="173" className={cn('h-11 w-auto', rail && 'hidden', !mobile && 'max-lg:hidden')} />
          <img src={markSrc} alt="" width="240" height="186" className={cn('h-8 w-auto', rail ? 'block' : 'hidden', !mobile && 'max-lg:block')} />
        </NavLink>
      </div>
      <p className={cn('px-5 pb-1 pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold/80', rail && 'sr-only', !mobile && 'max-lg:sr-only')}>Management</p>

      <nav aria-label="Main" className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1 max-lg:pt-3">
        <ul className="space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, badge }) => {
            const count = badge ? counts[badge] : 0
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  title={mobile ? undefined : label}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[0.84rem] font-medium transition-colors',
                      isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                      rail && 'justify-center px-0',
                      !mobile && 'max-lg:justify-center max-lg:px-0',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-gold" aria-hidden="true" />}
                      <Icon className={cn('h-[1.1rem] w-[1.1rem] shrink-0', isActive ? 'text-gold' : 'text-white/60 group-hover:text-white/90')} aria-hidden="true" />
                      <span className={cn('flex-1', rail && 'sr-only', !mobile && 'max-lg:sr-only')}>{label}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            'num rounded-full bg-danger px-1.5 text-[0.65rem] font-bold leading-[1.1rem] text-white',
                            rail && 'absolute right-1.5 top-1',
                            !mobile && 'max-lg:absolute max-lg:right-1.5 max-lg:top-1',
                          )}
                        >
                          {count}
                          <span className="sr-only"> {BADGE_LABEL[badge]}</span>
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {!mobile && (
        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white', rail && 'justify-center px-0')}
            aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {rail ? <PanelLeftOpen className="h-4 w-4" aria-hidden="true" /> : <PanelLeftClose className="h-4 w-4" aria-hidden="true" />}
            {!rail && 'Collapse'}
          </button>
        </div>
      )}
    </div>
  )
}
