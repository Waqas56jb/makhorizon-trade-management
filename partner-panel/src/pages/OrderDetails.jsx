import { useState } from 'react'
import { CircleCheck, FileText, HelpCircle, Lock, MessageSquarePlus, Ship } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { StatusHistory } from '../components/ui/Timelines'
import useConfirmAction from '../hooks/useConfirmAction'
import usePartnerData from '../hooks/usePartnerData'
import { formatCurrency, formatDate, formatDateTime, formatNumber } from '../lib/format'
import { orderTotal } from '../lib/quotation'
import { cn } from '../lib/utils'
import { addOrderNote, confirmOrder } from '../services/orderService'
import NotFound from './NotFound'

function NoteComposer({ orderId }) {
  const toast = useToast()
  const [type, setType] = useState('note')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await addOrderNote(orderId, text, type)
      setText('')
      toast.success(type === 'clarification' ? 'Clarification request added and posted to Messages (demo — not sent).' : 'Note added to the order.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3 border-t border-line p-5">
      <fieldset>
        <legend className="field-label">Type</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { v: 'note', label: 'Add a note', icon: MessageSquarePlus },
            { v: 'clarification', label: 'Request clarification', icon: HelpCircle },
          ].map(({ v, label, icon: Icon }) => (
            <label key={v} className={cn('flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm', type === v ? 'border-navy bg-navy/5 font-semibold' : 'border-line')}>
              <input type="radio" name="note-type" value={v} checked={type === v} onChange={() => setType(v)} className="accent-navy" />
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="order-note" className="field-label">
          {type === 'clarification' ? 'What needs clarification?' : 'Note'}
        </label>
        <textarea id="order-note" rows={3} value={text} onChange={(e) => setText(e.target.value)} maxLength={1500} className="field-control" aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? 'order-note-error' : 'order-note-hint'} />
        {error ? (
          <p id="order-note-error" role="alert" className="mt-1 text-xs font-medium text-danger">
            {error}
          </p>
        ) : (
          <p id="order-note-hint" className="mt-1 text-xs text-muted">
            {type === 'clarification' ? 'Also posted to the related conversation in Messages.' : 'Visible on this order.'} Demo only — nothing is sent.
          </p>
        )}
      </div>
      <Button type="submit" variant="primary" size="sm" loading={busy}>
        {type === 'clarification' ? 'Send clarification request' : 'Add note'}
      </Button>
    </form>
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  const data = usePartnerData()
  const o = data.orderById(id)
  const confirmAction = useConfirmAction({
    action: (row) => confirmOrder(row.id),
    title: (row) => `Confirm order ${row.id}?`,
    message: (row) => (
      <div className="space-y-2">
        <p>
          You confirm that your company accepts <strong>{row.title}</strong> for <strong className="num">{formatCurrency(orderTotal(row), row.currency)}</strong>, with delivery by {formatDate(row.deliveryDeadline)}.
        </p>
        <p className="text-xs text-muted">Demo — the status changes in this browser only.</p>
      </div>
    ),
    confirmLabel: 'Confirm order',
    tone: 'primary',
    success: (row) => `Order ${row.id} confirmed.`,
  })
  if (!o) return <NotFound title="Order not found" message={`No order “${id}” is available to your company.`} backTo="/orders" backLabel="Back to orders" />

  const total = orderTotal(o)
  const fmt = (n) => formatCurrency(n, o.currency)
  const shipments = data.shipments.filter((s) => s.orderId === o.id)
  const docs = data.documents.filter((d) => d.related?.kind === 'order' && d.related.id === o.id)

  return (
    <>
      <PageHeader
        title={o.title}
        breadcrumbs={[{ label: 'Orders', to: '/orders' }, { label: o.id }]}
        meta={<StatusBadge status={o.status} />}
        actions={
          o.status === 'Awaiting Confirmation' && (
            <Button variant="primary" icon={CircleCheck} onClick={() => confirmAction.ask(o)}>
              Confirm order
            </Button>
          )
        }
      />
      {o.status === 'Awaiting Confirmation' && (
        <div className="mb-5 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm">MAKHORIZON has issued this order. Review the items and terms, then confirm it — or request a clarification below.</div>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader title="Order summary" />
            <div className="p-5">
              <DetailList
                items={[
                  { label: 'Order reference', value: o.id },
                  { label: 'Related quotation', value: o.quotationId ? <Link to={`/quotations/${o.quotationId}`} className="text-navy hover:underline">{o.quotationId}</Link> : 'Framework order (no quotation)' },
                  { label: 'Order date', value: formatDate(o.orderDate) },
                  { label: 'Delivery deadline', value: formatDate(o.deliveryDeadline) },
                  { label: 'Confirmed', value: o.confirmedAt ? formatDateTime(o.confirmedAt) : 'Not yet confirmed' },
                  { label: 'Currency', value: o.currency },
                  { label: 'Delivery location', value: o.deliveryLocation, full: true },
                  { label: 'Delivery instructions', value: o.deliveryInstructions, full: true },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Items and service lines" description={`Set by MAKHORIZON · amounts in ${o.currency}`} actions={<span className="flex items-center gap-1 text-xs text-muted"><Lock className="h-3.5 w-3.5" aria-hidden="true" />Read-only</span>} />
            <div className="hidden overflow-x-auto md:block">
              <table className="table-base">
                <caption className="sr-only">Order items</caption>
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col" className="text-right">Quantity</th>
                    <th scope="col" className="text-right">Unit price</th>
                    <th scope="col" className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((i) => (
                    <tr key={i.description}>
                      <td>{i.description}</td>
                      <td className="num whitespace-nowrap text-right">
                        {formatNumber(i.quantity)} {i.unit}
                      </td>
                      <td className="num whitespace-nowrap text-right">{fmt(i.unitPrice)}</td>
                      <td className="num whitespace-nowrap text-right">{fmt(i.quantity * i.unitPrice)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="text-right font-semibold">
                      Order total
                    </td>
                    <td className="num text-right font-semibold">{fmt(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-line md:hidden">
              {o.items.map((i) => (
                <li key={i.description} className="px-4 py-3 text-sm">
                  <p className="font-medium">{i.description}</p>
                  <p className="num mt-0.5 text-xs text-muted">
                    {formatNumber(i.quantity)} {i.unit} × {fmt(i.unitPrice)}
                  </p>
                  <p className="num mt-1 font-semibold">{fmt(i.quantity * i.unitPrice)}</p>
                </li>
              ))}
              <li className="num flex justify-between px-4 py-3 font-semibold">
                <span>Order total</span>
                <span>{fmt(total)}</span>
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader title="Notes and communications" />
            {o.notes.length === 0 ? (
              <p className="p-5 text-sm text-muted">No notes yet.</p>
            ) : (
              <ul className="space-y-4 p-5">
                {o.notes.map((n) => (
                  <li key={n.id} className={cn('rounded-lg border p-3', n.author === 'partner' ? 'border-line bg-canvas' : 'border-gold/30 bg-[#fbf8f1]')}>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="font-semibold text-ink">{n.by}</span>
                      {n.author === 'makhorizon' && <span>· MAKHORIZON</span>}
                      {n.type === 'clarification' && <span className="font-semibold text-warning">· Clarification request</span>}
                      <span className="num">· {formatDateTime(n.at)}</span>
                    </p>
                    <p className="mt-1 text-sm">{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
            <NoteComposer orderId={o.id} />
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Order total" />
            <p className="num p-5 text-2xl font-semibold tracking-tight">{fmt(total)}</p>
          </Card>
          <Card>
            <CardHeader title="Related shipments" />
            {shipments.length === 0 ? (
              <p className="p-5 text-sm text-muted">No shipment has been created for this order yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {shipments.map((s) => (
                  <li key={s.id}>
                    <Link to={`/shipments/${s.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                      <Ship className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{s.id}</span>
                        <span className="block truncate text-xs text-muted">
                          {s.origin} → {s.destination}
                        </span>
                      </span>
                      <StatusBadge status={s.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Supporting documents" actions={<Link to={`/documents?upload=1&kind=order&id=${o.id}`} className="text-xs font-semibold text-navy hover:underline">Upload</Link>} />
            {docs.length === 0 ? (
              <p className="p-5 text-sm text-muted">No documents linked to this order.</p>
            ) : (
              <ul className="divide-y divide-line">
                {docs.map((d) => (
                  <li key={d.id}>
                    <Link to={`/documents?doc=${d.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                      <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{d.name}</span>
                      <StatusBadge status={d.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Status history" />
            <div className="p-5">
              <StatusHistory items={o.history} />
            </div>
          </Card>
        </div>
      </div>
      {confirmAction.dialog}
    </>
  )
}
