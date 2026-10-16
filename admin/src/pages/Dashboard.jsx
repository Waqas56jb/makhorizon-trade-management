import { useMemo, useState } from 'react'
import { Boxes, ChevronRight, ClipboardList, FilePlus2, Plus, Ship, TriangleAlert, Users, Wallet, Banknote } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CountBarChart, IncomeExpenseChart } from '../components/charts/Charts'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Card, CardHeader, StatCard } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import useFormat from '../hooks/useFormat'
import { monthlyIncomeExpense, ordersByStatus, upcomingDeadlines } from '../lib/analytics'
import { financeSummary, invoiceStatus, stockStatus } from '../lib/calc'
import { recentMonths, relativeDays } from '../lib/dates'
import { useAppState } from '../lib/store'
import { cn } from '../lib/utils'

const RANGES = [
  { value: 3, label: 'Last 3 months' },
  { value: 6, label: 'Last 6 months' },
  { value: 12, label: 'Last 12 months' },
]

export default function Dashboard() {
  const s = useAppState()
  const f = useFormat()
  const [months, setMonths] = useState(6)

  const data = useMemo(() => {
    const summary = financeSummary(s)
    const overdue = s.invoices.filter((i) => invoiceStatus(i, s.payments) === 'Overdue')
    const lowStock = s.inventory.filter((i) => stockStatus(i) !== 'In Stock')
    return {
      summary,
      overdue,
      lowStock,
      activeClients: s.clients.filter((c) => c.status === 'Active').length,
      activeOrders: s.orders.filter((o) => ['Confirmed', 'Processing'].includes(o.status)).length,
      draftOrders: s.orders.filter((o) => o.status === 'Draft').length,
      inProgress: s.shipments.filter((x) => ['Ready for Dispatch', 'In Transit', 'Delayed'].includes(x.status)),
      delayed: s.shipments.filter((x) => x.status === 'Delayed').length,
      deadlines: upcomingDeadlines(s, 30),
      byStatus: ordersByStatus(s.orders),
    }
  }, [s])

  const monthly = useMemo(() => monthlyIncomeExpense(s, recentMonths(months)), [s, months])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Overview of ${s.settings.company.name} operations. All figures are calculated from the fictional demo records.`}
        actions={
          <>
            <ButtonLink to="/quotations/new" icon={FilePlus2}>
              New quotation
            </ButtonLink>
            <ButtonLink to="/orders?new=1" variant="primary" icon={Plus}>
              New order
            </ButtonLink>
          </>
        }
      />

      {(data.overdue.length > 0 || data.delayed > 0) && (
        <div role="status" className="mb-5 flex flex-col gap-2 rounded-xl border border-danger/25 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-sm text-ink">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            <span>
              <strong>Needs attention:</strong>{' '}
              {[data.overdue.length && `${data.overdue.length} overdue invoice${data.overdue.length > 1 ? 's' : ''}`, data.delayed && `${data.delayed} delayed shipment${data.delayed > 1 ? 's' : ''}`].filter(Boolean).join(' and ')}.
            </span>
          </p>
          <div className="flex gap-2">
            {data.overdue.length > 0 && (
              <ButtonLink to="/finances?tab=invoices&status=Overdue" size="sm">
                View invoices
              </ButtonLink>
            )}
            {data.delayed > 0 && (
              <ButtonLink to="/shipments?status=Delayed" size="sm">
                View shipments
              </ButtonLink>
            )}
          </div>
        </div>
      )}

      <section aria-label="Key figures" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard LinkComp={Link} to="/clients" label="Total clients" value={s.clients.length} hint={`${data.activeClients} active`} icon={Users} />
        <StatCard LinkComp={Link} to="/orders?status=active" label="Active orders" value={data.activeOrders} hint={`Confirmed or processing · ${data.draftOrders} draft`} icon={ClipboardList} />
        <StatCard LinkComp={Link} to="/shipments?status=active" label="Shipments in progress" value={data.inProgress.length} hint={data.delayed ? `${data.delayed} delayed` : 'None delayed'} icon={Ship} tone={data.delayed ? 'danger' : 'navy'} />
        <StatCard LinkComp={Link} to="/finances?tab=invoices" label="Outstanding receivables" value={f.money(data.summary.receivables, f.primary)} hint={`${data.overdue.length} invoice${data.overdue.length === 1 ? '' : 's'} overdue`} icon={Wallet} tone={data.overdue.length ? 'warning' : 'navy'} />
        <StatCard LinkComp={Link} to="/finances?tab=records" label="Recorded income" value={f.money(data.summary.income, f.primary)} hint="All received income records" icon={Banknote} tone="success" />
        <StatCard LinkComp={Link} to="/inventory?stock=attention" label="Low / out-of-stock items" value={data.lowStock.length} hint={`of ${s.inventory.length} inventory items`} icon={Boxes} tone={data.lowStock.length ? 'warning' : 'navy'} />
      </section>
      {f.primary === 'DJF' && <p className="mt-2 text-xs text-muted">USD and EUR amounts are converted to DJF at illustrative fixed rates set in Settings — not live exchange rates.</p>}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Income vs expenses"
            description={`Recorded per month in ${f.primary}. Pending records excluded.`}
            actions={
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))} aria-label="Chart period" className="field-control h-8 min-h-8 w-auto py-1 text-xs">
                {RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            }
          />
          <div className="p-5">
            <IncomeExpenseChart data={monthly} currency={f.primary} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Orders by status" description={`${s.orders.length} orders in total`} actions={<Link to="/orders" className="text-xs font-semibold text-navy hover:underline">All orders</Link>} />
          <div className="p-5">
            <CountBarChart data={data.byStatus} label="Orders by status" />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upcoming deadlines" description="Payments due, expected arrivals and quotation expiries in the next 30 days, plus anything overdue." />
          {data.deadlines.length === 0 ? (
            <EmptyState title="No upcoming deadlines" message="Nothing is due in the next 30 days." />
          ) : (
            <ul className="divide-y divide-line">
              {data.deadlines.slice(0, 8).map((d) => (
                <li key={d.id}>
                  <Link to={d.to} className="flex items-center gap-4 px-5 py-3 hover:bg-[#fafbfc]">
                    <div className={cn('w-16 shrink-0 text-center', d.overdue ? 'text-danger' : 'text-ink')}>
                      <p className="num text-sm font-semibold">{f.date(d.date).replace(/ \d{4}$/, '')}</p>
                      <p className="text-[0.68rem] text-muted">{relativeDays(d.date)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-xs text-muted">
                        {d.kind}
                        {d.overdue && <Badge tone="danger">Overdue</Badge>}
                      </p>
                      <p className="truncate text-sm font-medium">{d.title}</p>
                    </div>
                    {d.amount !== undefined && <span className="num hidden shrink-0 text-sm font-medium sm:block">{f.money(d.amount, d.currency)}</span>}
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent activity" description="Latest changes. Seeded entries are labelled as simulated." />
          {s.activity.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <ul className="divide-y divide-line">
              {s.activity.slice(0, 8).map((a) => {
                const body = (
                  <>
                    <span className="num w-28 shrink-0 text-xs text-muted">{f.dateTime(a.at)}</span>
                    <span className="min-w-0 flex-1 text-sm">{a.message}</span>
                    {a.simulated && <Badge>Simulated</Badge>}
                  </>
                )
                return (
                  <li key={a.id}>
                    {a.link ? (
                      <Link to={a.link} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                        {body}
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-5 py-3">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      {data.lowStock.length > 0 && (
        <Card className="mt-5">
          <CardHeader title="Low-stock warning" description="Items at or below their minimum stock level." actions={<Link to="/inventory?stock=attention" className="text-xs font-semibold text-navy hover:underline">View inventory</Link>} />
          <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {data.lowStock.map((i) => (
              <li key={i.id}>
                <Link to={`/inventory/${i.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{i.name}</span>
                    <span className="num block text-xs text-muted">
                      {i.quantity} {i.unit} · min {i.minStock}
                    </span>
                  </span>
                  <Badge tone={stockStatus(i) === 'Out of Stock' ? 'danger' : 'warning'}>{stockStatus(i)}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
