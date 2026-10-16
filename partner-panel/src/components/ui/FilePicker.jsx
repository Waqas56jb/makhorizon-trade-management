import { useId, useRef, useState } from 'react'
import { CircleAlert, FileText, Paperclip, X } from 'lucide-react'
import { formatFileSize } from '../../lib/format'
import { cn } from '../../lib/utils'
import { ALLOWED_EXTENSIONS, MAX_FILE_BYTES, validateFile } from '../../services/documentService'

/**
 * Local file selection. Files stay in this browser tab — they are NOT uploaded.
 * `files` is an array of File objects; `onChange` receives the new array.
 */
export default function FilePicker({ files, onChange, multiple = false, label = 'File', required, error, hint, maxFiles = 5 }) {
  const id = useId()
  const inputRef = useRef(null)
  const [localError, setLocalError] = useState('')
  const shownError = localError || error

  const add = (list) => {
    setLocalError('')
    const picked = [...list]
    const problems = picked.map((f) => [f, validateFile(f)]).filter(([, e]) => e)
    if (problems.length) setLocalError(`${problems[0][0].name}: ${problems[0][1]}`)
    const valid = picked.filter((f) => !validateFile(f))
    if (multiple) {
      const merged = [...files, ...valid.filter((f) => !files.some((x) => x.name === f.name && x.size === f.size))]
      if (merged.length > maxFiles) setLocalError(`You can attach up to ${maxFiles} files.`)
      onChange(merged.slice(0, maxFiles))
    } else if (valid[0]) onChange([valid[0]])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <p id={`${id}-label`} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </p>
      <label
        htmlFor={id}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          add(e.dataTransfer.files)
        }}
        className={cn('flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-5 text-center transition-colors hover:border-navy hover:bg-canvas focus-within:border-navy', shownError ? 'border-danger' : 'border-[#c9d2da]')}
      >
        <Paperclip className="h-5 w-5 text-muted" aria-hidden="true" />
        <span className="text-sm font-semibold text-navy">{multiple ? 'Choose files' : files.length ? 'Choose a different file' : 'Choose a file'}</span>
        <span className="text-xs text-muted">or drag and drop · {ALLOWED_EXTENSIONS.join(', ').toUpperCase()} · max {formatFileSize(MAX_FILE_BYTES)}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple={multiple}
          accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(',')}
          onChange={(e) => add(e.target.files)}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          aria-invalid={shownError ? 'true' : 'false'}
          className="sr-only"
        />
      </label>
      {shownError ? (
        <p role="alert" className="mt-1 flex items-start gap-1 text-xs font-medium text-danger">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {shownError}
        </p>
      ) : null}
      <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
        {hint ?? 'Files are only selected in this browser for the demo. They are not uploaded to a server.'}
      </p>
      {files.length > 0 && (
        <ul className="mt-2 divide-y divide-line rounded-lg border border-line" aria-label="Selected files">
          {files.map((f) => (
            <li key={`${f.name}-${f.size}`} className="flex items-center gap-3 px-3 py-2">
              <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{f.name}</span>
                <span className="num block text-xs text-muted">{formatFileSize(f.size)}</span>
              </span>
              <button type="button" onClick={() => onChange(files.filter((x) => x !== f))} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-danger" aria-label={`Remove ${f.name}`}>
                <X aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
