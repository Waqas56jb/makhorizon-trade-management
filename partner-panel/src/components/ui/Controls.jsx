import { useId, useRef } from 'react'
import { Info } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Accessible on/off switch (role="switch"). */
export function Switch({ checked, onChange, label, description, disabled, id }) {
  const autoId = useId()
  const sid = id ?? autoId
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={sid} className="text-sm font-medium text-ink">
          {label}
        </label>
        {description && (
          <p id={`${sid}-desc`} className="text-xs text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        id={sid}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${sid}-desc` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', checked ? 'bg-navy' : 'bg-slate-300', disabled && 'opacity-50')}
      >
        <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[1.375rem]' : 'translate-x-0.5')} aria-hidden="true" />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}

/** Keyboard-accessible tabs (arrow keys move between tabs). */
export function Tabs({ tabs, value, onChange, label }) {
  const refs = useRef({})
  const onKey = (e, i) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    onChange(tabs[next].value)
    refs.current[tabs[next].value]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="-mb-px flex gap-1 overflow-x-auto border-b border-line px-2">
      {tabs.map((t, i) => {
        const active = t.value === value
        const Icon = t.icon
        return (
          <button
            key={t.value}
            ref={(el) => (refs.current[t.value] = el)}
            type="button"
            role="tab"
            id={`tab-${t.value}`}
            aria-selected={active}
            aria-controls={`panel-${t.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn('flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors', active ? 'border-gold text-ink' : 'border-transparent text-muted hover:text-ink')}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ value, children, className }) {
  return (
    <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} tabIndex={0} className={cn('outline-none', className)}>
      {children}
    </div>
  )
}

/** Honest notice used wherever a feature is simulated in this frontend-only phase. */
export function DemoNotice({ children, className, title = 'Demo data' }) {
  return (
    <div className={cn('flex items-start gap-2.5 rounded-lg border border-info/25 bg-info/5 px-3.5 py-2.5 text-[0.8rem] text-ink', className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
      <p>
        <span className="font-semibold">{title}: </span>
        {children}
      </p>
    </div>
  )
}
