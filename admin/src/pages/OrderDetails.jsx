import { useState } from 'react'
import { FilePlus, Pencil, Receipt, RefreshCw, Ship, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { InvoiceFormModal } from '../components/forms/FinanceForms'
import { OrderFormModal, StatusFormModal } from '../components/forms/TradeForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedTable from '../components/ui/RelatedTable'
import Timeline from '../components/ui/Timeline'
import { orderStatuses } from '../data/orders'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { documentTotals, invoiceOutstanding, invoiceStatus, quotationStatus } from '../lib/calc'
import { useAppState } from '../lib/store'
import { orderService } from '../services/tradeServices'
import NotFound from './NotFound'

export default function OrderDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const order = s.orders.find((o) => o.id === id)

  const del = useConfirmAction({
    action: (o) => orderService.remove(o.id),
    title: 'Delete order?',
    message: (o) => `${o.number} will be permanently removed from the demo data.`,
    success: (o) => `${o.number} deleted.`,
    onDone: () => navigate('/orders'),
  })

  if (!order) return <NotFound title="Order not found" backTo="/orders" backLabel="Back to orders" />
  const client = s.clients.find((c) => c.id === order.clientId)
  const quote = s.quotations.find((q) => q.id === order.quotationId)
  const shipments = s.shipments.filter((x) => x.orderId === id)
  const invoices = s.invoices.filter((i) => i.orderId === id)
  const docs = s.documents.filter((d) => d.relatedType === 'order' && d.relatedId === id)
  const payments = s.payments.filter((p) => invoices.some((i) => i.id === p.invoiceId))

  return (
    <>
      <PageHeader
        title={order.number}
        meta={<StatusBadge status={order.status} />}
        description={`${client?.company ?? 'Unknown client'} · ${order.origin} → ${order.destination}`}
        breadcrumbs={[{ label: 'Orders', to: '/orders' }, { label: order.number }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(order)}>
              Delete
            </Button>
            <Button icon={RefreshCw} onClick={() => setModal('status')}>
              Change status
            </Button>
            <Button icon={Pencil} onClick={() => setModal('edit')}>
              Edit
            </Button>
            {order.status !== 'Cancelled' && (
              <ButtonLink to={`/shipments?new=1&order=${order.id}`} variant="primary" icon={Ship}>
                Create shipment
              </ButtonLink>
            )}
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Order information" />
            <div className="p-5">
              <DetailList
                columns={3}
                items={[
                  { label: 'Order date', value: f.date(order.orderDate) },
                  { label: 'Expected completion', value: order.expectedDate ? f.date(order.expectedDate) : '' },
                  { label: 'Amount', value: <span className="num font-semibold">{f.money(order.amount, order.currency)}</span> },
                  { label: 'Origin', value: order.origin },
                  { label: 'Destination', value: order.destination },
                  { label: 'Quantity', value: order.quantity ? `${Number(order.quantity).toLocaleString('en-US')} ${order.unit ?? ''}` : '' },
                  { label: 'Product / cargo', value: order.cargo, full: true },
                  { label: 'Internal notes', value: order.notes, full: true },
                ]}
              />
            </div>
          </Card>
          <RelatedTable
            title="Shipments"
            rows={shipments}
            linkTo={(x) => `/shipments/${x.id}`}
            emptyText="No shipment created yet."
            actions={order.status !== 'Cancelled' && <ButtonLink to={`/shipments?new=1&order=${order.id}`} size="sm" icon={Ship}>Create shipment</ButtonLink>}
            columns={[
              { header: 'Reference', cell: (x) => x.reference },
              { header: 'Mode', cell: (x) => x.mode },
              { header: 'Departure', cell: (x) => f.date(x.departureDate) },
              { header: 'Expected arrival', cell: (x) => f.date(x.expectedArrival) },
              { header: 'Status', cell: (x) => <StatusBadge status={x.status} /> },
            ]}
          />
          <RelatedTable
            title="Invoices and payments"
            rows={invoices}
            linkTo={(i) => `/finances/invoices/${i.id}`}
            emptyText="No invoice linked to this order."
            description={payments.length ? `${payments.length} payment${payments.length > 1 ? 's' : ''} recorded` : undefined}
            actions={<Button size="sm" icon={Receipt} onClick={() => setModal('invoice')}>Create invoice</Button>}
            columns={[
              { header: 'Invoice', cell: (i) => i.number },
              { header: 'Due', cell: (i) => f.date(i.dueDate) },
              { header: 'Total', align: 'right', cell: (i) => f.money(documentTotals(i).total, i.currency) },
              { header: 'Outstanding', align: 'right', cell: (i) => f.money(invoiceOutstanding(i, s.payments), i.currency) },
              { header: 'Status', cell: (i) => <StatusBadge status={invoiceStatus(i, s.payments)} /> },
            ]}
          />
          <RelatedTable
            title="Documents"
            rows={docs}
            linkTo={(d) => `/documents/${d.id}`}
            actions={<Button size="sm" icon={FilePlus} onClick={() => setModal('document')}>Add document</Button>}
            columns={[
              { header: 'Name', cell: (d) => d.name },
              { header: 'Type', cell: (d) => d.type },
              { header: 'Added', cell: (d) => f.date(d.uploadDate) },
            ]}
          />
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Client" />
            <div className="p-5 text-sm">
              {client ? (
                <>
                  <Link to={`/clients/${client.id}`} className="font-semibold hover:underline">
                    {client.company}
                  </Link>
                  <p>{client.name}</p>
                  <p className="text-muted">{client.email}</p>
                  <p className="text-muted">{client.country}</p>
                </>
              ) : (
                <p className="text-muted">Client not found.</p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader title="Related quotation" />
            <div className="p-5 text-sm">
              {quote ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Link to={`/quotations/${quote.id}`} className="font-semibold hover:underline">
                      {quote.number}
                    </Link>
                    <p className="num text-muted">{f.money(documentTotals(quote).total, quote.currency)}</p>
                  </div>
                  <StatusBadge status={quotationStatus(quote)} />
                </div>
              ) : (
                <p className="text-muted">Not created from a quotation.</p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader title="Status history" />
            <div className="p-5">
              <Timeline entries={order.history} formatDate={f.date} />
            </div>
          </Card>
        </div>
      </div>

      <OrderFormModal open={modal === 'edit'} order={order} onClose={() => setModal(null)} />
      <StatusFormModal open={modal === 'status'} onClose={() => setModal(null)} title="Change order status" description={order.number} statuses={orderStatuses} current={order.status} onSubmit={(st, note) => orderService.setStatus(order.id, st, note)} />
      <InvoiceFormModal open={modal === 'invoice'} prefill={{ clientId: order.clientId, orderId: order.id, currency: order.currency, items: [{ description: `${order.cargo} (${order.number})`, quantity: 1, unitPrice: order.amount }] }} onClose={() => setModal(null)} />
      <DocumentFormModal open={modal === 'document'} prefill={{ relatedType: 'order', relatedId: order.id }} onClose={() => setModal(null)} />
      {del.dialog}
    </>
  )
}
