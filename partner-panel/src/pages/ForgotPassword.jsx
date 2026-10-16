import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, MailCheck, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import usePageTitle from '../hooks/usePageTitle'
import { requestPasswordReset } from '../services/authService'
import AuthLayout from '../components/layout/AuthLayout'

const schema = z.object({ email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.') })

export default function ForgotPassword() {
  usePageTitle('Reset password')
  const [sentTo, setSentTo] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  const onSubmit = handleSubmit(async ({ email }) => {
    const r = await requestPasswordReset(email)
    setSentTo(r.email)
  })

  return (
    <AuthLayout>
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to sign in
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      {sentTo ? (
        <div role="status" className="mt-6 rounded-lg border border-success/30 bg-success/5 p-4">
          <p className="flex items-center gap-2 font-semibold text-success">
            <MailCheck className="h-5 w-5" aria-hidden="true" />
            Demo confirmation
          </p>
          <p className="mt-2 text-sm text-ink">
            In the live portal, password reset instructions would be sent to <strong className="break-all">{sentTo}</strong> if it belongs to a partner account.
          </p>
          <p className="mt-2 text-xs text-muted">This is a frontend demo: no email has been sent and no password has changed.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setSentTo('')}>
              Use another email
            </Button>
            <Link to="/login" className="btn btn-primary btn-sm">
              Return to sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">Enter the email address linked to your partner account.</p>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <TextField id="reset-email" type="email" label="Email address" required autoComplete="email" inputMode="email" registration={register('email')} error={errors.email} />
            <Button type="submit" variant="primary" icon={Send} loading={isSubmitting} className="w-full">
              {isSubmitting ? 'Sending…' : 'Send reset instructions'}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted">Demo only — no email will be sent.</p>
        </>
      )}
    </AuthLayout>
  )
}
