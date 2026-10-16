import { ArrowDown, ArrowUp, ChevronsUp, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

const tones = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
  gold: 'bg-[#f6efe1] text-gold-deep ring-[#e8d8b6]',
}

// One mapping for every status in the portal keeps colours consistent.
const STATUS_TONES = {
  'To Do': 'neutral', 'In Progress': 'gold', Completed: 'success', Blocked: 'danger', 'Pending Review': 'info',
  Confirmed: 'info', Processing: 'gold', 'Awaiting Documents': 'warning', 'Ready for Dispatch': 'info', Cancelled: 'neutral',
  Planned: 'neutral', 'In Transit': 'gold', Arrived: 'info', Delivered: 'success', Delayed: 'danger',
  Verified: 'success', Draft: 'neutral', Requested: 'warning',
  Active: 'success',
}

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.72rem] font-semibold ring-1 ring-inset', tones[tone], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? 'neutral'} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {status}
    </Badge>
  )
}

const PRIORITY = {
  Low: { tone: 'neutral', icon: ArrowDown },
  Normal: { tone: 'info', icon: Minus },
  High: { tone: 'warning', icon: ArrowUp },
  Urgent: { tone: 'danger', icon: ChevronsUp },
}

/** Priority shown with an icon + label (never colour alone). */
export function PriorityBadge({ priority, className }) {
  const p = PRIORITY[priority] ?? PRIORITY.Normal
  const Icon = p.icon
  return (
    <Badge tone={p.tone} className={className}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {priority}
      <span className="sr-only"> priority</span>
    </Badge>
  )
}
