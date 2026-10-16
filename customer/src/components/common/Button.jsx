import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

const variants = {
  gold: 'btn-gold',
  navy: 'btn-navy',
  outline: 'btn-outline',
  'outline-light': 'btn-outline-light',
}

/** Router-aware link styled as a button. */
export function ButtonLink({ to, variant = 'gold', size, arrow = false, className, children, ...rest }) {
  return (
    <Link to={to} className={cn('btn', variants[variant], size === 'sm' && 'btn-sm', className)} {...rest}>
      <span>{children}</span>
      {arrow && <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />}
    </Link>
  )
}

export function Button({ variant = 'gold', size, arrow = false, className, children, type = 'button', ...rest }) {
  return (
    <button type={type} className={cn('btn', variants[variant], size === 'sm' && 'btn-sm', className)} {...rest}>
      {children}
      {arrow && <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />}
    </button>
  )
}

export function TextLink({ to, children, className, ...rest }) {
  return (
    <Link to={to} className={cn('link-underline text-sm', className)} {...rest}>
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  )
}
