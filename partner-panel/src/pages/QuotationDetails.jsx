import { ClipboardList, FilePenLine, FileText, Lock, MessageSquareQuote, PencilLine, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusHistory } from '../components/ui/Timelines'
import useConfirmAction from '../hooks/useConfirmAction'
import usePartnerData from '../hooks/usePartnerData'
import { formatCurrency, formatDate, formatDateTime, formatFileSize, formatNumber } from '../lib/format'
import { calcQuotationTotals } from '../lib/quotation'
import { deleteDraft } from '../services/quotationService'
import NotFound from './NotFound'

const LOCKED_MESSAGE = {
  Submitted: 'This quotation has been submitted and can no longer be edited. MAKHORIZON will review it.',
  'Under Review': 'MAKHORIZON is reviewing this quotation. It can be revised only if a revision is requested.',
  Accepted: 'This quotation was accepted and is locked.',
  Rejected: 'This quotation was not selected and is locked.',
  Expired: 'This quotation has passed its validity date and is locked.',
}

export default function QuotationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = usePartnerData()
  const q = data.quotationById(id)
  const del = useConfirmAction({
    action: (row) => deleteDraft(row.id),
    title: 'Delete this draft?',
    message: (row) => `Draft ${row.id} will be permanently removed from this demo.`,
    confirmLabel: 'Delete draft',
    success: (row) => `Draft ${row.id} deleted.`,
    onDone: () => navigate('/quotations'),
  })
  if (!q) return <NotFound title="Quotation not found" message={`No quotation “${id}” is available to your company.`} backTo="/quotations" backLabel="Back to quotations" />

  const opp = data.opportunityById(q.opportunityId)
  const totals = calcQuotationTotals(q)
  const fmt = (n) => formatCurrency(n, q.currency)
  const order = data.orders.find((o) => o.quotationId === q.id)
  const docs = data.documents.filter((d) => d.related?.kind === 'quotation' && d.related.id === q.id)

  const actions =
    q.status === 'Draft' ? (
      <>
        <Button icon={Trash2} onClick={() => del.ask(q)}>
          Delete draft
        </Button>
        <ButtonLink to={`/quotations/new?draft=${q.id}`} variant="primary" icon={PencilLine}>
          Continue editing
        </ButtonLink>
      </>
    ) : q.status === 'Revision Requested' ? (
      <ButtonLink to={`/quotations/new?revise=${q.id}`} variant="primary" icon={FilePenLine}>
        Revise quotation
      </ButtonLink>
    ) : order ? (
      <ButtonLink to={`/orders/${order.id}`} icon={ClipboardList}>
        View order {order.id}
      </ButtonLink>
    ) : null

  return (
    <>
      <PageHeader title={q.title} breadcrumbs={[{ label: 'Quotations', to: '/quotations' }, { label: q.id }]} meta={<StatusBadge status={q.status} />} actions={actions} />

      {q.status === 'Revision Requested' && q.feedback.length > 0 && (
        <div className="mb-5 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-semibold">Revision requested by {q.feedback.at(-1).from}</p>
          <p className="mt-1 text-sm">{q.feedback.at(-1).message}</p>
          <ButtonLink to={`/quotations/new?revise=${q.id}`} size="sm" variant="primary" icon={FilePenLine} className="mt-3">
            Prepare revised version
          </ButtonLink>
        </div>
      )}
      {LOCKED_MESSAGE[q.status] && (
        <p className="mb-5 flex items-start gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm text-muted">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {LOCKED_MESSAGE[q.status]}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader title="Quotation summary" />
            <div className="p-5">
              <DetailList
                items={[
                  { label: 'Reference', value: q.id },
                  { label: 'Version', value: q.version ?? 1 },
                  { label: 'Related opportunity', value: opp ? <Link to={`/opportunities/${opp.id}`} className="text-navy hover:underline">{opp.id} — {opp.title}</Link> : q.opportunityId, full: true },
                  { label: 'Destination', value: opp?.destination },
                  { label: 'Currency', value: q.currency },
                  { label: 'Submitted', value: q.submittedAt ? formatDateTime(q.submittedAt) : 'Not submitted' },
                  { label: 'Valid until', value: formatDate(q.validUntil) },
                  { label: 'Estimated delivery', value: q.deliveryDuration },
                  { label: 'Payment terms', value: q.paymentTerms },
                  { label: 'Delivery terms', value: q.deliveryTerms, full: true },
                  { label: 'Description', value: q.description, full: true },
                  { label: 'Additional conditions', value: q.conditions, full: true },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Commercial breakdown" description={`Amounts in ${q.currency}`} />
            <div className="overflow-x-auto">
              <table className="table-base">
                <caption className="sr-only">Commercial breakdown</caption>
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col" className="text-right">Quantity</th>
                    <th scope="col" className="text-right">Unit price</th>
                    <th scope="col" className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{q.title}</td>
                    <td className="num text-right whitespace-nowrap">
                      {formatNumber(q.quantity)} {q.unit}
                    </td>
                    <td className="num text-right whitespace-nowrap">{fmt(q.unitPrice)}</td>
                    <td className="num text-right whitespace-nowrap">{fmt(totals.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right text-muted">
                      Tax ({q.taxRate || 0}%)
                    </td>
                    <td className="num text-right">{fmt(totals.tax)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right text-muted">
                      Additional costs
                    </td>
                    <td className="num text-right">{fmt(totals.additional)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right font-semibold">
                      Total
                    </td>
                    <td className="num text-right font-semibold">{fmt(totals.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Submitted documents" description="File names recorded with this quotation" />
            {q.attachments.length === 0 && docs.length === 0 ? (
              <p className="p-5 text-sm text-muted">No documents were attached.</p>
            ) : (
              <ul className="divide-y divide-line">
                {q.attachments.map((a) => (
                  <li key={a.name} className="flex items-center gap-3 px-5 py-3">
                    <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{a.name}</span>
                    <span className="num text-xs text-muted">{formatFileSize(a.size)}</span>
                  </li>
                ))}
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                    <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <Link to={`/documents?doc=${d.id}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">
                      {d.name}
                    </Link>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {q.versions?.length > 0 && (
            <Card>
              <CardHeader title="Previous versions" />
              <ul className="divide-y divide-line">
                {q.versions.map((v) => (
                  <li key={v.version} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                    <span>
                      Version {v.version} · submitted {formatDateTime(v.submittedAt)}
                    </span>
                    <span className="num font-medium">{formatCurrency(v.total, v.currency)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Total" />
            <p className="num p-5 text-2xl font-semibold tracking-tight">{fmt(totals.total)}</p>
          </Card>
          <Card>
            <CardHeader title="MAKHORIZON feedback" />
            {q.feedback.length === 0 ? (
              <p className="p-5 text-sm text-muted">No feedback yet.</p>
            ) : (
              <ul className="space-y-4 p-5">
                {q.feedback.map((f) => (
                  <li key={f.at} className="flex gap-3">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                    <div>
                      <p className="text-sm">{f.message}</p>
                      <p className="num mt-1 text-xs text-muted">
                        {f.from} · {formatDateTime(f.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Your notes" />
            <p className="p-5 text-sm">{q.notes || <span className="text-muted">No notes added.</span>}</p>
          </Card>
          <Card>
            <CardHeader title="Status history" />
            <div className="p-5">
              <StatusHistory items={q.history} />
            </div>
          </Card>
        </div>
      </div>
      {del.dialog}
    </>
  )
}
