import { useMemo } from 'react'
import { Eye, Ship } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { shipmentStatuses, shippingMethods } from '../data/shipments'
import useListState from '../hooks/useListState'
import usePartnerData from '../hooks/usePartnerData'
import { formatDate } from '../lib/format'

export default function Shipments() {
  const data = usePartnerData()
  const destinations = useMemo(() => [...new Set(data.shipments.map((s) => s.destination))].sort(), [data.shipments])
  const list = useListState(data.shipments, (s) => [s.id, s.orderId, s.trackingRef, s.origin, s.destination], {
    status: (s, v) => s.status === v,
    destination: (s, v) => s.destination === v,
    method: (s, v) => s.method === v,
  })

  const columns = [
    { key: 'id', header: 'Shipment reference', mobile: 'title', sort: (s) => s.id, cell: (s) => <Link to={`/shipments/${s.id}`} className="font-medium hover:text-gold-deep hover:underline">{s.id}</Link>, className: 'whitespace-nowrap' },
    { key: 'order', header: 'Related order', mobile: 'subtitle', sort: (s) => s.orderId, cell: (s) => <Link to={`/orders/${s.orderId}`} className="hover:underline">{s.orderId}</Link>, className: 'whitespace-nowrap' },
    { key: 'origin', header: 'Origin', mobile: true, sort: (s) => s.origin },
    { key: 'destination', header: 'Destination', mobile: true, sort: (s) => s.destination },
    { key: 'method', header: 'Method', sort: (s) => s.method, className: 'whitespace-nowrap', hideBelow: '2xl' },
    { key: 'dispatch', header: 'Dispatch date', sort: (s) => s.dispatchDate, cell: (s) => formatDate(s.dispatchDate), className: 'whitespace-nowrap', hideBelow: '2xl' },
    { key: 'eta', header: 'Est. arrival', mobile: true, sort: (s) => s.eta, cell: (s) => (s.status === 'Delivered' ? `Delivered ${formatDate(s.deliveredOn)}` : formatDate(s.eta)), className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', mobile: true, sort: (s) => s.status, cell: (s) => <StatusBadge status={s.status} /> },
  ]

  return (
    <>
      <PageHeader title="Shipments" description="Deliveries related to your orders, as recorded by the MAKHORIZON logistics team." />
      <DemoNotice className="mb-4" title="Demo tracking data">
        Shipment statuses are sample records. There is no live GPS or carrier tracking until the backend and logistics integrations are connected.
      </DemoNotice>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search shipment, order or tracking ref" label="Search shipments" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={shipmentStatuses} />
          <FilterSelect label="Destination" value={list.filters.destination ?? ''} onChange={(v) => list.setFilter('destination', v)} options={destinations} />
          <FilterSelect label="Method" value={list.filters.method ?? ''} onChange={(v) => list.setFilter('method', v)} options={shippingMethods} />
        </FilterBar>
        <DataTable
          caption="Shipments"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          cardsBelow="xl"
          initialSort={{ key: 'dispatch', dir: 'desc' }}
          actions={(s) => (
            <Link to={`/shipments/${s.id}`} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`View details for shipment ${s.id}`} title="View details">
              <Eye aria-hidden="true" />
            </Link>
          )}
          empty={data.shipments.length === 0 ? <EmptyState icon={Ship} title="No shipments yet" /> : <EmptyState title="No shipments match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
    </>
  )
}
