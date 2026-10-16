import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import useDemoSubmit from '../../hooks/useDemoSubmit'
import { subscribeToUpdates } from '../../services/inquiryService'
import { newsletterSchema } from './schemas'

export default function NewsletterSignup() {
  const { status, error: submitError, submit, reset: resetSubmit } = useDemoSubmit(subscribeToUpdates)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(newsletterSchema), defaultValues: { email: '' } })

  const onSubmit = async ({ email }) => {
    await submit(email)
    reset({ email: '' })
  }

  const error = errors.email
  const submitting = status === 'submitting'

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Business updates sign-up" className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Your business email"
            className="field-control h-12"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'newsletter-error' : 'newsletter-note'}
            {...register('email', { onChange: () => status !== 'idle' && resetSubmit() })}
          />
        </div>
        <button type="submit" className="btn btn-navy h-12" disabled={submitting}>
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {submitting ? 'Validating…' : 'Notify me'}
        </button>
      </form>
      <div aria-live="polite" className="mt-3 min-h-6 text-sm">
        {error && (
          <p id="newsletter-error" className="flex items-center gap-1.5 font-medium text-danger">
            <CircleAlert className="h-4 w-4" aria-hidden="true" />
            {error.message}
          </p>
        )}
        {!error && status === 'success' && (
          <p className="flex items-start gap-1.5 text-success">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              Email format looks good. This sign-up is a frontend demo, so your address has <strong>not</strong> been stored or
              subscribed to anything.
            </span>
          </p>
        )}
        {!error && status === 'error' && <p className="text-danger">{submitError}</p>}
        {!error && status === 'idle' && (
          <p id="newsletter-note" className="text-body">
            Demo only — no email is stored until the website is connected to a mailing service.
          </p>
        )}
      </div>
    </div>
  )
}
