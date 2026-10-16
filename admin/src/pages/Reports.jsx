import { useMemo, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CountBarChart, IncomeExpenseChart } from '../components/charts/Charts'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, StatCard } from '../components/ui/Card'
import { DateRange } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import useFormat from '../hooks/useFormat'
import { financeSummary, invoicePaid, stockStatus, toPrimary, documentTotals } from '../lib/calc'
import { inRange, monthlyIncomeExpense, ordersByStatus, outstandingInvoices, shipmentsByStatus } from '../lib/analytics'
import { downloadCSV } from '../lib/csv'
import { addDays, todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'

function monthsBetween(from, to) {
  const out = []
  let [y, m] = from.slice(0, 7).split('-').map(Number)
  const [ty, tm] = to.slice(0, 7).split('-').map(Number)
  while ((y < ty || (y === ty && m <= tm)) && out.length < 24) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return out
}

function presetRange(id) {
  const today = todayISO()
  const y = today.slice(0, 4)
  switch (id) {
    case 'month':
      return [`${today.slice(0, 7)}-01`, today]
    case '90':
      return [addDays(today, -89), today]
    case 'year':
      return [`${y}-01-01`, today]
    default:
      return [addDays(today, -179), today]
  }
}

function CsvButton({ onClick, disabled, label }) {
  return (
    <Button size="sm" icon={Download} onClick={onClick} disabled={disabled} className="no-print" aria-label={`Export ${label} as CSV`}>
      CSV
    </Button>
  )
}

const PRESETS = [
  { id: 'month', label: 'This month' },
  { id: '90', label: 'Last 90 days' },
  { id: '180', label: 'Last 6 months' },
  { id: 'year', label: 'This year' },
]

export default function Reports() {
  const s = useAppState()
  const f = useFormat()
  const [preset, setPreset] = useState('180')
  const [[from, to], setRange] = useState(() => presetRange('180'))

  const choose = (id) => {
    setPreset(id)
    setRange(presetRange(id))
  }

  const r = useMemo(() => {
    const records = s.records.filter((x) => inRange(x.date, from, to))
    const orders = s.orders.filter((x) => inRange(x.orderDate, from, to))
    const shipments = s.shipments.filter((x) => inRange(x.departureDate, from, to))
    const summary = financeSummary(s, records)
    const monthly = from && to ? monthlyIncomeExpense(s, monthsBetween(from, to), records) : []
    const outstanding = outstandingInvoices(s)
    const lowStock = s.inventory.filter((i) => stockStatus(i) !== 'In Stock')
    const clientActivity = s.clients
      .map((c) => {
        const cOrders = orders.filter((o) => o.clientId === c.id)
        const invoiced = s.invoices
          .filter((i) => i.clientId === c.id && i.status !== 'Draft' && i.status !== 'Cancelled' && inRange(i.issueDate, from, to))
          .reduce((sum, i) => sum + toPrimary(documentTotals(i).total, i.currency, s.settings), 0)
        const paid = records.filter((x) => x.clientId === c.id && x.type === 'Income' && x.status === 'Received').reduce((sum, x) => sum + toPrimary(x.amount, x.currency, s.settings), 0)
        const owed = outstanding.filter((o) => o.inv.clientId === c.id).reduce((sum, o) => sum + toPrimary(o.outstanding, o.inv.currency, s.settings), 0)
        return { client: c, orders: cOrders.length, orderValue: cOrders.reduce((sum, o) => sum + toPrimary(o.amount, o.currency, s.settings), 0), invoiced, paid, owed }
      })
      .filter((x) => x.orders || x.invoiced || x.paid || x.owed)
      .sort((a, b) => b.orderValue - a.orderValue)
    return { records, orders, shipments, summary, monthly, outstanding, lowStock, clientActivity }
  }, [s, from, to])

  const periodLabel = from && to ? `${f.date(from)} – ${f.date(to)}` : 'All dates'
  const stamp = `${from || 'start'}_to_${to || todayISO()}`
  const clientName = (id) => s.clients.find((c) => c.id === id)?.company ?? ''

  const exports = {
    records: () =>
      downloadCSV(`makhorizon-income-expenses_${stamp}.csv`, r.records, [
        { header: 'Date', value: (x) => x.date },
        { header: 'Type', value: (x) => x.type },
        { header: 'Category', value: (x) => x.category },
        { header: 'Description', value: (x) => x.description },
        { header: 'Amount', value: (x) => x.amount },
        { header: 'Currency', value: (x) => x.currency },
        { header: `Amount (${f.primary})`, value: (x) => Math.round(toPrimary(x.amount, x.currency, s.settings)) },
        { header: 'Status', value: (x) => x.status },
        { header: 'Reference', value: (x) => x.reference },
      ]),
    outstanding: () =>
      downloadCSV(`makhorizon-outstanding-invoices_${todayISO()}.csv`, r.outstanding, [
        { header: 'Invoice', value: (x) => x.inv.number },
        { header: 'Client', value: (x) => clientName(x.inv.clientId) },
        { header: 'Due date', value: (x) => x.inv.dueDate },
        { header: 'Currency', value: (x) => x.inv.currency },
        { header: 'Total', value: (x) => documentTotals(x.inv).total },
        { header: 'Paid', value: (x) => invoicePaid(x.inv, s.payments) },
        { header: 'Outstanding', value: (x) => x.outstanding },
        { header: 'Status', value: (x) => x.status },
      ]),
    lowStock: () =>
      downloadCSV(`makhorizon-low-stock_${todayISO()}.csv`, r.lowStock, [
        { header: 'SKU', value: (x) => x.sku },
        { header: 'Item', value: (x) => x.name },
        { header: 'Quantity', value: (x) => x.quantity },
        { header: 'Unit', value: (x) => x.unit },
        { header: 'Minimum', value: (x) => x.minStock },
        { header: 'Status', value: (x) => stockStatus(x) },
      ]),
    clients: () =>
      downloadCSV(`makhorizon-client-activity_${stamp}.csv`, r.clientActivity, [
        { header: 'Client', value: (x) => x.client.company },
        { header: 'Orders in period', value: (x) => x.orders },
        { header: `Order value (${f.primary})`, value: (x) => Math.round(x.orderValue) },
        { header: `Invoiced in period (${f.primary})`, value: (x) => Math.round(x.invoiced) },
        { header: `Received in period (${f.primary})`, value: (x) => Math.round(x.paid) },
        { header: `Outstanding now (${f.primary})`, value: (x) => Math.round(x.owed) },
      ]),
  }

  return (
    <>
      <PageHeader title="Reports" description="Summaries derived from the same demo records used across the admin panel." actions={<Button icon={Printer} onClick={() => window.print()}>Print report</Button>} />

      <Card className="no-print mb-5">
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Report period" className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.id} type="button" onClick={() => choose(p.id)} aria-pressed={preset === p.id} className={`btn btn-sm ${preset === p.id ? 'btn-primary' : 'btn-secondary'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <DateRange
            from={from}
            to={to}
            onFrom={(v) => {
              setPreset('custom')
              setRange([v, to])
            }}
            onTo={(v) => {
              setPreset('custom')
              setRange([from, v])
            }}
          />
        </div>
      </Card>

      <div className="print-area space-y-5">
        <div className="hidden print:block">
          <p className="text-lg font-bold">{s.settings.company.name} — Report</p>
          <p className="text-sm">Period: {periodLabel} · Generated {f.date(todayISO())} · Demo data</p>
        </div>

        <section aria-labelledby="fin-h">
          <h2 id="fin-h" className="mb-3 text-base font-semibold">
            Income and expenses <span className="font-normal text-muted">· {periodLabel}</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Recorded income" value={f.money(r.summary.income, f.primary)} tone="success" />
            <StatCard label="Recorded expenses" value={f.money(r.summary.expenses, f.primary)} tone="danger" />
            <StatCard label="Recorded net balance" value={f.money(r.summary.net, f.primary)} hint="Not audited profit" />
          </div>
          <Card className="mt-3">
            <CardHeader title="Monthly breakdown" description={`${r.records.length} records in period · pending records excluded`} actions={<CsvButton onClick={exports.records} disabled={!r.records.length} label="income and expense records" />} />
            <div className="p-5">
              <IncomeExpenseChart data={r.monthly} currency={f.primary} height={240} />
            </div>
          </Card>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Orders by status" description={`${r.orders.length} orders dated in the period`} />
            <div className="p-5">{r.orders.length ? <CountBarChart data={ordersByStatus(r.orders)} label="Orders by status" /> : <EmptyState title="No orders in this period" />}</div>
          </Card>
          <Card>
            <CardHeader title="Shipment status summary" description={`${r.shipments.length} shipments departing in the period`} />
            <div className="p-5">{r.shipments.length ? <CountBarChart data={shipmentsByStatus(r.shipments)} label="Shipments by status" /> : <EmptyState title="No shipments in this period" />}</div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Outstanding invoices" description="Current balances (not limited to the period)" actions={<CsvButton onClick={exports.outstanding} disabled={!r.outstanding.length} label="outstanding invoices" />} />
          {r.outstanding.length === 0 ? (
            <EmptyState title="No outstanding invoices" />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <caption className="sr-only">Outstanding invoices</caption>
                <thead>
                  <tr>
                    <th scope="col">Invoice</th>
                    <th scope="col">Client</th>
                    <th scope="col">Due</th>
                    <th scope="col" className="text-right">Outstanding</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {r.outstanding.map(({ inv, outstanding, status }) => (
                    <tr key={inv.id}>
                      <td>
                        <Link to={`/finances/invoices/${inv.id}`} className="font-medium hover:underline">
                          {inv.number}
                        </Link>
                      </td>
                      <td>{clientName(inv.clientId)}</td>
                      <td className="whitespace-nowrap">{f.date(inv.dueDate)}</td>
                      <td className="num whitespace-nowrap text-right">{f.money(outstanding, inv.currency)}</td>
                      <td>
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
          <Card>
            <CardHeader title="Low-stock items" description="Current stock at or below minimum" actions={<CsvButton onClick={exports.lowStock} disabled={!r.lowStock.length} label="low-stock items" />} />
            {r.lowStock.length === 0 ? (
              <EmptyState title="All items are in stock" />
            ) : (
              <ul className="divide-y divide-line">
                {r.lowStock.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                    <Link to={`/inventory/${i.id}`} className="min-w-0 truncate hover:underline">
                      {i.name}
                    </Link>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="num text-xs text-muted">
                        {i.quantity}/{i.minStock} {i.unit}
                      </span>
                      <StatusBadge status={stockStatus(i)} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Client activity" description={`Values in ${f.primary} · ${periodLabel}`} actions={<CsvButton onClick={exports.clients} disabled={!r.clientActivity.length} label="client activity" />} />
            {r.clientActivity.length === 0 ? (
              <EmptyState title="No client activity in this period" />
            ) : (
              <div className="overflow-x-auto">
                <table className="table-base">
                  <caption className="sr-only">Client activity summary</caption>
                  <thead>
                    <tr>
                      <th scope="col">Client</th>
                      <th scope="col" className="text-right">Orders</th>
                      <th scope="col" className="text-right">Order value</th>
                      <th scope="col" className="text-right">Received</th>
                      <th scope="col" className="text-right">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.clientActivity.map((x) => (
                      <tr key={x.client.id}>
                        <td>
                          <Link to={`/clients/${x.client.id}`} className="font-medium hover:underline">
                            {x.client.company}
                          </Link>
                        </td>
                        <td className="num text-right">{x.orders}</td>
                        <td className="num whitespace-nowrap text-right">{f.money(x.orderValue, f.primary)}</td>
                        <td className="num whitespace-nowrap text-right">{f.money(x.paid, f.primary)}</td>
                        <td className="num whitespace-nowrap text-right">{x.owed ? f.money(x.owed, f.primary) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
        <p className="text-xs text-muted">All figures are calculated from fictional demo records. Foreign-currency amounts use the illustrative fixed rates in Settings.</p>
      </div>
    </>
  )
}
