import { Compass } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import usePageTitle from '../hooks/usePageTitle'

/** Unknown routes, and records that don't exist or aren't assigned to the employee. */
export default function NotFound({ title = 'Page not found', message = 'The page you’re looking for doesn’t exist.', backTo = '/dashboard', backLabel = 'Back to dashboard' }) {
  usePageTitle(title)
  return (
    <div className="card mx-auto mt-6 flex max-w-lg flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-muted">
        <Compass className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-lg font-semibold">{title}</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      <ButtonLink to={backTo} variant="primary" className="mt-6">
        {backLabel}
      </ButtonLink>
    </div>
  )
}
