import { useState } from 'react'
import { Ban, Banknote, Pencil, Printer, Send, Trash2, X } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { InvoiceFormModal, PaymentFormModal } from '../components/forms/FinanceForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, StatCard } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import PrintDocument from '../components/ui/PrintDocument'
import { EmptyState } from '../components/ui/States'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { documentTotals, invoiceOutstanding, invoicePaid, invoiceStatus, isOverdueBy } from '../lib/calc'
import { useAppState } from '../lib/store'
import { financeService } from '../services/financeService'
import NotFound from './NotFound'

export default function InvoiceDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const inv = s.invoices.find((i) => i.id === id)

  const del = useConfirmAction({
    action: (i) => financeService.removeInvoice(i.id),
    title: 'Delete invoice?',
    message: (i) => `${i.number} will be permanently removed from the demo data.`,
    success: (i) => `${i.number} deleted.`,
    onDone: () => navigate('/finances?tab=invoices'),
  })
  const cancel = useConfirmAction({
    action: (i) => financeService.setInvoiceStatus(i.id, 'Cancelled'),
    title: 'Cancel invoice?',
    message: (i) => `${i.number} will be marked Cancelled and excluded from receivables. Recorded payments are kept.`,
    confirmLabel: 'Cancel invoice',
    success: 'Invoice cancelled.',
  })
  const removePay = useConfirmAction({
    action: (p) => financeService.removePayment(p.id),
    title: 'Remove payment?',
    message: (p) => `The payment of ${f.money(p.amount, inv.currency)} on ${f.date(p.date)} and its linked income record will be removed.`,
    confirmLabel: 'Remove payment',
    success: 'Payment removed.',
  })
  const [issuing, setIssuing] = useState(false)

  if (!inv) return <NotFound title="Invoice not found" backTo="/finances?tab=invoices" backLabel="Back to invoices" />
  const client = s.clients.find((c) => c.id === inv.clientId)
  const order = s.orders.find((o) => o.id === inv.orderId)
  const status = invoiceStatus(inv, s.payments)
  const total = documentTotals(inv).total
  const paid = invoicePaid(inv, s.payments)
  const outstanding = invoiceOutstanding(inv, s.payments)
  const payments = s.payments.filter((p) => p.invoiceId === id).sort((a, b) => a.date.localeCompare(b.date))

  const issue = async () => {
    setIssuing(true)
    try {
      await financeService.setInvoiceStatus(inv.id, 'Unpaid')
    } finally {
      setIssuing(false)
    }
  }

  return (
    <>
      <PageHeader
        title={inv.number}
        meta={<StatusBadge status={status} />}
        description={`${client?.company ?? 'Unknown client'}${order ? ` · ${order.number}` : ''}`}
        breadcrumbs={[{ label: 'Finances', to: '/finances' }, { label: 'Invoices', to: '/finances?tab=invoices' }, { label: inv.number }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(inv)}>
              Delete
            </Button>
            {inv.status !== 'Cancelled' && (
              <Button icon={Ban} onClick={() => cancel.ask(inv)}>
                Cancel invoice
              </Button>
            )}
            <Button icon={Printer} onClick={() => window.print()}>
              Print
            </Button>
            <Button icon={Pencil} onClick={() => setModal('edit')}>
              Edit
            </Button>
            {inv.status === 'Draft' ? (
              <Button variant="primary" icon={Send} loading={issuing} onClick={issue}>
                Mark as issued
              </Button>
            ) : (
              outstanding > 0 && (
                <Button variant="primary" icon={Banknote} onClick={() => setModal('payment')}>
                  Record payment
                </Button>
              )
            )}
          </>
        }
      />

      <div className="no-print mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Invoice total" value={f.money(total, inv.currency)} />
        <StatCard label="Paid" value={f.money(paid, inv.currency)} tone="success" hint={`${payments.length} payment${payments.length === 1 ? '' : 's'}`} />
        <StatCard
          label="Outstanding"
          value={f.money(outstanding, inv.currency)}
          tone={status === 'Overdue' ? 'danger' : outstanding ? 'warning' : 'navy'}
          hint={status === 'Overdue' ? `${isOverdueBy(inv.dueDate)} days past due` : inv.status === 'Draft' ? 'Draft — not yet issued' : `Due ${f.date(inv.dueDate)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_22rem]">
        <PrintDocument
          kind="Invoice"
          number={inv.number}
          status={status}
          company={s.settings.company}
          client={client}
          doc={inv}
          notes={inv.notes}
          meta={[
            ['Issue date', f.date(inv.issueDate)],
            ['Due date', f.date(inv.dueDate)],
            ['Order', order?.number ?? '—'],
            ['Paid to date', f.money(paid, inv.currency)],
            ['Balance due', f.money(outstanding, inv.currency)],
          ]}
          footnote="Generated from the MAKHORIZON admin demo. Not a tax invoice."
        />
        <Card className="no-print self-start">
          <CardHeader title="Payments" description="Each payment also appears in income records." />
          {payments.length === 0 ? (
            <EmptyState className="py-8" title="No payments recorded" action={outstanding > 0 && <Button size="sm" icon={Banknote} onClick={() => setModal('payment')}>Record payment</Button>} />
          ) : (
            <ul className="divide-y divide-line">
              {payments.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 px-5 py-3">
                  <div className="text-sm">
                    <p className="num font-semibold">{f.money(p.amount, inv.currency)}</p>
                    <p className="text-xs text-muted">
                      {f.date(p.date)} · {p.method}
                      {p.reference && ` · ${p.reference}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" iconOnly icon={X} aria-label={`Remove payment of ${f.money(p.amount, inv.currency)}`} onClick={() => removePay.ask(p)} />
                </li>
              ))}
            </ul>
          )}
          {client && (
            <div className="border-t border-line px-5 py-3 text-xs text-muted">
              Client:{' '}
              <Link to={`/clients/${client.id}`} className="font-medium text-ink hover:underline">
                {client.company}
              </Link>
            </div>
          )}
        </Card>
      </div>

      <InvoiceFormModal open={modal === 'edit'} invoice={inv} onClose={() => setModal(null)} />
      <PaymentFormModal open={modal === 'payment'} invoice={inv} onClose={() => setModal(null)} />
      {del.dialog}
      {cancel.dialog}
      {removePay.dialog}
    </>
  )
}
