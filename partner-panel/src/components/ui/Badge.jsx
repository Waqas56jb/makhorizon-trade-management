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
// The label is always shown, so status is never communicated by colour alone.
const STATUS_TONES = {
  // Opportunities
  Open: 'success', 'Closing Soon': 'warning', Closed: 'neutral', Awarded: 'info',
  // Quotations
  Draft: 'neutral', Submitted: 'info', 'Under Review': 'gold', 'Revision Requested': 'warning', Accepted: 'success', Rejected: 'danger', Expired: 'neutral',
  // Orders
  'Awaiting Confirmation': 'warning', Confirmed: 'info', 'In Progress': 'gold', 'Ready for Dispatch': 'info', Dispatched: 'info', Delivered: 'success', Completed: 'success', 'On Hold': 'warning', Cancelled: 'neutral',
  // Shipments
  'Preparing Shipment': 'neutral', 'In Transit': 'gold', 'Customs Clearance': 'info', 'Out for Delivery': 'gold', Delayed: 'danger',
  // Documents
  Requested: 'warning', Approved: 'success', 'Revision Required': 'danger',
  // Team / misc
  Active: 'success', 'Invitation Pending': 'warning', 'Recorded (demo)': 'neutral', Saved: 'neutral', Removed: 'neutral',
}

const statusTone = (status) => STATUS_TONES[status] ?? 'neutral'

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.72rem] font-semibold ring-1 ring-inset', tones[tone], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }) {
  if (!status) return null
  return (
    <Badge tone={statusTone(status)} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {status}
    </Badge>
  )
}
