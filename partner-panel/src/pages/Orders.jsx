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
import { currencies } from '../data/quotations'
import useListState from '../hooks/useListState'
import usePartnerData from '../hooks/usePartnerData'
import { isPast } from '../lib/dates'
import { formatCurrency, formatDate } from '../lib/format'
import { orderTotal } from '../lib/quotation'

const OPEN = ['Awaiting Confirmation', 'Confirmed', 'In Progress', 'Ready for Dispatch', 'Dispatched', 'On Hold']

export default function Orders() {
  const data = usePartnerData()
  const rows = useMemo(() => data.orders.map((o) => ({ ...o, total: orderTotal(o) })), [data])
  const list = useListState(rows, (o) => [o.id, o.title, o.quotationId], {
    status: (o, v) => o.status === v,
    currency: (o, v) => o.currency === v,
    from: (o, v) => o.orderDate >= v,
    to: (o, v) => o.orderDate <= v,
  })

  const columns = [
    { key: 'id', header: 'Order reference', mobile: 'title', sort: (o) => o.id, cell: (o) => <Link to={`/orders/${o.id}`} className="font-medium hover:text-gold-deep hover:underline">{o.id}</Link>, className: 'whitespace-nowrap' },
    { key: 'title', header: 'Order title', mobile: 'subtitle', sort: (o) => o.title, cell: (o) => <span className="block max-w-[13rem] truncate">{o.title}</span> },
    { key: 'date', header: 'Order date', mobile: true, sort: (o) => o.orderDate, cell: (o) => formatDate(o.orderDate), className: 'whitespace-nowrap', hideBelow: '2xl' },
    { key: 'quote', header: 'Related quotation', sort: (o) => o.quotationId || null, cell: (o) => (o.quotationId ? <Link to={`/quotations/${o.quotationId}`} className="hover:underline">{o.quotationId}</Link> : <span className="text-muted">—</span>), className: 'whitespace-nowrap', hideBelow: '2xl' },
    { key: 'amount', header: 'Amount', align: 'right', mobile: true, sort: (o) => o.total, cell: (o) => formatCurrency(o.total, o.currency), className: 'whitespace-nowrap' },
    {
      key: 'deadline',
      header: 'Delivery deadline',
      mobile: true,
      sort: (o) => o.deliveryDeadline,
      cell: (o) => <span className={OPEN.includes(o.status) && isPast(o.deliveryDeadline) ? 'font-semibold text-danger' : ''}>{formatDate(o.deliveryDeadline)}</span>,
      className: 'whitespace-nowrap',
    },
    { key: 'status', header: 'Status', mobile: true, mobileFull: true, sort: (o) => o.status, cell: (o) => <StatusBadge status={o.status} /> },
  ]

  return (
    <>
      <PageHeader title="Orders" description="Orders issued or confirmed by MAKHORIZON for your company." />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search order or quotation" label="Search orders" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={orderStatuses} />
          <FilterSelect label="Currency" value={list.filters.currency ?? ''} onChange={(v) => list.setFilter('currency', v)} options={currencies} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Orders"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          cardsBelow="xl"
          initialSort={{ key: 'date', dir: 'desc' }}
          actions={(o) => (
            <Link to={`/orders/${o.id}`} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`View order ${o.id}`} title="View">
              <Eye aria-hidden="true" />
            </Link>
          )}
          empty={data.orders.length === 0 ? <EmptyState icon={ClipboardList} title="No orders yet" message="Orders appear here once MAKHORIZON accepts one of your quotations." /> : <EmptyState title="No orders match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
    </>
  )
}
