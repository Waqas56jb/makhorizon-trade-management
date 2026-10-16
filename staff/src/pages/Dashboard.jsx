import { useMemo, useState } from 'react'
import { CalendarCheck2, ChevronRight, ListTodo, Ship, TriangleAlert, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import TaskActions from '../components/tasks/TaskActions'
import { Badge, PriorityBadge, StatusBadge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/States'
import { fmtDate, fmtDateTime } from '../hooks/useFormat'
import useMine from '../hooks/useMine'
import usePageTitle from '../hooks/usePageTitle'
import { relativeDays } from '../lib/dates'
import { isDueToday, isOpen, isOverdue, shipmentAttention, sortTasks, taskDisplayStatus } from '../lib/selectors'
import { cn } from '../lib/utils'

function greeting(now) {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function SummaryCard({ to, label, value, hint, icon: Icon, tone }) {
  const toneCls = { navy: 'bg-navy/5 text-navy', warning: 'bg-warning/10 text-warning', danger: 'bg-danger/10 text-danger', gold: 'bg-gold/15 text-gold-deep' }[tone]
  return (
    <Link to={to} className="card flex items-center gap-4 p-3.5 transition-shadow hover:shadow-pop focus-visible:shadow-pop sm:p-4">
      <span className={cn('hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg sm:flex', toneCls)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-muted">{label}</span>
        <span className="num block text-2xl font-semibold leading-tight">{value}</span>
        {hint && <span className="block truncate text-xs text-muted">{hint}</span>}
      </span>
    </Link>
  )
}

export default function Dashboard() {
  usePageTitle('Dashboard')
  const mine = useMine()
  // Captured once per visit for the greeting and date line.
  const [now] = useState(() => new Date())
  const first = mine.employee?.name.split(' ')[0] ?? ''

  const d = useMemo(() => {
    const open = mine.tasks.filter(isOpen)
    const activeShipments = mine.shipments.filter((s) => !['Delivered', 'Cancelled'].includes(s.status))
    return {
      dueToday: mine.tasks.filter(isDueToday),
      inProgress: mine.tasks.filter((t) => t.status === 'In Progress'),
      overdue: mine.tasks.filter(isOverdue),
      activeShipments,
      // Today's focus: overdue + due today first, then the next open tasks.
      focus: sortTasks(open).slice(0, 5),
      attention: activeShipments.map((s) => ({ s, reason: shipmentAttention(s, mine.state) })).filter((x) => x.reason),
    }
  }, [mine])

  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <section className="mb-6 flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">{today}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting(now)}, {first}
        </h1>
        <p className="text-sm text-muted">Here is your work overview for today.</p>
      </section>

      {d.overdue.length > 0 && (
        <div role="alert" className="mb-5 flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-sm">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            <span>
              <strong>
                You have {d.overdue.length} overdue task{d.overdue.length > 1 ? 's' : ''}.
              </strong>{' '}
              Please update or report a blocker.
            </span>
          </p>
          <ButtonLink to="/my-tasks?view=overdue" size="sm">
            View overdue tasks
          </ButtonLink>
        </div>
      )}

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard to="/my-tasks?view=today" label="Tasks due today" value={d.dueToday.length} icon={CalendarCheck2} tone={d.dueToday.length ? 'warning' : 'navy'} />
        <SummaryCard to="/my-tasks?status=In%20Progress" label="Tasks in progress" value={d.inProgress.length} icon={Timer} tone="gold" />
        <SummaryCard to="/my-tasks?view=overdue" label="Overdue tasks" value={d.overdue.length} icon={ListTodo} tone={d.overdue.length ? 'danger' : 'navy'} />
        <SummaryCard to="/my-shipments" label="Assigned shipments" value={d.activeShipments.length} hint={`${d.attention.length} need${d.attention.length === 1 ? 's' : ''} an update`} icon={Ship} tone="navy" />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="My tasks today" description="Overdue and due-today tasks first." actions={<Link to="/my-tasks" className="text-xs font-semibold text-navy hover:underline">All my tasks</Link>} />
          {d.focus.length === 0 ? (
            <EmptyState title="No open tasks" message="You have completed all your assigned tasks." />
          ) : (
            <ul className="divide-y divide-line">
              {d.focus.map((t) => {
                const order = mine.orderById(t.orderId)
                const sh = mine.shipmentById(t.shipmentId)
                return (
                  <li key={t.id} className={cn('flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center', isOverdue(t) && 'bg-danger/[0.03]')}>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={taskDisplayStatus(t)} />
                        <PriorityBadge priority={t.priority} />
                        <span className={cn('text-xs', isOverdue(t) ? 'font-semibold text-danger' : isDueToday(t) ? 'font-semibold text-warning' : 'text-muted')}>
                          {isOverdue(t) ? `Overdue (${relativeDays(t.dueDate)})` : isDueToday(t) ? 'Due today' : `Due ${fmtDate(t.dueDate)}`}
                        </span>
                      </div>
                      <Link to={`/tasks/${t.id}`} className="mt-1 block truncate text-sm font-semibold hover:text-gold-deep hover:underline">
                        {t.title}
                      </Link>
                      <p className="truncate text-xs text-muted">{[t.reference, order?.number, sh?.reference].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <TaskActions task={t} compact />
                      <Link to={`/tasks/${t.id}`} className="btn btn-ghost btn-sm" aria-label={`View task ${t.reference}`}>
                        View
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Shipment updates needed" description="Your shipments that need attention · demo data" />
            {d.attention.length === 0 ? (
              <EmptyState title="All shipments are up to date" />
            ) : (
              <ul className="divide-y divide-line">
                {d.attention.map(({ s, reason }) => (
                  <li key={s.id}>
                    <Link to={`/shipments/${s.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                          {s.reference} <StatusBadge status={s.status} />
                        </p>
                        <p className="truncate text-xs text-muted">
                          {s.origin} → {s.destination}
                        </p>
                        <Badge tone={s.status === 'Delayed' ? 'danger' : 'warning'} className="mt-1">
                          {reason}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Recent activity" description="Your latest actions in this demo." />
            {mine.activity.length === 0 ? (
              <EmptyState title="No activity yet" />
            ) : (
              <ol className="space-y-3 p-5">
                {mine.activity.slice(0, 6).map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      {a.link ? (
                        <Link to={a.link} className="text-sm hover:underline">
                          {a.message}
                        </Link>
                      ) : (
                        <p className="text-sm">{a.message}</p>
                      )}
                      <p className="num text-xs text-muted">
                        {fmtDateTime(a.at)}
                        {a.simulated && ' · simulated'}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
