import { useMemo, useState } from 'react'
import { ClipboardList, Download, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OrderFormModal } from '../components/forms/TradeForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { orderStatuses } from '../data/orders'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useLookups from '../hooks/useLookups'
import useUrlIntent from '../hooks/useUrlIntent'
import { inRange } from '../lib/analytics'
import { documentTotals } from '../lib/calc'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { orderService } from '../services/tradeServices'

const STATUS_OPTIONS = [{ value: 'active', label: 'Active (confirmed + processing)' }, ...orderStatuses.map((x) => ({ value: x, label: x }))]

export default function Orders() {
  const s = useAppState()
  const f = useFormat()
  const lk = useLookups()
  const { intent, params } = useUrlIntent(['new', 'quotation', 'client'])

  const [form, setForm] = useState(() => {
    if (!intent.new) return { open: false, order: null, prefill: null }
    const q = intent.quotation ? s.quotations.find((x) => x.id === intent.quotation) : null
    const prefill = q
      ? { clientId: q.clientId, quotationId: q.id, cargo: q.description, currency: q.currency, amount: documentTotals(q).total, notes: `Created from quotation ${q.number}.` }
      : intent.client
        ? { clientId: intent.client }
        : null
    return { open: true, order: null, prefill }
  })

  const rows = useMemo(
    () =>
      s.orders.map((o) => ({
        ...o,
        client: lk.clients[o.clientId]?.company ?? '—',
        shipment: s.shipments.find((x) => x.orderId === o.id),
      })),
    [s.orders, s.shipments, lk],
  )

  const list = useListState(
    rows,
    (r) => [r.number, r.client, r.cargo, r.origin, r.destination],
    {
      status: (r, v) => (v === 'active' ? ['Confirmed', 'Processing'].includes(r.status) : r.status === v),
      from: (r, v) => inRange(r.orderDate, v, ''),
      to: (r, v) => inRange(r.orderDate, '', v),
    },
    { status: params.get('status') ?? '' },
  )

  const del = useConfirmAction({
    action: (o) => orderService.remove(o.id),
    title: 'Delete order?',
    message: (o) => `${o.number} for ${o.client} will be permanently removed. Orders with shipments or invoices cannot be deleted — cancel them instead.`,
    success: (o) => `${o.number} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-orders-${todayISO()}.csv`, list.filtered, [
      { header: 'Order', value: (r) => r.number },
      { header: 'Client', value: (r) => r.client },
      { header: 'Order date', value: (r) => r.orderDate },
      { header: 'Origin', value: (r) => r.origin },
      { header: 'Destination', value: (r) => r.destination },
      { header: 'Cargo', value: (r) => r.cargo },
      { header: 'Amount', value: (r) => r.amount },
      { header: 'Currency', value: (r) => r.currency },
      { header: 'Status', value: (r) => r.status },
      { header: 'Shipment', value: (r) => r.shipment?.reference ?? '' },
    ])

  const columns = [
    { key: 'number', header: 'Order', mobile: 'title', sort: (r) => r.number, cell: (r) => <CellLink to={`/orders/${r.id}`}>{r.number}</CellLink> },
    { key: 'client', header: 'Client', mobile: 'subtitle', sort: (r) => r.client },
    { key: 'date', header: 'Date', mobile: true, sort: (r) => r.orderDate, cell: (r) => f.date(r.orderDate), className: 'whitespace-nowrap' },
    { key: 'origin', header: 'Origin', sort: (r) => r.origin },
    { key: 'destination', header: 'Destination', sort: (r) => r.destination },
    { key: 'amount', header: 'Amount', align: 'right', mobile: true, sort: (r) => r.amount, cell: (r) => f.money(r.amount, r.currency) },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'shipment',
      header: 'Shipment',
      cell: (r) =>
        r.shipment ? (
          <Link to={`/shipments/${r.shipment.id}`} className="whitespace-nowrap hover:underline">
            {r.shipment.reference}
          </Link>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Orders"
        description="Commercial transactions managed by the company, from confirmation to completion."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, order: null, prefill: null })}>
              New order
            </Button>
          </>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search order, client, cargo, route" label="Search orders" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={STATUS_OPTIONS} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Orders"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'date', dir: 'desc' }}
          actions={(r) => <RowActions label={r.number} viewTo={`/orders/${r.id}`} onEdit={() => setForm({ open: true, order: r, prefill: null })} onDelete={() => del.ask(r)} />}
          empty={s.orders.length === 0 ? <EmptyState icon={ClipboardList} title="No orders yet" /> : <EmptyState title="No orders match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <OrderFormModal open={form.open} order={form.order} prefill={form.prefill} onClose={() => setForm({ open: false, order: null, prefill: null })} />
      {del.dialog}
    </>
  )
}
