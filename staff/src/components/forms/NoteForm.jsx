import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { required } from '../../lib/schemas'
import { Button } from '../ui/Button'
import { TextareaField } from '../ui/Fields'
import { useToast } from '../ui/Toast'

const schema = z.object({ text: required('Note', 1000) })

/** Inline "add a note / update" form. */
export default function NoteForm({ id, label = 'Add a note', submitLabel = 'Add note', placeholder, onSubmit, success = 'Note added.' }) {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { text: '' } })

  const submit = handleSubmit(async ({ text }) => {
    try {
      await onSubmit(text)
      reset({ text: '' })
      toast.success(success)
    } catch (err) {
      toast.error(err.message, 'Not saved')
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <TextareaField id={id} label={label} rows={3} placeholder={placeholder} registration={register('text')} error={errors.text} />
      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="primary" icon={Send} loading={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
