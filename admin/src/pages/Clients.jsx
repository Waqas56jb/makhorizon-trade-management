import { useMemo, useState } from 'react'
import { Download, Plus, Users } from 'lucide-react'
import { ClientFormModal } from '../components/forms/ContactForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { clientTypes } from '../data/clients'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import { clientOutstanding } from '../lib/calc'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { clientService } from '../services/contactServices'

export default function Clients() {
  const s = useAppState()
  const f = useFormat()
  const [form, setForm] = useState({ open: false, client: null })

  const rows = useMemo(
    () =>
      s.clients.map((c) => ({
        ...c,
        orderCount: s.orders.filter((o) => o.clientId === c.id).length,
        outstanding: clientOutstanding(c.id, s),
      })),
    [s],
  )
  const countries = useMemo(() => [...new Set(s.clients.map((c) => c.country))].sort(), [s.clients])

  const list = useListState(rows, (r) => [r.name, r.company, r.email, r.country], {
    status: (r, v) => r.status === v,
    country: (r, v) => r.country === v,
    type: (r, v) => r.type === v,
  })

  const del = useConfirmAction({
    action: (c) => clientService.remove(c.id),
    title: 'Delete client?',
    message: (c) => (
      <>
        <strong>{c.company}</strong> ({c.name}) will be permanently removed from the demo data. Clients with orders, quotations or invoices cannot be deleted.
      </>
    ),
    success: (c) => `${c.company} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-clients-${todayISO()}.csv`, list.filtered, [
      { header: 'Client ID', value: (r) => r.id },
      { header: 'Name', value: (r) => r.name },
      { header: 'Company', value: (r) => r.company },
      { header: 'Email', value: (r) => r.email },
      { header: 'Phone', value: (r) => r.phone },
      { header: 'Country', value: (r) => r.country },
      { header: 'Type', value: (r) => r.type },
      { header: 'Orders', value: (r) => r.orderCount },
      { header: `Outstanding (${f.primary})`, value: (r) => Math.round(r.outstanding) },
      { header: 'Status', value: (r) => r.status },
    ])

  const columns = [
    { key: 'name', header: 'Client', mobile: 'title', sort: (r) => r.name, cell: (r) => <CellLink to={`/clients/${r.id}`} sub={r.type}>{r.name}</CellLink> },
    { key: 'company', header: 'Company', mobile: 'subtitle', sort: (r) => r.company, cell: (r) => r.company },
    { key: 'email', header: 'Email', cell: (r) => <a href={`mailto:${r.email}`} className="text-ink hover:underline">{r.email}</a> },
    { key: 'country', header: 'Country', mobile: true, sort: (r) => r.country },
    { key: 'phone', header: 'Phone', cell: (r) => r.phone || <span className="text-muted">—</span>, className: 'whitespace-nowrap' },
    { key: 'orders', header: 'Orders', align: 'right', mobile: true, sort: (r) => r.orderCount, cell: (r) => r.orderCount },
    { key: 'outstanding', header: 'Outstanding', align: 'right', mobile: true, sort: (r) => r.outstanding, cell: (r) => (r.outstanding > 0 ? f.money(r.outstanding, f.primary) : <span className="text-muted">—</span>) },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Clients"
        description="Businesses the company works with. Outstanding balances come from unpaid invoices."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, client: null })}>
              Add client
            </Button>
          </>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search name, company, email, country" label="Search clients" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={['Active', 'Inactive']} />
          <FilterSelect label="Country" value={list.filters.country ?? ''} onChange={(v) => list.setFilter('country', v)} options={countries} />
          <FilterSelect label="Type" value={list.filters.type ?? ''} onChange={(v) => list.setFilter('type', v)} options={clientTypes} />
        </FilterBar>
        <DataTable
          caption="Clients"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'name', dir: 'asc' }}
          actions={(r) => <RowActions label={r.company} viewTo={`/clients/${r.id}`} onEdit={() => setForm({ open: true, client: r })} onDelete={() => del.ask(r)} />}
          empty={
            s.clients.length === 0 ? (
              <EmptyState icon={Users} title="No clients yet" message="Add your first client to start creating quotations and orders." action={<Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, client: null })}>Add client</Button>} />
            ) : (
              <EmptyState title="No clients match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />
            )
          }
        />
      </Card>
      <ClientFormModal open={form.open} client={form.client} onClose={() => setForm({ open: false, client: null })} />
      {del.dialog}
    </>
  )
}
