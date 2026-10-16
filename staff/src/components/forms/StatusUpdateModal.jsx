import { z } from 'zod'
import { SelectField, TextareaField } from '../ui/Fields'
import { StatusBadge } from '../ui/Badge'
import FormModal from './FormModal'

/**
 * Status update dialog limited to `allowed` next statuses.
 * Statuses in `reasonRequired` need a note (e.g. Delayed).
 */
export default function StatusUpdateModal({ open, onClose, title, description, current, allowed, reasonRequired = [], onSubmit, children }) {
  const schema = z
    .object({ status: z.string().min(1, 'Please choose the new status.'), note: z.string().trim().max(500, 'Please keep the note under 500 characters.').optional() })
    .refine((v) => !reasonRequired.includes(v.status) || (v.note && v.note.length >= 3), { path: ['note'], message: 'Please give a short reason.' })

  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="md"
      title={title}
      description={description}
      schema={schema}
      defaultValues={{ status: allowed[0] ?? '', note: '' }}
      onSubmit={(v) => onSubmit(v.status, v.note ?? '')}
      successMessage={(v) => `Status updated to ${v.status}.`}
      submitLabel="Save update"
    >
      {(form) => {
        const next = form.watch('status')
        const needsReason = reasonRequired.includes(next)
        return (
          <>
            <p className="flex items-center gap-2 text-sm">
              Current status: <StatusBadge status={current} />
            </p>
            <SelectField id="su-status" label="New status" required options={allowed} registration={form.register('status')} error={form.formState.errors.status} />
            <TextareaField
              id="su-note"
              label={needsReason ? 'Reason' : 'Note'}
              required={needsReason}
              hint={needsReason ? 'Required. Explain what happened.' : 'Optional. Saved in the status history.'}
              rows={3}
              registration={form.register('note')}
              error={form.formState.errors.note}
            />
            {children?.(next)}
          </>
        )
      }}
    </FormModal>
  )
}
