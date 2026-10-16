import { CircleAlert, Inbox, LoaderCircle, RotateCcw } from 'lucide-react'
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

export function ErrorState({ title = 'Something went wrong', message = 'This section could not be displayed.', onRetry, className }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
        <CircleAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-secondary mt-4">
          <RotateCcw aria-hidden="true" />
          Try again
        </button>
      )}
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

export function LoadingState({ label = 'Loading', className }) {
  return (
    <div className={cn('flex min-h-[12rem] items-center justify-center', className)}>
      <Spinner label={label} />
    </div>
  )
}

export function PageLoader() {
  return <LoadingState label="Loading page" className="min-h-[50vh]" />
}
