import { Component } from 'react'
import { CircleAlert, RefreshCw } from 'lucide-react'
import { LogoMark } from './Logo'

/**
 * Shown while a route's code downloads. It takes the shape of the dark page hero
 * every route starts with, so the transparent header above it stays readable.
 */
export function LoadingState({ label = 'Loading page' }) {
  return (
    <div
      className="flex min-h-[min(80vh,40rem)] items-center justify-center bg-midnight pb-16 pt-[calc(var(--header-h)+4rem)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5">
        <LogoMark className="w-16 animate-pulse" />
        <div className="h-px w-24 animate-pulse bg-gold" aria-hidden="true" />
        <span className="sr-only">{label}…</span>
      </div>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'This section could not be displayed. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex min-h-[min(80vh,40rem)] items-center justify-center bg-midnight px-5 pb-20 pt-[calc(var(--header-h)+4rem)]" role="alert">
      <div className="card max-w-lg p-10 text-center shadow-card">
        <CircleAlert className="mx-auto h-10 w-10 text-danger" aria-hidden="true" />
        <h1 className="display-md mt-5">{title}</h1>
        <p className="mt-3">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-navy mt-8">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

/** Catches render errors (including failed lazy-loaded chunks). Give it a `key` per route to reset. */
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          message="The page could not be loaded. This can happen after a network interruption or a site update."
          onRetry={() => window.location.reload()}
        />
      )
    }
    return this.props.children
  }
}
