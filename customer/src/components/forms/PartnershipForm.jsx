import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { partnershipCategories } from '../../data/partnerships'
import useDemoSubmit from '../../hooks/useDemoSubmit'
import { submitPartnershipInquiry } from '../../services/inquiryService'
import { CheckboxField, SelectField, TextareaField, TextField } from './Fields'
import { DemoSuccess, SubmitButton, SubmitError } from './FormFeedback'
import { partnershipSchema } from './schemas'

const defaultValues = {
  fullName: '',
  organisation: '',
  email: '',
  country: '',
  partnershipType: '',
  website: '',
  message: '',
  consent: false,
}

export default function PartnershipForm() {
  const { status, result, error, submit, reset: resetSubmit } = useDemoSubmit(submitPartnershipInquiry)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(partnershipSchema), defaultValues, mode: 'onTouched' })

  if (status === 'success') {
    return (
      <DemoSuccess
        title="Partnership inquiry validated (demo)"
        reference={result.reference}
        onReset={() => {
          reset(defaultValues)
          resetSubmit()
        }}
      />
    )
  }

  const submitting = status === 'submitting'

  return (
    <form onSubmit={handleSubmit(submit)} noValidate aria-label="Partnership inquiry" className="grid gap-6 sm:grid-cols-2">
      <TextField id="p-fullName" label="Full name" required autoComplete="name" registration={register('fullName')} error={errors.fullName} />
      <TextField id="p-organisation" label="Organisation" required autoComplete="organization" registration={register('organisation')} error={errors.organisation} />
      <TextField id="p-email" type="email" label="Business email" required autoComplete="email" inputMode="email" registration={register('email')} error={errors.email} />
      <TextField id="p-country" label="Country" required autoComplete="country-name" registration={register('country')} error={errors.country} />
      <SelectField id="p-type" label="Partnership type" required options={partnershipCategories} registration={register('partnershipType')} error={errors.partnershipType} />
      <TextField id="p-website" type="url" label="Website" optional inputMode="url" placeholder="www.example.com" registration={register('website')} error={errors.website} />
      <TextareaField
        id="p-message"
        label="Your proposal"
        required
        rows={6}
        hint="Describe your organisation, what you offer or are looking for, and the markets involved."
        registration={register('message')}
        error={errors.message}
        className="sm:col-span-2"
      />
      <CheckboxField id="p-consent" registration={register('consent')} error={errors.consent} className="sm:col-span-2">
        I agree that MAKHORIZON Logistics &amp; Trade may use these details to review and respond to this inquiry, as described in the{' '}
        <Link to="/privacy-policy" className="font-semibold text-navy underline underline-offset-2">
          privacy policy
        </Link>
        . I understand that submitting an inquiry creates no commitment for either party.
      </CheckboxField>
      {status === 'error' && (
        <div className="sm:col-span-2">
          <SubmitError message={error} onRetry={handleSubmit(submit)} />
        </div>
      )}
      <div className="sm:col-span-2">
        <SubmitButton submitting={submitting}>
          Submit partnership inquiry
          <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
        </SubmitButton>
      </div>
    </form>
  )
}
