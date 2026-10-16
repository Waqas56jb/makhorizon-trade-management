import { cn } from '../../lib/utils'

export function Card({ as: Comp = 'section', className, children, ...rest }) {
  return (
    <Comp className={cn('card', className)} {...rest}>
      {children}
    </Comp>
  )
}

export function CardHeader({ title, description, actions, className, as: Heading = 'h2' }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4', className)}>
      <div className="min-w-0">
        <Heading className="text-[0.95rem] font-semibold">{title}</Heading>
        {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Label/value grid for detail pages. */
export function DetailList({ items, columns = 2, className }) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4', columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : '', className)}>
      {items
        .filter((i) => !i.hidden)
        .map((i) => (
          <div key={i.label} className={cn('min-w-0', i.full && 'sm:col-span-full')}>
            <dt className="text-[0.72rem] font-medium uppercase tracking-wide text-muted">{i.label}</dt>
            <dd className="mt-0.5 break-words text-[0.875rem] text-ink">{i.value || i.value === 0 ? i.value : <span className="text-muted">—</span>}</dd>
          </div>
        ))}
    </dl>
  )
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'navy', to, LinkComp }) {
  const toneCls = { navy: 'bg-navy/5 text-navy', gold: 'bg-gold/15 text-gold-deep', success: 'bg-success/10 text-success', warning: 'bg-warning/10 text-warning', danger: 'bg-danger/10 text-danger' }[tone]
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted">{label}</p>
        {Icon && (
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', toneCls)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="num mt-1 text-xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </>
  )
  if (to && LinkComp)
    return (
      <LinkComp to={to} className="card block p-4 transition-shadow hover:shadow-pop focus-visible:shadow-pop">
        {body}
      </LinkComp>
    )
  return <div className="card p-4">{body}</div>
}
