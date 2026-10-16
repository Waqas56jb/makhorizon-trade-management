import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { formatMoney } from '../../hooks/useFormat'
import { documentTotals, lineTotal } from '../../lib/calc'
import { Button } from '../ui/Button'
import { TextField } from '../ui/Fields'

/** Editable line items with live line totals, subtotal, tax, additional charge and grand total. */
export default function LineItemsEditor({ form, idPrefix }) {
  const { control, register, formState } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = useWatch({ control, name: 'items' }) ?? []
  const taxRate = useWatch({ control, name: 'taxRate' })
  const additionalCharge = useWatch({ control, name: 'additionalCharge' })
  const currency = useWatch({ control, name: 'currency' })
  const totals = documentTotals({ items, taxRate, additionalCharge })
  const errs = formState.errors.items

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-line">
        <div className="hidden grid-cols-[1fr_6.5rem_8.5rem_8.5rem_2.5rem] gap-3 border-b border-line bg-[#f8fafb] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-wide text-muted sm:grid">
          <span>Description</span>
          <span>Quantity</span>
          <span>Unit price</span>
          <span className="text-right">Line total</span>
          <span className="sr-only">Remove</span>
        </div>
        <ul className="divide-y divide-line">
          {fields.map((field, i) => (
            <li key={field.id} className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-[1fr_6.5rem_8.5rem_8.5rem_2.5rem] sm:items-start">
              <TextField
                id={`${idPrefix}-d-${i}`}
                label={<span className="sm:sr-only">Description</span>}
                aria-label={`Line ${i + 1} description`}
                className="col-span-2 sm:col-span-1"
                registration={register(`items.${i}.description`)}
                error={errs?.[i]?.description}
              />
              <TextField id={`${idPrefix}-q-${i}`} type="number" min="0" step="any" label={<span className="sm:sr-only">Quantity</span>} aria-label={`Line ${i + 1} quantity`} registration={register(`items.${i}.quantity`)} error={errs?.[i]?.quantity} />
              <TextField id={`${idPrefix}-p-${i}`} type="number" min="0" step="any" label={<span className="sm:sr-only">Unit price</span>} aria-label={`Line ${i + 1} unit price`} registration={register(`items.${i}.unitPrice`)} error={errs?.[i]?.unitPrice} />
              <div className="flex items-center justify-between sm:block sm:pt-2.5 sm:text-right">
                <span className="text-xs text-muted sm:hidden">Line total</span>
                <span className="num font-medium">{formatMoney(lineTotal(items[i] ?? {}), currency)}</span>
              </div>
              <div className="flex justify-end sm:pt-0.5">
                <Button variant="ghost" size="sm" iconOnly icon={Trash2} aria-label={`Remove line ${i + 1}`} onClick={() => remove(i)} disabled={fields.length === 1} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {typeof errs?.message === 'string' && <p className="mt-1 text-xs font-medium text-danger">{errs.message}</p>}
      <Button size="sm" icon={Plus} className="mt-3" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
        Add line item
      </Button>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_18rem]">
        <div className="grid grid-cols-2 gap-4 self-start">
          <TextField id={`${idPrefix}-tax`} type="number" min="0" max="100" step="any" label="Tax rate (%)" hint="Optional" registration={register('taxRate')} error={formState.errors.taxRate} />
          <TextField id={`${idPrefix}-charge`} type="number" min="0" step="any" label="Additional charge" hint="Optional flat amount" registration={register('additionalCharge')} error={formState.errors.additionalCharge} />
        </div>
        <dl className="num space-y-1.5 rounded-lg bg-canvas p-4 text-sm" aria-live="polite">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatMoney(totals.subtotal, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tax ({Number(taxRate) || 0}%)</dt>
            <dd>{formatMoney(totals.tax, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Additional charge</dt>
            <dd>{formatMoney(totals.charge, currency)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
            <dt>Grand total</dt>
            <dd>{formatMoney(totals.total, currency)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
