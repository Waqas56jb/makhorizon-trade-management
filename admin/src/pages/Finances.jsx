import { useMemo, useState } from 'react'
import { Banknote, Download, Lock, Plus, Receipt, Scale, Wallet, CreditCard, HandCoins } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { InvoiceFormModal, PaymentFormModal, RecordFormModal } from '../components/forms/FinanceForms'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, StatCard } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { expenseCategories, incomeCategories, invoiceStatuses } from '../data/finances'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useLookups from '../hooks/useLookups'
import { inRange, outstandingInvoices } from '../lib/analytics'
import { documentTotals, financeSummary, invoiceOutstanding, invoicePaid, invoiceStatus, toPrimary } from '../lib/calc'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { cn } from '../lib/utils'
import { financeService } from '../services/financeService'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'records', label: 'Income & expenses' },
  { id: 'invoices', label: 'Invoices' },
]

function Overview({ s, f }) {
  const sum = financeSummary(s)
  const byCategory = useMemo(() => {
    const map = {}
    s.records
      .filter((r) => r.type === 'Expense' && r.status !== 'Pending')
      .forEach((r) => {
        map[r.category] = (map[r.category] ?? 0) + toPrimary(r.amount, r.currency, s.settings)
      })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [s])
  const max = byCategory[0]?.[1] ?? 1
  const open = outstandingInvoices(s).slice(0, 6)

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Recorded income" value={f.money(sum.income, f.primary)} icon={Banknote} tone="success" hint="Received income records" />
        <StatCard label="Recorded expenses" value={f.money(sum.expenses, f.primary)} icon={CreditCard} tone="danger" hint="Paid expense records" />
        <StatCard label="Net recorded balance" value={f.money(sum.net, f.primary)} icon={Scale} hint="Income minus expenses — not audited profit" />
        <StatCard label="Outstanding receivables" value={f.money(sum.receivables, f.primary)} icon={Wallet} tone="warning" hint="Unpaid invoice balances" />
        <StatCard label="Outstanding payables" value={f.money(sum.payables, f.primary)} icon={HandCoins} tone="warning" hint="Pending expense records" />
      </div>
      <p className="mt-2 text-xs text-muted">Demo records only. Amounts in other currencies are converted at the illustrative rates in Settings. This is a record-keeping view, not an accounting or tax system.</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Expenses by category" description={`Paid expenses, ${f.primary}`} />
          {byCategory.length === 0 ? (
            <EmptyState title="No expenses recorded" />
          ) : (
            <ul className="space-y-3 p-5">
              {byCategory.map(([cat, v]) => (
                <li key={cat}>
                  <div className="flex justify-between text-sm">
                    <span>{cat}</span>
                    <span className="num font-medium">{f.money(v, f.primary)}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-canvas" aria-hidden="true">
                    <div className="h-full rounded-full bg-[#b8862b]" style={{ width: `${Math.max(2, (v / max) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Outstanding invoices" description="Sorted by due date" actions={<Link to="/finances?tab=invoices" className="text-xs font-semibold text-navy hover:underline">All invoices</Link>} />
          {open.length === 0 ? (
            <EmptyState title="Nothing outstanding" message="All issued invoices are fully paid." />
          ) : (
            <ul className="divide-y divide-line">
              {open.map(({ inv, status, outstanding }) => (
                <li key={inv.id}>
                  <Link to={`/finances/invoices/${inv.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{inv.number}</span>
                      <span className="block truncate text-xs text-muted">
                        {s.clients.find((c) => c.id === inv.clientId)?.company} · due {f.date(inv.dueDate)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="num text-sm font-medium">{f.money(outstanding, inv.currency)}</span>
                      <StatusBadge status={status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

function Records({ s, f, lk, initialNew }) {
  const [modal, setModal] = useState(initialNew ? { open: true, record: null, prefill: initialNew } : { open: false, record: null, prefill: null })
  const rows = useMemo(() => s.records.map((r) => ({ ...r, party: r.type === 'Income' ? lk.clients[r.clientId]?.company : lk.suppliers[r.supplierId]?.company })), [s.records, lk])
  const list = useListState(rows, (r) => [r.description, r.category, r.reference, r.party], {
    type: (r, v) => r.type === v,
    category: (r, v) => r.category === v,
    status: (r, v) => r.status === v,
    from: (r, v) => inRange(r.date, v, ''),
    to: (r, v) => inRange(r.date, '', v),
  })
  const totals = useMemo(() => financeSummary(s, list.filtered), [s, list.filtered])

  const del = useConfirmAction({
    action: (r) => financeService.removeRecord(r.id),
    title: 'Delete record?',
    message: (r) => `${r.type} record “${r.description}” (${f.money(r.amount, r.currency)}) will be permanently removed.`,
    success: 'Record deleted.',
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-income-expenses-${todayISO()}.csv`, list.filtered, [
      { header: 'Date', value: (r) => r.date },
      { header: 'Type', value: (r) => r.type },
      { header: 'Category', value: (r) => r.category },
      { header: 'Description', value: (r) => r.description },
      { header: 'Client / supplier', value: (r) => r.party ?? '' },
      { header: 'Amount', value: (r) => r.amount },
      { header: 'Currency', value: (r) => r.currency },
      { header: 'Payment method', value: (r) => r.method },
      { header: 'Reference', value: (r) => r.reference },
      { header: 'Status', value: (r) => r.status },
    ])

  const columns = [
    { key: 'date', header: 'Date', mobile: true, sort: (r) => r.date, cell: (r) => f.date(r.date), className: 'whitespace-nowrap' },
    { key: 'type', header: 'Type', mobile: true, sort: (r) => r.type, cell: (r) => <StatusBadge status={r.type} /> },
    { key: 'category', header: 'Category', sort: (r) => r.category },
    {
      key: 'description',
      header: 'Description',
      mobile: 'title',
      sort: (r) => r.description,
      cell: (r) => (
        <div className="min-w-0">
          <span className="font-medium">{r.description}</span>
          {r.paymentId && (
            <Badge tone="neutral" className="ml-2">
              <Lock className="h-3 w-3" aria-hidden="true" />
              From invoice
            </Badge>
          )}
        </div>
      ),
    },
    { key: 'party', header: 'Client / supplier', mobile: 'subtitle', sort: (r) => r.party ?? '', cell: (r) => r.party ?? <span className="text-muted">—</span> },
    { key: 'amount', header: 'Amount', align: 'right', mobile: true, sort: (r) => toPrimary(r.amount, r.currency, s.settings), cell: (r) => <span className={r.type === 'Expense' ? 'text-danger' : 'text-success'}>{r.type === 'Expense' ? '−' : '+'}{f.money(r.amount, r.currency)}</span> },
    { key: 'method', header: 'Method', cell: (r) => r.method || '—' },
    { key: 'reference', header: 'Reference', cell: (r) => r.reference || '—' },
    { key: 'status', header: 'Status', sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ]

  const categories = list.filters.type === 'Income' ? incomeCategories : list.filters.type === 'Expense' ? expenseCategories : [...incomeCategories, ...expenseCategories]

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
          Export CSV
        </Button>
        <Button variant="primary" icon={Plus} onClick={() => setModal({ open: true, record: null, prefill: null })}>
          Add record
        </Button>
      </div>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search description, reference, party" label="Search records" />
          <FilterSelect label="Type" value={list.filters.type ?? ''} onChange={(v) => { list.setFilter('type', v); list.setFilter('category', '') }} options={['Income', 'Expense']} />
          <FilterSelect label="Category" value={list.filters.category ?? ''} onChange={(v) => list.setFilter('category', v)} options={categories} />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={['Received', 'Paid', 'Pending']} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <dl className="num grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-4" aria-label="Totals for filtered records">
          {[
            ['Income (filtered)', totals.income, 'text-success'],
            ['Expenses (filtered)', totals.expenses, 'text-danger'],
            ['Net (filtered)', totals.net, 'text-ink'],
            ['Pending expenses', totals.payables, 'text-warning'],
          ].map(([k, v, c]) => (
            <div key={k} className="bg-[#fafbfc] px-4 py-3">
              <dt className="text-[0.7rem] uppercase tracking-wide text-muted">{k}</dt>
              <dd className={cn('text-sm font-semibold', c)}>{f.money(v, f.primary)}</dd>
            </div>
          ))}
        </dl>
        <DataTable
          caption="Income and expense records"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'date', dir: 'desc' }}
          actions={(r) =>
            r.paymentId ? (
              <Link to={`/finances/invoices/${s.payments.find((p) => p.id === r.paymentId)?.invoiceId}`} className="btn btn-ghost btn-sm whitespace-nowrap" aria-label={`Open invoice for ${r.description}`}>
                <Receipt aria-hidden="true" />
                Invoice
              </Link>
            ) : (
              <RowActions label={r.description} onEdit={() => setModal({ open: true, record: r, prefill: null })} onDelete={() => del.ask(r)} />
            )
          }
          empty={<EmptyState title="No records match your filters" action={list.active && <Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <RecordFormModal open={modal.open} record={modal.record} prefill={modal.prefill} onClose={() => setModal({ open: false, record: null, prefill: null })} />
      {del.dialog}
    </>
  )
}

function Invoices({ s, f, lk, initialStatus }) {
  const [modal, setModal] = useState({ type: null, invoice: null })
  const rows = useMemo(
    () =>
      s.invoices.map((i) => ({
        ...i,
        client: lk.clients[i.clientId]?.company ?? '—',
        order: lk.orders[i.orderId],
        total: documentTotals(i).total,
        paid: invoicePaid(i, s.payments),
        outstanding: invoiceOutstanding(i, s.payments),
        effective: invoiceStatus(i, s.payments),
      })),
    [s.invoices, s.payments, lk],
  )
  const list = useListState(
    rows,
    (r) => [r.number, r.client, r.order?.number],
    {
      status: (r, v) => r.effective === v,
      client: (r, v) => r.clientId === v,
      from: (r, v) => inRange(r.issueDate, v, ''),
      to: (r, v) => inRange(r.issueDate, '', v),
    },
    { status: initialStatus ?? '' },
  )

  const del = useConfirmAction({
    action: (i) => financeService.removeInvoice(i.id),
    title: 'Delete invoice?',
    message: (i) => `${i.number} for ${i.client} will be permanently removed. Invoices with payments cannot be deleted — cancel them instead.`,
    success: (i) => `${i.number} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-invoices-${todayISO()}.csv`, list.filtered, [
      { header: 'Invoice', value: (r) => r.number },
      { header: 'Client', value: (r) => r.client },
      { header: 'Order', value: (r) => r.order?.number ?? '' },
      { header: 'Issue date', value: (r) => r.issueDate },
      { header: 'Due date', value: (r) => r.dueDate },
      { header: 'Currency', value: (r) => r.currency },
      { header: 'Total', value: (r) => r.total },
      { header: 'Paid', value: (r) => r.paid },
      { header: 'Outstanding', value: (r) => r.outstanding },
      { header: 'Status', value: (r) => r.effective },
    ])

  const columns = [
    { key: 'number', header: 'Invoice', mobile: 'title', sort: (r) => r.number, cell: (r) => <CellLink to={`/finances/invoices/${r.id}`}>{r.number}</CellLink> },
    { key: 'client', header: 'Client', mobile: 'subtitle', sort: (r) => r.client },
    { key: 'order', header: 'Order', cell: (r) => (r.order ? <Link to={`/orders/${r.order.id}`} className="whitespace-nowrap hover:underline">{r.order.number}</Link> : <span className="text-muted">—</span>) },
    { key: 'issue', header: 'Issued', sort: (r) => r.issueDate, cell: (r) => f.date(r.issueDate), className: 'whitespace-nowrap' },
    { key: 'due', header: 'Due', mobile: true, sort: (r) => r.dueDate, cell: (r) => f.date(r.dueDate), className: 'whitespace-nowrap' },
    { key: 'total', header: 'Total', align: 'right', sort: (r) => toPrimary(r.total, r.currency, s.settings), cell: (r) => f.money(r.total, r.currency) },
    { key: 'outstanding', header: 'Outstanding', align: 'right', mobile: true, sort: (r) => toPrimary(r.outstanding, r.currency, s.settings), cell: (r) => (r.outstanding > 0 ? f.money(r.outstanding, r.currency) : <span className="text-muted">—</span>) },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.effective, cell: (r) => <StatusBadge status={r.effective} /> },
  ]

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
          Export CSV
        </Button>
        <Button variant="primary" icon={Plus} onClick={() => setModal({ type: 'invoice', invoice: null })}>
          Create invoice
        </Button>
      </div>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search invoice, client, order" label="Search invoices" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={invoiceStatuses} />
          <FilterSelect label="Client" value={list.filters.client ?? ''} onChange={(v) => list.setFilter('client', v)} options={s.clients.map((c) => ({ value: c.id, label: c.company }))} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Invoices"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'due', dir: 'desc' }}
          actions={(r) => (
            <>
              {r.outstanding > 0 && (
                <button type="button" onClick={() => setModal({ type: 'payment', invoice: r })} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`Record payment for ${r.number}`} title="Record payment">
                  <Banknote aria-hidden="true" />
                </button>
              )}
              <RowActions label={r.number} viewTo={`/finances/invoices/${r.id}`} onEdit={() => setModal({ type: 'invoice', invoice: r })} onDelete={() => del.ask(r)} />
            </>
          )}
          empty={<EmptyState title="No invoices match your filters" action={list.active && <Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <InvoiceFormModal open={modal.type === 'invoice'} invoice={modal.invoice ? s.invoices.find((i) => i.id === modal.invoice.id) : null} onClose={() => setModal({ type: null, invoice: null })} />
      <PaymentFormModal open={modal.type === 'payment'} invoice={modal.invoice ? s.invoices.find((i) => i.id === modal.invoice.id) : null} onClose={() => setModal({ type: null, invoice: null })} />
      {del.dialog}
    </>
  )
}

export default function Finances() {
  const s = useAppState()
  const f = useFormat()
  const lk = useLookups()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview'
  // One-off intents from other pages (e.g. supplier "record purchase").
  const [intent] = useState(() => ({ status: params.get('status'), newRecord: params.get('new') === 'expense' || params.get('new') === 'income' ? { type: params.get('new') === 'income' ? 'Income' : 'Expense', status: params.get('new') === 'income' ? 'Received' : 'Paid', supplierId: params.get('supplier') ?? '' } : null }))

  const selectTab = (id) => setParams(id === 'overview' ? {} : { tab: id }, { replace: true })

  return (
    <>
      <PageHeader title="Finances" description="Income, expenses, invoices and payments recorded in the demo data." />
      <div role="tablist" aria-label="Finance sections" className="no-print mb-5 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => selectTab(t.id)}
            onKeyDown={(e) => {
              const i = TABS.findIndex((x) => x.id === tab)
              if (e.key === 'ArrowRight') selectTab(TABS[(i + 1) % TABS.length].id)
              if (e.key === 'ArrowLeft') selectTab(TABS[(i - 1 + TABS.length) % TABS.length].id)
            }}
            tabIndex={tab === t.id ? 0 : -1}
            className={cn('-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold', tab === t.id ? 'border-gold text-ink' : 'border-transparent text-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'overview' && <Overview s={s} f={f} />}
        {tab === 'records' && <Records s={s} f={f} lk={lk} initialNew={intent.newRecord} />}
        {tab === 'invoices' && <Invoices s={s} f={f} lk={lk} initialStatus={intent.status} />}
      </div>
    </>
  )
}
