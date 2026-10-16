import { useState } from 'react'
import { Download, ExternalLink, FileText, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useLookups, { relatedRecord } from '../hooks/useLookups'
import { useAppState } from '../lib/store'
import { formatFileSize } from '../lib/utils'
import { documentService, getFileUrl } from '../services/documentService'
import NotFound from './NotFound'

export default function DocumentDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const lk = useLookups()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const doc = s.documents.find((d) => d.id === id)

  const del = useConfirmAction({
    action: (d) => documentService.remove(d.id),
    title: 'Delete document?',
    message: (d) => `“${d.name}” will be permanently removed from the register.`,
    success: 'Document deleted.',
    onDone: () => navigate('/documents'),
  })

  if (!doc) return <NotFound title="Document not found" backTo="/documents" backLabel="Back to documents" />
  const related = relatedRecord(doc.relatedType, doc.relatedId, lk)
  const fileUrl = getFileUrl(doc.id)

  return (
    <>
      <PageHeader
        title={doc.name}
        meta={<Badge>{doc.type}</Badge>}
        description={`Added ${f.date(doc.uploadDate)}`}
        breadcrumbs={[{ label: 'Documents', to: '/documents' }, { label: doc.name }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(doc)}>
              Delete
            </Button>
            <Button variant="primary" icon={Pencil} onClick={() => setEditing(true)}>
              Edit details
            </Button>
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader title="Document details" />
          <div className="p-5">
            <DetailList
              items={[
                { label: 'Name', value: doc.name },
                { label: 'Type', value: doc.type },
                { label: 'Related to', value: related ? <Link to={related.to} className="hover:underline"><span className="capitalize text-muted">{doc.relatedType}: </span>{related.label}</Link> : '' },
                { label: 'Date added', value: f.date(doc.uploadDate) },
                { label: 'File name', value: doc.fileName ? <span className="font-mono text-xs">{doc.fileName}</span> : '' },
                { label: 'File size', value: doc.fileSize ? formatFileSize(doc.fileSize) : '' },
                { label: 'Description', value: doc.description, full: true },
              ]}
            />
          </div>
        </Card>
        <Card className="self-start">
          <CardHeader title="File" />
          <div className="p-5 text-sm">
            <div className="flex items-center gap-3 rounded-lg bg-canvas p-3">
              <FileText className="h-8 w-8 shrink-0 text-muted" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate font-medium">{doc.fileName || 'No file attached'}</p>
                <p className="text-xs text-muted">{doc.fileSize ? formatFileSize(doc.fileSize) : '—'}</p>
              </div>
            </div>
            {fileUrl ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <ExternalLink aria-hidden="true" />
                  Open
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a href={fileUrl} download={doc.fileName} className="btn btn-secondary btn-sm">
                  <Download aria-hidden="true" />
                  Download
                </a>
              </div>
            ) : null}
            <p className="mt-3 text-xs text-muted">
              {fileUrl
                ? 'This file is available only in this browser tab until you reload. It has not been uploaded to a server.'
                : 'Demo mode: no stored file is available. Files will be retrievable once document storage is connected.'}
            </p>
          </div>
        </Card>
      </div>
      <DocumentFormModal open={editing} document={doc} onClose={() => setEditing(false)} />
      {del.dialog}
    </>
  )
}
