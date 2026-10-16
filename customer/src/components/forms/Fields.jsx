import { CircleAlert } from 'lucide-react'
import { cn } from '../../lib/utils'

function FieldShell({ id, label, required, optional, hint, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="ml-1.5 text-xs font-normal text-body">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-body">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger" role="alert">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  )
}

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

export function TextField({ id, label, registration, error, required, optional, hint, className, type = 'text', ...inputProps }) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <input
        id={id}
        type={type}
        className="field-control"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...registration}
        {...inputProps}
      />
    </FieldShell>
  )
}

export function TextareaField({ id, label, registration, error, required, optional, hint, className, rows = 5, ...inputProps }) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        className="field-control"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...registration}
        {...inputProps}
      />
    </FieldShell>
  )
}

export function SelectField({ id, label, registration, error, required, optional, hint, className, options, placeholder = 'Select an option' }) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <select
        id={id}
        className="field-control"
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, error, hint)}
        defaultValue=""
        {...registration}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function CheckboxField({ id, registration, error, children, className }) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className={cn(
            'mt-1 h-[1.1rem] w-[1.1rem] shrink-0 cursor-pointer rounded border-[#b5c0ca] accent-navy',
            error && 'outline outline-1 outline-danger',
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...registration}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-body">
          {children}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 pl-7 text-xs font-medium text-danger" role="alert">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error.message}
        </p>
      )}
    </div>
  )
}
