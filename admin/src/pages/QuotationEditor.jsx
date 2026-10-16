import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import LineItemsEditor from '../components/forms/LineItemsEditor'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { SelectField, TextareaField, TextField } from '../components/ui/Fields'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { quotationStatuses } from '../data/quotations'
import { CURRENCIES } from '../lib/calc'
import { addDays, todayISO } from '../lib/dates'
import { choice, date, lineItems, optional, optionalNumber, required } from '../lib/schemas'
import { useAppState } from '../lib/store'
import { quotationService } from '../services/tradeServices'
import NotFound from './NotFound'

const schema = z
  .object({
    clientId: choice('a client'),
    issueDate: date('Quotation date'),
    expiryDate: date('Expiry date'),
    currency: choice('a currency'),
    status: choice('a status'),
    description: required('Description', 300),
    items: lineItems,
    taxRate: optionalNumber('Tax rate').refine((v) => v === null || v <= 100, 'Tax rate cannot exceed 100%.'),
    additionalCharge: optionalNumber('Additional charge'),
    notes: optional(1000),
  })
  .refine((v) => v.expiryDate >= v.issueDate, { path: ['expiryDate'], message: 'Expiry date cannot be before the quotation date.' })
  .refine((v) => v.status !== 'Expired', { path: ['status'], message: 'Expired is set automatically from the expiry date.' })

function Editor({ quotation }) {
  const s = useAppState()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [submitError, setSubmitError] = useState('')
  const editing = !!quotation
  const today = todayISO()

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: quotation
      ? { ...quotation, taxRate: quotation.taxRate || '', additionalCharge: quotation.additionalCharge || '' }
      : {
          clientId: params.get('client') ?? '',
          issueDate: today,
          expiryDate: addDays(today, 30),
          currency: s.settings.preferences.defaultCurrency,
          status: 'Draft',
          description: '',
          items: [{ description: '', quantity: 1, unitPrice: 0 }],
          taxRate: '',
          additionalCharge: '',
          notes: '',
        },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = handleSubmit(async (v) => {
    setSubmitError('')
    const clean = { ...v, taxRate: v.taxRate ?? 0, additionalCharge: v.additionalCharge ?? 0 }
    try {
      const id = editing ? await quotationService.update(quotation.id, clean) : await quotationService.create(clean)
      toast.success(editing ? 'Quotation updated.' : 'Quotation created.')
      navigate(`/quotations/${id}`)
    } catch (err) {
      setSubmitError(err.message)
    }
  })

  return (
    <>
      <PageHeader
        title={editing ? `Edit ${quotation.number}` : 'New quotation'}
        description="Totals are calculated automatically from the line items. Nothing is sent to the client from this demo."
        breadcrumbs={[{ label: 'Quotations', to: '/quotations' }, ...(editing ? [{ label: quotation.number, to: `/quotations/${quotation.id}` }] : []), { label: editing ? 'Edit' : 'New' }]}
      />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {submitError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            {submitError}
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <p role="alert" className="text-sm font-medium text-danger">
            Please correct the highlighted fields.
          </p>
        )}
        <Card>
          <CardHeader title="Quotation details" />
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField id="q-client" label="Client" required placeholder="Select client" options={s.clients.filter((c) => c.status === 'Active' || c.id === quotation?.clientId).map((c) => ({ value: c.id, label: c.company }))} registration={register('clientId')} error={errors.clientId} />
            <TextField id="q-issue" type="date" label="Quotation date" required registration={register('issueDate')} error={errors.issueDate} />
            <TextField id="q-expiry" type="date" label="Expiry date" required registration={register('expiryDate')} error={errors.expiryDate} />
            <SelectField id="q-currency" label="Currency" required options={CURRENCIES} registration={register('currency')} error={errors.currency} />
            <SelectField id="q-status" label="Status" required options={quotationStatuses.filter((x) => x !== 'Expired')} registration={register('status')} error={errors.status} />
            <TextareaField id="q-desc" label="Description" required rows={2} className="sm:col-span-2 lg:col-span-3" registration={register('description')} error={errors.description} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Line items" description="Quantities and prices cannot be negative." />
          <div className="p-5">
            <LineItemsEditor form={form} idPrefix="q" />
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <TextareaField id="q-notes" label="Notes" hint="Optional. Shown on the printed quotation." registration={register('notes')} error={errors.notes} />
          </div>
        </Card>
        <div className="flex flex-wrap justify-end gap-2">
          <ButtonLink to={editing ? `/quotations/${quotation.id}` : '/quotations'}>Cancel</ButtonLink>
          <Button type="submit" variant="primary" icon={Save} loading={isSubmitting}>
            {isSubmitting ? 'Saving…' : editing ? 'Save changes' : 'Create quotation'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default function QuotationEditor() {
  const { id } = useParams()
  const quotation = useAppState().quotations.find((q) => q.id === id)
  if (id && !quotation) return <NotFound title="Quotation not found" backTo="/quotations" backLabel="Back to quotations" />
  return <Editor key={id ?? 'new'} quotation={quotation} />
}
