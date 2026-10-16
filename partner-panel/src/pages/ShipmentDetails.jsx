import { Copy, FileText, TriangleAlert } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { ShipmentTimeline } from '../components/ui/Timelines'
import usePartnerData from '../hooks/usePartnerData'
import { formatDate, formatDateTime } from '../lib/format'
import NotFound from './NotFound'

export default function ShipmentDetails() {
  const { id } = useParams()
  const data = usePartnerData()
  const toast = useToast()
  const s = data.shipmentById(id)
  if (!s) return <NotFound title="Shipment not found" message={`No shipment “${id}” is available to your company.`} backTo="/shipments" backLabel="Back to shipments" />

  const order = data.orderById(s.orderId)
  const last = s.events.at(-1)
  const docs = data.documents.filter((d) => (d.related?.kind === 'shipment' && d.related.id === s.id) || (d.related?.kind === 'order' && d.related.id === s.orderId))

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(s.trackingRef)
      toast.success(`Tracking reference ${s.trackingRef} copied.`)
    } catch {
      toast.error('Copy is not available in this browser. Select the reference and copy it manually.')
    }
  }

  return (
    <>
      <PageHeader
        title={`Shipment ${s.id}`}
        breadcrumbs={[{ label: 'Shipments', to: '/shipments' }, { label: s.id }]}
        meta={<StatusBadge status={s.status} />}
        description={`${s.origin} → ${s.destination}`}
        actions={
          s.trackingRef && (
            <Button icon={Copy} onClick={copy}>
              Copy Tracking Reference
            </Button>
          )
        }
      />
      <DemoNotice className="mb-5" title="Demo tracking data">
        This timeline reflects sample records entered by MAKHORIZON — it is not live carrier or GPS tracking.
      </DemoNotice>

      {s.delayed && (
        <div role="note" className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
          <span>
            <strong>Delayed.</strong> {s.deliveryNotes}
          </span>
        </div>
      )}

      <Card className="mb-5">
        <CardHeader title="Shipment progress" description={last ? `Last status update: ${formatDateTime(last.at)}` : undefined} />
        <div className="p-5">
          <ShipmentTimeline shipment={s} />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Shipment details" />
          <div className="p-5">
            <DetailList
              items={[
                { label: 'Shipment reference', value: s.id },
                { label: 'Related order', value: <Link to={`/orders/${s.orderId}`} className="text-navy hover:underline">{s.orderId}{order ? ` — ${order.title}` : ''}</Link> },
                { label: 'Origin', value: s.origin },
                { label: 'Destination', value: s.destination },
                { label: 'Shipping method', value: s.method },
                { label: 'Carrier', value: s.carrier || 'Not supplied' },
                { label: 'Tracking number', value: s.trackingRef ? <span className="font-mono">{s.trackingRef}</span> : 'Not supplied' },
                { label: 'Dispatch date', value: formatDate(s.dispatchDate) },
                { label: 'Estimated arrival', value: s.eta ? formatDate(s.eta) : 'Not available' },
                { label: 'Delivered on', value: s.deliveredOn ? formatDate(s.deliveredOn) : '', hidden: !s.deliveredOn },
                { label: 'Last status update', value: last ? `${formatDateTime(last.at)}${last.note ? ` — ${last.note}` : ''}` : '' },
                { label: 'Delivery notes', value: s.deliveryNotes, full: true },
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Related documents" actions={<Link to={`/documents?upload=1&kind=shipment&id=${s.id}`} className="text-xs font-semibold text-navy hover:underline">Upload</Link>} />
          {docs.length === 0 ? (
            <p className="p-5 text-sm text-muted">No documents linked to this shipment or its order.</p>
          ) : (
            <ul className="divide-y divide-line">
              {docs.map((d) => (
                <li key={d.id}>
                  <Link to={`/documents?doc=${d.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                    <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{d.name}</span>
                      <span className="block text-xs text-muted">{d.type}</span>
                    </span>
                    <StatusBadge status={d.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
