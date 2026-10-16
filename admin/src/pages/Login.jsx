import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Copy, Info, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import logoSrc from '../assets/brand/logo.webp'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Fields'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../lib/auth'
import { useSettings } from '../lib/store'
import { DEMO_PASSWORD } from '../services/authService'

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export default function Login() {
  usePageTitle('Sign in')
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const demoEmail = useSettings().profile.email
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  // Return to the page that required sign-in (both after login and if already signed in).
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

  const fillDemo = () => {
    setValue('email', demoEmail, { shouldValidate: true })
    setValue('password', DEMO_PASSWORD, { shouldValidate: true })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="on-dark relative hidden overflow-hidden bg-midnight p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <svg className="absolute -right-32 -top-32 h-[34rem] w-[34rem] text-gold/10" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          {[96, 76, 56, 36].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" />
          ))}
        </svg>
        <img src={logoSrc} alt="MAKHORIZON Global Logistics & Trade" width="640" height="173" className="relative h-14 w-auto self-start" />
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Management console</p>
          <p className="mt-4 text-3xl font-semibold leading-tight">Clients, orders, shipments and finances — in one place.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">A simple workspace for coordinating MAKHORIZON’s trade and logistics operations from Djibouti.</p>
        </div>
        <p className="relative text-xs text-white/40">Salam Tower, 5th Floor, Djibouti</p>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center rounded-xl bg-midnight p-4 lg:hidden">
            <img src={logoSrc} alt="MAKHORIZON Global Logistics & Trade" width="640" height="173" className="h-11 w-auto" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to the MAKHORIZON admin panel.</p>

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
            <TextField id="login-email" type="email" label="Email" required autoComplete="username" registration={register('email')} error={errors.email} />
            <TextField id="login-password" type="password" label="Password" required autoComplete="current-password" registration={register('password')} error={errors.password} />
            <Button type="submit" variant="primary" icon={Lock} loading={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Info className="h-4 w-4 text-gold-deep" aria-hidden="true" />
              Demo credentials
            </p>
            <dl className="mt-2 space-y-1 text-[0.82rem]">
              <div className="flex gap-2">
                <dt className="w-16 text-muted">Email</dt>
                <dd className="font-mono">{demoEmail}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 text-muted">Password</dt>
                <dd className="font-mono">{DEMO_PASSWORD}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted">Authentication is simulated in the browser for this demo. It is not secure and must be replaced before real use.</p>
            <Button size="sm" icon={Copy} className="mt-3" onClick={fillDemo}>
              Fill demo credentials
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
