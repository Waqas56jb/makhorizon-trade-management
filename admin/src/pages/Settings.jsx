import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, RotateCcw, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { SelectField, TextareaField, TextField } from '../components/ui/Fields'
import { ConfirmDialog } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { CURRENCIES } from '../lib/calc'
import { DATE_FORMATS, formatDate, todayISO } from '../lib/dates'
import { choice, email, number, optional, required } from '../lib/schemas'
import { useSettings } from '../lib/store'
import { settingsService } from '../services/settingsService'

function SettingsForm({ id, title, description, schema, defaults, section, children, transform = (v) => v }) {
  const toast = useToast()
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = form
  const submit = handleSubmit(async (v) => {
    await settingsService.update(section, transform(v))
    reset(v)
    toast.success(`${title} saved.`, 'Saved to demo data')
  })
  return (
    <Card as="section" id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <div className="border-b border-line px-5 py-4">
        <h2 id={`${id}-h`} className="text-[0.95rem] font-semibold">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <form onSubmit={submit} noValidate>
        <div className="space-y-4 p-5">{children(form)}</div>
        <div className="flex justify-end border-t border-line bg-[#fafbfc] px-5 py-3">
          <Button type="submit" variant="primary" icon={Save} loading={isSubmitting} disabled={!isDirty && !isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

const companySchema = z.object({ name: required('Company name'), ceo: required('CEO name', 100), address: required('Address', 200), currency: choice('a currency'), description: optional(500) })
const prefSchema = z.object({
  defaultCurrency: choice('a currency'),
  dateFormat: choice('a date format'),
  overdue: z.boolean(),
  delayed: z.boolean(),
  arriving: z.boolean(),
  lowStock: z.boolean(),
  expiring: z.boolean(),
  usd: number('USD rate').refine((v) => v > 0, 'Rate must be greater than zero.'),
  eur: number('EUR rate').refine((v) => v > 0, 'Rate must be greater than zero.'),
})
const profileSchema = z.object({ name: required('Display name', 100), email })

const NOTIFY = [
  ['overdue', 'Overdue invoices'],
  ['delayed', 'Delayed shipments'],
  ['arriving', 'Shipments expected within 7 days'],
  ['lowStock', 'Low and out-of-stock items'],
  ['expiring', 'Quotations expiring within 7 days'],
]

export default function Settings() {
  const settings = useSettings()
  const toast = useToast()
  const { hash } = useLocation()
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash])

  const resetData = async () => {
    setResetting(true)
    await settingsService.resetDemoData()
    setResetting(false)
    setConfirmReset(false)
    setVersion((v) => v + 1) // remount forms with restored values
    toast.success('Demo data restored to the original sample records.')
  }

  return (
    <>
      <PageHeader title="Settings" description="Company details, preferences and your demo profile." />
      <p className="mb-5 flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
        Settings are saved as temporary demo data in this browser only, until backend persistence is implemented.
      </p>
      <div key={version} className="grid gap-5 xl:grid-cols-2">
        <SettingsForm id="company" section="company" title="Company profile" description="Shown on printed quotations and invoices." schema={companySchema} defaults={settings.company}>
          {(form) => (
            <>
              <TextField id="co-name" label="Company name" required registration={form.register('name')} error={form.formState.errors.name} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="co-ceo" label="CEO name" required registration={form.register('ceo')} error={form.formState.errors.ceo} />
                <SelectField id="co-cur" label="Primary currency" required hint="Used for totals, dashboards and reports." options={CURRENCIES} registration={form.register('currency')} error={form.formState.errors.currency} />
              </div>
              <TextField id="co-address" label="Address" required registration={form.register('address')} error={form.formState.errors.address} />
              <TextareaField id="co-desc" label="Company description" registration={form.register('description')} error={form.formState.errors.description} />
            </>
          )}
        </SettingsForm>

        <SettingsForm
          id="preferences"
          section="preferences"
          title="Preferences"
          description="Defaults for new records and which alerts appear in notifications."
          schema={prefSchema}
          defaults={{ defaultCurrency: settings.preferences.defaultCurrency, dateFormat: settings.preferences.dateFormat, ...settings.preferences.notify, usd: settings.rates.USD, eur: settings.rates.EUR }}
          transform={(v) => {
            // Rates live in their own settings section.
            settingsService.update('rates', { USD: v.usd, EUR: v.eur })
            return { defaultCurrency: v.defaultCurrency, dateFormat: v.dateFormat, notify: { overdue: v.overdue, delayed: v.delayed, arriving: v.arriving, lowStock: v.lowStock, expiring: v.expiring } }
          }}
        >
          {(form) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField id="pr-cur" label="Default currency for new records" required options={CURRENCIES} registration={form.register('defaultCurrency')} error={form.formState.errors.defaultCurrency} />
                <SelectField id="pr-date" label="Date format" required options={DATE_FORMATS.map((d) => ({ value: d, label: `${d} (${formatDate(todayISO(), d)})` }))} registration={form.register('dateFormat')} error={form.formState.errors.dateFormat} />
              </div>
              <fieldset>
                <legend className="field-label">Notifications in this interface</legend>
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  {NOTIFY.map(([k, label]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-sm hover:bg-canvas">
                      <input type="checkbox" className="h-4 w-4 accent-navy" {...form.register(k)} />
                      {label}
                    </label>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-muted">No email, SMS or push messages are sent.</p>
              </fieldset>
              <fieldset>
                <legend className="field-label">Illustrative conversion rates (DJF per unit)</legend>
                <div className="mt-1 grid gap-4 sm:grid-cols-2">
                  <TextField id="pr-usd" type="number" step="any" min="0" label="1 USD =" registration={form.register('usd')} error={form.formState.errors.usd} />
                  <TextField id="pr-eur" type="number" step="any" min="0" label="1 EUR =" registration={form.register('eur')} error={form.formState.errors.eur} />
                </div>
                <p className="mt-1.5 text-xs text-muted">Fixed values used to combine currencies in totals. They are not live exchange rates.</p>
              </fieldset>
            </>
          )}
        </SettingsForm>

        <SettingsForm id="profile" section="profile" title="Profile" description="Your display name and the email used to sign in to this demo." schema={profileSchema} defaults={{ name: settings.profile.name, email: settings.profile.email }}>
          {(form) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="pf-name" label="Display name" required registration={form.register('name')} error={form.formState.errors.name} />
              <TextField id="pf-email" type="email" label="Demo login email" required hint="Sign in with this email next time. The demo password does not change." registration={form.register('email')} error={form.formState.errors.email} />
            </div>
          )}
        </SettingsForm>

        <Card as="section" aria-labelledby="reset-h">
          <CardHeader as="h2" title="Demo data" description="All records in this admin panel are fictional and stored only in this browser." />
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p id="reset-h" className="text-sm text-muted">
              Restore the original sample clients, orders, shipments, inventory and finances. Your changes and settings will be discarded.
            </p>
            <Button icon={RotateCcw} onClick={() => setConfirmReset(true)} className="shrink-0">
              Reset demo data
            </Button>
          </div>
        </Card>
      </div>
      <ConfirmDialog
        open={confirmReset}
        onClose={() => !resetting && setConfirmReset(false)}
        onConfirm={resetData}
        busy={resetting}
        title="Reset demo data?"
        message="Every change made in this browser — new records, edits, deletions and settings — will be replaced by the original sample data."
        confirmLabel="Reset data"
      />
    </>
  )
}
