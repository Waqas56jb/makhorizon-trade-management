import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const cls = 'btn btn-ghost btn-sm btn-icon text-muted hover:text-ink'

/** View / Edit / Delete icon buttons with descriptive labels. */
export default function RowActions({ label, viewTo, onEdit, onDelete }) {
  return (
    <>
      {viewTo && (
        <Link to={viewTo} className={cls} aria-label={`View ${label}`} title="View">
          <Eye aria-hidden="true" />
        </Link>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} className={cls} aria-label={`Edit ${label}`} title="Edit">
          <Pencil aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} className={`${cls} hover:!text-danger`} aria-label={`Delete ${label}`} title="Delete">
          <Trash2 aria-hidden="true" />
        </button>
      )}
    </>
  )
}

export function CellLink({ to, children, sub }) {
  return (
    <div className="min-w-0">
      <Link to={to} className="font-medium text-ink hover:text-gold-deep hover:underline">
        {children}
      </Link>
      {sub && <div className="truncate text-xs text-muted">{sub}</div>}
    </div>
  )
}
