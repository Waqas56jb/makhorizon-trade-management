import { Check, CircleDot, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHIPMENT_STAGES } from '../../data/shipments'
import { formatDateTime } from '../../lib/format'
import { cn } from '../../lib/utils'
import { StatusBadge } from './Badge'

/** Chronological activity feed. items: { id, at, message, status?, link? } */
export function ActivityTimeline({ items, limit }) {
  const list = limit ? items.slice(0, limit) : items
  return (
    <ol className="relative space-y-4 p-5">
      {list.map((a, i) => (
        <li key={a.id} className="relative flex gap-3">
          {i < list.length - 1 && <span className="absolute left-[0.3rem] top-4 h-[calc(100%+0.5rem)] w-px bg-line" aria-hidden="true" />}
          <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-gold bg-white" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {a.link ? (
                <Link to={a.link} className="text-sm font-medium hover:text-gold-deep hover:underline">
                  {a.message}
                </Link>
              ) : (
                <p className="text-sm font-medium">{a.message}</p>
              )}
              {a.status && <StatusBadge status={a.status} />}
            </div>
            <p className="num mt-0.5 text-xs text-muted">{formatDateTime(a.at)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Status history list (newest last, as it happened). items: { at, status, by?, note? } */
export function StatusHistory({ items }) {
  return (
    <ol className="space-y-3">
      {items.map((h, i) => (
        <li key={`${h.at}-${i}`} className="flex gap-3">
          <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', i === items.length - 1 ? 'bg-gold' : 'bg-slate-300')} aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={h.status} />
              <span className="num text-xs text-muted">{formatDateTime(h.at)}</span>
            </div>
            {(h.by || h.note) && (
              <p className="mt-1 text-[0.82rem] text-ink">
                {h.note}
                {h.by && <span className="text-muted">{h.note ? ' · ' : ''}by {h.by}</span>}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * Seven-stage shipment progress. Only stages actually reached (per the record) are
 * marked complete; a delay is shown on the current stage. Not live tracking.
 */
export function ShipmentTimeline({ shipment }) {
  const reachedAt = (i) => shipment.events.filter((e) => e.stage === i).at(0)?.at
  return (
    <ol className="grid gap-0 md:grid-cols-7" aria-label="Shipment progress">
      {SHIPMENT_STAGES.map((stage, i) => {
        const done = i < shipment.stage || (i === shipment.stage && (shipment.status === 'Delivered' || i === 0))
        const current = i === shipment.stage && !done
        const delayed = current && shipment.delayed
        const at = i <= shipment.stage ? reachedAt(i) : null
        const state = done ? 'completed' : delayed ? 'delayed' : current ? 'current' : 'upcoming'
        return (
          <li key={stage} className="relative flex gap-3 pb-5 md:flex-col md:items-center md:gap-2 md:pb-0 md:text-center">
            {i < SHIPMENT_STAGES.length - 1 && (
              <span className={cn('absolute left-[0.94rem] top-8 h-[calc(100%-2rem)] w-0.5 md:left-[calc(50%+1.1rem)] md:top-[0.94rem] md:h-0.5 md:w-[calc(100%-2.2rem)]', i < shipment.stage ? 'bg-gold' : 'bg-line')} aria-hidden="true" />
            )}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                done && 'border-gold bg-gold text-midnight',
                current && !delayed && 'border-navy bg-white text-navy',
                delayed && 'border-danger bg-danger/10 text-danger',
                state === 'upcoming' && 'border-line bg-white text-muted',
              )}
              aria-hidden="true"
            >
              {done ? <Check className="h-4 w-4" /> : delayed ? <TriangleAlert className="h-4 w-4" /> : current ? <CircleDot className="h-4 w-4" /> : <span className="text-[0.7rem] font-semibold">{i + 1}</span>}
            </span>
            <div className="min-w-0 pt-1 md:pt-0">
              <p className={cn('text-[0.8rem] font-semibold leading-tight', state === 'upcoming' ? 'text-muted' : 'text-ink')}>{stage}</p>
              <p className={cn('text-[0.7rem]', delayed ? 'font-semibold text-danger' : 'text-muted')}>
                {state === 'completed' ? 'Completed' : delayed ? 'Delayed' : current ? 'Current stage' : 'Pending'}
                {at && <span className="num block">{formatDateTime(at)}</span>}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
