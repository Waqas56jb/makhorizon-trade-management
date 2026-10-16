import { ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import logoMark from '../../assets/brand/logo-mark.webp'
import logoSrc from '../../assets/brand/logo.webp'
import usePartnerData from '../../hooks/usePartnerData'
import { useAuth } from '../../lib/auth'
import { cn } from '../../lib/utils'
import { NAV_GROUPS } from './nav'

const BADGE_LABEL = {
  quotations: 'quotations need your revision',
  orders: 'orders awaiting confirmation',
  documents: 'documents requested',
  messages: 'unread messages',
  notifications: 'unread notifications',
}

/** Desktop sidebar (optionally collapsed to icons) and mobile drawer content. */
export default function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }) {
  const data = usePartnerData()
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const counts = {
    quotations: data.kpis.revisions,
    orders: data.kpis.toConfirm,
    documents: data.kpis.requestedDocs,
    messages: data.unreadMessages,
    notifications: data.unreadNotifications,
  }

  return (
    <div className="on-dark flex h-full flex-col bg-midnight text-white">
      <div className={cn('flex h-[var(--header-h)] shrink-0 items-center border-b border-white/10', collapsed ? 'justify-center px-2' : 'px-5')}>
        <NavLink to="/dashboard" onClick={onNavigate} aria-label="MAKHORIZON Partner Portal — overview">
          {collapsed ? <img src={logoMark} alt="" width="240" height="186" className="h-8 w-auto" /> : <img src={logoSrc} alt="" width="640" height="173" className="h-11 w-auto" />}
        </NavLink>
      </div>
      {!collapsed && <p className="px-5 pb-1 pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold/80">Partner Portal</p>}
      <nav aria-label="Main" className={cn('scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-4', collapsed ? 'px-2 pt-3' : 'px-3 pt-1')}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-3 first:mt-1">
            {collapsed ? <div className="mx-2 mb-2 border-t border-white/10" aria-hidden="true" /> : <p className="px-3 pb-1 text-[0.65rem] font-medium uppercase tracking-wider text-white/40">{group.label}</p>}
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, badge }) => {
                const active = pathname === to || pathname.startsWith(`${to}/`)
                const count = badge ? counts[badge] : 0
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={onNavigate}
                      title={collapsed ? label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg py-2.5 text-[0.86rem] font-medium transition-colors',
                        collapsed ? 'justify-center px-2' : 'px-3',
                        active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-gold" aria-hidden="true" />}
                      <Icon className={cn('h-[1.1rem] w-[1.1rem] shrink-0', active ? 'text-gold' : 'text-white/60 group-hover:text-white/90')} aria-hidden="true" />
                      <span className={collapsed ? 'sr-only' : 'flex-1'}>{label}</span>
                      {count > 0 &&
                        (collapsed ? (
                          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold ring-2 ring-midnight">
                            <span className="sr-only">
                              {count} {BADGE_LABEL[badge]}
                            </span>
                          </span>
                        ) : (
                          <span className={cn('num rounded-full px-1.5 text-[0.65rem] font-bold leading-[1.1rem]', ['messages', 'notifications'].includes(badge) ? 'bg-gold text-midnight' : 'bg-white/90 text-midnight')}>
                            {count}
                            <span className="sr-only"> {BADGE_LABEL[badge]}</span>
                          </span>
                        ))}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        <div className={cn('mt-3 border-t border-white/10 pt-3')}>
          <button
            type="button"
            onClick={() => {
              onNavigate?.()
              logout()
            }}
            title={collapsed ? 'Logout' : undefined}
            className={cn('flex w-full items-center gap-3 rounded-lg py-2.5 text-[0.86rem] font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white', collapsed ? 'justify-center px-2' : 'px-3')}
          >
            <LogOut className="h-[1.1rem] w-[1.1rem] shrink-0 text-white/60" aria-hidden="true" />
            <span className={collapsed ? 'sr-only' : ''}>Logout</span>
          </button>
        </div>
      </nav>
      <div className={cn('flex items-center border-t border-white/10 py-2', collapsed ? 'justify-center px-2' : 'justify-between pl-5 pr-2')}>
        {!collapsed && <p className="text-[0.7rem] text-white/45">Demo mode · fictional data</p>}
        {onToggleCollapse && (
          <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white">
            {collapsed ? <ChevronsRight className="h-4 w-4" aria-hidden="true" /> : <ChevronsLeft className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  )
}
