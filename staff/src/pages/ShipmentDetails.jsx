import { useState } from 'react'
import { CircleCheck, CircleDashed, FilePlus, PackageCheck, Plane, RefreshCw, Ship, Truck, Package, TriangleAlert, Info } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import NoteForm from '../components/forms/NoteForm'
import StatusUpdateModal from '../components/forms/StatusUpdateModal'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import History from '../components/ui/History'
import { ConfirmDialog } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedList from '../components/ui/RelatedList'
import { useToast } from '../components/ui/Toast'
import { staffShipmentTransitions } from '../data/shipments'
import { fmtDate } from '../hooks/useFormat'
import useMine from '../hooks/useMine'
import { relativeDays } from '../lib/dates'
import { shipmentAttention, taskDisplayStatus } from '../lib/selectors'
import { cn } from '../lib/utils'
import { addShipmentNote, updateShipmentStatus } from '../services/operationsService'
import NotFound from './NotFound'

const MODE_ICON = { Sea: Ship, Air: Plane, Road: Truck, Other: Package }
const STEPS = ['Planned', 'Ready for Dispatch', 'In Transit', 'Arrived', 'Delivered']

function Progress({ status }) {
  const index = status === 'Delayed' ? -1 : STEPS.indexOf(status)
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Shipment progress">
      {STEPS.map((step, i) => {
        const done = index >= 0 && i < index
        const current = i === index
        return (
          <li key={step} aria-current={current ? 'step' : undefined} className="min-w-0">
            <div className={cn('h-1.5 rounded-full', done || current ? 'bg-navy' : 'bg-line')} />
            <p className={cn('mt-1.5 hidden truncate text-xs sm:block', current ? 'font-semibold' : done ? 'text-ink' : 'text-muted')}>{step}</p>
            <span className="sr-only">{done ? 'completed' : current ? 'current' : 'not reached'}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default function ShipmentDetails() {
  const { id } = useParams()
  const mine = useMine()
  const toast = useToast()
  const [modal, setModal] = useState(null)
  const [busy, setBusy] = useState(false)
  const sh = mine.shipments.find((s) => s.id === id)
  if (!sh) return <NotFound title="Shipment not found" message="This shipment doesn’t exist or isn’t assigned to you." backTo="/my-shipments" backLabel="Back to my shipments" />

  const order = mine.orderById(sh.orderId)
  const tasks = mine.tasks.filter((t) => t.shipmentId === id)
  const attention = shipmentAttention(sh, mine.state)
  const allowed = staffShipmentTransitions[sh.status] ?? []
  const generalAllowed = allowed.filter((x) => x !== 'Delivered')
  const ModeIcon = MODE_ICON[sh.mode] ?? Package
  const docFor = (r) => mine.state.documents.find((d) => d.id === r.documentId)

  const markDelivered = async () => {
    setBusy(true)
    try {
      await updateShipmentStatus(sh.id, 'Delivered', 'Delivery confirmed')
      toast.success(`${sh.reference} marked Delivered.`)
      setModal(null)
    } catch (err) {
      toast.error(err.message, 'Not updated')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title={sh.reference}
        meta={<StatusBadge status={sh.status} />}
        description={`${sh.origin} → ${sh.destination}`}
        breadcrumbs={[{ label: 'My Shipments', to: '/my-shipments' }, { label: sh.reference }]}
        actions={
          <>
            {generalAllowed.length > 0 && (
              <Button variant={allowed.includes('Delivered') ? 'secondary' : 'primary'} icon={RefreshCw} onClick={() => setModal('status')}>
                Record update
              </Button>
            )}
            {allowed.includes('Delivered') && (
              <Button variant="primary" icon={PackageCheck} onClick={() => setModal('delivered')}>
                Mark delivered
              </Button>
            )}
          </>
        }
      />
      {attention && (
        <p role="status" className={cn('mb-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm', sh.status === 'Delayed' ? 'border-danger/30 bg-danger/5' : 'border-warning/30 bg-warning/10')}>
          <TriangleAlert className={cn('h-4 w-4 shrink-0', sh.status === 'Delayed' ? 'text-danger' : 'text-warning')} aria-hidden="true" />
          Action needed: {attention}.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Shipment overview" description="Coordination status recorded by staff — not live tracking." />
            <div className="space-y-5 p-5">
              {sh.status === 'Delayed' ? (
                <p className="rounded-lg bg-danger/5 px-3 py-2 text-sm text-danger">Delayed. Record the next update once the carrier confirms new dates.</p>
              ) : sh.status !== 'Cancelled' ? (
                <Progress status={sh.status} />
              ) : null}
              <div className="flex items-center gap-4 rounded-lg bg-canvas p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                  <ModeIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="grid flex-1 gap-1 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wide text-muted">Origin</p>
                    <p className="font-medium">{sh.origin}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wide text-muted">Destination</p>
                    <p className="font-medium">{sh.destination}</p>
                  </div>
                </div>
              </div>
              <DetailList
                columns={3}
                items={[
                  { label: 'Related order', value: order ? <Link to={`/orders/${order.id}`} className="hover:underline">{order.number}</Link> : '' },
                  { label: 'Client', value: order?.client.company },
                  { label: 'Transport mode', value: sh.mode },
                  { label: 'Carrier', value: sh.carrier },
                  { label: 'Tracking reference', value: sh.trackingRef },
                  { label: 'Departure', value: fmtDate(sh.departureDate) },
                  { label: 'Expected arrival', value: sh.expectedArrival ? `${fmtDate(sh.expectedArrival)} (${relativeDays(sh.expectedArrival)})` : '' },
                  { label: 'Actual arrival / delivery', value: sh.actualArrival ? fmtDate(sh.actualArrival) : '' },
                  { label: 'Notes', value: sh.notes, full: true },
                ]}
              />
              <p className="flex items-start gap-2 text-xs text-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Updates are saved in this demo only. Real notifications and permanent records require the backend integration.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Required documents" />
            {sh.requiredDocs.length === 0 ? (
              <p className="p-5 text-sm text-muted">No documents are listed for this shipment.</p>
            ) : (
              <ul className="divide-y divide-line">
                {sh.requiredDocs.map((r) => {
                  const doc = docFor(r)
                  const available = doc && doc.fileName
                  return (
                    <li key={r.name} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                      {available ? <CircleCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" /> : <CircleDashed className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />}
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{r.name}</span>
                        <span className="block text-xs text-muted">{available ? 'Document recorded' : doc ? 'Requested — file not yet provided' : 'Missing'}</span>
                      </span>
                      {doc ? (
                        <Link to={`/documents/${doc.id}`} className="btn btn-ghost btn-sm">
                          {available ? 'View' : 'Provide file'}
                        </Link>
                      ) : (
                        <Link to={`/documents?new=1&order=${sh.orderId}&shipment=${sh.id}&name=${encodeURIComponent(r.name)}`} className="btn btn-secondary btn-sm">
                          <FilePlus aria-hidden="true" />
                          Add document
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Operational note" />
            <div className="p-5">
              <NoteForm id={`sh-note-${sh.id}`} label="Add a note to the shipment history" placeholder="e.g. Port gate-in booked for Thursday morning." onSubmit={(text) => addShipmentNote(sh.id, text)} />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <RelatedList title="My tasks for this shipment" items={tasks.map((t) => ({ key: t.id, to: `/tasks/${t.id}`, title: t.title, sub: t.reference, badge: <StatusBadge status={taskDisplayStatus(t)} /> }))} empty="No tasks for this shipment." />
          <Card>
            <CardHeader title="Status history" description="Previous status, new status, time and employee." />
            <div className="p-5">
              <History entries={sh.events} />
            </div>
          </Card>
          {!allowed.length && (
            <p className="text-xs text-muted">
              <Badge>{sh.status}</Badge> No further staff updates are available for this shipment.
            </p>
          )}
        </div>
      </div>

      <StatusUpdateModal
        open={modal === 'status'}
        onClose={() => setModal(null)}
        title="Record shipment update"
        description={`${sh.reference} · permitted operational updates`}
        current={sh.status}
        allowed={generalAllowed}
        reasonRequired={['Delayed']}
        onSubmit={(st, note) => updateShipmentStatus(sh.id, st, note)}
      >
        {(next) => (next === 'Arrived' && !sh.actualArrival ? <p className="text-xs text-muted">Today’s date will be recorded as the actual arrival date.</p> : null)}
      </StatusUpdateModal>
      <ConfirmDialog
        open={modal === 'delivered'}
        onClose={() => !busy && setModal(null)}
        onConfirm={markDelivered}
        busy={busy}
        tone="primary"
        title="Mark shipment as delivered?"
        message={
          <>
            <strong>{sh.reference}</strong> will be marked Delivered{!sh.actualArrival && ' and today will be recorded as the delivery date'}. This is a significant update and cannot be undone by staff.
          </>
        }
        confirmLabel="Mark delivered"
      />
    </>
  )
}
