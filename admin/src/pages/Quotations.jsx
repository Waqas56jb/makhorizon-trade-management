import { useMemo } from 'react'
import { Download, FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { quotationStatuses } from '../data/quotations'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useLookups from '../hooks/useLookups'
import { inRange } from '../lib/analytics'
import { documentTotals, quotationStatus } from '../lib/calc'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { quotationService } from '../services/tradeServices'

export default function Quotations() {
  const s = useAppState()
  const f = useFormat()
  const lk = useLookups()
  const navigate = useNavigate()

  const rows = useMemo(() => s.quotations.map((q) => ({ ...q, client: lk.clients[q.clientId]?.company ?? '—', total: documentTotals(q).total, effective: quotationStatus(q) })), [s.quotations, lk])
  const list = useListState(rows, (r) => [r.number, r.client, r.description], {
    status: (r, v) => r.effective === v,
    currency: (r, v) => r.currency === v,
    from: (r, v) => inRange(r.issueDate, v, ''),
    to: (r, v) => inRange(r.issueDate, '', v),
  })

  const del = useConfirmAction({
    action: (q) => quotationService.remove(q.id),
    title: 'Delete quotation?',
    message: (q) => `${q.number} for ${q.client} will be permanently removed. Quotations already converted to orders cannot be deleted.`,
    success: (q) => `${q.number} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-quotations-${todayISO()}.csv`, list.filtered, [
      { header: 'Quotation', value: (r) => r.number },
      { header: 'Client', value: (r) => r.client },
      { header: 'Issue date', value: (r) => r.issueDate },
      { header: 'Expiry date', value: (r) => r.expiryDate },
      { header: 'Description', value: (r) => r.description },
      { header: 'Total', value: (r) => r.total },
      { header: 'Currency', value: (r) => r.currency },
      { header: 'Status', value: (r) => r.effective },
    ])

  const columns = [
    { key: 'number', header: 'Quotation', mobile: 'title', sort: (r) => r.number, cell: (r) => <CellLink to={`/quotations/${r.id}`}>{r.number}</CellLink> },
    { key: 'client', header: 'Client', mobile: 'subtitle', sort: (r) => r.client },
    { key: 'issue', header: 'Issued', mobile: true, sort: (r) => r.issueDate, cell: (r) => f.date(r.issueDate), className: 'whitespace-nowrap' },
    { key: 'expiry', header: 'Expires', sort: (r) => r.expiryDate, cell: (r) => f.date(r.expiryDate), className: 'whitespace-nowrap' },
    { key: 'total', header: 'Total', align: 'right', mobile: true, sort: (r) => r.total, cell: (r) => f.money(r.total, r.currency) },
    { key: 'currency', header: 'Currency', sort: (r) => r.currency },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.effective, cell: (r) => <StatusBadge status={r.effective} /> },
  ]

  return (
    <>
      <PageHeader
        title="Quotations"
        description="Proposals for requested goods or services. Sent quotations past their expiry date show as Expired."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <ButtonLink to="/quotations/new" variant="primary" icon={Plus}>
              New quotation
            </ButtonLink>
          </>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search number, client, description" label="Search quotations" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={quotationStatuses} />
          <FilterSelect label="Currency" value={list.filters.currency ?? ''} onChange={(v) => list.setFilter('currency', v)} options={['DJF', 'USD', 'EUR']} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Quotations"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'issue', dir: 'desc' }}
          actions={(r) => <RowActions label={r.number} viewTo={`/quotations/${r.id}`} onEdit={() => navigate(`/quotations/${r.id}/edit`)} onDelete={() => del.ask(r)} />}
          empty={s.quotations.length === 0 ? <EmptyState icon={FileText} title="No quotations yet" action={<ButtonLink to="/quotations/new" variant="primary" icon={Plus}>New quotation</ButtonLink>} /> : <EmptyState title="No quotations match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      {del.dialog}
    </>
  )
}
