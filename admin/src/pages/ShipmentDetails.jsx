import { useState } from 'react'
import { Check, FilePlus, Pencil, Plane, RefreshCw, Ship, StickyNote, Trash2, Truck, Package, TriangleAlert } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import FormModal from '../components/forms/FormModal'
import { ShipmentFormModal, StatusFormModal } from '../components/forms/TradeForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { TextareaField } from '../components/ui/Fields'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedTable from '../components/ui/RelatedTable'
import Timeline from '../components/ui/Timeline'
import { shipmentStatuses } from '../data/shipments'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { relativeDays } from '../lib/dates'
import { required } from '../lib/schemas'
import { useAppState } from '../lib/store'
import { cn } from '../lib/utils'
import { shipmentService } from '../services/tradeServices'
import NotFound from './NotFound'

const STEPS = ['Planned', 'Ready for Dispatch', 'In Transit', 'Arrived', 'Delivered']
const MODE_ICON = { Sea: Ship, Air: Plane, Road: Truck, Other: Package }

function Progress({ status }) {
  const exceptional = status === 'Delayed' || status === 'Cancelled'
  // Delayed shipments are shown at the In Transit step with a warning.
  const index = status === 'Delayed' ? 2 : STEPS.indexOf(status)
  return (
    <div>
      <ol className="grid grid-cols-5 gap-1" aria-label="Shipment progress">
        {STEPS.map((step, i) => {
          const done = index >= 0 && i < index
          const current = i === index && status !== 'Cancelled'
          return (
            <li key={step} className="min-w-0" aria-current={current ? 'step' : undefined}>
              <div className={cn('h-1.5 rounded-full', done || current ? (status === 'Delayed' && current ? 'bg-danger' : 'bg-navy') : 'bg-line')} />
              <div className="mt-2 flex items-center gap-1.5">
                <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-bold', done ? 'bg-navy text-white' : current ? (status === 'Delayed' ? 'bg-danger text-white' : 'bg-gold text-midnight') : 'bg-line text-muted')}>
                  {done ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
                </span>
                <span className={cn('hidden truncate text-xs sm:block', current || done ? 'font-semibold text-ink' : 'text-muted')}>{step}</span>
              </div>
              <span className="sr-only">{done ? 'completed' : current ? 'current' : 'not reached'}</span>
            </li>
          )
        })}
      </ol>
      {exceptional && (
        <p className={cn('mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm', status === 'Delayed' ? 'bg-danger/5 text-danger' : 'bg-canvas text-muted')}>
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          {status === 'Delayed' ? 'Shipment is marked Delayed. Revised dates must be confirmed with the carrier.' : 'Shipment was cancelled.'}
        </p>
      )}
    </div>
  )
}

const noteSchema = z.object({ note: required('Note', 500) })

export default function ShipmentDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const sh = s.shipments.find((x) => x.id === id)

  const del = useConfirmAction({
    action: (x) => shipmentService.remove(x.id),
    title: 'Delete shipment?',
    message: (x) => `${x.reference} will be permanently removed from the demo data.`,
    success: (x) => `${x.reference} deleted.`,
    onDone: () => navigate('/shipments'),
  })

  if (!sh) return <NotFound title="Shipment not found" backTo="/shipments" backLabel="Back to shipments" />
  const order = s.orders.find((o) => o.id === sh.orderId)
  const client = s.clients.find((c) => c.id === order?.clientId)
  const docs = s.documents.filter((d) => d.relatedType === 'shipment' && d.relatedId === id)
  const ModeIcon = MODE_ICON[sh.mode] ?? Package

  return (
    <>
      <PageHeader
        title={sh.reference}
        meta={<StatusBadge status={sh.status} />}
        description={`${sh.origin} → ${sh.destination}`}
        breadcrumbs={[{ label: 'Shipments', to: '/shipments' }, { label: sh.reference }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(sh)}>
              Delete
            </Button>
            <Button icon={StickyNote} onClick={() => setModal('note')}>
              Add note
            </Button>
            <Button icon={Pencil} onClick={() => setModal('edit')}>
              Edit
            </Button>
            <Button variant="primary" icon={RefreshCw} onClick={() => setModal('status')}>
              Update status
            </Button>
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Progress" description="Coordination status recorded by the team — not live tracking." />
            <div className="p-5">
              <Progress status={sh.status} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Shipment overview" />
            <div className="p-5">
              <div className="mb-5 flex items-center gap-4 rounded-lg bg-canvas p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold">
                  <ModeIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="grid flex-1 gap-1 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wide text-muted">Origin</p>
                    <p className="font-medium">{sh.origin}</p>
                  </div>
                  <span className="hidden text-muted sm:block" aria-hidden="true">
                    →
                  </span>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wide text-muted">Destination</p>
                    <p className="font-medium">{sh.destination}</p>
                  </div>
                </div>
              </div>
              <DetailList
                columns={3}
                items={[
                  { label: 'Transport mode', value: sh.mode },
                  { label: 'Carrier', value: sh.carrier },
                  { label: 'Tracking reference', value: sh.trackingRef },
                  { label: 'Departure', value: f.date(sh.departureDate) },
                  { label: 'Expected arrival', value: sh.expectedArrival ? `${f.date(sh.expectedArrival)} (${relativeDays(sh.expectedArrival)})` : '' },
                  { label: 'Actual arrival / delivery', value: sh.actualArrival ? f.date(sh.actualArrival) : '' },
                  { label: 'Internal notes', value: sh.notes, full: true },
                ]}
              />
              <p className="mt-4 text-xs text-muted">Expected dates are planning estimates and are not guaranteed.</p>
            </div>
          </Card>
          <RelatedTable
            title="Documents"
            rows={docs}
            linkTo={(d) => `/documents/${d.id}`}
            actions={<Button size="sm" icon={FilePlus} onClick={() => setModal('document')}>Add document</Button>}
            columns={[
              { header: 'Name', cell: (d) => d.name },
              { header: 'Type', cell: (d) => d.type },
              { header: 'File', cell: (d) => d.fileName || '—' },
              { header: 'Added', cell: (d) => f.date(d.uploadDate) },
            ]}
          />
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Related order" />
            <div className="p-5 text-sm">
              {order ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <Link to={`/orders/${order.id}`} className="font-semibold hover:underline">
                      {order.number}
                    </Link>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-muted">{order.cargo}</p>
                  {client && (
                    <p className="mt-3">
                      Client:{' '}
                      <Link to={`/clients/${client.id}`} className="font-medium hover:underline">
                        {client.company}
                      </Link>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted">Order not found.</p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader title="Status history and notes" />
            <div className="p-5">
              <Timeline entries={sh.history} formatDate={f.date} />
            </div>
          </Card>
        </div>
      </div>

      <ShipmentFormModal open={modal === 'edit'} shipment={sh} onClose={() => setModal(null)} />
      <StatusFormModal open={modal === 'status'} onClose={() => setModal(null)} title="Update shipment status" description="Arrived or Delivered records today as the actual date if none is set." statuses={shipmentStatuses} current={sh.status} onSubmit={(st, note) => shipmentService.updateStatus(sh.id, st, note)} />
      <FormModal open={modal === 'note'} onClose={() => setModal(null)} size="md" title="Add note" description={sh.reference} schema={noteSchema} defaultValues={{ note: '' }} onSubmit={(v) => shipmentService.addNote(sh.id, v.note)} successMessage="Note added." submitLabel="Add note">
        {(form) => <TextareaField id="sh-note" label="Note" required rows={4} registration={form.register('note')} error={form.formState.errors.note} />}
      </FormModal>
      <DocumentFormModal open={modal === 'document'} prefill={{ relatedType: 'shipment', relatedId: sh.id }} onClose={() => setModal(null)} />
      {del.dialog}
    </>
  )
}
