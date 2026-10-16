import { useMemo } from 'react'
import { Eye, Ship, TriangleAlert } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { shipmentStatuses, transportModes } from '../data/shipments'
import { fmtDate } from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useMine from '../hooks/useMine'
import { shipmentAttention } from '../lib/selectors'
import { cn } from '../lib/utils'

const inRange = (iso, from, to) => !!iso && (!from || iso >= from) && (!to || iso <= to)

export default function MyShipments() {
  const mine = useMine()
  const [params] = useSearchParams()
  const rows = useMemo(
    () => mine.shipments.map((s) => ({ ...s, orderNumber: mine.orderById(s.orderId)?.number ?? '—', attention: shipmentAttention(s, mine.state) })),
    [mine],
  )
  const list = useListState(
    rows,
    (r) => [r.reference, r.orderNumber, r.destination, r.trackingRef],
    {
      status: (r, v) => r.status === v,
      mode: (r, v) => r.mode === v,
      attention: (r, v) => (v === 'yes' ? !!r.attention : true),
      from: (r, v) => inRange(r.departureDate, v, '') || inRange(r.expectedArrival, v, ''),
      to: (r, v) => inRange(r.departureDate, '', v) || inRange(r.expectedArrival, '', v),
    },
    { attention: params.get('attention') === 'yes' ? 'yes' : '' },
  )
  const needCount = rows.filter((r) => r.attention).length

  const columns = [
    { key: 'ref', header: 'Shipment', mobile: 'title', sort: (r) => r.reference, cell: (r) => <Link to={`/shipments/${r.id}`} className="font-medium hover:text-gold-deep hover:underline">{r.reference}</Link> },
    { key: 'order', header: 'Order', mobile: 'subtitle', sort: (r) => r.orderNumber, cell: (r) => <Link to={`/orders/${r.orderId}`} className="hover:underline">{r.orderNumber}</Link> },
    { key: 'dest', header: 'Destination', mobile: true, sort: (r) => r.destination },
    { key: 'mode', header: 'Mode', sort: (r) => r.mode },
    { key: 'dep', header: 'Departure', sort: (r) => r.departureDate, cell: (r) => fmtDate(r.departureDate), className: 'whitespace-nowrap' },
    { key: 'eta', header: 'Expected arrival', mobile: true, sort: (r) => r.expectedArrival, cell: (r) => fmtDate(r.expectedArrival), className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'action',
      header: 'Action needed',
      mobile: true,
      mobileFull: true,
      sort: (r) => (r.attention ? 0 : 1),
      cell: (r) =>
        r.attention ? (
          <Badge tone={r.status === 'Delayed' ? 'danger' : 'warning'} className="whitespace-normal">
            <TriangleAlert className="h-3 w-3" aria-hidden="true" />
            {r.attention}
          </Badge>
        ) : (
          <span className="text-xs text-muted">None</span>
        ),
    },
  ]

  return (
    <>
      <PageHeader title="My Shipments" description="Shipments assigned to you. This is an internal coordination record — there is no live carrier tracking." />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search shipment or order" label="Search shipments" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={shipmentStatuses} />
          <FilterSelect label="Mode" value={list.filters.mode ?? ''} onChange={(v) => list.setFilter('mode', v)} options={transportModes} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
          <button
            type="button"
            onClick={() => list.setFilter('attention', list.filters.attention === 'yes' ? '' : 'yes')}
            aria-pressed={list.filters.attention === 'yes'}
            className={cn('btn btn-sm', list.filters.attention === 'yes' ? 'btn-primary' : 'btn-secondary')}
          >
            <TriangleAlert aria-hidden="true" />
            Needs attention ({needCount})
          </button>
        </FilterBar>
        <DataTable
          caption="My shipments"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'action', dir: 'asc' }}
          actions={(r) => (
            <Link to={`/shipments/${r.id}`} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`View shipment ${r.reference}`} title="View">
              <Eye aria-hidden="true" />
            </Link>
          )}
          empty={mine.shipments.length === 0 ? <EmptyState icon={Ship} title="No shipments assigned to you" /> : <EmptyState title="No shipments match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
    </>
  )
}
