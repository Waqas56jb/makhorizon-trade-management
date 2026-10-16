import { useState } from 'react'
import { Lock, RefreshCw } from 'lucide-react'
import { useParams } from 'react-router-dom'
import NoteForm from '../components/forms/NoteForm'
import StatusUpdateModal from '../components/forms/StatusUpdateModal'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import History, { NotesList } from '../components/ui/History'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedList from '../components/ui/RelatedList'
import { staffOrderTransitions } from '../data/orders'
import { fmtDate, fmtDateTime } from '../hooks/useFormat'
import useMine from '../hooks/useMine'
import { taskDisplayStatus } from '../lib/selectors'
import { addOrderUpdate, updateOrderStatus } from '../services/operationsService'
import NotFound from './NotFound'

export default function OrderDetails() {
  const { id } = useParams()
  const mine = useMine()
  const [statusOpen, setStatusOpen] = useState(false)
  const order = mine.orders.find((o) => o.id === id)
  if (!order) return <NotFound title="Order not found" message="This order doesn’t exist or isn’t assigned to you." backTo="/my-orders" backLabel="Back to my orders" />

  const tasks = mine.tasks.filter((t) => t.orderId === id)
  const shipments = mine.shipments.filter((s) => s.orderId === id)
  const docs = mine.documents.filter((d) => d.orderId === id)
  const allowed = staffOrderTransitions[order.status] ?? []

  return (
    <>
      <PageHeader
        title={order.number}
        meta={<StatusBadge status={order.status} />}
        description={`${order.client.company} · ${order.origin} → ${order.destination}`}
        breadcrumbs={[{ label: 'My Orders', to: '/my-orders' }, { label: order.number }]}
        actions={
          allowed.length > 0 && (
            <Button variant="primary" icon={RefreshCw} onClick={() => setStatusOpen(true)}>
              Update status
            </Button>
          )
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Order information" />
            <div className="p-5">
              <DetailList
                columns={3}
                items={[
                  { label: 'Order reference', value: <span className="font-mono">{order.number}</span> },
                  { label: 'Order date', value: fmtDate(order.orderDate) },
                  { label: 'Expected completion', value: order.expectedDate ? fmtDate(order.expectedDate) : '' },
                  { label: 'Origin', value: order.origin },
                  { label: 'Destination', value: order.destination },
                  { label: 'Quantity', value: order.quantity },
                  { label: 'Cargo / product', value: order.cargo, full: true },
                  { label: 'Last updated', value: fmtDateTime(order.updatedAt) },
                ]}
              />
              <p className="mt-5 flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-xs text-muted">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Prices, commercial terms and cancellation are managed by the administrator.
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Operational updates" description="Notes about progress on this order." />
            <div className="space-y-5 p-5">
              <NotesList notes={order.updates} empty="No updates yet." />
              <NoteForm id={`order-update-${order.id}`} label="Add an operational update" submitLabel="Add update" success="Update added." placeholder="e.g. Supplier confirmed loading on Monday." onSubmit={(text) => addOrderUpdate(order.id, text)} />
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Client" />
            <div className="p-5">
              <DetailList
                columns={1}
                items={[
                  { label: 'Company', value: order.client.company },
                  { label: 'Contact', value: order.client.contact },
                  { label: 'Country', value: order.client.country },
                ]}
              />
            </div>
          </Card>
          <RelatedList title="My tasks for this order" items={tasks.map((t) => ({ key: t.id, to: `/tasks/${t.id}`, title: t.title, sub: `${t.reference} · due ${fmtDate(t.dueDate)}`, badge: <StatusBadge status={taskDisplayStatus(t)} /> }))} empty="No tasks for this order." />
          <RelatedList title="Shipments" items={shipments.map((s) => ({ key: s.id, to: `/shipments/${s.id}`, title: s.reference, sub: `${s.mode} · ${s.origin} → ${s.destination}`, badge: <StatusBadge status={s.status} /> }))} empty="No shipment yet." />
          <RelatedList title="Documents" items={docs.map((d) => ({ key: d.id, to: `/documents/${d.id}`, title: d.name, sub: d.type, badge: <StatusBadge status={d.status} /> }))} empty="No documents linked." />
          <Card>
            <CardHeader title="Status history" />
            <div className="p-5">
              <History entries={order.history} />
            </div>
          </Card>
        </div>
      </div>
      <StatusUpdateModal open={statusOpen} onClose={() => setStatusOpen(false)} title="Update order status" description={`${order.number} · operational statuses only`} current={order.status} allowed={allowed} onSubmit={(st, note) => updateOrderStatus(order.id, st, note)} />
    </>
  )
}
