import { useMemo, useState } from 'react'
import { Eye, FolderOpen, Info, Lock, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { documentStatuses, documentTypes, PROTECTED_TYPES } from '../data/documents'
import useConfirmAction from '../hooks/useConfirmAction'
import { fmtDate } from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import useMine from '../hooks/useMine'
import { canDeleteDocument, canEditDocument, canFulfilRequest, deleteDocumentMetadata } from '../services/documentService'

const iconBtn = 'btn btn-ghost btn-sm btn-icon text-muted hover:text-ink'

export default function Documents() {
  const mine = useMine()
  const [params, setParams] = useSearchParams()
  // One-off intent from shipment pages: /documents?new=1&order=..&shipment=..&name=..
  const [form, setForm] = useState(() =>
    params.get('new') ? { open: true, doc: null, prefill: { orderId: params.get('order') ?? '', shipmentId: params.get('shipment') ?? '', name: params.get('name') ?? '' } } : { open: false, doc: null, prefill: null },
  )
  const empId = mine.employee?.id

  const rows = useMemo(
    () =>
      mine.documents.map((d) => ({
        ...d,
        orderNumber: mine.state.orders.find((o) => o.id === d.orderId)?.number ?? '',
        shipmentRef: mine.state.shipments.find((s) => s.id === d.shipmentId)?.reference ?? '',
      })),
    [mine],
  )
  const related = [...mine.orders.map((o) => ({ value: `order:${o.id}`, label: o.number })), ...mine.shipments.map((s) => ({ value: `shipment:${s.id}`, label: s.reference }))]
  const list = useListState(rows, (r) => [r.name, r.reference, r.fileName, r.orderNumber, r.shipmentRef], {
    type: (r, v) => r.type === v,
    status: (r, v) => r.status === v,
    related: (r, v) => {
      const [kind, id] = v.split(':')
      return kind === 'order' ? r.orderId === id : r.shipmentId === id
    },
  })

  const del = useConfirmAction({
    action: (d) => deleteDocumentMetadata(d.id),
    title: 'Delete draft record?',
    message: (d) => `The draft record “${d.name}” will be removed from the demo data. Only your own drafts can be deleted.`,
    success: 'Draft record deleted.',
  })

  const closeForm = () => {
    setForm({ open: false, doc: null, prefill: null })
    if (params.get('new')) setParams({}, { replace: true })
  }

  const columns = [
    { key: 'name', header: 'Document', mobile: 'title', sort: (r) => r.name, cell: (r) => <div className="min-w-0"><Link to={`/documents/${r.id}`} className="font-medium hover:text-gold-deep hover:underline">{r.name}</Link><div className="font-mono text-[0.7rem] text-muted">{r.reference}</div></div> },
    { key: 'type', header: 'Type', mobile: 'subtitle', sort: (r) => r.type, cell: (r) => <span className="inline-flex items-center gap-1 whitespace-nowrap">{PROTECTED_TYPES.includes(r.type) && <Lock className="h-3 w-3 text-muted" aria-label="Protected" />}{r.type}</span> },
    { key: 'order', header: 'Order', mobile: true, sort: (r) => r.orderNumber, cell: (r) => (r.orderNumber ? <Link to={`/orders/${r.orderId}`} className="whitespace-nowrap hover:underline">{r.orderNumber}</Link> : <span className="text-muted">—</span>) },
    { key: 'shipment', header: 'Shipment', sort: (r) => r.shipmentRef, cell: (r) => (r.shipmentRef ? <Link to={`/shipments/${r.shipmentId}`} className="whitespace-nowrap hover:underline">{r.shipmentRef}</Link> : <span className="text-muted">—</span>) },
    { key: 'date', header: 'Recorded', sort: (r) => r.recordedAt, cell: (r) => fmtDate(r.recordedAt), className: 'whitespace-nowrap' },
    { key: 'file', header: 'File', cell: (r) => (r.fileName ? <span className="font-mono text-xs">{r.fileName}</span> : <span className="text-xs text-warning">No file</span>) },
    { key: 'status', header: 'Status', mobile: true, sort: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Documents"
        description="Documents linked to your orders and shipments, and records you have added."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setForm({ open: true, doc: null, prefill: null })}>
            Add document
          </Button>
        }
      />
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-line bg-white px-4 py-3 text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
        Demo mode: only document details are saved. Files you choose stay in this browser tab and are not uploaded. Financial and commercial documents (marked with a lock) are protected.
      </p>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search name, reference, file" label="Search documents" />
          <FilterSelect label="Type" value={list.filters.type ?? ''} onChange={(v) => list.setFilter('type', v)} options={documentTypes} />
          <FilterSelect label="Related to" value={list.filters.related ?? ''} onChange={(v) => list.setFilter('related', v)} options={related} />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={documentStatuses} />
        </FilterBar>
        <DataTable
          caption="Documents"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'date', dir: 'desc' }}
          actions={(r) => (
            <>
              <Link to={`/documents/${r.id}`} className={iconBtn} aria-label={`View ${r.name}`} title="View">
                <Eye aria-hidden="true" />
              </Link>
              {(canEditDocument(r, empId) || canFulfilRequest(r, empId)) && (
                <button type="button" onClick={() => setForm({ open: true, doc: r, prefill: null })} className={iconBtn} aria-label={canFulfilRequest(r, empId) ? `Provide file for ${r.name}` : `Edit ${r.name}`} title={canFulfilRequest(r, empId) ? 'Provide file' : 'Edit'}>
                  <Pencil aria-hidden="true" />
                </button>
              )}
              {canDeleteDocument(r, empId) && (
                <button type="button" onClick={() => del.ask(r)} className={`${iconBtn} hover:!text-danger`} aria-label={`Delete draft ${r.name}`} title="Delete draft">
                  <Trash2 aria-hidden="true" />
                </button>
              )}
            </>
          )}
          empty={mine.documents.length === 0 ? <EmptyState icon={FolderOpen} title="No documents yet" /> : <EmptyState title="No documents match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <DocumentFormModal open={form.open} document={form.doc} prefill={form.prefill} onClose={closeForm} />
      {del.dialog}
    </>
  )
}
