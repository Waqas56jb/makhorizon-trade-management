import { CalendarClock, ClipboardList, Ship, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fmtDate } from '../../hooks/useFormat'
import { relativeDays } from '../../lib/dates'
import { isDueToday, isOverdue, taskDisplayStatus } from '../../lib/selectors'
import { cn } from '../../lib/utils'
import { PriorityBadge, StatusBadge } from '../ui/Badge'
import TaskActions from './TaskActions'

/** Task summary card used on the dashboard and task list. */
export default function TaskCard({ task, order, shipment, assignedByName, showDescription = true }) {
  const overdue = isOverdue(task)
  const today = isDueToday(task)
  const done = task.status === 'Completed'

  return (
    <article className={cn('card flex h-full flex-col p-4 transition-shadow hover:shadow-pop', overdue && 'border-danger/40', done && 'bg-[#fafbfc]')} aria-labelledby={`task-${task.id}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={taskDisplayStatus(task)} />
        <PriorityBadge priority={task.priority} />
        <span className="ml-auto font-mono text-[0.7rem] text-muted">{task.reference}</span>
      </div>
      <h3 id={`task-${task.id}`} className={cn('mt-2.5 text-[0.95rem] font-semibold leading-snug', done && 'text-muted line-through decoration-muted/50')}>
        <Link to={`/tasks/${task.id}`} className="hover:text-gold-deep hover:underline">
          {task.title}
        </Link>
      </h3>
      {showDescription && <p className="mt-1 line-clamp-2 text-sm text-muted">{task.description}</p>}

      <dl className="mt-3 space-y-1.5 text-xs">
        <div className={cn('flex items-center gap-1.5', overdue ? 'font-semibold text-danger' : today ? 'font-semibold text-warning' : 'text-muted')}>
          <dt className="sr-only">Due</dt>
          <dd className="flex items-center gap-1.5">
            {overdue ? <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            {done ? `Completed ${fmtDate(task.completedAt?.slice(0, 10))}` : overdue ? `Overdue · due ${fmtDate(task.dueDate)} (${relativeDays(task.dueDate)})` : today ? 'Due today' : `Due ${fmtDate(task.dueDate)}`}
          </dd>
        </div>
        {order && (
          <div className="flex items-center gap-1.5 text-muted">
            <dt className="sr-only">Order</dt>
            <dd className="flex min-w-0 items-center gap-1.5">
              <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
              {order.number} · {order.client.company}
              </span>
            </dd>
          </div>
        )}
        {shipment && (
          <div className="flex items-center gap-1.5 text-muted">
            <dt className="sr-only">Shipment</dt>
            <dd className="flex items-center gap-1.5">
              <Ship className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {shipment.reference}
            </dd>
          </div>
        )}
        {assignedByName && (
          <div className="text-muted">
            <dt className="inline">Assigned by </dt>
            <dd className="inline">{assignedByName}</dd>
          </div>
        )}
      </dl>
      {task.status === 'Blocked' && task.blockedReason && <p className="mt-2 rounded-md bg-danger/5 px-2.5 py-1.5 text-xs text-danger">Blocked: {task.blockedReason}</p>}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <TaskActions task={task} compact />
        <Link to={`/tasks/${task.id}`} className="btn btn-ghost btn-sm" aria-label={`View task ${task.reference}`}>
          View task
        </Link>
      </div>
    </article>
  )
}
