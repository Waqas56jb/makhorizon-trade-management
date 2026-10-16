import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, FileText, History, Save, Send, X } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import { SelectField, TextareaField, TextField } from '../components/ui/Fields'
import FilePicker from '../components/ui/FilePicker'
import { ConfirmDialog } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { currencies, paymentTermsOptions } from '../data/quotations'
import usePartnerData from '../hooks/usePartnerData'
import { addDays, todayISO } from '../lib/dates'
import { formatCurrency, formatDate, formatFileSize } from '../lib/format'
import { calcQuotationTotals } from '../lib/quotation'
import { optional, required } from '../lib/schemas'
import { saveDraft, submitQuotation, submitRevision } from '../services/quotationService'
import NotFound from './NotFound'

const amount = (label, { positive = false, max } = {}) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((v) => Number.isFinite(Number(v)), `${label} must be a number.`)
    .refine((v) => Number(v) >= 0, `${label} cannot be negative.`)
    .refine((v) => !positive || Number(v) > 0, `${label} must be greater than zero.`)
    .refine((v) => max === undefined || Number(v) <= max, `${label} cannot exceed ${max}.`)

const schema = z.object({
  opportunityId: z.string().min(1, 'Select an opportunity.'),
  title: required('Quotation title', 150),
  description: optional(1500),
  unitPrice: amount('Unit price', { positive: true }),
  quantity: amount('Quantity', { positive: true }),
  unit: optional(40),
  currency: z.enum(currencies, { error: 'Select a currency.' }),
  taxRate: amount('Tax rate', { max: 100 }),
  additionalCosts: amount('Additional costs'),
  deliveryDuration: required('Estimated delivery duration', 120),
  deliveryTerms: optional(600),
  validUntil: z
    .string()
    .min(1, 'Valid-until date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.')
    .refine((v) => v >= todayISO(), 'The valid-until date must be today or later.'),
  paymentTerms: z.string().min(1, 'Select payment terms.'),
  conditions: optional(1000),
  notes: optional(1500),
})

const EMPTY = (opportunityId = '') => ({
  opportunityId,
  title: '',
  description: '',
  unitPrice: '',
  quantity: '',
  unit: '',
  currency: 'USD',
  taxRate: '0',
  additionalCosts: '0',
  deliveryDuration: '',
  deliveryTerms: '',
  validUntil: addDays(todayISO(), 30),
  paymentTerms: '',
  conditions: '',
  notes: '',
})

const fromRecord = (q) => ({
  ...EMPTY(q.opportunityId),
  ...Object.fromEntries(Object.keys(EMPTY()).map((k) => [k, q[k] == null ? '' : String(q[k])])),
  validUntil: q.validUntil && q.validUntil >= todayISO() ? q.validUntil : addDays(todayISO(), 30),
})

// Unsaved form values are kept in sessionStorage (this tab only) so navigation doesn't lose work.
// Only the text fields are kept — never files.
const storageKey = (mode, id) => `mkh-partner-quotation-form:${mode}:${id ?? 'new'}`
function readSaved(key) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function clearSaved(key) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export default function QuotationForm() {
  const [params] = useSearchParams()
  const data = usePartnerData()
  const draftId = params.get('draft')
  const reviseId = params.get('revise')
  const mode = reviseId ? 'revise' : draftId ? 'draft' : 'new'
  const record = reviseId ? data.quotationById(reviseId) : draftId ? data.quotationById(draftId) : null

  if (mode !== 'new') {
    if (!record) return <NotFound title="Quotation not found" message="This quotation does not exist or is not available to your company." backTo="/quotations" backLabel="Back to quotations" />
    if (mode === 'draft' && record.status !== 'Draft')
      return <NotFound title="This quotation can’t be edited" message={`${record.id} has status “${record.status}”. Only drafts can be edited.`} backTo={`/quotations/${record.id}`} backLabel="View quotation" />
    if (mode === 'revise' && record.status !== 'Revision Requested')
      return <NotFound title="No revision requested" message={`${record.id} has status “${record.status}”. A revision can only be submitted when MAKHORIZON requests one.`} backTo={`/quotations/${record.id}`} backLabel="View quotation" />
  }
  // Remount when switching between new / draft / revision so defaults are fresh.
  return <QuotationEditor key={`${mode}:${record?.id ?? params.get('opportunity') ?? ''}`} mode={mode} record={record} data={data} initialOpportunity={params.get('opportunity') ?? ''} />
}

function QuotationEditor({ mode, record, data, initialOpportunity }) {
  const navigate = useNavigate()
  const toast = useToast()
  const key = storageKey(mode, record?.id)
  const [restored, setRestored] = useState(() => readSaved(key))
  const baseDefaults = record ? fromRecord(record) : EMPTY(data.opportunityById(initialOpportunity) ? initialOpportunity : '')
  const [files, setFiles] = useState([])
  const [existing, setExisting] = useState(record?.attachments ?? [])
  const [confirm, setConfirm] = useState(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [busy, setBusy] = useState('')
  const [submitError, setSubmitError] = useState('')

  const form = useForm({ resolver: zodResolver(schema), defaultValues: restored ? { ...baseDefaults, ...restored } : baseDefaults, mode: 'onTouched' })
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = form

  // Persist unsaved text values for this tab while editing (only once the user has changed something).
  const allValues = useWatch({ control })
  useEffect(() => {
    if (!isDirty) return
    try {
      sessionStorage.setItem(key, JSON.stringify(allValues))
    } catch {
      // Storage unavailable — editing still works.
    }
  }, [allValues, isDirty, key])

  const [opportunityId, unitPrice, quantity, taxRate, additionalCosts, currency] = useWatch({ control, name: ['opportunityId', 'unitPrice', 'quantity', 'taxRate', 'additionalCosts', 'currency'] })
  const totals = calcQuotationTotals({ unitPrice, quantity, taxRate, additionalCosts })
  const opp = data.opportunityById(opportunityId)
  const fmt = (n) => formatCurrency(n, currency || 'USD')

  const options = useMemo(() => {
    const open = data.opportunities.filter((o) => ['Open', 'Closing Soon'].includes(o.displayStatus))
    const current = data.opportunityById(record?.opportunityId)
    const list = current && !open.includes(current) ? [current, ...open] : open
    return list.map((o) => ({ value: o.id, label: `${o.id} — ${o.title}${['Open', 'Closing Soon'].includes(o.displayStatus) ? '' : ` (${o.displayStatus})`}` }))
  }, [data, record])

  const attachments = () => [...existing, ...files.map((f) => ({ name: f.name, size: f.size, type: f.type }))]

  const finish = (target) => {
    clearSaved(key)
    navigate(target)
  }

  const onSaveDraft = async () => {
    setSubmitError('')
    setBusy('draft')
    try {
      const saved = await saveDraft({ ...getValues(), attachments: attachments() }, mode === 'draft' ? record.id : undefined)
      toast.success(`Draft ${saved.id} saved in this browser.`, 'Draft saved')
      finish(`/quotations/${saved.id}`)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setBusy('')
    }
  }

  const onSubmit = handleSubmit((values) => {
    setSubmitError('')
    setConfirm(values)
  })

  const doSubmit = async () => {
    setBusy('submit')
    try {
      const payload = { ...confirm, attachments: attachments() }
      const saved = mode === 'revise' ? await submitRevision(record.id, payload) : await submitQuotation(payload, mode === 'draft' ? record.id : undefined)
      toast.success(mode === 'revise' ? `Version ${saved.version} of ${saved.id} submitted (demo).` : `${saved.id} submitted to MAKHORIZON (demo — nothing was sent).`, 'Quotation submitted')
      setConfirm(null)
      finish(`/quotations/${saved.id}`)
    } catch (err) {
      setConfirm(null)
      setSubmitError(err.message)
    } finally {
      setBusy('')
    }
  }

  const title = mode === 'revise' ? `Revise ${record.id}` : mode === 'draft' ? `Edit draft ${record.id}` : 'Create quotation'
  const feedback = record?.feedback?.at(-1)

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[{ label: 'Quotations', to: '/quotations' }, ...(record ? [{ label: record.id, to: `/quotations/${record.id}` }] : []), { label: mode === 'new' ? 'New' : mode === 'draft' ? 'Edit draft' : 'Revision' }]}
        meta={record && <StatusBadge status={record.status} />}
        description={mode === 'revise' ? 'Update your offer in response to MAKHORIZON’s review notes, then submit the new version.' : 'Prepare a structured commercial offer for a trade opportunity.'}
      />

      {restored && (
        <div role="status" className="mb-4 flex flex-col gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <History className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
            Unsaved changes from earlier in this session were restored. Selected files need to be chosen again.
          </p>
          <Button
            size="sm"
            onClick={() => {
              clearSaved(key)
              reset(baseDefaults)
              setRestored(null)
              toast.info('Restored changes discarded.')
            }}
          >
            Discard restored changes
          </Button>
        </div>
      )}

      {mode === 'revise' && feedback && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-semibold">Review notes from {feedback.from}</p>
          <p className="mt-1 text-sm">{feedback.message}</p>
          <p className="num mt-1 text-xs text-muted">Current version: {record.version ?? 1} · the previous figures will be kept in the quotation history.</p>
        </div>
      )}

      {submitError && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
          {submitError}
        </div>
      )}

      <form id="quotation-form" onSubmit={onSubmit} noValidate className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="A. Opportunity information" />
            <div className="space-y-4 p-5">
              {mode === 'revise' ? (
                <p className="text-sm text-muted">The opportunity cannot be changed in a revision.</p>
              ) : (
                <SelectField id="q-opportunity" label="Opportunity" required registration={register('opportunityId')} error={errors.opportunityId} options={options} placeholder="Select an available opportunity" hint={options.length === 0 ? 'No opportunities are currently open.' : 'Only open opportunities accept quotations.'} />
              )}
              {opp ? (
                <div className="rounded-lg bg-canvas p-4">
                  <DetailList
                    items={[
                      { label: 'Opportunity reference', value: <Link to={`/opportunities/${opp.id}`} className="font-medium text-navy hover:underline">{opp.id}</Link> },
                      { label: 'Status', value: <StatusBadge status={opp.displayStatus} /> },
                      { label: 'Opportunity title', value: opp.title, full: true },
                      { label: 'Destination', value: opp.destination },
                      { label: 'Submission deadline', value: formatDate(opp.closingDate) },
                    ]}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted">Select an opportunity to see its reference, title and destination.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="B. Commercial offer" description="Amounts are recorded in the selected currency. No currency conversion is performed." />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <TextField id="q-title" label="Quotation title" required className="sm:col-span-2" registration={register('title')} error={errors.title} />
              <TextareaField id="q-description" label="Description" className="sm:col-span-2" rows={3} registration={register('description')} error={errors.description} hint="Products or services offered, specifications and origin." />
              <SelectField id="q-currency" label="Currency" required registration={register('currency')} error={errors.currency} options={currencies} />
              <TextField id="q-unit" label="Unit" placeholder="e.g. tonne, carton, TEU" registration={register('unit')} error={errors.unit} />
              <TextField id="q-price" label={`Unit price (${currency || 'USD'})`} required type="number" inputMode="decimal" min="0" step="any" registration={register('unitPrice')} error={errors.unitPrice} />
              <TextField id="q-qty" label="Quantity" required type="number" inputMode="decimal" min="0" step="any" registration={register('quantity')} error={errors.quantity} />
              <TextField id="q-tax" label="Tax rate (%)" type="number" inputMode="decimal" min="0" max="100" step="any" registration={register('taxRate')} error={errors.taxRate} hint="Enter 0 if no tax applies." />
              <TextField id="q-additional" label={`Additional costs (${currency || 'USD'})`} type="number" inputMode="decimal" min="0" step="any" registration={register('additionalCosts')} error={errors.additionalCosts} hint="Freight, handling, insurance, etc." />
              <dl className="grid grid-cols-2 gap-3 rounded-lg bg-canvas p-4 text-sm sm:col-span-2" aria-live="polite">
                <dt className="text-muted">Calculated subtotal</dt>
                <dd className="num text-right font-semibold">{fmt(totals.subtotal)}</dd>
                <dt className="text-muted">Calculated total</dt>
                <dd className="num text-right font-semibold">{fmt(totals.total)}</dd>
              </dl>
            </div>
          </Card>

          <Card>
            <CardHeader title="C. Delivery and validity" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <TextField id="q-duration" label="Estimated delivery duration" required placeholder="e.g. 4 weeks from confirmation" registration={register('deliveryDuration')} error={errors.deliveryDuration} />
              <TextField id="q-valid" label="Quotation valid until" required type="date" min={todayISO()} registration={register('validUntil')} error={errors.validUntil} />
              <TextareaField id="q-terms" label="Delivery terms or notes" className="sm:col-span-2" rows={2} placeholder="e.g. CFR Djibouti port, staged deliveries" registration={register('deliveryTerms')} error={errors.deliveryTerms} />
              <SelectField id="q-payment" label="Payment terms" required className="sm:col-span-2" registration={register('paymentTerms')} error={errors.paymentTerms} options={paymentTermsOptions} placeholder="Select payment terms" />
              <TextareaField id="q-conditions" label="Additional commercial conditions" className="sm:col-span-2" rows={2} registration={register('conditions')} error={errors.conditions} />
            </div>
          </Card>

          <Card>
            <CardHeader title="D. Supporting documents" />
            <div className="space-y-4 p-5">
              {existing.length > 0 && (
                <div>
                  <p className="field-label">Previously attached (file names only)</p>
                  <ul className="divide-y divide-line rounded-lg border border-line">
                    {existing.map((a) => (
                      <li key={a.name} className="flex items-center gap-3 px-3 py-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{a.name}</span>
                          <span className="num block text-xs text-muted">{formatFileSize(a.size)}</span>
                        </span>
                        <button type="button" onClick={() => setExisting((list) => list.filter((x) => x !== a))} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-danger" aria-label={`Remove ${a.name}`}>
                          <X aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <FilePicker files={files} onChange={setFiles} multiple label="Attach files" hint="Files are simulated in this frontend-only phase: only their names and sizes are recorded with the quotation. Nothing is uploaded to a server." />
            </div>
          </Card>

          <Card>
            <CardHeader title="E. Notes" />
            <div className="p-5">
              <TextareaField id="q-notes" label="Message for the MAKHORIZON team" rows={3} registration={register('notes')} error={errors.notes} />
            </div>
          </Card>
        </div>

        <aside className="xl:sticky xl:top-[calc(var(--header-h)+1.5rem)] xl:self-start">
          <Card>
            <CardHeader title="Quotation summary" description={`All amounts in ${currency || 'USD'}`} />
            <dl className="space-y-2.5 p-5 text-sm">
              {[
                ['Subtotal', totals.subtotal],
                [`Tax (${Number(taxRate) > 0 ? Number(taxRate) : 0}%)`, totals.tax],
                ['Additional costs', totals.additional],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted">{label}</dt>
                  <dd className="num">{fmt(value)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 border-t border-line pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="num font-semibold" data-testid="quotation-total">
                  {fmt(totals.total)}
                </dd>
              </div>
            </dl>
            <div className="space-y-2 border-t border-line p-5">
              <Button type="submit" variant="primary" icon={Send} className="w-full" disabled={!!busy}>
                {mode === 'revise' ? 'Submit revised quotation' : 'Submit quotation'}
              </Button>
              {mode !== 'revise' && (
                <Button icon={Save} className="w-full" onClick={onSaveDraft} loading={busy === 'draft'} disabled={!!busy}>
                  Save draft
                </Button>
              )}
              <Button variant="ghost" className="w-full" onClick={() => (isDirty || files.length ? setCancelOpen(true) : finish(record ? `/quotations/${record.id}` : '/quotations'))} disabled={!!busy}>
                Cancel
              </Button>
            </div>
          </Card>
          <DemoNotice className="mt-4" title="Demo">
            Submitting records the quotation in this browser only. Nothing is sent to MAKHORIZON.
          </DemoNotice>
        </aside>
      </form>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => busy !== 'submit' && setConfirm(null)}
        onConfirm={doSubmit}
        busy={busy === 'submit'}
        tone="primary"
        confirmLabel={mode === 'revise' ? 'Submit revision' : 'Submit quotation'}
        title={mode === 'revise' ? 'Submit the revised quotation?' : 'Submit this quotation?'}
        message={
          confirm && (
            <div className="space-y-2">
              <p>
                You are about to submit <strong>{confirm.title}</strong> for {opp?.id ?? 'the selected opportunity'}.
              </p>
              <p className="num">
                Total: <strong>{fmt(totals.total)}</strong> · valid until {formatDate(confirm.validUntil)}
              </p>
              <p className="text-xs text-muted">After submission the quotation can no longer be edited unless MAKHORIZON requests a revision.</p>
            </div>
          )
        }
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => finish(record ? `/quotations/${record.id}` : '/quotations')}
        title="Discard unsaved changes?"
        message="Your changes to this quotation have not been saved. Save a draft to keep them."
        confirmLabel="Discard changes"
      />
    </>
  )
}
