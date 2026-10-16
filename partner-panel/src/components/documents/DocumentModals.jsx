import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Download, Send, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { documentTypes } from '../../data/documents'
import useConfirmAction from '../../hooks/useConfirmAction'
import { formatDate, formatFileSize, fileTypeLabel } from '../../lib/format'
import { optional, required } from '../../lib/schemas'
import { relatedInfo, relatedOptions } from '../../lib/selectors'
import { createDocument, deleteDraftDocument, getFileUrl, submitDocumentFile } from '../../services/documentService'
import { StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { DetailList } from '../ui/Card'
import { DemoNotice } from '../ui/Controls'
import { SelectField, TextareaField, TextField } from '../ui/Fields'
import FilePicker from '../ui/FilePicker'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'

const schema = z.object({
  name: required('Document name', 150),
  type: z.string().min(1, 'Select a document type.'),
  related: z.string().min(1, 'Select the related record.'),
  notes: optional(600),
})

function UploadForm({ data, initialRelated, onClose }) {
  const toast = useToast()
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [busy, setBusy] = useState('')
  const options = relatedOptions(data)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', type: '', related: options.some((o) => o.value === initialRelated) ? initialRelated : '', notes: '' },
    mode: 'onTouched',
  })

  const save = (submit) =>
    handleSubmit(async (values) => {
      setSubmitError('')
      setFileError('')
      if (submit && !files[0]) {
        setFileError('Choose a file before submitting, or save the record as a draft.')
        return
      }
      setBusy(submit ? 'submit' : 'draft')
      try {
        const [kind, id] = values.related.split(':')
        const doc = await createDocument({ ...values, related: { kind, id } }, files[0] ?? null, { submit })
        toast.success(submit ? `${doc.id} submitted for review (demo — the file was not uploaded).` : `Draft ${doc.id} saved.`)
        onClose()
      } catch (err) {
        setSubmitError(err.message)
      } finally {
        setBusy('')
      }
    })

  return (
    <Modal
      open
      onClose={onClose}
      title="Upload document"
      description="Register a document for MAKHORIZON. In this demo the file stays in your browser."
      size="lg"
      busy={!!busy}
      footer={
        <>
          <Button onClick={onClose} disabled={!!busy}>
            Cancel
          </Button>
          <Button onClick={save(false)} loading={busy === 'draft'} disabled={!!busy}>
            Save as draft
          </Button>
          <Button variant="primary" icon={Send} onClick={save(true)} loading={busy === 'submit'} disabled={!!busy}>
            Submit for review
          </Button>
        </>
      }
    >
      <form onSubmit={save(true)} noValidate className="space-y-4">
        {submitError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            {submitError}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="doc-name" label="Document name" required className="sm:col-span-2" registration={register('name')} error={errors.name} />
          <SelectField id="doc-type" label="Document type" required registration={register('type')} error={errors.type} options={documentTypes} placeholder="Select a type" />
          <SelectField id="doc-related" label="Related record" required registration={register('related')} error={errors.related} options={options} placeholder="Select a record" />
        </div>
        <FilePicker files={files} onChange={(f) => { setFiles(f); setFileError('') }} label="File" error={fileError} hint="Not uploaded to a server in this frontend-only phase. You can download it again from this tab until the page is reloaded." />
        <TextareaField id="doc-notes" label="Notes (optional)" rows={2} registration={register('notes')} error={errors.notes} />
      </form>
    </Modal>
  )
}

export function UploadDocumentModal({ open, ...props }) {
  return open ? <UploadForm {...props} /> : null
}

function ProvideFile({ doc, onDone }) {
  const toast = useToast()
  const [files, setFiles] = useState([])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const label = doc.status === 'Requested' ? 'Provide requested file' : doc.status === 'Revision Required' ? 'Upload revised file' : 'Attach file and submit'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!files[0]) {
      setError('Choose a file first.')
      return
    }
    setBusy(true)
    try {
      await submitDocumentFile(doc.id, files[0], notes)
      toast.success(`${doc.id} submitted for review (demo — the file was not uploaded).`)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3 rounded-lg border border-line p-4">
      <p className="text-sm font-semibold">{label}</p>
      <FilePicker files={files} onChange={setFiles} label="File" required error={error} />
      <div>
        <label htmlFor="provide-notes" className="field-label">
          Note for MAKHORIZON (optional)
        </label>
        <textarea id="provide-notes" rows={2} maxLength={600} value={notes} onChange={(e) => setNotes(e.target.value)} className="field-control" />
      </div>
      <Button type="submit" variant="primary" icon={Send} loading={busy}>
        Submit file
      </Button>
    </form>
  )
}

export function DocumentDetailsModal({ doc, data, onClose }) {
  const del = useConfirmAction({
    action: (d) => deleteDraftDocument(d.id),
    title: 'Delete this draft document?',
    message: (d) => `“${d.name}” will be removed from this demo.`,
    confirmLabel: 'Delete draft',
    success: (d) => `Draft ${d.id} deleted.`,
    onDone: onClose,
  })
  if (!doc) return del.dialog
  const rel = relatedInfo(doc.related, data)
  const url = getFileUrl(doc.id)
  const needsFile = ['Requested', 'Revision Required', 'Draft'].includes(doc.status)

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title={doc.name}
        description={`${doc.id} · ${doc.type}`}
        size="lg"
        footer={
          <>
            {doc.status === 'Draft' && (
              <Button variant="danger" icon={Trash2} onClick={() => del.ask(doc)}>
                Delete draft
              </Button>
            )}
            {url && (
              <a href={url} download={doc.fileName} className="btn btn-secondary">
                <Download aria-hidden="true" />
                Download
              </a>
            )}
            <Button onClick={onClose}>Close</Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={doc.status} />
            {doc.reviewNote && <span className="text-sm text-ink">{doc.reviewNote}</span>}
          </div>
          <DetailList
            items={[
              { label: 'Document type', value: doc.type },
              { label: 'Related record', value: rel ? <Link to={rel.to} onClick={onClose} className="text-navy hover:underline">{rel.label}</Link> : '' },
              { label: 'File name', value: doc.fileName || 'No file yet' },
              { label: 'File type', value: doc.fileName ? fileTypeLabel(doc.fileType, doc.fileName) : '' },
              { label: 'File size', value: doc.fileName ? formatFileSize(doc.fileSize) : '' },
              { label: doc.status === 'Requested' ? 'Requested on' : 'Upload date', value: formatDate(doc.status === 'Requested' ? doc.requestedAt : doc.uploadedAt) },
              { label: 'Uploaded by', value: doc.uploadedBy },
              { label: 'Notes', value: doc.notes, full: true },
            ]}
          />
          {doc.fileName && !url && <DemoNotice title="Download unavailable">Sample records have no real file attached, and files chosen earlier are cleared when the page reloads. Nothing is stored on a server.</DemoNotice>}
          {needsFile && <ProvideFile doc={doc} onDone={onClose} />}
        </div>
      </Modal>
      {del.dialog}
    </>
  )
}
