import { useState } from 'react'
import { Paperclip } from 'lucide-react'
import { z } from 'zod'
import { documentTypes, relatedTypes } from '../../data/documents'
import { choice, optional, required } from '../../lib/schemas'
import { useAppState } from '../../lib/store'
import { formatFileSize } from '../../lib/utils'
import { ALLOWED_EXTENSIONS, documentService, validateFile } from '../../services/documentService'
import { SelectField, TextareaField, TextField } from '../ui/Fields'
import FormModal from './FormModal'

const schema = z
  .object({
    name: required('Document name', 150),
    type: choice('a document type'),
    relatedType: z.string().optional(),
    relatedId: z.string().optional(),
    description: optional(500),
  })
  .refine((v) => !v.relatedType || v.relatedId, { path: ['relatedId'], message: 'Select the related record.' })

export function DocumentFormModal({ open, document: doc, prefill, onClose }) {
  const s = useAppState()
  const editing = !!doc
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')

  const optionsFor = (type) =>
    ({
      client: s.clients.map((c) => ({ value: c.id, label: c.company })),
      supplier: s.suppliers.map((c) => ({ value: c.id, label: c.company })),
      order: s.orders.map((o) => ({ value: o.id, label: o.number })),
      shipment: s.shipments.map((x) => ({ value: x.id, label: x.reference })),
      partner: s.partners.map((p) => ({ value: p.id, label: p.company })),
    })[type] ?? []

  const close = (r) => {
    setFile(null)
    setFileError('')
    onClose(r)
  }

  return (
    <FormModal
      open={open}
      onClose={close}
      title={editing ? 'Edit document details' : 'Add document'}
      description="Metadata is saved in the demo data. Files are not uploaded to any server."
      schema={schema}
      defaultValues={doc ?? { name: '', type: '', relatedType: '', relatedId: '', description: '', ...prefill }}
      onSubmit={(v) => {
        if (fileError) throw new Error(fileError)
        const clean = { ...v, relatedId: v.relatedType ? v.relatedId : '' }
        return editing ? documentService.update(doc.id, clean, file) : documentService.create(clean, file)
      }}
      successMessage={() => (editing ? 'Document details updated.' : 'Document registered.')}
    >
      {(form) => {
        const e = form.formState.errors
        const relatedType = form.watch('relatedType')
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="d-name" label="Document name" required className="sm:col-span-2" registration={form.register('name')} error={e.name} />
              <SelectField id="d-type" label="Document type" required placeholder="Select type" options={documentTypes} registration={form.register('type')} error={e.type} />
              <div className="hidden sm:block" />
              <SelectField id="d-rtype" label="Related to" placeholder="Nothing" options={relatedTypes} registration={form.register('relatedType', { onChange: () => form.setValue('relatedId', '') })} />
              <SelectField id="d-rid" label="Related record" placeholder={relatedType ? 'Select record' : 'Choose “Related to” first'} disabled={!relatedType} options={optionsFor(relatedType)} registration={form.register('relatedId')} error={e.relatedId} />
            </div>
            <TextareaField id="d-desc" label="Description" hint="Optional" registration={form.register('description')} error={e.description} />
            <div>
              <label htmlFor="d-file" className="field-label">
                {editing ? 'Replace file (optional)' : 'File (optional)'}
              </label>
              <label htmlFor="d-file" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#c5ced6] bg-canvas px-4 py-4 text-sm hover:border-navy">
                <Paperclip className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <span className="min-w-0 truncate">{file ? `${file.name} · ${formatFileSize(file.size)}` : editing && doc.fileName ? `Current: ${doc.fileName}` : 'Choose a file from this device'}</span>
              </label>
              <input
                id="d-file"
                type="file"
                className="sr-only"
                accept={ALLOWED_EXTENSIONS.map((x) => `.${x}`).join(',')}
                aria-describedby="d-file-help"
                onChange={(ev) => {
                  const f = ev.target.files?.[0] ?? null
                  const err = validateFile(f)
                  setFileError(err ?? '')
                  setFile(err ? null : f)
                }}
              />
              {fileError ? (
                <p role="alert" className="mt-1 text-xs font-medium text-danger">
                  {fileError}
                </p>
              ) : (
                <p id="d-file-help" className="mt-1 text-xs text-muted">
                  PDF, images, Word, Excel, CSV or text, up to 10 MB. Demo mode: the file stays in this browser tab only and is not permanently uploaded.
                </p>
              )}
            </div>
          </>
        )
      }}
    </FormModal>
  )
}
