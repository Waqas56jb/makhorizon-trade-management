import { useEffect, useMemo, useState } from 'react'
import { FileText, Paperclip, X } from 'lucide-react'
import { z } from 'zod'
import { documentTypes } from '../../data/documents'
import { formatFileSize } from '../../hooks/useFormat'
import useMine from '../../hooks/useMine'
import { optional, optionalDate, required } from '../../lib/schemas'
import { ALLOWED_EXTENSIONS, canFulfilRequest, createDocumentMetadata, extOf, PREVIEWABLE, updateDocumentMetadata, validateFile } from '../../services/documentService'
import { SelectField, TextareaField, TextField } from '../ui/Fields'
import FormModal from './FormModal'

const schema = z.object({
  name: required('Document name', 150),
  type: z.string().min(1, 'Please choose a document type.'),
  orderId: z.string().optional(),
  shipmentId: z.string().optional(),
  documentDate: optionalDate,
  description: optional(500),
})

/** File picker with metadata, safe in-browser preview and a remove action. */
function FilePicker({ file, onChange, error, required: isRequired }) {
  // Temporary preview URL, revoked whenever the file changes or the form closes.
  const url = useMemo(() => (file && PREVIEWABLE.includes(extOf(file.name)) ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => url && URL.revokeObjectURL(url), [url])

  const ext = file ? extOf(file.name) : ''
  return (
    <div>
      <p className="field-label">
        File{isRequired ? <span className="ml-0.5 text-danger" aria-hidden="true">*</span> : <span className="ml-1 text-xs font-normal text-muted">(optional)</span>}
      </p>
      {file ? (
        <div className="rounded-lg border border-line">
          <div className="flex items-center gap-3 p-3">
            <FileText className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{file.name}</p>
              <p className="text-xs text-muted">
                {formatFileSize(file.size)} · {file.type || ext.toUpperCase()}
              </p>
            </div>
            <button type="button" onClick={() => onChange(null)} className="btn btn-ghost btn-sm" aria-label={`Remove ${file.name}`}>
              <X aria-hidden="true" />
              Remove
            </button>
          </div>
          {url && (
            <div className="border-t border-line bg-canvas p-3">
              <p className="mb-2 text-xs font-semibold text-muted">Preview</p>
              {['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? (
                <img src={url} alt={`Preview of ${file.name}`} className="max-h-64 w-auto rounded border border-line bg-white" />
              ) : (
                <iframe src={url} title={`Preview of ${file.name}`} className="h-64 w-full rounded border border-line bg-white" {...(ext === 'txt' ? { sandbox: '' } : {})} />
              )}
            </div>
          )}
        </div>
      ) : (
        <label htmlFor="doc-file" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#c5ced6] bg-canvas px-4 py-4 text-sm hover:border-navy">
          <Paperclip className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          Choose a file from this device
        </label>
      )}
      <input
        id="doc-file"
        type="file"
        className="sr-only"
        accept={ALLOWED_EXTENSIONS.map((x) => `.${x}`).join(',')}
        aria-describedby="doc-file-help"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null)
          e.target.value = ''
        }}
      />
      {error ? (
        <p role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        <p id="doc-file-help" className="mt-1 text-xs text-muted">
          PDF, images, Word, Excel, CSV or text · up to 10 MB. Demo mode: the file stays in this browser tab and is <strong>not uploaded</strong>.
        </p>
      )}
    </div>
  )
}

/**
 * Add a document record, edit your own draft metadata, or provide the file
 * for a requested document.
 */
export function DocumentFormModal({ open, document: doc, prefill, onClose }) {
  const mine = useMine()
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const editing = !!doc
  const fulfilling = editing && canFulfilRequest(doc, mine.employee?.id)

  const pick = (f) => {
    const err = validateFile(f)
    setFileError(err ?? '')
    setFile(err ? null : f)
  }
  const close = (r) => {
    setFile(null)
    setFileError('')
    onClose(r)
  }

  return (
    <FormModal
      open={open}
      onClose={close}
      title={fulfilling ? 'Provide requested document' : editing ? 'Edit document details' : 'Add document record'}
      description="Saved as demo metadata. Files are not uploaded to any server."
      schema={schema}
      defaultValues={doc ? { name: doc.name, type: doc.type, orderId: doc.orderId, shipmentId: doc.shipmentId, documentDate: doc.documentDate, description: doc.description } : { name: '', type: '', orderId: '', shipmentId: '', documentDate: '', description: '', ...prefill }}
      onSubmit={(v) => {
        if (fileError) throw new Error(fileError)
        if (fulfilling && !file) throw new Error('Attach the received file to complete this request.')
        return editing ? updateDocumentMetadata(doc.id, v, file) : createDocumentMetadata(v, file)
      }}
      successMessage={() => (fulfilling ? 'Requested document provided and sent for review (demo).' : editing ? 'Document details updated.' : file ? 'Document record added for review (demo).' : 'Draft document record added.')}
      submitLabel={fulfilling ? 'Provide document' : editing ? 'Save changes' : 'Add document'}
    >
      {(form) => {
        const e = form.formState.errors
        const orderId = form.watch('orderId')
        const shipments = mine.shipments.filter((s) => !orderId || s.orderId === orderId)
        return (
          <>
            {fulfilling && (
              <dl className="grid gap-3 rounded-lg bg-canvas p-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted">Document</dt>
                  <dd className="font-medium">{doc.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Type</dt>
                  <dd>{doc.type}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Linked to</dt>
                  <dd>{[mine.state.orders.find((o) => o.id === doc.orderId)?.number, mine.state.shipments.find((x) => x.id === doc.shipmentId)?.reference].filter(Boolean).join(' · ') || '—'}</dd>
                </div>
              </dl>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {!fulfilling && <TextField id="doc-name" label="Document name" required className="sm:col-span-2" registration={form.register('name')} error={e.name} />}
              {!fulfilling && <SelectField id="doc-type" label="Document type" required placeholder="Select type" options={documentTypes} registration={form.register('type')} error={e.type} />}
              <TextField id="doc-date" type="date" label="Document date" hint="Optional" registration={form.register('documentDate')} error={e.documentDate} />
              {!fulfilling && <SelectField
                id="doc-order"
                label="Related order"
                placeholder="None"
                options={mine.orders.map((o) => ({ value: o.id, label: `${o.number} · ${o.client.company}` }))}
                registration={form.register('orderId', {
                  onChange: (ev) => {
                    const sid = form.getValues('shipmentId')
                    if (sid && mine.shipmentById(sid)?.orderId !== ev.target.value) form.setValue('shipmentId', '')
                  },
                })}
              />}
              {!fulfilling && <SelectField id="doc-shipment" label="Related shipment" placeholder="None" options={shipments.map((s) => ({ value: s.id, label: s.reference }))} registration={form.register('shipmentId')} />}
            </div>
            <TextareaField id="doc-desc" label="Description" hint="Optional" registration={form.register('description')} error={e.description} />
            <FilePicker file={file} onChange={pick} error={fileError} required={fulfilling} />
            {editing && doc.fileName && !file && <p className="text-xs text-muted">Current file on record: {doc.fileName}. Choose a new file only to replace it.</p>}
          </>
        )
      }}
    </FormModal>
  )
}
