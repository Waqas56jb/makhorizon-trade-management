import { useMemo } from 'react'
import { Download, Eye, FolderOpen, Upload } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { DocumentDetailsModal, UploadDocumentModal } from '../components/documents/DocumentModals'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { documentStatuses, documentTypes } from '../data/documents'
import useListState from '../hooks/useListState'
import usePartnerData from '../hooks/usePartnerData'
import { fileTypeLabel, formatDate, formatFileSize } from '../lib/format'
import { relatedInfo } from '../lib/selectors'
import { getFileUrl } from '../services/documentService'

export default function Documents() {
  const data = usePartnerData()
  const [params, setParams] = useSearchParams()
  const rows = useMemo(() => data.documents.map((d) => ({ ...d, rel: relatedInfo(d.related, data) })), [data])
  const list = useListState(rows, (d) => [d.name, d.id, d.fileName, d.rel?.short], {
    type: (d, v) => d.type === v,
    status: (d, v) => d.status === v,
  })

  const openDoc = data.documentById(params.get('doc'))
  const uploadOpen = params.get('upload') === '1'
  const initialRelated = params.get('kind') && params.get('id') ? `${params.get('kind')}:${params.get('id')}` : ''
  const setParam = (patch) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p)
        Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
        return next
      },
      { replace: true },
    )
  const closeUpload = () => setParam({ upload: '', kind: '', id: '' })

  const columns = [
    {
      key: 'name',
      header: 'Document',
      mobile: 'title',
      sort: (d) => d.name,
      cell: (d) => (
        <button type="button" onClick={() => setParam({ doc: d.id })} className="block max-w-[15rem] text-left">
          <span className="block truncate font-medium hover:text-gold-deep hover:underline">{d.name}</span>
          <span className="block text-xs font-normal text-muted">{d.id}</span>
        </button>
      ),
    },
    { key: 'type', header: 'Type', mobile: 'subtitle', sort: (d) => d.type },
    { key: 'related', header: 'Related to', mobile: true, sort: (d) => d.rel?.short, cell: (d) => (d.rel ? <Link to={d.rel.to} className="whitespace-nowrap hover:underline">{d.rel.short}</Link> : '—') },
    { key: 'date', header: 'Upload date', mobile: true, sort: (d) => d.uploadedAt || null, cell: (d) => (d.uploadedAt ? formatDate(d.uploadedAt) : <span className="text-muted">Not uploaded</span>), className: 'whitespace-nowrap' },
    { key: 'filetype', header: 'File type', sort: (d) => fileTypeLabel(d.fileType, d.fileName), cell: (d) => (d.fileName ? fileTypeLabel(d.fileType, d.fileName) : '—'), hideBelow: '2xl' },
    { key: 'size', header: 'Size', align: 'right', sort: (d) => d.fileSize ?? null, cell: (d) => (d.fileName ? formatFileSize(d.fileSize) : '—'), className: 'whitespace-nowrap', hideBelow: '2xl' },
    { key: 'status', header: 'Status', mobile: true, sort: (d) => d.status, cell: (d) => <StatusBadge status={d.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Documents"
        description="Files exchanged with MAKHORIZON for your quotations, orders, shipments and company record."
        actions={
          <Button variant="primary" icon={Upload} onClick={() => setParam({ upload: '1' })}>
            Upload document
          </Button>
        }
      />
      <DemoNotice className="mb-4" title="Frontend-only phase">
        Selected files are not uploaded to a server — only the document details are recorded. A file you choose can be downloaded again from this tab until the page reloads.
      </DemoNotice>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search name, reference or file" label="Search documents" />
          <FilterSelect label="Type" value={list.filters.type ?? ''} onChange={(v) => list.setFilter('type', v)} options={documentTypes} />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={documentStatuses} />
        </FilterBar>
        <DataTable
          caption="Documents"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          cardsBelow="xl"
          initialSort={{ key: 'status', dir: 'desc' }}
          actions={(d) => {
            const url = getFileUrl(d.id)
            return (
              <>
                {url && (
                  <a href={url} download={d.fileName} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`Download ${d.name}`} title="Download">
                    <Download aria-hidden="true" />
                  </a>
                )}
                <button type="button" onClick={() => setParam({ doc: d.id })} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`View details for ${d.name}`} title="View details">
                  <Eye aria-hidden="true" />
                </button>
              </>
            )
          }}
          empty={
            data.documents.length === 0 ? (
              <EmptyState icon={FolderOpen} title="No documents yet" action={<Button variant="primary" onClick={() => setParam({ upload: '1' })}>Upload document</Button>} />
            ) : (
              <EmptyState title="No documents match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />
            )
          }
        />
      </Card>
      <UploadDocumentModal open={uploadOpen} data={data} initialRelated={initialRelated} onClose={closeUpload} />
      <DocumentDetailsModal doc={openDoc} data={data} onClose={() => setParam({ doc: '' })} />
    </>
  )
}
