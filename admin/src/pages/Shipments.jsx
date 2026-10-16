import { useMemo, useState } from 'react'
import { Download, Plus, Ship } from 'lucide-react'
import { ShipmentFormModal } from '../components/forms/TradeForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { shipmentStatuses, transportModes } from '../data/shipments'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useLookups from '../hooks/useLookups'
import useUrlIntent from '../hooks/useUrlIntent'
import { inRange } from '../lib/analytics'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { shipmentService } from '../services/tradeServices'

const ACTIVE = ['Ready for Dispatch', 'In Transit', 'Delayed']
const STATUS_OPTIONS = [{ value: 'active', label: 'In progress' }, ...shipmentStatuses.map((x) => ({ value: x, label: x }))]

export default function Shipments() {
  const s = useAppState()
  const f = useFormat()
  const lk = useLookups()
  const { intent, params } = useUrlIntent(['new', 'order'])

  const [form, setForm] = useState(() => {
    if (!intent.new) return { open: false, shipment: null, prefill: null }
    const o = intent.order ? s.orders.find((x) => x.id === intent.order) : null
    return { open: true, shipment: null, prefill: o ? { orderId: o.id, origin: o.origin, destination: o.destination } : null }
  })

  const rows = useMemo(
    () =>
      s.shipments.map((x) => {
        const order = lk.orders[x.orderId]
        return { ...x, orderNumber: order?.number ?? '—', client: lk.clients[order?.clientId]?.company ?? '—' }
      }),
    [s.shipments, lk],
  )

  const list = useListState(
    rows,
    (r) => [r.reference, r.orderNumber, r.client, r.origin, r.destination, r.carrier, r.trackingRef],
    {
      status: (r, v) => (v === 'active' ? ACTIVE.includes(r.status) : r.status === v),
      mode: (r, v) => r.mode === v,
      from: (r, v) => inRange(r.departureDate, v, ''),
      to: (r, v) => inRange(r.departureDate, '', v),
    },
    { status: params.get('status') ?? '' },
  )

  const del = useConfirmAction({
    action: (x) => shipmentService.remove(x.id),
    title: 'Delete shipment?',
    message: (x) => `${x.reference} and its status history will be permanently removed from the demo data.`,
    success: (x) => `${x.reference} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-shipments-${todayISO()}.csv`, list.filtered, [
      { header: 'Reference', value: (r) => r.reference },
      { header: 'Order', value: (r) => r.orderNumber },
      { header: 'Client', value: (r) => r.client },
      { header: 'Origin', value: (r) => r.origin },
      { header: 'Destination', value: (r) => r.destination },
      { header: 'Mode', value: (r) => r.mode },
      { header: 'Carrier', value: (r) => r.carrier },
      { header: 'Tracking reference', value: (r) => r.trackingRef },
      { header: 'Departure', value: (r) => r.departureDate },
      { header: 'Expected arrival', value: (r) => r.expectedArrival },
      { header: 'Actual arrival', value: (r) => r.actualArrival },
      { header: 'Status', value: (r) => r.status },
    ])

  const columns = [
    { key: 'ref', header: 'Shipment', mobile: 'title', sort: (r) => r.reference, cell: (r) => <CellLink to={`/shipments/${r.id}`} sub={r.carrier}>{r.reference}</CellLink> },
    { key: 'order', header: 'Order', sort: (r) => r.orderNumber, cell: (r) => <CellLink to={`/orders/${r.orderId}`}>{r.orderNumber}</CellLink> },
    { key: 'client', header: 'Client', mobile: 'subtitle', sort: (r) => r.client },
    { key: 'route', header: 'Route', mobile: true, cell: (r) => <span className="whitespace-nowrap">{r.origin} → {r.destination}</span> },
    { key: 'mode', header: 'Mode', sort: (r) => r.mode },
    { key: 'dep', header: 'Departure', sort: (r) => r.departureDate, cell: (r) => f.date(r.departureDate), className: 'whitespace-nowrap' },
    { key: 'eta', header: 'Expected arrival', mobile: true, sort: (r) => r.expectedArrival, cell: (r) => f.date(r.expectedArrival), className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Shipments"
        description="Internal coordination records for goods in movement. No live carrier tracking is connected."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, shipment: null, prefill: null })}>
              New shipment
            </Button>
          </>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search reference, order, client, carrier" label="Search shipments" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={STATUS_OPTIONS} />
          <FilterSelect label="Mode" value={list.filters.mode ?? ''} onChange={(v) => list.setFilter('mode', v)} options={transportModes} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Shipments"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'eta', dir: 'desc' }}
          actions={(r) => <RowActions label={r.reference} viewTo={`/shipments/${r.id}`} onEdit={() => setForm({ open: true, shipment: r, prefill: null })} onDelete={() => del.ask(r)} />}
          empty={s.shipments.length === 0 ? <EmptyState icon={Ship} title="No shipments yet" /> : <EmptyState title="No shipments match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <ShipmentFormModal open={form.open} shipment={form.shipment} prefill={form.prefill} onClose={() => setForm({ open: false, shipment: null, prefill: null })} />
      {del.dialog}
    </>
  )
}
