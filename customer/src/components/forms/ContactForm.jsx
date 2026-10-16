import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import useDemoSubmit from '../../hooks/useDemoSubmit'
import { submitContactMessage } from '../../services/inquiryService'
import { CheckboxField, SelectField, TextareaField, TextField } from './Fields'
import { DemoSuccess, SubmitButton, SubmitError } from './FormFeedback'
import { contactCategories, contactSchema } from './schemas'

const defaultValues = { fullName: '', email: '', company: '', category: '', subject: '', message: '', consent: false }

export default function ContactForm({ defaultCategory = '' }) {
  const { status, result, error, submit, reset: resetSubmit } = useDemoSubmit(submitContactMessage)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...defaultValues, category: defaultCategory },
    mode: 'onTouched',
  })

  if (status === 'success') {
    return (
      <DemoSuccess
        title="Message validated (demo)"
        reference={result.reference}
        onReset={() => {
          reset({ ...defaultValues, category: defaultCategory })
          resetSubmit()
        }}
        resetLabel="Write another message"
      />
    )
  }

  const submitting = status === 'submitting'

  return (
    <form onSubmit={handleSubmit(submit)} noValidate aria-label="Contact form" className="grid gap-6 sm:grid-cols-2">
      <TextField id="c-fullName" label="Full name" required autoComplete="name" registration={register('fullName')} error={errors.fullName} />
      <TextField id="c-email" type="email" label="Email address" required autoComplete="email" inputMode="email" registration={register('email')} error={errors.email} />
      <TextField id="c-company" label="Company" optional autoComplete="organization" registration={register('company')} error={errors.company} />
      <SelectField id="c-category" label="Inquiry category" required options={contactCategories} registration={register('category')} error={errors.category} />
      <TextField id="c-subject" label="Subject" required registration={register('subject')} error={errors.subject} className="sm:col-span-2" />
      <TextareaField id="c-message" label="Message" required rows={6} registration={register('message')} error={errors.message} className="sm:col-span-2" />
      <CheckboxField id="c-consent" registration={register('consent')} error={errors.consent} className="sm:col-span-2">
        I agree that MAKHORIZON Logistics &amp; Trade may use these details to respond to my message, as described in the{' '}
        <Link to="/privacy-policy" className="font-semibold text-navy underline underline-offset-2">
          privacy policy
        </Link>
        .
      </CheckboxField>
      {status === 'error' && (
        <div className="sm:col-span-2">
          <SubmitError message={error} onRetry={handleSubmit(submit)} />
        </div>
      )}
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-body">
          Fields marked <span className="text-danger">*</span> are required.
        </span>
        <SubmitButton submitting={submitting}>
          Send message
          <Send className="h-4 w-4" aria-hidden="true" />
        </SubmitButton>
      </div>
    </form>
  )
}
