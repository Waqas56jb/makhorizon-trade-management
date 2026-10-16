import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'

function Inner({ onClose, title, description, schema, defaultValues, onSubmit, successMessage, submitLabel = 'Save', size = 'lg', children }) {
  const toast = useToast()
  const [submitError, setSubmitError] = useState('')
  const form = useForm({ resolver: zodResolver(schema), defaultValues, mode: 'onTouched' })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const submit = handleSubmit(async (values) => {
    setSubmitError('')
    try {
      const result = await onSubmit(values)
      toast.success(typeof successMessage === 'function' ? successMessage(values, result) : successMessage)
      onClose(result)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    }
  })

  const formId = `form-${title.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <Modal
      open
      onClose={() => onClose()}
      title={title}
      description={description}
      size={size}
      busy={isSubmitting}
      footer={
        <>
          <Button onClick={() => onClose()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-6">
        {submitError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-ink">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            {submitError}
          </div>
        )}
        {children(form)}
      </form>
    </Modal>
  )
}

/** Create/edit dialog. Remounts on every open so defaults are always fresh. */
export default function FormModal({ open, ...props }) {
  return open ? <Inner {...props} /> : null
}
