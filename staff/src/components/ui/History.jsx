import { ArrowRight, StickyNote } from 'lucide-react'
import { fmtDateTime } from '../../hooks/useFormat'
import { cn } from '../../lib/utils'
import { StatusBadge } from './Badge'

/** Status history: entries {at, from, to, by, note, isNote}. Newest first. */
export default function History({ entries }) {
  const list = [...entries].reverse()
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {list.map((h, i) => (
        <li key={`${h.at}-${i}`} className="relative">
          <span className={cn('absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full ring-4 ring-white', i === 0 ? 'bg-gold' : 'bg-[#c5ced6]')} aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-1.5">
            {h.isNote ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
                <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                Note
              </span>
            ) : (
              <>
                {h.from && (
                  <>
                    <StatusBadge status={h.from} />
                    <ArrowRight className="h-3.5 w-3.5 text-muted" aria-label="to" />
                  </>
                )}
                <StatusBadge status={h.to ?? h.status} />
              </>
            )}
          </div>
          <p className="num mt-1 text-xs text-muted">
            {fmtDateTime(h.at)} · {h.by}
          </p>
          {h.note && <p className="mt-1 text-sm">{h.note}</p>}
        </li>
      ))}
    </ol>
  )
}

/** Simple list of notes/updates {id, at, by, text}. */
export function NotesList({ notes, empty = 'No notes yet.' }) {
  if (!notes.length) return <p className="text-sm text-muted">{empty}</p>
  return (
    <ul className="space-y-3">
      {[...notes].reverse().map((n) => (
        <li key={n.id} className="rounded-lg bg-canvas p-3">
          <p className="whitespace-pre-line text-sm">{n.text}</p>
          <p className="num mt-1 text-xs text-muted">
            {n.by} · {fmtDateTime(n.at)}
          </p>
        </li>
      ))}
    </ul>
  )
}
