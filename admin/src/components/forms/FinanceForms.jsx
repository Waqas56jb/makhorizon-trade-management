import { z } from 'zod'
import { expenseCategories, incomeCategories, paymentMethods } from '../../data/finances'
import { formatMoney } from '../../hooks/useFormat'
import { CURRENCIES, documentTotals, invoiceOutstanding } from '../../lib/calc'
import { addDays, todayISO } from '../../lib/dates'
import { choice, date, lineItems, number, optional, optionalNumber, required } from '../../lib/schemas'
import { useAppState } from '../../lib/store'
import { financeService } from '../../services/financeService'
import { FormSection, SelectField, TextareaField, TextField } from '../ui/Fields'
import FormModal from './FormModal'
import LineItemsEditor from './LineItemsEditor'

// ---------------- Income / expense record ----------------
const recordSchema = z.object({
  type: z.enum(['Income', 'Expense']),
  date: date('Date'),
  category: choice('a category'),
  description: required('Description', 200),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
  amount: number('Amount').refine((v) => v > 0, 'Amount must be greater than zero.'),
  currency: choice('a currency'),
  method: z.string().optional(),
  reference: optional(60),
  status: choice('a status'),
  notes: optional(500),
})

export function RecordFormModal({ open, record, prefill, onClose }) {
  const s = useAppState()
  const editing = !!record
  const defaults = record ?? {
    type: 'Expense',
    date: todayISO(),
    category: '',
    description: '',
    clientId: '',
    supplierId: '',
    amount: '',
    currency: s.settings.preferences.defaultCurrency,
    method: 'Bank Transfer',
    reference: '',
    status: 'Paid',
    notes: '',
    ...prefill,
  }
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit record' : 'Add income or expense'}
      description="Demo financial record — not an accounting system."
      schema={recordSchema}
      defaultValues={defaults}
      onSubmit={(v) => {
        const clean = { ...v, clientId: v.type === 'Income' ? v.clientId : '', supplierId: v.type === 'Expense' ? v.supplierId : '' }
        return editing ? financeService.updateRecord(record.id, clean) : financeService.createRecord(clean)
      }}
      successMessage={(v) => (editing ? 'Record updated.' : `${v.type} recorded.`)}
    >
      {(form) => {
        const e = form.formState.errors
        const type = form.watch('type')
        const onType = (ev) => {
          form.setValue('category', '')
          form.setValue('status', ev.target.value === 'Income' ? 'Received' : 'Paid')
        }
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField id="r-type" label="Type" required options={['Income', 'Expense']} registration={form.register('type', { onChange: onType })} error={e.type} />
              <TextField id="r-date" type="date" label="Date" required registration={form.register('date')} error={e.date} />
              <SelectField id="r-cat" label="Category" required placeholder="Select category" options={type === 'Income' ? incomeCategories.filter((c) => c !== 'Invoice Payment') : expenseCategories} registration={form.register('category')} error={e.category} />
              {type === 'Income' ? (
                <SelectField id="r-client" label="Related client" placeholder="None" options={s.clients.map((c) => ({ value: c.id, label: c.company }))} registration={form.register('clientId')} />
              ) : (
                <SelectField id="r-supplier" label="Supplier" placeholder="None" options={s.suppliers.map((c) => ({ value: c.id, label: c.company }))} registration={form.register('supplierId')} />
              )}
              <TextField id="r-desc" label="Description" required className="sm:col-span-2" registration={form.register('description')} error={e.description} />
              <TextField id="r-amount" type="number" min="0" step="any" label="Amount" required registration={form.register('amount')} error={e.amount} />
              <SelectField id="r-cur" label="Currency" required options={CURRENCIES} registration={form.register('currency')} error={e.currency} />
              <SelectField id="r-method" label="Payment method" placeholder="Not specified" options={paymentMethods} registration={form.register('method')} />
              <TextField id="r-ref" label="Reference" hint="Optional" registration={form.register('reference')} error={e.reference} />
              <SelectField
                id="r-status"
                label="Status"
                required
                hint={type === 'Expense' ? 'Pending expenses count as payables.' : 'Pending income is not included in recorded income.'}
                options={type === 'Income' ? ['Received', 'Pending'] : ['Paid', 'Pending']}
                registration={form.register('status')}
                error={e.status}
              />
            </div>
            <TextareaField id="r-notes" label="Notes" hint="Optional" registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

// ---------------- Invoice ----------------
const invoiceSchema = z
  .object({
    clientId: choice('a client'),
    orderId: z.string().optional(),
    issueDate: date('Issue date'),
    dueDate: date('Due date'),
    currency: choice('a currency'),
    status: z.enum(['Draft', 'Unpaid', 'Cancelled']),
    items: lineItems,
    taxRate: optionalNumber('Tax rate').refine((v) => v === null || v <= 100, 'Tax rate cannot exceed 100%.'),
    additionalCharge: optionalNumber('Additional charge'),
    notes: optional(1000),
  })
  .refine((v) => v.dueDate >= v.issueDate, { path: ['dueDate'], message: 'Due date cannot be before the issue date.' })

export function InvoiceFormModal({ open, invoice, prefill, onClose }) {
  const s = useAppState()
  const editing = !!invoice
  const today = todayISO()
  const defaults = invoice
    ? { ...invoice, taxRate: invoice.taxRate ?? '', additionalCharge: invoice.additionalCharge ?? '' }
    : { clientId: '', orderId: '', issueDate: today, dueDate: addDays(today, 30), currency: s.settings.preferences.defaultCurrency, status: 'Unpaid', items: [{ description: '', quantity: 1, unitPrice: 0 }], taxRate: '', additionalCharge: '', notes: '', ...prefill }
  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="xl"
      title={editing ? `Edit invoice ${invoice.number}` : 'Create invoice'}
      description="Paid, partially paid and overdue statuses are calculated from payments and the due date."
      schema={invoiceSchema}
      defaultValues={defaults}
      onSubmit={(v) => {
        const clean = { ...v, taxRate: v.taxRate ?? 0, additionalCharge: v.additionalCharge ?? 0 }
        return editing ? financeService.updateInvoice(invoice.id, clean) : financeService.createInvoice(clean)
      }}
      successMessage={() => (editing ? 'Invoice updated.' : 'Invoice created.')}
      submitLabel={editing ? 'Save invoice' : 'Create invoice'}
    >
      {(form) => {
        const e = form.formState.errors
        const clientId = form.watch('clientId')
        const onOrder = (ev) => {
          const o = s.orders.find((x) => x.id === ev.target.value)
          if (!o) return
          form.setValue('currency', o.currency)
          const items = form.getValues('items')
          if (items.length === 1 && !items[0].description) form.setValue('items', [{ description: `${o.cargo} (${o.number})`, quantity: 1, unitPrice: o.amount }])
        }
        return (
          <>
            <FormSection title="Details">
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField id="in-client" label="Client" required placeholder="Select client" options={s.clients.map((c) => ({ value: c.id, label: c.company }))} registration={form.register('clientId', { onChange: () => form.setValue('orderId', '') })} error={e.clientId} />
                <SelectField id="in-order" label="Related order" hint="Optional" placeholder="None" disabled={!clientId} options={s.orders.filter((o) => o.clientId === clientId).map((o) => ({ value: o.id, label: o.number }))} registration={form.register('orderId', { onChange: onOrder })} />
                <SelectField id="in-status" label="Status" required hint="Unpaid = issued to the client" options={['Draft', 'Unpaid', 'Cancelled']} registration={form.register('status')} error={e.status} />
                <TextField id="in-issue" type="date" label="Issue date" required registration={form.register('issueDate')} error={e.issueDate} />
                <TextField id="in-due" type="date" label="Due date" required registration={form.register('dueDate')} error={e.dueDate} />
                <SelectField id="in-cur" label="Currency" required options={CURRENCIES} registration={form.register('currency')} error={e.currency} />
              </div>
            </FormSection>
            <FormSection title="Line items">
              <LineItemsEditor form={form} idPrefix="in" />
            </FormSection>
            <TextareaField id="in-notes" label="Notes" hint="Optional" registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

// ---------------- Payment ----------------
export function PaymentFormModal({ open, invoice, onClose }) {
  const s = useAppState()
  const outstanding = invoice ? invoiceOutstanding(invoice, s.payments) : 0
  const schema = z.object({
    date: date('Payment date'),
    amount: number('Amount')
      .refine((v) => v > 0, 'Amount must be greater than zero.')
      .refine((v) => v <= outstanding + 0.001, `Amount cannot exceed the outstanding ${invoice ? formatMoney(outstanding, invoice.currency) : ''}.`),
    method: choice('a payment method'),
    reference: optional(60),
  })
  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="md"
      title="Record payment"
      description={invoice ? `${invoice.number} · total ${formatMoney(documentTotals(invoice).total, invoice.currency)} · outstanding ${formatMoney(outstanding, invoice.currency)}` : ''}
      schema={schema}
      defaultValues={{ date: todayISO(), amount: outstanding || '', method: 'Bank Transfer', reference: '' }}
      onSubmit={(v) => financeService.recordPayment(invoice.id, v)}
      successMessage={(v) => `Payment of ${formatMoney(v.amount, invoice.currency)} recorded.`}
      submitLabel="Record payment"
    >
      {(form) => {
        const e = form.formState.errors
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="py-amount" type="number" min="0" step="any" label={`Amount (${invoice.currency})`} required hint="Partial payments are allowed." registration={form.register('amount')} error={e.amount} />
              <TextField id="py-date" type="date" label="Payment date" required registration={form.register('date')} error={e.date} />
              <SelectField id="py-method" label="Method" required options={paymentMethods} registration={form.register('method')} error={e.method} />
              <TextField id="py-ref" label="Reference" hint="Optional" registration={form.register('reference')} error={e.reference} />
            </div>
            <p className="rounded-lg bg-canvas p-3 text-xs text-muted">The payment is also added to income records automatically.</p>
          </>
        )
      }}
    </FormModal>
  )
}
