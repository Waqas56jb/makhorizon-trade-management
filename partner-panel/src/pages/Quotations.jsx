import { useMemo } from 'react'
import { Eye, FilePlus2, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { currencies, quotationStatuses } from '../data/quotations'
import useListState from '../hooks/useListState'
import usePartnerData from '../hooks/usePartnerData'
import { formatCurrency, formatDate } from '../lib/format'
import { calcQuotationTotals } from '../lib/quotation'

export default function Quotations() {
  const data = usePartnerData()
  const rows = useMemo(
    () =>
      data.quotations.map((q) => ({
        ...q,
        total: calcQuotationTotals(q).total,
        opportunityTitle: data.opportunityById(q.opportunityId)?.title ?? '—',
        submittedDate: q.submittedAt ? q.submittedAt.slice(0, 10) : '',
      })),
    [data],
  )
  const list = useListState(rows, (q) => [q.id, q.title, q.opportunityId, q.opportunityTitle], {
    status: (q, v) => q.status === v,
    currency: (q, v) => q.currency === v,
    from: (q, v) => !!q.submittedDate && q.submittedDate >= v,
    to: (q, v) => !!q.submittedDate && q.submittedDate <= v,
  })

  const columns = [
    { key: 'id', header: 'Reference', mobile: 'title', sort: (q) => q.id, cell: (q) => <Link to={`/quotations/${q.id}`} className="font-medium hover:text-gold-deep hover:underline">{q.id}</Link>, className: 'whitespace-nowrap' },
    {
      key: 'opp',
      header: 'Related opportunity',
      mobile: 'subtitle',
      sort: (q) => q.opportunityTitle,
      cell: (q) => (
        <span className="block max-w-[13rem]">
          <span className="block truncate">{q.opportunityTitle}</span>
          <span className="block text-xs text-muted">{q.opportunityId}</span>
        </span>
      ),
    },
    { key: 'submitted', header: 'Submitted', mobile: true, sort: (q) => q.submittedDate || null, cell: (q) => (q.submittedDate ? formatDate(q.submittedDate) : <span className="text-muted">Not submitted</span>), className: 'whitespace-nowrap' },
    { key: 'amount', header: 'Amount', align: 'right', mobile: true, sort: (q) => q.total, cell: (q) => formatCurrency(q.total, q.currency), className: 'whitespace-nowrap' },
    { key: 'currency', header: 'Currency', sort: (q) => q.currency, hideBelow: '2xl' },
    { key: 'valid', header: 'Valid until', sort: (q) => q.validUntil, cell: (q) => formatDate(q.validUntil), className: 'whitespace-nowrap', hideBelow: '2xl' },
    { key: 'status', header: 'Status', mobile: true, sort: (q) => q.status, cell: (q) => <StatusBadge status={q.status} /> },
    { key: 'updated', header: 'Last updated', mobile: true, sort: (q) => q.updatedAt, cell: (q) => formatDate(q.updatedAt), className: 'whitespace-nowrap', hideBelow: '2xl' },
  ]

  return (
    <>
      <PageHeader
        title="Quotations"
        description="Quotations you have prepared or submitted to MAKHORIZON. Amounts are shown in each quotation’s own currency — no conversion is applied."
        actions={
          <ButtonLink to="/quotations/new" variant="primary" icon={FilePlus2}>
            Create quotation
          </ButtonLink>
        }
      />
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search reference or opportunity" label="Search quotations" />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={quotationStatuses} />
          <FilterSelect label="Currency" value={list.filters.currency ?? ''} onChange={(v) => list.setFilter('currency', v)} options={currencies} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Quotations"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          cardsBelow="xl"
          initialSort={{ key: 'updated', dir: 'desc' }}
          actions={(q) => (
            <Link to={`/quotations/${q.id}`} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`View quotation ${q.id}`} title="View">
              <Eye aria-hidden="true" />
            </Link>
          )}
          empty={
            data.quotations.length === 0 ? (
              <EmptyState icon={FileText} title="No quotations yet" message="Browse trade opportunities and submit your first quotation." action={<ButtonLink to="/opportunities" variant="primary">Browse opportunities</ButtonLink>} />
            ) : (
              <EmptyState title="No quotations match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />
            )
          }
        />
      </Card>
    </>
  )
}
