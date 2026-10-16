import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

const TONES = { navy: 'bg-navy/5 text-navy', gold: 'bg-gold/15 text-gold-deep', success: 'bg-success/10 text-success', warning: 'bg-warning/10 text-warning', danger: 'bg-danger/10 text-danger' }

/** Restrained KPI tile. `hint` is only shown when the data supports it. */
export default function KpiCard({ label, value, hint, icon: Icon, tone = 'navy', to }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.8rem] font-medium text-muted">{label}</p>
        {Icon && (
          <span className={cn('hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:flex', TONES[tone])}>
            <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="num mt-1 text-[1.75rem] font-semibold leading-none tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </>
  )
  const cls = 'card block p-4 sm:p-5'
  // In-page targets (e.g. "#pending-actions") use a plain anchor so the browser scrolls.
  if (to?.startsWith('#'))
    return (
      <a href={to} className={cn(cls, 'transition-shadow hover:shadow-pop focus-visible:shadow-pop')}>
        {body}
      </a>
    )
  return to ? (
    <Link to={to} className={cn(cls, 'transition-shadow hover:shadow-pop focus-visible:shadow-pop')}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}
