import { ArrowLeft, CheckCircle2, FilePlus2, FileText, Info, MessagesSquare } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import { PageHeader } from '../components/ui/PageHeader'
import usePartnerData from '../hooks/usePartnerData'
import { relativeDays } from '../lib/dates'
import { budgetLabel, formatDate } from '../lib/format'
import NotFound from './NotFound'

export default function OpportunityDetails() {
  const { id } = useParams()
  const data = usePartnerData()
  const o = data.opportunityById(id)
  if (!o) return <NotFound title="Opportunity not found" message={`No opportunity with the reference “${id}” is available.`} backTo="/opportunities" backLabel="Back to opportunities" />

  const accepting = ['Open', 'Closing Soon'].includes(o.displayStatus)
  const myQuotes = data.quotations.filter((q) => q.opportunityId === o.id)

  return (
    <>
      <PageHeader
        title={o.title}
        breadcrumbs={[{ label: 'Trade Opportunities', to: '/opportunities' }, { label: o.id }]}
        meta={<StatusBadge status={o.displayStatus} />}
        actions={
          accepting ? (
            <ButtonLink to={`/quotations/new?opportunity=${o.id}`} variant="primary" icon={FilePlus2}>
              Submit Quotation
            </ButtonLink>
          ) : (
            <span className="text-sm text-muted">This opportunity is not accepting quotations.</span>
          )
        }
      />
      <DemoNotice className="mb-5" title="Illustrative demo opportunity">
        Sample record for demonstration only — not a real tender or verified contract.
      </DemoNotice>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader title="Overview" />
            <div className="space-y-5 p-5">
              <p className="text-sm leading-relaxed text-ink">{o.overview}</p>
              <div>
                <h3 className="text-sm font-semibold">Requirements</h3>
                <ul className="mt-2 space-y-1.5">
                  {o.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Required documents</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {o.requiredDocuments.map((r) => (
                    <li key={r}>
                      <Badge>
                        <FileText className="h-3 w-3" aria-hidden="true" />
                        {r}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Commercial notes" />
            <p className="p-5 text-sm leading-relaxed">{o.commercialNotes}</p>
          </Card>
          <Card>
            <CardHeader title="Contact and clarification" />
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
                {o.clarification}
              </p>
              <Link to="/messages" className="btn btn-secondary btn-sm shrink-0">
                <MessagesSquare aria-hidden="true" />
                Open messages
              </Link>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Key details" />
            <div className="p-5">
              <DetailList
                columns={1}
                items={[
                  { label: 'Reference', value: o.id },
                  { label: 'Category', value: o.category },
                  { label: 'Destination', value: o.destination },
                  { label: 'Region', value: o.region },
                  { label: 'Estimated quantities', value: o.quantities },
                  { label: 'Estimated value', value: budgetLabel(o.budget) },
                  { label: 'Published', value: formatDate(o.publishedAt) },
                  { label: 'Submission deadline', value: o.closingDate ? `${formatDate(o.closingDate)}${accepting ? ` (${relativeDays(o.closingDate)})` : ''}` : '' },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Your quotations" description="For this opportunity" />
            {myQuotes.length === 0 ? (
              <p className="p-5 text-sm text-muted">You have not submitted a quotation for this opportunity.</p>
            ) : (
              <ul className="divide-y divide-line">
                {myQuotes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <Link to={`/quotations/${q.id}`} className="text-sm font-medium hover:underline">
                      {q.id}
                    </Link>
                    <StatusBadge status={q.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to opportunities
          </Link>
        </div>
      </div>
    </>
  )
}
