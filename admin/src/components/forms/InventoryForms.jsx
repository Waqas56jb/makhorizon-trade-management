import { z } from 'zod'
import { inventoryCategories, inventoryUnits, movementTypes } from '../../data/inventory'
import { todayISO } from '../../lib/dates'
import { choice, date, number, optional, optionalNumber, required } from '../../lib/schemas'
import { useAppState } from '../../lib/store'
import { inventoryService } from '../../services/inventoryService'
import { FormSection, SelectField, TextareaField, TextField } from '../ui/Fields'
import FormModal from './FormModal'

const itemSchema = z.object({
  name: required('Item name', 120),
  sku: required('SKU', 40),
  category: choice('a category'),
  description: optional(500),
  quantity: number('Quantity', { integer: false }),
  unit: choice('a unit'),
  minStock: number('Minimum stock level'),
  cost: number('Purchase cost'),
  price: optionalNumber('Reference selling price'),
  supplierId: z.string().optional(),
  location: optional(120),
})

export function InventoryFormModal({ open, item, onClose }) {
  const s = useAppState()
  const editing = !!item
  const cur = s.settings.company.currency
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit inventory item' : 'Add inventory item'}
      description={editing ? `${item.name} · quantity changes are recorded as stock movements` : 'Track a product or material held in stock.'}
      schema={itemSchema}
      defaultValues={item ? { ...item, price: item.price ?? '' } : { name: '', sku: '', category: '', description: '', quantity: 0, unit: 'pcs', minStock: 0, cost: '', price: '', supplierId: '', location: '' }}
      onSubmit={(v) => (editing ? inventoryService.update(item.id, v) : inventoryService.create(v))}
      successMessage={(v) => (editing ? `${v.name} updated.` : `${v.name} added.`)}
    >
      {(form) => {
        const e = form.formState.errors
        return (
          <>
            <FormSection title="Item">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="i-name" label="Item name" required registration={form.register('name')} error={e.name} />
                <TextField id="i-sku" label="SKU / reference" required registration={form.register('sku')} error={e.sku} />
                <SelectField id="i-cat" label="Category" required placeholder="Select category" options={inventoryCategories} registration={form.register('category')} error={e.category} />
                <SelectField id="i-supplier" label="Supplier" placeholder="None" options={s.suppliers.map((x) => ({ value: x.id, label: x.company }))} registration={form.register('supplierId')} />
                <TextareaField id="i-desc" label="Description" hint="Optional" rows={2} className="sm:col-span-2" registration={form.register('description')} error={e.description} />
              </div>
            </FormSection>
            <FormSection title="Stock">
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField
                  id="i-qty"
                  type="number"
                  min="0"
                  step="any"
                  label={editing ? 'Current quantity' : 'Opening quantity'}
                  required
                  readOnly={editing}
                  hint={editing ? 'Use “Record movement” to change.' : 'Recorded as an opening stock movement.'}
                  registration={form.register('quantity')}
                  error={e.quantity}
                />
                <SelectField id="i-unit" label="Unit" required options={inventoryUnits} registration={form.register('unit')} error={e.unit} />
                <TextField id="i-min" type="number" min="0" step="any" label="Minimum stock level" required hint="Low-stock warning at or below this" registration={form.register('minStock')} error={e.minStock} />
                <TextField id="i-cost" type="number" min="0" step="any" label={`Purchase cost (${cur})`} required registration={form.register('cost')} error={e.cost} />
                <TextField id="i-price" type="number" min="0" step="any" label={`Reference price (${cur})`} hint="Optional" registration={form.register('price')} error={e.price} />
                <TextField id="i-loc" label="Storage location" hint="Optional" registration={form.register('location')} error={e.location} />
              </div>
            </FormSection>
          </>
        )
      }}
    </FormModal>
  )
}

const movementSchema = z
  .object({
    date: date('Date'),
    type: choice('a movement type'),
    quantity: number('Quantity', { allowNegative: true }),
    reason: required('Reason', 200),
    reference: optional(60),
  })
  .refine((v) => v.quantity !== 0, { path: ['quantity'], message: 'Quantity cannot be zero.' })
  .refine((v) => v.type === 'Adjustment' || v.quantity > 0, { path: ['quantity'], message: 'Use a positive quantity. Only adjustments can be negative.' })

export function MovementFormModal({ open, item, onClose }) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="md"
      title="Record stock movement"
      description={item ? `${item.name} · ${item.quantity} ${item.unit} available` : ''}
      schema={movementSchema}
      defaultValues={{ date: todayISO(), type: 'Received', quantity: '', reason: '', reference: '' }}
      onSubmit={(v) => inventoryService.recordMovement(item.id, v)}
      successMessage={(v, newQty) => `Movement recorded. New quantity: ${newQty} ${item.unit}.`}
      submitLabel="Record movement"
    >
      {(form) => {
        const e = form.formState.errors
        const type = form.watch('type')
        const qty = Number(form.watch('quantity')) || 0
        const delta = type === 'Received' ? Math.abs(qty) : type === 'Issued' ? -Math.abs(qty) : qty
        const after = item.quantity + delta
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField id="m-type" label="Movement type" required options={movementTypes} registration={form.register('type')} error={e.type} />
              <TextField id="m-date" type="date" label="Date" required registration={form.register('date')} error={e.date} />
              <TextField
                id="m-qty"
                type="number"
                step="any"
                label={`Quantity (${item.unit})`}
                required
                hint={type === 'Adjustment' ? 'Adjustment: use a negative number to reduce stock.' : undefined}
                registration={form.register('quantity')}
                error={e.quantity}
              />
              <TextField id="m-ref" label="Reference" hint="Optional, e.g. order or PO number" registration={form.register('reference')} error={e.reference} />
            </div>
            <TextField id="m-reason" label="Reason" required registration={form.register('reason')} error={e.reason} />
            <p className={`rounded-lg p-3 text-sm ${after < 0 ? 'bg-danger/5 text-danger' : 'bg-canvas text-ink'}`} aria-live="polite">
              Quantity after this movement: <strong className="num">{after}</strong> {item.unit}
              {after < 0 && ' — stock cannot go below zero.'}
            </p>
          </>
        )
      }}
    </FormModal>
  )
}
