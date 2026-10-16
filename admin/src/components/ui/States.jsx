import { Inbox, LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing to show', message, action, className, titleAs: Title = 'p' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-muted">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <Title className="mt-3 font-semibold text-ink">{title}</Title>
      {message && <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Spinner({ label = 'Loading', className }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-sm text-muted', className)}>
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}…
    </span>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner label="Loading page" />
    </div>
  )
}
