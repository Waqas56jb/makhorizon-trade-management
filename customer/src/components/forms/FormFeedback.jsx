import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { CircleAlert, CircleCheck, LoaderCircle, RefreshCw } from 'lucide-react'
import { EASE } from '../../lib/motion'

/** Honest confirmation shown after a frontend-only demo submission. */
export function DemoSuccess({ title, reference, onReset, resetLabel = 'Submit another inquiry', children }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-[var(--radius-card)] border border-success/30 bg-white p-8 outline-none sm:p-10"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
        <CircleCheck className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="display-md mt-6">{title}</h3>
      <p className="mt-4 leading-relaxed">
        Your entries passed local validation in this browser. <strong className="text-navy">Nothing has been sent:</strong> the
        website is running in frontend demo mode and is not yet connected to MAKHORIZON’s systems, so the company has not
        received this inquiry.
      </p>
      {children}
      {reference && (
        <p className="mt-5 text-sm">
          Demo reference: <code className="rounded bg-ivory px-2 py-1 font-mono text-[0.8rem] text-navy">{reference}</code>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={onReset} className="btn btn-navy">
          {resetLabel}
        </button>
      </div>
    </motion.div>
  )
}

export function SubmitError({ message, onRetry }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-[var(--radius-card)] border border-danger/30 bg-danger/5 p-4 text-sm text-navy">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-semibold">The submission could not be completed.</p>
        <p className="mt-0.5 text-body">{message}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 font-semibold text-navy hover:text-gold-deep">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  )
}

export function SubmitButton({ submitting, children, className = 'btn btn-gold' }) {
  return (
    <button type="submit" className={className} disabled={submitting} aria-busy={submitting || undefined}>
      {submitting ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          Validating…
        </>
      ) : (
        children
      )}
    </button>
  )
}
