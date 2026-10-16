import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import useDemoSubmit from '../../hooks/useDemoSubmit'
import { EASE } from '../../lib/motion'
import { cn } from '../../lib/utils'
import { submitQuoteRequest } from '../../services/inquiryService'
import { CheckboxField, SelectField, TextareaField, TextField } from './Fields'
import { DemoSuccess, SubmitButton, SubmitError } from './FormFeedback'
import { inquiryTypes, quoteSchema, quoteSteps, timeframes, tradeDirections } from './schemas'

const defaultValues = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  inquiryType: '',
  direction: '',
  cargo: '',
  origin: '',
  destination: '',
  quantity: '',
  timeframe: '',
  details: '',
  consent: false,
}

function StepIndicator({ step }) {
  return (
    <div className="mb-10">
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {quoteSteps.length}: {quoteSteps[step].title}
      </p>
      <ol className="grid grid-cols-3 gap-2 sm:gap-4" aria-hidden="true">
        {quoteSteps.map((s, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={s.title}>
              <div className="h-1 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full bg-gold"
                  initial={false}
                  animate={{ width: done || current ? '100%' : '0%' }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold',
                    done ? 'bg-navy text-white' : current ? 'bg-gold text-midnight' : 'bg-line text-body',
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn('hidden text-xs font-semibold sm:block', current || done ? 'text-navy' : 'text-body')}>{s.title}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function QuoteForm() {
  const [step, setStep] = useState(0)
  const topRef = useRef(null)
  const { status, result, error, submit, reset: resetSubmit } = useDemoSubmit(submitQuoteRequest)
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(quoteSchema), defaultValues, mode: 'onTouched' })

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const next = async () => {
    const valid = await trigger(quoteSteps[step].fields, { shouldFocus: true })
    if (valid) {
      setStep((s) => s + 1)
      scrollToTop()
    }
  }
  const back = () => {
    setStep((s) => s - 1)
    scrollToTop()
  }

  const onSubmit = (data) => submit(data)
  // If the final submit reveals errors on earlier steps, jump to the first one.
  const onInvalid = (errs) => {
    const firstStep = quoteSteps.findIndex((s) => s.fields.some((f) => errs[f]))
    if (firstStep !== -1 && firstStep !== step) setStep(firstStep)
  }

  const startOver = () => {
    reset(defaultValues)
    resetSubmit()
    setStep(0)
    scrollToTop()
  }

  if (status === 'success') {
    const values = getValues()
    return (
      <div ref={topRef}>
        <DemoSuccess title="Quote request validated (demo)" reference={result.reference} onReset={startOver} resetLabel="Start a new request">
          <dl className="mt-6 grid gap-x-8 gap-y-3 rounded-[var(--radius-card)] bg-ivory p-5 text-sm sm:grid-cols-2">
            {[
              ['Inquiry type', values.inquiryType],
              ['Direction', values.direction],
              ['Origin', values.origin],
              ['Destination', values.destination],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-body">{k}</dt>
                <dd className="mt-0.5 font-medium text-navy">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm">
            Once the backend is connected, this form will deliver requests to the MAKHORIZON team. In the meantime, you can review our{' '}
            <Link to="/services" className="font-semibold text-navy underline underline-offset-4 hover:text-gold-deep">
              services
            </Link>
            .
          </p>
        </DemoSuccess>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <div ref={topRef} className="scroll-mt-32">
      <StepIndicator step={step} />
      <form
        onSubmit={(e) => {
          // Enter on an earlier step advances instead of submitting the whole form.
          if (step < quoteSteps.length - 1) {
            e.preventDefault()
            next()
            return
          }
          handleSubmit(onSubmit, onInvalid)(e)
        }}
        noValidate
        aria-label="Request a quote"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.fieldset
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="min-w-0"
          >
            <legend className="mb-7">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
                Step {step + 1} of {quoteSteps.length}
              </span>
              <span className="mt-2 block font-display text-3xl text-navy">{quoteSteps[step].title}</span>
            </legend>

            {step === 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField id="q-fullName" label="Full name" required autoComplete="name" registration={register('fullName')} error={errors.fullName} />
                <TextField id="q-company" label="Company name" required autoComplete="organization" registration={register('company')} error={errors.company} />
                <TextField id="q-email" type="email" label="Business email" required autoComplete="email" inputMode="email" registration={register('email')} error={errors.email} />
                <TextField id="q-phone" type="tel" label="Phone number" optional autoComplete="tel" inputMode="tel" hint="Include your country code, e.g. +253" registration={register('phone')} error={errors.phone} />
                <TextField id="q-country" label="Country" required autoComplete="country-name" registration={register('country')} error={errors.country} className="sm:col-span-2" />
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <SelectField id="q-inquiryType" label="Inquiry type" required options={inquiryTypes} registration={register('inquiryType')} error={errors.inquiryType} />
                <SelectField id="q-direction" label="Import or export direction" required options={tradeDirections} registration={register('direction')} error={errors.direction} />
                <TextareaField
                  id="q-cargo"
                  label="Product or cargo description"
                  required
                  rows={4}
                  hint="What is being traded or moved? Include packaging or handling notes if relevant."
                  registration={register('cargo')}
                  error={errors.cargo}
                  className="sm:col-span-2"
                />
                <TextField id="q-origin" label="Origin country or location" required registration={register('origin')} error={errors.origin} />
                <TextField id="q-destination" label="Destination country or location" required registration={register('destination')} error={errors.destination} />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField id="q-quantity" label="Estimated quantity" optional hint="e.g. 2 × 40ft containers, 5,000 units, 12 tonnes" registration={register('quantity')} error={errors.quantity} />
                <SelectField id="q-timeframe" label="Preferred timeframe" optional options={timeframes} placeholder="Select a timeframe" registration={register('timeframe')} error={errors.timeframe} />
                <TextareaField id="q-details" label="Additional details" optional rows={5} registration={register('details')} error={errors.details} className="sm:col-span-2" />
                <CheckboxField id="q-consent" registration={register('consent')} error={errors.consent} className="sm:col-span-2">
                  I agree that MAKHORIZON Logistics &amp; Trade may use the information in this form to review and respond to my inquiry, as described in the{' '}
                  <Link to="/privacy-policy" className="font-semibold text-navy underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </CheckboxField>
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>

        {status === 'error' && (
          <div className="mt-8">
            <SubmitError message={error} onRetry={handleSubmit(onSubmit, onInvalid)} />
          </div>
        )}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn btn-outline" disabled={submitting}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
          ) : (
            <span className="text-xs text-body">
              Fields marked <span className="text-danger">*</span> are required.
            </span>
          )}
          {step < quoteSteps.length - 1 ? (
            <button type="submit" className="btn btn-navy">
              Continue
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <SubmitButton submitting={submitting}>
              Submit request
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </SubmitButton>
          )}
        </div>
      </form>
    </div>
  )
}
