import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Eye, EyeOff, Info, KeyRound, Lock, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../lib/auth'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../services/authService'
import AuthLayout from '../components/layout/AuthLayout'

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  remember: z.boolean(),
})

export default function Login() {
  usePageTitle('Sign in')
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '', remember: false } })

  // Return to the page that required sign-in, both after login and if already signed in.
  const destination = location.state?.from ?? '/dashboard'
  if (session) return <Navigate to={destination} replace />

  const onSubmit = handleSubmit(async ({ email, password, remember }) => {
    setError('')
    try {
      await login(email, password, remember)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  })

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Partner sign in</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage your partnership with MAKHORIZON.</p>

      {location.state?.signedOut && !error && (
        <p role="status" className="mt-5 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          You have signed out of the demo session.
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            {error}
          </div>
        )}
        <TextField id="login-email" type="email" label="Email address" required autoComplete="username" inputMode="email" registration={register('email')} error={errors.email} />
        <div className="relative">
          <TextField id="login-password" type={showPassword ? 'text' : 'password'} label="Password" required autoComplete="current-password" inputClassName="pr-11" registration={register('password')} error={errors.password} />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            aria-controls="login-password"
            className="absolute right-1.5 top-[1.6rem] flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" className="h-4 w-4 rounded border-[#c9d2da] accent-navy" {...register('remember')} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-navy hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" icon={Lock} loading={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-5 flex items-start gap-2 text-xs text-muted">
        <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
        This portal is intended for authorised MAKHORIZON business partners only. Do not share your sign-in details.
      </p>

      <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4 text-gold-deep" aria-hidden="true" />
          Demo credentials
        </p>
        <dl className="mt-2 space-y-1 text-[0.82rem]">
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 text-muted">Email</dt>
            <dd className="break-all font-mono">{DEMO_EMAIL}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 text-muted">Password</dt>
            <dd className="font-mono">{DEMO_PASSWORD}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted">Sign-in is simulated in the browser for this demo and is not production security. The partner company and its data are fictional.</p>
        <Button
          size="sm"
          icon={KeyRound}
          className="mt-3"
          onClick={() => {
            setValue('email', DEMO_EMAIL, { shouldValidate: true })
            setValue('password', DEMO_PASSWORD, { shouldValidate: true })
          }}
        >
          Fill demo credentials
        </Button>
      </div>
    </AuthLayout>
  )
}
