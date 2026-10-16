import { useMemo, useState } from 'react'
import { FolderOpen, Info, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { DateRange, FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { documentTypes, relatedTypes } from '../data/documents'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useLookups, { relatedRecord } from '../hooks/useLookups'
import { inRange } from '../lib/analytics'
import { useAppState } from '../lib/store'
import { formatFileSize } from '../lib/utils'
import { documentService } from '../services/documentService'

export default function Documents() {
  const s = useAppState()
  const f = useFormat()
  const lk = useLookups()
  const [form, setForm] = useState({ open: false, doc: null })

  const rows = useMemo(() => s.documents.map((d) => ({ ...d, related: relatedRecord(d.relatedType, d.relatedId, lk) })), [s.documents, lk])
  const list = useListState(rows, (r) => [r.name, r.fileName, r.description, r.related?.label], {
    type: (r, v) => r.type === v,
    relatedType: (r, v) => r.relatedType === v,
    from: (r, v) => inRange(r.uploadDate, v, ''),
    to: (r, v) => inRange(r.uploadDate, '', v),
  })

  const del = useConfirmAction({
    action: (d) => documentService.remove(d.id),
    title: 'Delete document?',
    message: (d) => `The register entry “${d.name}” will be permanently removed from the demo data.`,
    success: 'Document deleted.',
  })

  const columns = [
    { key: 'name', header: 'Document', mobile: 'title', sort: (r) => r.name, cell: (r) => <CellLink to={`/documents/${r.id}`} sub={r.description}>{r.name}</CellLink> },
    { key: 'type', header: 'Type', mobile: 'subtitle', sort: (r) => r.type, cell: (r) => <Badge>{r.type}</Badge> },
    {
      key: 'related',
      header: 'Related to',
      mobile: true,
      sort: (r) => r.related?.label ?? '',
      cell: (r) =>
        r.related ? (
          <span className="whitespace-nowrap">
            <span className="text-xs capitalize text-muted">{r.relatedType}: </span>
            <Link to={r.related.to} className="hover:underline">
              {r.related.label}
            </Link>
          </span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    { key: 'date', header: 'Added', mobile: true, sort: (r) => r.uploadDate, cell: (r) => f.date(r.uploadDate), className: 'whitespace-nowrap' },
    { key: 'file', header: 'File', cell: (r) => (r.fileName ? <span className="text-xs"><span className="font-mono">{r.fileName}</span> <span className="text-muted">· {formatFileSize(r.fileSize)}</span></span> : <span className="text-muted">No file</span>) },
  ]

  return (
    <>
      <PageHeader
        title="Documents"
        description="Central register of trade documents and their related records."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, doc: null })}>
            Add document
          </Button>
        }
      />
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-line bg-white px-4 py-3 text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
        Demo mode: only document details are saved. Sample entries have no attached files, and files you choose stay in this browser tab — nothing is uploaded or stored on a server.
      </p>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search name, file, related record" label="Search documents" />
          <FilterSelect label="Type" value={list.filters.type ?? ''} onChange={(v) => list.setFilter('type', v)} options={documentTypes} />
          <FilterSelect label="Related to" value={list.filters.relatedType ?? ''} onChange={(v) => list.setFilter('relatedType', v)} options={relatedTypes} />
          <DateRange from={list.filters.from ?? ''} to={list.filters.to ?? ''} onFrom={(v) => list.setFilter('from', v)} onTo={(v) => list.setFilter('to', v)} />
        </FilterBar>
        <DataTable
          caption="Documents"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'date', dir: 'desc' }}
          actions={(r) => <RowActions label={r.name} viewTo={`/documents/${r.id}`} onEdit={() => setForm({ open: true, doc: r })} onDelete={() => del.ask(r)} />}
          empty={s.documents.length === 0 ? <EmptyState icon={FolderOpen} title="No documents yet" /> : <EmptyState title="No documents match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <DocumentFormModal open={form.open} document={form.doc} onClose={() => setForm({ open: false, doc: null })} />
      {del.dialog}
    </>
  )
}
