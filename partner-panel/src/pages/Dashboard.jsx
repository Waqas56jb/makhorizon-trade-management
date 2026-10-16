import { ArrowRight, ChevronRight, ClipboardList, FilePlus2, FileText, FolderUp, Inbox, ListChecks, Search, Ship } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import KpiCard from '../components/ui/KpiCard'
import { EmptyState } from '../components/ui/States'
import { ActivityTimeline } from '../components/ui/Timelines'
import usePageTitle from '../hooks/usePageTitle'
import usePartnerData from '../hooks/usePartnerData'
import { formatCurrency, formatDate, formatDateTime } from '../lib/format'
import { orderTotal } from '../lib/quotation'
import { lastMessage } from '../lib/selectors'
import { cn } from '../lib/utils'

const QUICK_ACTIONS = [
  { to: '/opportunities', label: 'Browse Opportunities', icon: Search },
  { to: '/quotations/new', label: 'Create Quotation', icon: FilePlus2 },
  { to: '/orders', label: 'View Orders', icon: ClipboardList },
  { to: '/documents?upload=1', label: 'Upload Document', icon: FolderUp },
]

export default function Dashboard() {
  usePageTitle('Overview')
  const data = usePartnerData()
  const first = data.user?.name.split(' ')[0] ?? ''
  const { kpis } = data
  const activeShipments = data.shipments.filter((s) => s.status !== 'Delivered')

  const orderColumns = [
    { key: 'id', header: 'Order ID', mobile: 'title', cell: (o) => <Link to={`/orders/${o.id}`} className="font-medium hover:text-gold-deep hover:underline">{o.id}</Link>, className: 'whitespace-nowrap' },
    { key: 'title', header: 'Order description', mobile: 'subtitle', cell: (o) => <span className="line-clamp-2 min-w-[6.5rem]">{o.title}</span> },
    { key: 'date', header: 'Order date', mobile: true, cell: (o) => formatDate(o.orderDate), className: 'hidden whitespace-nowrap 2xl:table-cell' },
    { key: 'value', header: 'Value', align: 'right', mobile: true, cell: (o) => formatCurrency(orderTotal(o), o.currency), className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', mobile: true, mobileFull: true, cell: (o) => <StatusBadge status={o.status} /> },
    { key: 'action', header: <span className="sr-only">Action</span>, cell: (o) => <Link to={`/orders/${o.id}`} className="text-xs font-semibold text-navy hover:underline" aria-label={`View order ${o.id}`}>View</Link>, className: 'hidden 2xl:table-cell' },
  ]

  return (
    <>
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">{data.partner?.companyName}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back, {first}</h1>
          <p className="mt-1 text-sm text-muted">Here is an overview of your partnership with MAKHORIZON.</p>
        </div>
        <ButtonLink to="/quotations/new" variant="primary" icon={FilePlus2}>
          Create quotation
        </ButtonLink>
      </section>

      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard to="/orders" label="Active Orders" value={kpis.activeOrders} hint={kpis.toConfirm ? `${kpis.toConfirm} awaiting your confirmation` : 'Orders not yet delivered'} icon={ClipboardList} />
        <KpiCard to="/quotations" label="Pending Quotations" value={kpis.pendingQuotations} hint={kpis.revisions ? `${kpis.revisions} revision requested` : 'Awaiting a decision'} icon={FileText} tone="gold" />
        <KpiCard to="/shipments" label="Active Shipments" value={kpis.activeShipments} hint={kpis.delayed ? `${kpis.delayed} delayed` : 'Not yet delivered'} icon={Ship} tone={kpis.delayed ? 'danger' : 'navy'} />
        <KpiCard to="#pending-actions" label="Open Requests" value={kpis.openRequests} hint="Requests from MAKHORIZON awaiting you" icon={ListChecks} tone={kpis.openRequests ? 'warning' : 'navy'} />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader title="Recent orders" description="Latest orders issued by MAKHORIZON" actions={<Link to="/orders" className="text-xs font-semibold text-navy hover:underline">View all orders</Link>} />
            <DataTable
              caption="Recent orders"
              columns={orderColumns}
              rows={data.orders.slice(0, 5)}
              pageSize={5}
              empty={<EmptyState icon={ClipboardList} title="No orders yet" message="Orders appear here once MAKHORIZON accepts a quotation." />}
            />
          </Card>

          <Card>
            <CardHeader title="Active shipments" description="Shipment records entered by MAKHORIZON · demo data, not live tracking" actions={<Link to="/shipments" className="text-xs font-semibold text-navy hover:underline">All shipments</Link>} />
            {activeShipments.length === 0 ? (
              <EmptyState icon={Ship} title="No active shipments" />
            ) : (
              <ul className="divide-y divide-line">
                {activeShipments.map((s) => (
                  <li key={s.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        {s.id} <StatusBadge status={s.status} />
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {s.origin} → {s.destination}
                      </p>
                    </div>
                    <p className="text-xs text-muted sm:w-36 sm:text-right">
                      <span className="block text-[0.68rem] uppercase tracking-wide">Est. arrival</span>
                      <span className="num font-medium text-ink">{s.eta ? formatDate(s.eta) : 'Not available'}</span>
                    </p>
                    <Link to={`/shipments/${s.id}`} className="btn btn-secondary btn-sm self-start sm:self-center" aria-label={`View details for shipment ${s.id}`}>
                      View details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Recent activity" description="Updates on your quotations, orders, shipments and documents" />
            {data.activity.length === 0 ? <EmptyState title="No activity yet" /> : <ActivityTimeline items={data.activity} limit={7} />}
          </Card>
        </div>

        <div className="space-y-5">
          <Card id="pending-actions" className="scroll-mt-24">
            <CardHeader title="Pending actions" description="Items that need your attention" />
            {data.pendingActions.length === 0 ? (
              <EmptyState title="You’re all caught up" message="There is nothing waiting for you right now." />
            ) : (
              <ul className="divide-y divide-line">
                {data.pendingActions.map((a) => (
                  <li key={`${a.kind}-${a.id}`}>
                    <Link to={a.to} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                      <div className="min-w-0 flex-1">
                        <Badge tone={a.tone}>{a.kind}</Badge>
                        <p className="mt-1 truncate text-sm font-semibold">{a.label}</p>
                        <p className="truncate text-xs text-muted">{a.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Quick actions" />
            <div className="grid grid-cols-2 gap-2 p-4">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className="flex flex-col items-start gap-2 rounded-lg border border-line p-3 text-sm font-semibold transition-colors hover:border-gold hover:bg-[#fbf8f1]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent messages" description="From the MAKHORIZON coordination team" actions={<Link to="/messages" className="text-xs font-semibold text-navy hover:underline">Open messages</Link>} />
            {data.conversations.length === 0 ? (
              <EmptyState icon={Inbox} title="No messages yet" />
            ) : (
              <ul className="divide-y divide-line">
                {data.conversations.slice(0, 3).map((c) => {
                  const last = lastMessage(c)
                  return (
                    <li key={c.id}>
                      <Link to={`/messages?c=${c.id}`} className="flex items-start gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                        <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', c.unread ? 'bg-gold' : 'bg-transparent')} aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center justify-between gap-2">
                            <span className={cn('truncate text-sm', c.unread ? 'font-semibold' : 'font-medium')}>
                              {c.contact}
                              {c.unread > 0 && <span className="sr-only"> ({c.unread} unread)</span>}
                            </span>
                            <span className="num shrink-0 text-[0.68rem] text-muted">{formatDateTime(last?.at).split(' · ')[0]}</span>
                          </p>
                          <p className="truncate text-xs text-muted">
                            {last?.from === 'partner' ? 'You: ' : ''}
                            {last?.body}
                          </p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <div className="border-t border-line p-2">
              <Link to="/messages" className="btn btn-ghost btn-sm w-full">
                Go to messages
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
