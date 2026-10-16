import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, CircleCheck, LifeBuoy, Search, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import { SelectField, TextareaField, TextField } from '../components/ui/Fields'
import { SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { supportCategories } from '../data/communications'
import usePartnerData from '../hooks/usePartnerData'
import { formatDateTime } from '../lib/format'
import { required } from '../lib/schemas'
import { matchesSearch } from '../lib/utils'
import { createSupportRequest } from '../services/supportService'

const FAQS = [
  {
    q: 'How do I submit a quotation?',
    a: (
      <>
        Open <Link to="/opportunities" className="text-navy underline">Trade Opportunities</Link>, choose an open opportunity and select <strong>Submit Quotation</strong>. Complete the commercial offer, delivery and validity details, then select <strong>Submit quotation</strong> and confirm. You can also <strong>Save draft</strong> and finish later from the Quotations page.
      </>
    ),
    text: 'opportunities submit quotation draft commercial offer',
  },
  {
    q: 'How do I view an order?',
    a: (
      <>
        Go to <Link to="/orders" className="text-navy underline">Orders</Link> and select an order reference. The order page shows items, amounts, delivery details, documents, related shipments and status history. Orders awaiting confirmation show a <strong>Confirm order</strong> button.
      </>
    ),
    text: 'orders view confirm items delivery',
  },
  {
    q: 'How can I check shipment status?',
    a: (
      <>
        Open <Link to="/shipments" className="text-navy underline">Shipments</Link> and select a shipment to see its progress timeline, estimated arrival and related documents. In this demo the information is sample data — there is no live GPS or carrier tracking.
      </>
    ),
    text: 'shipment status tracking timeline arrival',
  },
  {
    q: 'How do I submit a document?',
    a: (
      <>
        On <Link to="/documents" className="text-navy underline">Documents</Link>, select <strong>Upload document</strong>, enter the name and type, choose the related record and a file, then submit for review. Documents MAKHORIZON has requested are marked <strong>Requested</strong> — open one to provide the file. Files are not uploaded to a server in this demo.
      </>
    ),
    text: 'document upload file requested submit',
  },
  {
    q: 'How can I request a quotation revision?',
    a: (
      <>
        Revisions are requested by MAKHORIZON. When a quotation shows <strong>Revision Requested</strong>, open it to read the review notes and select <strong>Revise quotation</strong> to submit an updated version. To ask about a quotation in another status, send a message to Trade Coordination from <Link to="/messages" className="text-navy underline">Messages</Link>.
      </>
    ),
    text: 'quotation revision requested revise update',
  },
  {
    q: 'How do I update my company information?',
    a: (
      <>
        Open <Link to="/company-profile" className="text-navy underline">Company Profile</Link>, select <strong>Edit profile</strong>, make your changes and select <strong>Save changes</strong>. In this demo the changes are saved in your browser only.
      </>
    ),
    text: 'company profile update information edit',
  },
]

const schema = z.object({
  category: z.string().min(1, 'Select a category.'),
  subject: required('Subject', 150).refine((v) => v.length >= 4, 'Please enter a subject of at least 4 characters.'),
  description: z.string().trim().min(15, 'Please describe the request in at least 15 characters.').max(2000, 'Please keep this under 2000 characters.'),
  reference: z.string().optional(),
})

function SupportForm({ data }) {
  const toast = useToast()
  const [created, setCreated] = useState(null)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { category: '', subject: '', description: '', reference: '' }, mode: 'onTouched' })
  const refs = [...data.orders.map((o) => ({ value: o.id, label: `${o.id} — ${o.title}` })), ...data.quotations.map((q) => ({ value: q.id, label: `${q.id} — ${q.title}` }))]

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      const r = await createSupportRequest(values)
      setCreated(r)
      reset()
      toast.success(`Demo support request ${r.id} recorded.`)
    } catch (err) {
      setError(err.message)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 p-5">
      {created && (
        <div role="status" className="rounded-lg border border-success/30 bg-success/5 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-success">
            <CircleCheck className="h-4 w-4" aria-hidden="true" />
            Demo reference {created.id}
          </p>
          <p className="mt-1">Your request was recorded in this browser. It has not been sent to MAKHORIZON — no support ticket exists yet.</p>
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="sup-cat" label="Category" required registration={register('category')} error={errors.category} options={supportCategories} placeholder="Select a category" />
        <SelectField id="sup-ref" label="Related order or quotation (optional)" registration={register('reference')} options={refs} placeholder="None" />
      </div>
      <TextField id="sup-subject" label="Subject" required registration={register('subject')} error={errors.subject} />
      <TextareaField id="sup-desc" label="Description" required rows={4} registration={register('description')} error={errors.description} />
      <Button type="submit" variant="primary" icon={Send} loading={isSubmitting}>
        Submit request
      </Button>
    </form>
  )
}

export default function Help() {
  const data = usePartnerData()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(0)
  const faqs = FAQS.filter((f) => matchesSearch([f.q, f.text], query))

  return (
    <>
      <PageHeader title="Help & Support" description="Answers to common questions and a way to contact MAKHORIZON support." />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Frequently asked questions" />
          <div className="border-b border-line p-4">
            <SearchInput value={query} onChange={setQuery} placeholder="Search the FAQs" label="Search frequently asked questions" />
          </div>
          {faqs.length === 0 ? (
            <EmptyState icon={Search} title="No matching questions" message="Try another keyword, or send a support request." />
          ) : (
            <ul className="divide-y divide-line">
              {faqs.map((f, i) => {
                const expanded = open === i
                return (
                  <li key={f.q}>
                    <h3>
                      <button type="button" onClick={() => setOpen(expanded ? -1 : i)} aria-expanded={expanded} aria-controls={`faq-${i}`} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold hover:bg-canvas">
                        {f.q}
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                    </h3>
                    <div id={`faq-${i}`} hidden={!expanded} className="px-5 pb-4 text-sm leading-relaxed text-ink">
                      {f.a}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Contact support" description="Describe what you need and we’ll route it to the right team." />
            <div className="px-5 pt-4">
              <DemoNotice title="Demo">Support requests are saved in this browser only and are not sent to MAKHORIZON.</DemoNotice>
            </div>
            <SupportForm data={data} />
          </Card>
          <Card>
            <CardHeader title="Your demo requests" />
            {data.supportRequests.length === 0 ? (
              <EmptyState icon={LifeBuoy} title="No requests yet" />
            ) : (
              <ul className="divide-y divide-line">
                {data.supportRequests.map((r) => (
                  <li key={r.id} className="px-5 py-3">
                    <p className="flex flex-wrap items-center justify-between gap-2">
                      <span className="num text-sm font-semibold">{r.id}</span>
                      <StatusBadge status={r.status} />
                    </p>
                    <p className="mt-0.5 text-sm">{r.subject}</p>
                    <p className="num text-xs text-muted">
                      {r.category}
                      {r.reference && ` · ${r.reference}`} · {formatDateTime(r.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
