import { NavLink, useLocation } from 'react-router-dom'
import logoSrc from '../../assets/brand/logo.webp'
import useMine from '../../hooks/useMine'
import { isOverdue, shipmentAttention } from '../../lib/selectors'
import { cn } from '../../lib/utils'
import { NAV } from './nav'

const BADGE_LABEL = { tasks: 'overdue tasks', shipments: 'shipments need attention', notifications: 'unread notifications' }

export default function Sidebar({ onNavigate }) {
  const mine = useMine()
  const { pathname } = useLocation()
  const counts = {
    tasks: mine.tasks.filter(isOverdue).length,
    shipments: mine.shipments.filter((s) => shipmentAttention(s, mine.state)).length,
    notifications: mine.notifications.filter((n) => !n.read).length,
  }

  return (
    <div className="on-dark flex h-full flex-col bg-midnight text-white">
      <div className="flex h-[var(--header-h)] shrink-0 items-center border-b border-white/10 px-5">
        <NavLink to="/dashboard" onClick={onNavigate} aria-label="MAKHORIZON Staff Portal — dashboard">
          <img src={logoSrc} alt="" width="640" height="173" className="h-11 w-auto" />
        </NavLink>
      </div>
      <p className="px-5 pb-1 pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold/80">Staff Portal</p>
      <nav aria-label="Main" className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1">
        <ul className="space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, badge, match }) => {
            const active = (match ?? [to]).some((m) => pathname.startsWith(m))
            const count = badge ? counts[badge] : 0
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn('group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.86rem] font-medium transition-colors', active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white')}
                >
                  {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-gold" aria-hidden="true" />}
                  <Icon className={cn('h-[1.1rem] w-[1.1rem] shrink-0', active ? 'text-gold' : 'text-white/60 group-hover:text-white/90')} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <span className={cn('num rounded-full px-1.5 text-[0.65rem] font-bold leading-[1.1rem]', badge === 'notifications' ? 'bg-gold text-midnight' : 'bg-danger text-white')}>
                      {count}
                      <span className="sr-only"> {BADGE_LABEL[badge]}</span>
                    </span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      <p className="border-t border-white/10 px-5 py-3 text-[0.7rem] text-white/45">Demo mode · fictional data</p>
    </div>
  )
}
