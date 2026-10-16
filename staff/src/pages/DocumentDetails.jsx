import { useState } from 'react'
import { Download, ExternalLink, FileText, Lock, Pencil, Trash2, Upload } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PROTECTED_TYPES } from '../data/documents'
import useConfirmAction from '../hooks/useConfirmAction'
import { fmtDate, formatFileSize } from '../hooks/useFormat'
import useMine from '../hooks/useMine'
import { employeeName } from '../lib/selectors'
import { canDeleteDocument, canEditDocument, canFulfilRequest, deleteDocumentMetadata, extOf, getFileType, getFileUrl } from '../services/documentService'
import NotFound from './NotFound'

export default function DocumentDetails() {
  const { id } = useParams()
  const mine = useMine()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const doc = mine.documents.find((d) => d.id === id)
  const del = useConfirmAction({
    action: (d) => deleteDocumentMetadata(d.id),
    title: 'Delete draft record?',
    message: (d) => `The draft record “${d.name}” will be removed from the demo data.`,
    success: 'Draft record deleted.',
    onDone: () => navigate('/documents'),
  })
  if (!doc) return <NotFound title="Document not found" message="This document doesn’t exist or isn’t linked to your work." backTo="/documents" backLabel="Back to documents" />

  const empId = mine.employee.id
  const order = mine.state.orders.find((o) => o.id === doc.orderId)
  const shipment = mine.state.shipments.find((s) => s.id === doc.shipmentId)
  const url = getFileUrl(doc.id)
  const isImage = url && (getFileType(doc.id).startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(extOf(doc.fileName)))
  const isProtected = PROTECTED_TYPES.includes(doc.type)
  const fulfil = canFulfilRequest(doc, empId)

  return (
    <>
      <PageHeader
        title={doc.name}
        meta={<StatusBadge status={doc.status} />}
        description={`${doc.reference} · ${doc.type}`}
        breadcrumbs={[{ label: 'Documents', to: '/documents' }, { label: doc.reference }]}
        actions={
          <>
            {canDeleteDocument(doc, empId) && (
              <Button icon={Trash2} onClick={() => del.ask(doc)}>
                Delete draft
              </Button>
            )}
            {fulfil ? (
              <Button variant="primary" icon={Upload} onClick={() => setEditing(true)}>
                Provide file
              </Button>
            ) : (
              canEditDocument(doc, empId) && (
                <Button variant="primary" icon={Pencil} onClick={() => setEditing(true)}>
                  Edit details
                </Button>
              )
            )}
          </>
        }
      />
      {doc.status === 'Requested' && (
        <p className="mb-5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
          This document has been <strong>requested</strong>. Use “Provide file” to attach the copy you received.
        </p>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Document details" />
          <div className="p-5">
            <DetailList
              items={[
                { label: 'Reference', value: <span className="font-mono">{doc.reference}</span> },
                { label: 'Type', value: doc.type },
                { label: 'Related order', value: order ? <Link to={`/orders/${order.id}`} className="hover:underline">{order.number}</Link> : '' },
                { label: 'Related shipment', value: shipment ? <Link to={`/shipments/${shipment.id}`} className="hover:underline">{shipment.reference}</Link> : '' },
                { label: 'Document date', value: doc.documentDate ? fmtDate(doc.documentDate) : '' },
                { label: 'Added', value: `${fmtDate(doc.recordedAt)} by ${employeeName(mine.state, doc.addedBy)}` },
                { label: 'File name', value: doc.fileName ? <span className="font-mono text-xs">{doc.fileName}</span> : '' },
                { label: 'File size', value: doc.fileSize ? formatFileSize(doc.fileSize) : '' },
                { label: 'Description', value: doc.description, full: true },
              ]}
            />
            {isProtected && (
              <p className="mt-5 flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-xs text-muted">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Protected {doc.type.toLowerCase()} — it can’t be edited or deleted from the staff portal.
              </p>
            )}
          </div>
        </Card>
        <Card className="self-start">
          <CardHeader title="File" />
          <div className="space-y-3 p-5 text-sm">
            <div className="flex items-center gap-3 rounded-lg bg-canvas p-3">
              <FileText className="h-8 w-8 shrink-0 text-muted" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate font-medium">{doc.fileName || 'No file on record'}</p>
                <p className="text-xs text-muted">{doc.fileSize ? formatFileSize(doc.fileSize) : '—'}</p>
              </div>
            </div>
            {url ? (
              <>
                {isImage && <img src={url} alt={`Preview of ${doc.fileName}`} className="max-h-60 w-auto rounded border border-line" />}
                <div className="flex flex-wrap gap-2">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <ExternalLink aria-hidden="true" />
                    Open
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <a href={url} download={doc.fileName} className="btn btn-secondary btn-sm">
                    <Download aria-hidden="true" />
                    Download
                  </a>
                </div>
                <p className="text-xs text-muted">This file is available only in this browser tab until you reload. It has not been uploaded to a server.</p>
              </>
            ) : (
              <p className="text-xs text-muted">{doc.fileName ? 'The file is not available in this demo — only its details are recorded. Files will be retrievable once document storage is connected.' : 'No file has been provided for this record yet.'}</p>
            )}
          </div>
        </Card>
      </div>
      <DocumentFormModal open={editing} document={doc} onClose={() => setEditing(false)} />
      {del.dialog}
    </>
  )
}
