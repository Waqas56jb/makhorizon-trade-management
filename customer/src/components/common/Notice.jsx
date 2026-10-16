import { Info } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Honest labelling for draft copy and frontend-only demo behaviour. */
export default function Notice({ title, children, className }) {
  return (
    <div className={cn('notice', className)} role="note">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5 text-body' : 'text-body'}>{children}</div>
      </div>
    </div>
  )
}
