import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

const variants = { primary: 'btn-primary', gold: 'btn-gold', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger' }

export function Button({ variant = 'secondary', size, icon: Icon, loading = false, iconOnly = false, className, children, type = 'button', disabled, ...rest }) {
  return (
    <button
      type={type}
      className={cn('btn', variants[variant], size === 'sm' && 'btn-sm', iconOnly && 'btn-icon', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  )
}

export function ButtonLink({ to, variant = 'secondary', size, icon: Icon, className, children, ...rest }) {
  return (
    <Link to={to} className={cn('btn', variants[variant], size === 'sm' && 'btn-sm', className)} {...rest}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </Link>
  )
}
