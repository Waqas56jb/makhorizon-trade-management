import { cn } from '../../lib/utils'

const tones = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
  gold: 'bg-[#f6efe1] text-gold-deep ring-[#e8d8b6]',
  navy: 'bg-navy text-white ring-navy',
}

// One mapping for every status in the app keeps colours consistent.
const STATUS_TONES = {
  Active: 'success', Inactive: 'neutral',
  Draft: 'neutral', Sent: 'info', Accepted: 'success', Rejected: 'danger', Expired: 'warning',
  Confirmed: 'info', Processing: 'gold', Completed: 'success', Cancelled: 'neutral',
  Planned: 'neutral', 'Ready for Dispatch': 'info', 'In Transit': 'gold', Arrived: 'info', Delivered: 'success', Delayed: 'danger',
  'In Stock': 'success', 'Low Stock': 'warning', 'Out of Stock': 'danger',
  Unpaid: 'info', 'Partially Paid': 'gold', Paid: 'success', Overdue: 'danger',
  Received: 'success', Pending: 'warning',
  Income: 'success', Expense: 'danger',
  Prospect: 'neutral', Contacted: 'info',
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
