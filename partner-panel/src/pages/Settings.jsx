import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, CircleAlert, Eye, EyeOff, KeyRound, Save, Shield, SlidersHorizontal, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { DemoNotice, Switch, TabPanel, Tabs } from '../components/ui/Controls'
import { SelectField, TextField } from '../components/ui/Fields'
import { PageHeader } from '../components/ui/PageHeader'
import ResetDemoData from '../components/ui/ResetDemoData'
import { useToast } from '../components/ui/Toast'
import usePartnerData from '../hooks/usePartnerData'
import { required } from '../lib/schemas'
import { cn } from '../lib/utils'
import { changePasswordDemo, languages, timeZones, updateAccount, updateNotificationPreferences, updatePreferences } from '../services/settingsService'

const TABS = [
  { value: 'account', label: 'Account', icon: UserRound },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
]

function FormError({ message }) {
  if (!message) return null
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
      {message}
    </div>
  )
}

function AccountTab({ user, settings }) {
  const toast = useToast()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(z.object({ displayName: required('Display name', 80), language: z.string(), timeZone: z.string() })),
    defaultValues: { displayName: user.name, language: settings.language, timeZone: settings.timeZone },
  })
  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      await updateAccount(values)
      reset(values)
      toast.success('Account settings saved in this browser.')
    } catch (err) {
      setError(err.message)
    }
  })
  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-4 p-5">
      <FormError message={error} />
      <TextField id="set-name" label="Display name" required registration={register('displayName')} error={errors.displayName} />
      <TextField id="set-email" label="Email address" value={user.email} readOnly hint="Tied to the demo login and cannot be changed here." />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="set-lang" label="Preferred language" registration={register('language')} options={languages} hint="Interface translations are not part of this demo." />
        <SelectField id="set-tz" label="Time zone" registration={register('timeZone')} options={timeZones} />
      </div>
      <Button type="submit" variant="primary" icon={Save} loading={isSubmitting} disabled={!isDirty}>
        Save account settings
      </Button>
    </form>
  )
}

const NOTIFICATION_ITEMS = [
  { key: 'email', label: 'Email notifications', description: 'Receive a copy of notifications by email (no email is sent in this demo).' },
  { key: 'orders', label: 'Order updates', description: 'New orders, confirmations and status changes.' },
  { key: 'shipments', label: 'Shipment updates', description: 'Status changes and delays on your shipments.' },
  { key: 'quotations', label: 'Quotation updates', description: 'Reviews, revision requests and decisions.' },
  { key: 'messages', label: 'Message notifications', description: 'New messages from MAKHORIZON teams.' },
]

function NotificationsTab({ settings }) {
  const toast = useToast()
  const [prefs, setPrefs] = useState(settings.notifications)
  const [busy, setBusy] = useState(false)
  const dirty = NOTIFICATION_ITEMS.some(({ key }) => prefs[key] !== settings.notifications[key])
  const save = async () => {
    setBusy(true)
    await updateNotificationPreferences(prefs)
    setBusy(false)
    toast.success('Notification preferences saved in this browser. No real email settings were changed.')
  }
  return (
    <div className="max-w-xl p-5">
      <div className="divide-y divide-line">
        {NOTIFICATION_ITEMS.map((item) => (
          <Switch key={item.key} label={item.label} description={item.description} checked={!!prefs[item.key]} onChange={(v) => setPrefs((p) => ({ ...p, [item.key]: v }))} />
        ))}
      </div>
      <Button variant="primary" icon={Save} onClick={save} loading={busy} disabled={!dirty} className="mt-4">
        Save preferences
      </Button>
    </div>
  )
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z
      .string()
      .min(10, 'Use at least 10 characters.')
      .regex(/[A-Z]/, 'Include an uppercase letter.')
      .regex(/[a-z]/, 'Include a lowercase letter.')
      .regex(/\d/, 'Include a number.'),
    confirmPassword: z.string().min(1, 'Confirm the new password.'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ['confirmPassword'], message: 'The passwords do not match.' })

function SecurityTab() {
  const toast = useToast()
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }, mode: 'onTouched' })
  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      await changePasswordDemo(values)
      reset()
      toast.success('Form validated. Demo only — no password was changed or stored.', 'Password not changed')
    } catch (err) {
      setError(err.message)
    }
  })
  const type = show ? 'text' : 'password'
  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-4 p-5">
      <DemoNotice title="Demo only">The password form is validated in the browser, but no password is changed or stored. Real password changes will use the authentication backend.</DemoNotice>
      <FormError message={error} />
      <TextField id="pw-current" label="Current password" type={type} required autoComplete="current-password" registration={register('currentPassword')} error={errors.currentPassword} />
      <TextField id="pw-new" label="New password" type={type} required autoComplete="new-password" registration={register('newPassword')} error={errors.newPassword} hint="At least 10 characters with upper- and lowercase letters and a number." />
      <TextField id="pw-confirm" label="Confirm new password" type={type} required autoComplete="new-password" registration={register('confirmPassword')} error={errors.confirmPassword} />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" icon={KeyRound} loading={isSubmitting}>
          Change password
        </Button>
        <Button variant="ghost" icon={show ? EyeOff : Eye} onClick={() => setShow((v) => !v)} aria-pressed={show}>
          {show ? 'Hide passwords' : 'Show passwords'}
        </Button>
      </div>
    </form>
  )
}

function PreferencesTab({ settings }) {
  const toast = useToast()
  // Selected immediately; the saved setting follows after the simulated request.
  const [selected, setSelected] = useState(settings.density)
  const choose = async (density) => {
    if (density === selected) return
    const previous = selected
    setSelected(density)
    try {
      await updatePreferences({ density })
      toast.success(`Table display set to ${density}.`)
    } catch (err) {
      setSelected(previous)
      toast.error(err.message)
    }
  }
  return (
    <div className="max-w-2xl space-y-6 p-5">
      <fieldset>
        <legend className="text-sm font-semibold">Table density</legend>
        <p className="text-xs text-muted">Applies to tables across the portal. Saved to the demo data in this browser.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { v: 'comfortable', label: 'Comfortable', hint: 'More spacing between rows' },
            { v: 'compact', label: 'Compact', hint: 'Fit more rows on screen' },
          ].map(({ v, label, hint }) => (
            <label key={v} className={cn('flex cursor-pointer items-start gap-3 rounded-lg border p-3', selected === v ? 'border-navy bg-navy/5' : 'border-line hover:bg-canvas')}>
              <input type="radio" name="density" value={v} checked={selected === v} onChange={() => choose(v)} className="mt-1 accent-navy" />
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="border-t border-line pt-5">
        <h3 className="text-sm font-semibold">Demo data</h3>
        <p className="mb-3 mt-0.5 text-xs text-muted">Restore the original sample records. Everything you created or changed in this browser will be replaced.</p>
        <ResetDemoData />
      </div>
    </div>
  )
}

export default function Settings() {
  const { user, settings } = usePartnerData()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'account'
  if (!user) return null
  return (
    <>
      <PageHeader title="Settings" description="Personal settings for your partner portal account." />
      <Card>
        <Tabs label="Settings sections" tabs={TABS} value={tab} onChange={(v) => setParams({ tab: v }, { replace: true })} />
        <TabPanel value={tab}>
          <CardHeader as="h2" title={TABS.find((t) => t.value === tab).label} className="sr-only" />
          {tab === 'account' && <AccountTab user={user} settings={settings} />}
          {tab === 'notifications' && <NotificationsTab settings={settings} />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'preferences' && <PreferencesTab settings={settings} />}
        </TabPanel>
      </Card>
    </>
  )
}
