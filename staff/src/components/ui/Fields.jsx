import { CircleAlert } from 'lucide-react'
import { cn } from '../../lib/utils'

function Shell({ id, label, required, hint, error, className, children }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 flex items-start gap-1 text-xs font-medium text-danger">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

const aria = (id, error, hint, required) => ({
  'aria-invalid': error ? 'true' : 'false',
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  'aria-required': required || undefined,
})

export function TextField({ id, label, registration, error, required, hint, className, inputClassName, type = 'text', ...props }) {
  return (
    <Shell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input id={id} type={type} className={cn('field-control', inputClassName)} {...aria(id, error, hint, required)} {...registration} {...props} />
    </Shell>
  )
}

export function TextareaField({ id, label, registration, error, required, hint, className, rows = 3, ...props }) {
  return (
    <Shell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea id={id} rows={rows} className="field-control" {...aria(id, error, hint, required)} {...registration} {...props} />
    </Shell>
  )
}

/** options: array of strings or {value, label}. */
export function SelectField({ id, label, registration, error, required, hint, className, options, placeholder, ...props }) {
  return (
    <Shell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <select id={id} className="field-control" {...aria(id, error, hint, required)} {...registration} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        })}
      </select>
    </Shell>
  )
}

export function FormSection({ title, description, children }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-[0.72rem] font-semibold uppercase tracking-wider text-muted">{title}</legend>
      {description && <p className="-mt-2 mb-3 text-xs text-muted">{description}</p>}
      {children}
    </fieldset>
  )
}
