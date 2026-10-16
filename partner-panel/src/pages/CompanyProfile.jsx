import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, CircleAlert, ImagePlus, Lock, PencilLine, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import { SelectField, TextareaField, TextField } from '../components/ui/Fields'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { businessCategories, communicationMethods } from '../data/partners'
import usePartnerData from '../hooks/usePartnerData'
import { formatDate } from '../lib/format'
import { email, optional, phone, required, url } from '../lib/schemas'
import { initials } from '../lib/utils'
import { updatePartnerProfile } from '../services/partnerProfileService'

const schema = z.object({
  companyName: required('Company name', 150).refine((v) => !/makhorizon/i.test(v), 'Enter your own company name.'),
  registrationNumber: required('Registration number', 60),
  country: required('Country', 80),
  city: required('City', 80),
  address: required('Business address', 250),
  contactName: required('Primary contact name', 120),
  email,
  phone: phone.refine((v) => !!v, 'Phone number is required.'),
  website: url,
  category: z.string().min(1, 'Select a business category.'),
  description: optional(800),
  preferredContact: z.string().min(1, 'Select a communication method.'),
})

const FIELDS = Object.keys(schema.shape)
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export default function CompanyProfile() {
  const { partner } = usePartnerData()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [logo, setLogo] = useState(null) // { name, url } — local preview only
  const [logoError, setLogoError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const form = useForm({ resolver: zodResolver(schema), defaultValues: Object.fromEntries(FIELDS.map((k) => [k, partner?.[k] ?? ''])), mode: 'onTouched' })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = form

  useEffect(() => () => logo && URL.revokeObjectURL(logo.url), [logo])

  if (!partner) return null

  const startEdit = () => {
    reset(Object.fromEntries(FIELDS.map((k) => [k, partner[k] ?? ''])))
    setSubmitError('')
    setEditing(true)
  }
  const cancel = () => {
    reset()
    setEditing(false)
    toast.info('Changes discarded.')
  }
  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    try {
      await updatePartnerProfile({ ...values, logoName: logo?.name ?? partner.logoName })
      setEditing(false)
      toast.success('Company profile saved in this browser (demo — not sent to a server).', 'Profile updated')
    } catch (err) {
      setSubmitError(err.message)
    }
  })

  const pickLogo = (file) => {
    setLogoError('')
    if (!file) return
    if (!LOGO_TYPES.includes(file.type)) return setLogoError('Use a PNG, JPG or WebP image.')
    if (file.size > 2 * 1024 * 1024) return setLogoError('The logo must be 2 MB or smaller.')
    setLogo({ name: file.name, url: URL.createObjectURL(file) })
  }

  const logoBlock = (
    <div className="flex items-center gap-4">
      {logo ? (
        <img src={logo.url} alt={`${partner.companyName} logo preview`} className="h-16 w-16 rounded-xl border border-line object-contain" />
      ) : (
        <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-navy text-lg font-bold text-gold" aria-hidden="true">
          {initials(partner.companyName)}
        </span>
      )}
      <div className="min-w-0">
        <label className="btn btn-secondary btn-sm cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-gold-deep">
          <ImagePlus aria-hidden="true" />
          {logo ? 'Change logo' : 'Choose logo'}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => pickLogo(e.target.files?.[0])} />
        </label>
        {logo && (
          <button type="button" onClick={() => setLogo(null)} className="btn btn-ghost btn-sm ml-1">
            <X aria-hidden="true" />
            Remove
          </button>
        )}
        <p className="mt-1 text-xs text-muted">{logoError ? <span className="font-medium text-danger">{logoError}</span> : 'Preview only — the logo is not uploaded and is cleared on reload.'}</p>
      </div>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Company Profile"
        description="Your company’s information as shared with MAKHORIZON."
        actions={
          !editing && (
            <Button variant="primary" icon={PencilLine} onClick={startEdit}>
              Edit profile
            </Button>
          )
        }
      />
      <DemoNotice className="mb-4" title="Saved locally">
        Changes are saved to the demo data in this browser only. They are not sent to or stored on a MAKHORIZON server.
      </DemoNotice>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title={editing ? 'Edit company information' : 'Company information'} actions={partner.tier && <Badge tone="success">{partner.tier}</Badge>} />
          {editing ? (
            <form onSubmit={onSubmit} noValidate className="space-y-6 p-5">
              {submitError && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                  {submitError}
                </div>
              )}
              {logoBlock}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="cp-name" label="Company name" required registration={register('companyName')} error={errors.companyName} />
                <TextField id="cp-reg" label="Company registration number" required registration={register('registrationNumber')} error={errors.registrationNumber} />
                <TextField id="cp-country" label="Country" required registration={register('country')} error={errors.country} />
                <TextField id="cp-city" label="City" required registration={register('city')} error={errors.city} />
                <TextField id="cp-address" label="Business address" required className="sm:col-span-2" registration={register('address')} error={errors.address} />
                <TextField id="cp-contact" label="Primary contact name" required registration={register('contactName')} error={errors.contactName} />
                <TextField id="cp-email" label="Contact email" type="email" required registration={register('email')} error={errors.email} />
                <TextField id="cp-phone" label="Phone number" type="tel" required registration={register('phone')} error={errors.phone} />
                <TextField id="cp-web" label="Website" placeholder="www.example.com" registration={register('website')} error={errors.website} />
                <SelectField id="cp-cat" label="Business category" required registration={register('category')} error={errors.category} options={businessCategories} placeholder="Select a category" />
                <SelectField id="cp-pref" label="Preferred communication method" required registration={register('preferredContact')} error={errors.preferredContact} options={communicationMethods} placeholder="Select a method" />
                <TextareaField id="cp-desc" label="Short company description" className="sm:col-span-2" rows={3} registration={register('description')} error={errors.description} />
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
                <Button onClick={cancel} disabled={isSubmitting}>
                  Cancel changes
                </Button>
                <Button type="submit" variant="primary" icon={Save} loading={isSubmitting} disabled={!isDirty && !logo}>
                  Save changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 p-5">
              {logoBlock}
              <DetailList
                items={[
                  { label: 'Company name', value: partner.companyName },
                  { label: 'Registration number', value: partner.registrationNumber },
                  { label: 'Country', value: partner.country },
                  { label: 'City', value: partner.city },
                  { label: 'Business address', value: partner.address, full: true },
                  { label: 'Primary contact', value: partner.contactName },
                  { label: 'Contact email', value: partner.email },
                  { label: 'Phone number', value: partner.phone },
                  { label: 'Website', value: partner.website },
                  { label: 'Business category', value: partner.category },
                  { label: 'Preferred communication', value: partner.preferredContact },
                  { label: 'Description', value: partner.description, full: true },
                ]}
              />
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Partnership" />
            <div className="p-5">
              <DetailList columns={1} items={[{ label: 'Partner status', value: partner.tier }, { label: 'Partner since', value: formatDate(partner.partnerSince) }, { label: 'Partner ID', value: partner.id }]} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Your MAKHORIZON contact" actions={<span className="flex items-center gap-1 text-xs text-muted"><Lock className="h-3.5 w-3.5" aria-hidden="true" />Not editable</span>} />
            <div className="flex gap-3 p-5">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-semibold">MAKHORIZON Logistics &amp; Trade</p>
                <p className="text-muted">Salam Tower, 5th Floor, Djibouti</p>
                <p className="mt-2 text-xs text-muted">MAKHORIZON’s company details are managed by MAKHORIZON and cannot be changed from the partner portal. Use Messages to reach the team.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
