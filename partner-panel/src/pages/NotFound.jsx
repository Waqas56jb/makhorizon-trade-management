import { Compass } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import usePageTitle from '../hooks/usePageTitle'

/** Unknown routes, and records that don't exist or belong to another partner (indistinguishable on purpose). */
export default function NotFound({ title = 'Page not found', message = 'The page you’re looking for doesn’t exist or may have moved.', backTo = '/dashboard', backLabel = 'Back to overview' }) {
  usePageTitle(title)
  return (
    <div className="card mx-auto mt-6 flex max-w-lg flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-muted">
        <Compass className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">404</p>
      <h1 className="mt-1 text-lg font-semibold">{title}</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      <ButtonLink to={backTo} variant="primary" className="mt-6">
        {backLabel}
      </ButtonLink>
    </div>
  )
}
