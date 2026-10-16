import { useMemo } from 'react'
import { ClipboardList, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { orderStatuses } from '../data/orders'
import { fmtDate, fmtDateTime } from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useMine from '../hooks/useMine'

const inRange = (iso, from, to) => (!from || iso >= from) && (!to || iso <= to)

export default function MyOrders() {
  const mine = useMine()
  const rows = useMemo(() => mine.orders.map((o) => ({ ...o, shipment: mine.shipments.find((s) => s.orderId === o.id) })), [mine.orders, mine.shipments])
  const list = useListState(rows, (r) => [r.number, r.client.company, r.cargo], {
    status: (r, v) => r.status === v,
    from: (r, v) => inRange(r.orderDate, v, ''),
    to: (r, v) => inRange(r.orderDate, '', v),
  })

  const columns = [
    { key: 'number', header: 'Order', mobile: 'title', sort: (r) => r.number, cell: (r) => <Link to={`/orders/${r.id}`} className="font-medium hover:text-gold-deep hover:underline">{r.number}</Link> },
    { key: 'client', header: 'Client', mobile: 'subtitle', sort: (r) => r.client.company, cell: (r) => r.client.company },
    { key: 'date', header: 'Order date', sort: (r) => r.orderDate, cell: (r) => fmtDate(r.orderDate), className: 'whitespace-nowrap' },
    { key: 'route', header: 'Origin → destination', mobile: true, cell: (r) => <span className="whitespace-nowrap">{r.origin} → {r.destination}</span> },
    { key: 'cargo', header: 'Cargo', cell: (r) => <span className="line-clamp-2 max-w-[16rem]">{r.cargo}</span> },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    { key: 'shipment', header: 'Shipment', cell: (r) => (r.shipment ? <Link to={`/shipments/${r.shipment.id}`} className="whitespace-nowrap hover:underline">{r.shipment.reference}</Link> : <span className="text-muted">—</span>) },
    { key: 'updated', header: 'Last updated', mobile: true, sort: (r) => r.updatedAt, cell: (r) => <span className="whitespace-nowrap text-xs">{fmtDateTime(r.updatedAt)}</span> },
  ]

  return (
    <>
      <PageHeader title="My Orders" description="Orders assigned to you. You can add operational updates; commercial details are managed by the administrator." />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search order or client" label="Search orders" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={orderStatuses} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="My orders"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'updated', dir: 'desc' }}
          actions={(r) => (
            <Link to={`/orders/${r.id}`} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`View order ${r.number}`} title="View">
              <Eye aria-hidden="true" />
            </Link>
          )}
          empty={mine.orders.length === 0 ? <EmptyState icon={ClipboardList} title="No orders assigned to you" /> : <EmptyState title="No orders match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
    </>
  )
}
