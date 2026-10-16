import { Compass } from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import usePageTitle from '../hooks/usePageTitle'

/** Used for unknown routes and for detail pages whose record no longer exists. */
export default function NotFound({ title = 'Page not found', message = 'The page or record you’re looking for doesn’t exist or may have been deleted.', backTo = '/dashboard', backLabel = 'Back to dashboard' }) {
  usePageTitle(title)
  return (
    <div className="card mx-auto mt-6 max-w-lg">
      <EmptyState icon={Compass} title={title} message={message} action={<ButtonLink to={backTo} variant="primary">{backLabel}</ButtonLink>} className="py-16" titleAs="h1" />
    </div>
  )
}
