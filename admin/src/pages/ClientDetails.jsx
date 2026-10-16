import { useMemo, useState } from 'react'
import { FilePlus2, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClientFormModal } from '../components/forms/ContactForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card, CardHeader, DetailList, StatCard } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedTable from '../components/ui/RelatedTable'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { clientOutstanding, documentTotals, invoiceOutstanding, invoiceStatus, quotationStatus } from '../lib/calc'
import { useAppState } from '../lib/store'
import { clientService } from '../services/contactServices'
import NotFound from './NotFound'

export default function ClientDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const client = s.clients.find((c) => c.id === id)

  const rel = useMemo(() => {
    const quotations = s.quotations.filter((q) => q.clientId === id)
    const orders = s.orders.filter((o) => o.clientId === id)
    const invoices = s.invoices.filter((i) => i.clientId === id)
    const transactions = s.records.filter((r) => r.clientId === id).sort((a, b) => b.date.localeCompare(a.date))
    return { quotations, orders, invoices, transactions, outstanding: clientOutstanding(id, s) }
  }, [s, id])

  const del = useConfirmAction({
    action: (c) => clientService.remove(c.id),
    title: 'Delete client?',
    message: (c) => `${c.company} will be permanently removed from the demo data.`,
    success: (c) => `${c.company} deleted.`,
    onDone: () => navigate('/clients'),
  })

  if (!client) return <NotFound title="Client not found" backTo="/clients" backLabel="Back to clients" />

  return (
    <>
      <PageHeader
        title={client.company}
        meta={<StatusBadge status={client.status} />}
        description={`${client.name} · ${client.type} · ${client.country}`}
        breadcrumbs={[{ label: 'Clients', to: '/clients' }, { label: client.company }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(client)}>
              Delete
            </Button>
            <Button icon={Pencil} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <ButtonLink to={`/quotations/new?client=${client.id}`} variant="primary" icon={FilePlus2}>
              Create quotation
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Contact information" />
            <div className="space-y-3 p-5 text-sm">
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <a href={`mailto:${client.email}`} className="break-all hover:underline">
                  {client.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {client.phone ? <a href={`tel:${client.phone.replace(/\s/g, '')}`} className="hover:underline">{client.phone}</a> : <span className="text-muted">Not provided</span>}
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <span>{[client.address, client.country].filter(Boolean).join(', ')}</span>
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Client information" />
            <div className="p-5">
              <DetailList
                columns={1}
                items={[
                  { label: 'Contact person', value: client.name },
                  { label: 'Client type', value: client.type },
                  { label: 'Client since', value: f.date(client.createdAt) },
                  { label: 'Client ID', value: client.id },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Internal notes" />
            <p className="whitespace-pre-line p-5 text-sm">{client.notes || <span className="text-muted">No notes.</span>}</p>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Outstanding balance" value={f.money(rel.outstanding, f.primary)} hint="From unpaid invoices" tone={rel.outstanding ? 'warning' : 'navy'} />
            <StatCard label="Orders" value={rel.orders.length} hint={`${rel.orders.filter((o) => ['Confirmed', 'Processing'].includes(o.status)).length} active`} />
            <StatCard label="Quotations" value={rel.quotations.length} hint={`${rel.quotations.filter((q) => quotationStatus(q) === 'Accepted').length} accepted`} />
          </div>

          <RelatedTable
            title="Quotations"
            rows={rel.quotations}
            linkTo={(q) => `/quotations/${q.id}`}
            actions={<ButtonLink to={`/quotations/new?client=${client.id}`} size="sm" icon={Plus}>New</ButtonLink>}
            columns={[
              { header: 'Number', cell: (q) => q.number },
              { header: 'Issued', cell: (q) => f.date(q.issueDate) },
              { header: 'Total', align: 'right', cell: (q) => f.money(documentTotals(q).total, q.currency) },
              { header: 'Status', cell: (q) => <StatusBadge status={quotationStatus(q)} /> },
            ]}
          />
          <RelatedTable
            title="Orders"
            rows={rel.orders}
            linkTo={(o) => `/orders/${o.id}`}
            actions={<ButtonLink to={`/orders?new=1&client=${client.id}`} size="sm" icon={Plus}>New</ButtonLink>}
            columns={[
              { header: 'Number', cell: (o) => o.number },
              { header: 'Date', cell: (o) => f.date(o.orderDate) },
              { header: 'Route', cell: (o) => `${o.origin} → ${o.destination}` },
              { header: 'Amount', align: 'right', cell: (o) => f.money(o.amount, o.currency) },
              { header: 'Status', cell: (o) => <StatusBadge status={o.status} /> },
            ]}
          />
          <RelatedTable
            title="Invoices"
            rows={rel.invoices}
            linkTo={(i) => `/finances/invoices/${i.id}`}
            columns={[
              { header: 'Number', cell: (i) => i.number },
              { header: 'Due', cell: (i) => f.date(i.dueDate) },
              { header: 'Total', align: 'right', cell: (i) => f.money(documentTotals(i).total, i.currency) },
              { header: 'Outstanding', align: 'right', cell: (i) => f.money(invoiceOutstanding(i, s.payments), i.currency) },
              { header: 'Status', cell: (i) => <StatusBadge status={invoiceStatus(i, s.payments)} /> },
            ]}
          />
          <RelatedTable
            title="Transaction history"
            description="Income records linked to this client, including invoice payments."
            rows={rel.transactions}
            columns={[
              { header: 'Date', cell: (r) => f.date(r.date) },
              { header: 'Description', cell: (r) => r.description },
              { header: 'Category', cell: (r) => r.category },
              { header: 'Amount', align: 'right', cell: (r) => f.money(r.amount, r.currency) },
              { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </div>
      </div>

      <ClientFormModal open={editing} client={client} onClose={() => setEditing(false)} />
      {del.dialog}
    </>
  )
}
