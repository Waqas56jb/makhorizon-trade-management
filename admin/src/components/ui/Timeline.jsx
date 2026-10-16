import { StickyNote } from 'lucide-react'
import { cn } from '../../lib/utils'
import { StatusBadge } from './Badge'

/** Status history list (newest first). */
export default function Timeline({ entries, formatDate }) {
  const list = [...entries].reverse()
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {list.map((h, i) => (
        <li key={i} className="relative">
          <span className={cn('absolute -left-[1.6rem] top-1 flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-white', i === 0 ? 'bg-gold' : 'bg-[#c5ced6]')} aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">
            {h.isNote ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
                <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                Note
              </span>
            ) : (
              <StatusBadge status={h.status} />
            )}
            <span className="num text-xs text-muted">{formatDate(h.date)}</span>
          </div>
          {h.note && <p className="mt-1 text-sm">{h.note}</p>}
        </li>
      ))}
    </ol>
  )
}
