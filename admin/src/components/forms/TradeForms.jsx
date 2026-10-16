import { z } from 'zod'
import { orderStatuses } from '../../data/orders'
import { shipmentStatuses, transportModes } from '../../data/shipments'
import useLookups from '../../hooks/useLookups'
import { CURRENCIES, documentTotals, quotationStatus } from '../../lib/calc'
import { todayISO } from '../../lib/dates'
import { choice, date, number, optional, optionalDate, optionalNumber, required } from '../../lib/schemas'
import { useAppState } from '../../lib/store'
import { orderService, shipmentService } from '../../services/tradeServices'
import { FormSection, SelectField, TextareaField, TextField } from '../ui/Fields'
import FormModal from './FormModal'

// ---------------- Order ----------------
const orderSchema = z
  .object({
    clientId: choice('a client'),
    quotationId: z.string().optional(),
    orderDate: date('Order date'),
    expectedDate: optionalDate,
    origin: required('Origin', 120),
    destination: required('Destination', 120),
    cargo: required('Product or cargo description', 300),
    quantity: optionalNumber('Quantity'),
    unit: optional(30),
    amount: number('Order amount'),
    currency: choice('a currency'),
    notes: optional(1000),
    status: choice('a status'),
  })
  .refine((v) => !v.expectedDate || v.expectedDate >= v.orderDate, { path: ['expectedDate'], message: 'Expected completion cannot be before the order date.' })

/** `prefill` can carry values copied from a quotation or client. */
export function OrderFormModal({ open, order, prefill, onClose }) {
  const s = useAppState()
  const editing = !!order
  const defaults = order ?? {
    clientId: '',
    quotationId: '',
    orderDate: todayISO(),
    expectedDate: '',
    origin: '',
    destination: '',
    cargo: '',
    quantity: '',
    unit: '',
    amount: '',
    currency: s.settings.preferences.defaultCurrency,
    notes: '',
    status: 'Confirmed',
    ...prefill,
  }
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? `Edit order ${order.number}` : 'Create order'}
      description={prefill?.quotationId && !editing ? 'Details copied from the accepted quotation. Review before saving.' : 'Commercial transaction managed by the company.'}
      schema={orderSchema}
      defaultValues={{ ...defaults, quantity: defaults.quantity ?? '' }}
      onSubmit={(v) => (editing ? orderService.update(order.id, v) : orderService.create(v))}
      successMessage={() => (editing ? 'Order updated.' : 'Order created.')}
    >
      {(form) => {
        const e = form.formState.errors
        const clientId = form.watch('clientId')
        const quotes = s.quotations.filter((q) => q.clientId === clientId && (quotationStatus(q) === 'Accepted' || q.id === defaults.quotationId))
        const onQuote = (ev) => {
          const q = s.quotations.find((x) => x.id === ev.target.value)
          if (!q) return
          form.setValue('cargo', q.description, { shouldValidate: true })
          form.setValue('currency', q.currency)
          form.setValue('amount', documentTotals(q).total, { shouldValidate: true })
        }
        return (
          <>
            <FormSection title="Client and source">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="o-client"
                  label="Client"
                  required
                  placeholder="Select client"
                  options={s.clients.filter((c) => c.status === 'Active' || c.id === defaults.clientId).map((c) => ({ value: c.id, label: c.company }))}
                  registration={form.register('clientId', { onChange: () => form.setValue('quotationId', '') })}
                  error={e.clientId}
                />
                <SelectField
                  id="o-quote"
                  label="Related quotation"
                  hint={clientId && quotes.length === 0 ? 'No accepted quotations for this client.' : 'Optional — fills cargo, currency and amount.'}
                  placeholder="None"
                  options={quotes.map((q) => ({ value: q.id, label: q.number }))}
                  registration={form.register('quotationId', { onChange: onQuote })}
                  disabled={!clientId}
                />
                <TextField id="o-date" type="date" label="Order date" required registration={form.register('orderDate')} error={e.orderDate} />
                <TextField id="o-expected" type="date" label="Expected completion" hint="Optional" registration={form.register('expectedDate')} error={e.expectedDate} />
              </div>
            </FormSection>
            <FormSection title="Goods and route">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="o-origin" label="Origin country / location" required registration={form.register('origin')} error={e.origin} />
                <TextField id="o-dest" label="Destination country / location" required registration={form.register('destination')} error={e.destination} />
                <TextareaField id="o-cargo" label="Product or cargo description" required rows={2} className="sm:col-span-2" registration={form.register('cargo')} error={e.cargo} />
                <TextField id="o-qty" type="number" min="0" step="any" label="Quantity" hint="Optional" registration={form.register('quantity')} error={e.quantity} />
                <TextField id="o-unit" label="Unit" hint="e.g. tonnes, containers, pallets" registration={form.register('unit')} error={e.unit} />
              </div>
            </FormSection>
            <FormSection title="Value and status">
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField id="o-amount" type="number" min="0" step="any" label="Order amount" required registration={form.register('amount')} error={e.amount} />
                <SelectField id="o-currency" label="Currency" required options={CURRENCIES} registration={form.register('currency')} error={e.currency} />
                <SelectField id="o-status" label="Status" required options={orderStatuses} registration={form.register('status')} error={e.status} />
              </div>
            </FormSection>
            <TextareaField id="o-notes" label="Internal notes" registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

// ---------------- Shipment ----------------
const shipmentSchema = z
  .object({
    orderId: choice('an order'),
    reference: optional(40),
    origin: required('Origin', 120),
    destination: required('Destination', 120),
    mode: choice('a transport mode'),
    carrier: optional(120),
    trackingRef: optional(80),
    departureDate: date('Departure date'),
    expectedArrival: date('Expected arrival date'),
    actualArrival: optionalDate,
    status: choice('a status'),
    notes: optional(1000),
  })
  .refine((v) => v.expectedArrival >= v.departureDate, { path: ['expectedArrival'], message: 'Expected arrival cannot be before departure.' })
  .refine((v) => !v.actualArrival || v.actualArrival >= v.departureDate, { path: ['actualArrival'], message: 'Actual arrival cannot be before departure.' })

export function ShipmentFormModal({ open, shipment, prefill, onClose }) {
  const s = useAppState()
  const lk = useLookups()
  const editing = !!shipment
  const defaults = shipment ?? { orderId: '', reference: '', origin: '', destination: '', mode: 'Sea', carrier: '', trackingRef: '', departureDate: todayISO(), expectedArrival: '', actualArrival: '', status: 'Planned', notes: '', ...prefill }
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? `Edit shipment ${shipment.reference}` : 'Create shipment'}
      description="Internal coordination record — not live carrier tracking."
      schema={shipmentSchema}
      defaultValues={defaults}
      onSubmit={(v) => (editing ? shipmentService.update(shipment.id, v) : shipmentService.create(v))}
      successMessage={() => (editing ? 'Shipment updated.' : 'Shipment created.')}
    >
      {(form) => {
        const e = form.formState.errors
        const order = lk.orders[form.watch('orderId')]
        const onOrder = (ev) => {
          const o = lk.orders[ev.target.value]
          if (!o) return
          form.setValue('origin', o.origin, { shouldValidate: true })
          form.setValue('destination', o.destination, { shouldValidate: true })
        }
        return (
          <>
            <FormSection title="Order">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="sh-order"
                  label="Related order"
                  required
                  placeholder="Select order"
                  options={s.orders.filter((o) => o.status !== 'Cancelled' || o.id === defaults.orderId).map((o) => ({ value: o.id, label: `${o.number} · ${lk.clients[o.clientId]?.company ?? ''}` }))}
                  registration={form.register('orderId', { onChange: onOrder })}
                  error={e.orderId}
                />
                <div>
                  <p className="field-label">Client</p>
                  <p className="field-control flex items-center bg-canvas text-muted">{order ? lk.clients[order.clientId]?.company : 'Set by the selected order'}</p>
                </div>
                <TextField id="sh-ref" label="Shipment reference" hint={editing ? undefined : 'Leave blank to generate automatically.'} registration={form.register('reference')} error={e.reference} />
                <SelectField id="sh-status" label="Status" required options={shipmentStatuses} registration={form.register('status')} error={e.status} />
              </div>
            </FormSection>
            <FormSection title="Route and transport">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="sh-origin" label="Origin" required registration={form.register('origin')} error={e.origin} />
                <TextField id="sh-dest" label="Destination" required registration={form.register('destination')} error={e.destination} />
                <SelectField id="sh-mode" label="Transport mode" required options={transportModes} registration={form.register('mode')} error={e.mode} />
                <TextField id="sh-carrier" label="Carrier name" hint="Optional" registration={form.register('carrier')} error={e.carrier} />
                <TextField id="sh-track" label="Tracking reference" hint="Optional, e.g. bill of lading number" registration={form.register('trackingRef')} error={e.trackingRef} />
              </div>
            </FormSection>
            <FormSection title="Dates">
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField id="sh-dep" type="date" label="Departure" required registration={form.register('departureDate')} error={e.departureDate} />
                <TextField id="sh-eta" type="date" label="Expected arrival" required registration={form.register('expectedArrival')} error={e.expectedArrival} />
                <TextField id="sh-ata" type="date" label="Actual arrival / delivery" hint="Optional" registration={form.register('actualArrival')} error={e.actualArrival} />
              </div>
            </FormSection>
            <TextareaField id="sh-notes" label="Notes" registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

// ---------------- Status change with note ----------------
const statusSchema = z.object({ status: choice('a status'), note: optional(500) })

export function StatusFormModal({ open, onClose, title, description, statuses, current, onSubmit }) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="md"
      title={title}
      description={description}
      schema={statusSchema.refine((v) => v.status !== current, { path: ['status'], message: `Already ${current}. Choose a different status.` })}
      defaultValues={{ status: current, note: '' }}
      onSubmit={(v) => onSubmit(v.status, v.note)}
      successMessage={(v) => `Status changed to ${v.status}.`}
      submitLabel="Update status"
    >
      {(form) => (
        <>
          <SelectField id="st-status" label="New status" required options={statuses} registration={form.register('status')} error={form.formState.errors.status} />
          <TextareaField id="st-note" label="Note" hint="Optional. Saved in the status history." registration={form.register('note')} error={form.formState.errors.note} />
        </>
      )}
    </FormModal>
  )
}
