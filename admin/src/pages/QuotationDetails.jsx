import { useState } from 'react'
import { ClipboardList, Pencil, Printer, RefreshCw, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusFormModal } from '../components/forms/TradeForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import PrintDocument from '../components/ui/PrintDocument'
import { quotationStatuses } from '../data/quotations'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { quotationStatus } from '../lib/calc'
import { useAppState } from '../lib/store'
import { quotationService } from '../services/tradeServices'
import NotFound from './NotFound'

export default function QuotationDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [statusOpen, setStatusOpen] = useState(false)
  const q = s.quotations.find((x) => x.id === id)

  const del = useConfirmAction({
    action: (x) => quotationService.remove(x.id),
    title: 'Delete quotation?',
    message: (x) => `${x.number} will be permanently removed from the demo data.`,
    success: (x) => `${x.number} deleted.`,
    onDone: () => navigate('/quotations'),
  })

  if (!q) return <NotFound title="Quotation not found" backTo="/quotations" backLabel="Back to quotations" />
  const client = s.clients.find((c) => c.id === q.clientId)
  const status = quotationStatus(q)
  const order = s.orders.find((o) => o.quotationId === q.id)

  return (
    <>
      <PageHeader
        title={q.number}
        meta={<StatusBadge status={status} />}
        description={client ? `Quotation for ${client.company}` : 'Quotation'}
        breadcrumbs={[{ label: 'Quotations', to: '/quotations' }, { label: q.number }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(q)}>
              Delete
            </Button>
            <Button icon={Printer} onClick={() => window.print()}>
              Print
            </Button>
            <Button icon={RefreshCw} onClick={() => setStatusOpen(true)}>
              Change status
            </Button>
            <ButtonLink to={`/quotations/${q.id}/edit`} icon={Pencil}>
              Edit
            </ButtonLink>
            {order ? (
              <ButtonLink to={`/orders/${order.id}`} variant="primary" icon={ClipboardList}>
                View order {order.number}
              </ButtonLink>
            ) : (
              status === 'Accepted' && (
                <ButtonLink to={`/orders?new=1&quotation=${q.id}`} variant="primary" icon={ClipboardList}>
                  Create order
                </ButtonLink>
              )
            )}
          </>
        }
      />
      {status !== 'Accepted' && !order && (
        <p className="no-print mb-4 text-xs text-muted">An order can be created once the quotation is marked Accepted.</p>
      )}
      <PrintDocument
        kind="Quotation"
        number={q.number}
        status={status}
        company={s.settings.company}
        client={client}
        doc={q}
        notes={q.notes}
        meta={[
          ['Quotation date', f.date(q.issueDate)],
          ['Valid until', f.date(q.expiryDate)],
          ['Currency', q.currency],
        ]}
        footnote="This quotation was generated from the MAKHORIZON admin demo. Prices and availability are subject to confirmation."
      />
      <StatusFormModal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title="Change quotation status"
        description="Marking a quotation Sent does not send anything to the client."
        statuses={quotationStatuses.filter((x) => x !== 'Expired')}
        current={q.status}
        onSubmit={(st) => quotationService.setStatus(q.id, st)}
      />
      {del.dialog}
    </>
  )
}
