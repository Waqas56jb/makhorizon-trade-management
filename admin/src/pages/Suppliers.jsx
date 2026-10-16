import { useMemo, useState } from 'react'
import { Download, Factory, Plus } from 'lucide-react'
import { SupplierFormModal } from '../components/forms/ContactForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { supplierCategories } from '../data/suppliers'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import { supplierPayable } from '../lib/calc'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { supplierService } from '../services/contactServices'

export default function Suppliers() {
  const s = useAppState()
  const f = useFormat()
  const [form, setForm] = useState({ open: false, supplier: null })

  const rows = useMemo(() => s.suppliers.map((x) => ({ ...x, payable: supplierPayable(x.id, s) })), [s])
  const countries = useMemo(() => [...new Set(s.suppliers.map((c) => c.country))].sort(), [s.suppliers])
  const list = useListState(rows, (r) => [r.company, r.contactName, r.email, r.country, r.category], {
    status: (r, v) => r.status === v,
    category: (r, v) => r.category === v,
    country: (r, v) => r.country === v,
  })

  const del = useConfirmAction({
    action: (x) => supplierService.remove(x.id),
    title: 'Delete supplier?',
    message: (x) => (
      <>
        <strong>{x.company}</strong> will be permanently removed. Suppliers linked to inventory or financial records cannot be deleted.
      </>
    ),
    success: (x) => `${x.company} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-suppliers-${todayISO()}.csv`, list.filtered, [
      { header: 'Supplier ID', value: (r) => r.id },
      { header: 'Company', value: (r) => r.company },
      { header: 'Contact', value: (r) => r.contactName },
      { header: 'Email', value: (r) => r.email },
      { header: 'Phone', value: (r) => r.phone },
      { header: 'Country', value: (r) => r.country },
      { header: 'Category', value: (r) => r.category },
      { header: `Payable (${f.primary})`, value: (r) => Math.round(r.payable) },
      { header: 'Status', value: (r) => r.status },
    ])

  const columns = [
    { key: 'company', header: 'Supplier', mobile: 'title', sort: (r) => r.company, cell: (r) => <CellLink to={`/suppliers/${r.id}`} sub={r.contactName}>{r.company}</CellLink> },
    { key: 'category', header: 'Category', mobile: 'subtitle', sort: (r) => r.category },
    { key: 'country', header: 'Country', mobile: true, sort: (r) => r.country },
    { key: 'email', header: 'Email', cell: (r) => <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a> },
    { key: 'phone', header: 'Phone', className: 'whitespace-nowrap', cell: (r) => r.phone || <span className="text-muted">—</span> },
    { key: 'payable', header: 'Payable', align: 'right', mobile: true, sort: (r) => r.payable, cell: (r) => (r.payable > 0 ? f.money(r.payable, f.primary) : <span className="text-muted">—</span>) },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Suppliers of goods and services. Payables come from pending expense records."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, supplier: null })}>
              Add supplier
            </Button>
          </>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search company, contact, email" label="Search suppliers" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={['Active', 'Inactive']} />
          <FilterSelect label="Category" value={list.filters.category ?? ''} onChange={(v) => list.setFilter('category', v)} options={supplierCategories} />
          <FilterSelect label="Country" value={list.filters.country ?? ''} onChange={(v) => list.setFilter('country', v)} options={countries} />
        </FilterBar>
        <DataTable
          caption="Suppliers"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'company', dir: 'asc' }}
          actions={(r) => <RowActions label={r.company} viewTo={`/suppliers/${r.id}`} onEdit={() => setForm({ open: true, supplier: r })} onDelete={() => del.ask(r)} />}
          empty={s.suppliers.length === 0 ? <EmptyState icon={Factory} title="No suppliers yet" /> : <EmptyState title="No suppliers match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <SupplierFormModal open={form.open} supplier={form.supplier} onClose={() => setForm({ open: false, supplier: null })} />
      {del.dialog}
    </>
  )
}
