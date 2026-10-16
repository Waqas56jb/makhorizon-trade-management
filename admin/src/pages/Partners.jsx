import { useMemo, useState } from 'react'
import { Download, Handshake, Plus } from 'lucide-react'
import { PartnerFormModal } from '../components/forms/ContactForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { partnerStatuses, partnerTypes } from '../data/partners'
import useConfirmAction from '../hooks/useConfirmAction'
import useListState from '../hooks/useListState'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { partnerService } from '../services/contactServices'

export default function Partners() {
  const s = useAppState()
  const [form, setForm] = useState({ open: false, partner: null })
  const countries = useMemo(() => [...new Set(s.partners.map((c) => c.country))].sort(), [s.partners])
  const list = useListState(s.partners, (r) => [r.company, r.contact, r.email, r.country, r.type], {
    status: (r, v) => r.status === v,
    type: (r, v) => r.type === v,
    country: (r, v) => r.country === v,
  })

  const del = useConfirmAction({
    action: (p) => partnerService.remove(p.id),
    title: 'Delete partner?',
    message: (p) => (
      <>
        <strong>{p.company}</strong> and its opportunity notes will be permanently removed from the demo data.
      </>
    ),
    success: (p) => `${p.company} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-partners-${todayISO()}.csv`, list.filtered, [
      { header: 'Partner ID', value: (r) => r.id },
      { header: 'Company', value: (r) => r.company },
      { header: 'Contact', value: (r) => r.contact },
      { header: 'Type', value: (r) => r.type },
      { header: 'Country', value: (r) => r.country },
      { header: 'Email', value: (r) => r.email },
      { header: 'Phone', value: (r) => r.phone },
      { header: 'Status', value: (r) => r.status },
    ])

  const columns = [
    { key: 'company', header: 'Partner', mobile: 'title', sort: (r) => r.company, cell: (r) => <CellLink to={`/partners/${r.id}`}>{r.company}</CellLink> },
    { key: 'contact', header: 'Contact person', mobile: 'subtitle', sort: (r) => r.contact },
    { key: 'country', header: 'Country', mobile: true, sort: (r) => r.country },
    { key: 'type', header: 'Type', mobile: true, sort: (r) => r.type },
    { key: 'email', header: 'Email', cell: (r) => <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a> },
    { key: 'phone', header: 'Phone', className: 'whitespace-nowrap', cell: (r) => r.phone || <span className="text-muted">—</span> },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Partners"
        description="Logistics partners, distributors, buyers and partnership inquiries."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, partner: null })}>
              Add partner
            </Button>
          </>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search company, contact, country" label="Search partners" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={partnerStatuses} />
          <FilterSelect label="Type" value={list.filters.type ?? ''} onChange={(v) => list.setFilter('type', v)} options={partnerTypes} />
          <FilterSelect label="Country" value={list.filters.country ?? ''} onChange={(v) => list.setFilter('country', v)} options={countries} />
        </FilterBar>
        <DataTable
          caption="Partners"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'company', dir: 'asc' }}
          actions={(r) => <RowActions label={r.company} viewTo={`/partners/${r.id}`} onEdit={() => setForm({ open: true, partner: r })} onDelete={() => del.ask(r)} />}
          empty={s.partners.length === 0 ? <EmptyState icon={Handshake} title="No partners yet" /> : <EmptyState title="No partners match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <PartnerFormModal open={form.open} partner={form.partner} onClose={() => setForm({ open: false, partner: null })} />
      {del.dialog}
    </>
  )
}
