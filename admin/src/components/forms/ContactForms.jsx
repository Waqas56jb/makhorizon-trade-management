import { z } from 'zod'
import { clientTypes } from '../../data/clients'
import { countries } from '../../data/countries'
import { partnerStatuses, partnerTypes } from '../../data/partners'
import { supplierCategories } from '../../data/suppliers'
import { todayISO } from '../../lib/dates'
import { choice, date, email, optional, phone, required, url } from '../../lib/schemas'
import { clientService, partnerService, supplierService } from '../../services/contactServices'
import { FormSection, SelectField, TextareaField, TextField } from '../ui/Fields'
import FormModal from './FormModal'

export function CountryField({ form, id, name = 'country' }) {
  return (
    <>
      <TextField id={id} label="Country" required list={`${id}-list`} autoComplete="country-name" registration={form.register(name)} error={form.formState.errors[name]} />
      <datalist id={`${id}-list`}>
        {countries.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </>
  )
}

// ---------------- Client ----------------
const clientSchema = z.object({
  name: required('Full name', 100),
  company: required('Company name', 120),
  email,
  phone,
  country: required('Country', 80),
  address: optional(200),
  type: choice('a client type'),
  notes: optional(1000),
  status: choice('a status'),
})

export function ClientFormModal({ open, client, onClose }) {
  const editing = !!client
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit client' : 'Add client'}
      description={editing ? client.company : 'Register a new client in the demo data.'}
      schema={clientSchema}
      defaultValues={client ?? { name: '', company: '', email: '', phone: '', country: '', address: '', type: '', notes: '', status: 'Active' }}
      onSubmit={(v) => (editing ? clientService.update(client.id, v) : clientService.create(v))}
      successMessage={(v) => (editing ? `${v.company} updated.` : `${v.company} added.`)}
    >
      {(form) => {
        const e = form.formState.errors
        return (
          <>
            <FormSection title="Client">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="c-name" label="Full name" required autoComplete="name" registration={form.register('name')} error={e.name} />
                <TextField id="c-company" label="Company name" required autoComplete="organization" registration={form.register('company')} error={e.company} />
                <SelectField id="c-type" label="Client type" required placeholder="Select type" options={clientTypes} registration={form.register('type')} error={e.type} />
                <SelectField id="c-status" label="Status" required options={['Active', 'Inactive']} registration={form.register('status')} error={e.status} />
              </div>
            </FormSection>
            <FormSection title="Contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="c-email" type="email" label="Email" required autoComplete="email" registration={form.register('email')} error={e.email} />
                <TextField id="c-phone" type="tel" label="Phone" hint="Optional. Include the country code." registration={form.register('phone')} error={e.phone} />
                <CountryField form={form} id="c-country" />
                <TextField id="c-address" label="Business address" hint="Optional" registration={form.register('address')} error={e.address} />
              </div>
            </FormSection>
            <TextareaField id="c-notes" label="Internal notes" hint="Optional. Visible to administrators only." registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

// ---------------- Supplier ----------------
const supplierSchema = z.object({
  contactName: required('Contact name', 100),
  company: required('Company name', 120),
  email,
  phone,
  country: required('Country', 80),
  address: optional(200),
  category: choice('a category'),
  notes: optional(1000),
  status: choice('a status'),
})

export function SupplierFormModal({ open, supplier, onClose }) {
  const editing = !!supplier
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit supplier' : 'Add supplier'}
      description={editing ? supplier.company : 'Register a supplier of goods or services.'}
      schema={supplierSchema}
      defaultValues={supplier ?? { contactName: '', company: '', email: '', phone: '', country: '', address: '', category: '', notes: '', status: 'Active' }}
      onSubmit={(v) => (editing ? supplierService.update(supplier.id, v) : supplierService.create(v))}
      successMessage={(v) => (editing ? `${v.company} updated.` : `${v.company} added.`)}
    >
      {(form) => {
        const e = form.formState.errors
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="s-company" label="Company name" required registration={form.register('company')} error={e.company} />
              <TextField id="s-contact" label="Contact name" required registration={form.register('contactName')} error={e.contactName} />
              <SelectField id="s-category" label="Supplier category" required placeholder="Select category" options={supplierCategories} registration={form.register('category')} error={e.category} />
              <SelectField id="s-status" label="Status" required options={['Active', 'Inactive']} registration={form.register('status')} error={e.status} />
              <TextField id="s-email" type="email" label="Email" required registration={form.register('email')} error={e.email} />
              <TextField id="s-phone" type="tel" label="Phone" hint="Optional" registration={form.register('phone')} error={e.phone} />
              <CountryField form={form} id="s-country" />
              <TextField id="s-address" label="Address" hint="Optional" registration={form.register('address')} error={e.address} />
            </div>
            <TextareaField id="s-notes" label="Internal notes" hint="Optional" registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

// ---------------- Partner ----------------
const partnerSchema = z.object({
  company: required('Company name', 120),
  contact: required('Contact person', 100),
  email,
  phone,
  country: required('Country', 80),
  type: choice('a partner type'),
  website: url,
  notes: optional(1000),
  status: choice('a status'),
})

export function PartnerFormModal({ open, partner, onClose }) {
  const editing = !!partner
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit partner' : 'Add partner'}
      description={editing ? partner.company : 'Add a business partner or partnership inquiry.'}
      schema={partnerSchema}
      defaultValues={partner ?? { company: '', contact: '', email: '', phone: '', country: '', type: '', website: '', notes: '', status: 'Prospect' }}
      onSubmit={(v) => (editing ? partnerService.update(partner.id, v) : partnerService.create(v))}
      successMessage={(v) => (editing ? `${v.company} updated.` : `${v.company} added.`)}
    >
      {(form) => {
        const e = form.formState.errors
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="p-company" label="Company name" required registration={form.register('company')} error={e.company} />
              <TextField id="p-contact" label="Contact person" required registration={form.register('contact')} error={e.contact} />
              <SelectField id="p-type" label="Partner type" required placeholder="Select type" options={partnerTypes} registration={form.register('type')} error={e.type} />
              <SelectField id="p-status" label="Status" required options={partnerStatuses} registration={form.register('status')} error={e.status} />
              <TextField id="p-email" type="email" label="Email" required registration={form.register('email')} error={e.email} />
              <TextField id="p-phone" type="tel" label="Phone" hint="Optional" registration={form.register('phone')} error={e.phone} />
              <CountryField form={form} id="p-country" />
              <TextField id="p-website" label="Website" hint="Optional" placeholder="example.com" registration={form.register('website')} error={e.website} />
            </div>
            <TextareaField id="p-notes" label="Notes" registration={form.register('notes')} error={e.notes} />
          </>
        )
      }}
    </FormModal>
  )
}

const opportunitySchema = z.object({ title: required('Title', 150), date: date('Date'), note: optional(1000) })

export function OpportunityFormModal({ open, partner, onClose }) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="md"
      title="Add business opportunity"
      description={partner?.company}
      schema={opportunitySchema}
      defaultValues={{ title: '', date: todayISO(), note: '' }}
      onSubmit={(v) => partnerService.addOpportunity(partner.id, v)}
      successMessage="Opportunity added."
    >
      {(form) => (
        <>
          <TextField id="o-title" label="Title" required registration={form.register('title')} error={form.formState.errors.title} />
          <TextField id="o-date" type="date" label="Date" required registration={form.register('date')} error={form.formState.errors.date} />
          <TextareaField id="o-note" label="Notes" registration={form.register('note')} error={form.formState.errors.note} />
        </>
      )}
    </FormModal>
  )
}
