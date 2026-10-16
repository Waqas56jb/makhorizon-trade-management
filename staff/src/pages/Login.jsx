import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Eye, EyeOff, Info, KeyRound, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import logoSrc from '../assets/brand/logo.webp'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../lib/auth'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../services/authService'

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
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
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  // Return to the page that required sign-in, both after login and if already signed in.
  const destination = location.state?.from ?? '/dashboard'
  if (session) return <Navigate to={destination} replace />

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError('')
    try {
      await login(email, password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  })

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <div className="on-dark relative hidden overflow-hidden bg-midnight p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <svg className="absolute -bottom-40 -right-40 h-[36rem] w-[36rem] text-gold/10" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          {[96, 76, 56, 36].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" />
          ))}
        </svg>
        <img src={logoSrc} alt="MAKHORIZON Global Logistics & Trade" width="640" height="173" className="relative h-14 w-auto self-start" />
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Staff portal</p>
          <p className="mt-4 text-3xl font-semibold leading-tight">Your tasks, orders and shipments for today.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">Update progress, record shipment events and register documents — all in one place.</p>
        </div>
        <p className="relative text-xs text-white/40">Salam Tower, 5th Floor, Djibouti</p>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center rounded-xl bg-midnight p-4 lg:hidden">
            <img src={logoSrc} alt="MAKHORIZON Global Logistics & Trade" width="640" height="173" className="h-11 w-auto" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff sign in</h1>
          <p className="mt-1 text-sm text-muted">Sign in to see your assigned work.</p>

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
            <TextField id="login-email" type="email" label="Work email" required autoComplete="username" inputMode="email" registration={register('email')} error={errors.email} />
            <div>
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
            </div>
            <Button type="submit" variant="primary" icon={Lock} loading={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4 text-gold-deep" aria-hidden="true" />
              Demo credentials
            </p>
            <dl className="mt-2 space-y-1 text-[0.82rem]">
              <div className="flex gap-2">
                <dt className="w-16 text-muted">Email</dt>
                <dd className="font-mono">{DEMO_EMAIL}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 text-muted">Password</dt>
                <dd className="font-mono">{DEMO_PASSWORD}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted">For demonstration only. Sign-in is simulated in the browser and is not secure. The employee shown after sign-in is fictional.</p>
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
        </div>
      </div>
    </div>
  )
}
