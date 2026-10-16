import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Card, CardHeader } from './Card'
import { EmptyState } from './States'

/** Compact related-records card used on detail pages. */
export default function RelatedTable({ title, description, rows, columns, emptyText = 'None yet.', actions, getKey = (r) => r.id, linkTo }) {
  return (
    <Card>
      <CardHeader title={title} description={description} actions={actions} as="h2" />
      {rows.length === 0 ? (
        <EmptyState className="py-8" title={emptyText} />
      ) : (
        <div className="overflow-x-auto">
          <table className="table-base">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.header} scope="col" className={cn(c.align === 'right' && 'text-right')}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={getKey(r)}>
                  {columns.map((c, i) => (
                    <td key={c.header} className={cn(c.align === 'right' && 'num text-right', 'whitespace-nowrap')}>
                      {i === 0 && linkTo ? (
                        <Link to={linkTo(r)} className="font-medium hover:text-gold-deep hover:underline">
                          {c.cell(r)}
                        </Link>
                      ) : (
                        c.cell(r)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
