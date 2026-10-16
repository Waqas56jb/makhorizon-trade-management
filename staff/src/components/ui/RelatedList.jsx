import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from './Card'

/** Compact linked list of related records for detail pages. */
export default function RelatedList({ title, description, items, empty = 'None.', actions }) {
  return (
    <Card>
      <CardHeader title={title} description={description} actions={actions} />
      {items.length === 0 ? (
        <p className="p-5 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li key={i.key}>
              <Link to={i.to} className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafbfc]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{i.title}</span>
                  {i.sub && <span className="block truncate text-xs text-muted">{i.sub}</span>}
                </span>
                {i.badge}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
