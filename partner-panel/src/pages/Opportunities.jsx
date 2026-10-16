import { useMemo, useState } from 'react'
import { CalendarClock, LayoutGrid, List, MapPin, Search, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { opportunityCategories, opportunityRegions, opportunityStatuses } from '../data/opportunities'
import useListState from '../hooks/useListState'
import usePartnerData from '../hooks/usePartnerData'
import { relativeDays } from '../lib/dates'
import { budgetLabel, formatDate } from '../lib/format'
import { cn } from '../lib/utils'

const PAGE = 6

function Meta({ icon: Icon, children }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </span>
  )
}

function OpportunityCard({ o, view }) {
  const closing = o.displayStatus === 'Open' || o.displayStatus === 'Closing Soon'
  return (
    <article className={cn('card flex h-full flex-col p-5 transition-shadow hover:shadow-pop', view === 'list' && 'sm:flex-row sm:items-center sm:gap-6')}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="num text-xs font-semibold text-gold-deep">{o.id}</span>
          <StatusBadge status={o.displayStatus} />
          <Badge>{o.category}</Badge>
        </div>
        <h2 className="mt-2 text-[0.98rem] font-semibold leading-snug">
          <Link to={`/opportunities/${o.id}`} className="hover:text-gold-deep hover:underline">
            {o.title}
          </Link>
        </h2>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{o.summary}</p>
        <div className={cn('mt-4 grid gap-2', view === 'list' ? 'sm:grid-cols-3' : 'grid-cols-1')}>
          <Meta icon={MapPin}>{o.destination}</Meta>
          <Meta icon={Wallet}>{budgetLabel(o.budget)}</Meta>
          <Meta icon={CalendarClock}>
            {o.closingDate ? `Closes ${formatDate(o.closingDate)}${closing ? ` (${relativeDays(o.closingDate)})` : ''}` : 'No closing date'}
          </Meta>
        </div>
      </div>
      <div className={cn('mt-5 flex', view === 'list' && 'sm:mt-0 sm:shrink-0')}>
        <Link to={`/opportunities/${o.id}`} className="btn btn-secondary btn-sm w-full sm:w-auto" aria-label={`View details: ${o.title}`}>
          View details
        </Link>
      </div>
    </article>
  )
}

export default function Opportunities() {
  const data = usePartnerData()
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const list = useListState(
    data.opportunities,
    (o) => [o.title, o.id],
    {
      category: (o, v) => o.category === v,
      region: (o, v) => o.region === v,
      status: (o, v) => o.displayStatus === v,
    },
  )
  const sorted = useMemo(() => {
    const rows = [...list.filtered]
    if (sort === 'closing') {
      // Open opportunities closing first; closed ones after.
      const open = (o) => (['Open', 'Closing Soon'].includes(o.displayStatus) ? 0 : 1)
      return rows.sort((a, b) => open(a) - open(b) || a.closingDate.localeCompare(b.closingDate))
    }
    return rows.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }, [list.filtered, sort])

  const [visible, setVisible] = useState(PAGE)
  const key = `${list.resetKey}|${sort}`
  const [prevKey, setPrevKey] = useState(key)
  if (prevKey !== key) {
    setPrevKey(key)
    setVisible(PAGE)
  }
  const shown = sorted.slice(0, visible)

  return (
    <>
      <PageHeader title="Trade Opportunities" description="Opportunities made available by MAKHORIZON to approved partners. Review the details and submit a quotation." />
      <DemoNotice className="mb-4" title="Illustrative demo opportunities">
        These records are sample data for demonstration. They are not real tenders, verified contracts or buyer commitments.
      </DemoNotice>
      <Card className="mb-4">
        <FilterBar active={list.active} onReset={list.reset} resultCount={sorted.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search title or reference" label="Search opportunities" />
          <FilterSelect label="Category" value={list.filters.category ?? ''} onChange={(v) => list.setFilter('category', v)} options={opportunityCategories} />
          <FilterSelect label="Region" value={list.filters.region ?? ''} onChange={(v) => list.setFilter('region', v)} options={opportunityRegions} />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={opportunityStatuses} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort opportunities" className="field-control w-auto flex-none">
            <option value="newest">Sort: Newest first</option>
            <option value="closing">Sort: Closing date</option>
          </select>
          <div className="hidden items-center rounded-lg border border-[#d5dce3] p-0.5 sm:flex" role="group" aria-label="Layout">
            {[
              { v: 'grid', icon: LayoutGrid, label: 'Grid view' },
              { v: 'list', icon: List, label: 'List view' },
            ].map(({ v, icon: Icon, label }) => (
              <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} aria-label={label} title={label} className={cn('flex h-8 w-8 items-center justify-center rounded-md', view === v ? 'bg-navy text-white' : 'text-muted hover:bg-canvas')}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </FilterBar>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState icon={Search} title="No opportunities match your filters" message="Try a different keyword, category or region." action={<Button onClick={list.reset}>Reset filters</Button>} />
        </Card>
      ) : (
        <>
          <ul className={cn('grid gap-4', view === 'grid' ? 'sm:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1')}>
            {shown.map((o) => (
              <li key={o.id}>
                <OpportunityCard o={o} view={view} />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col items-center gap-2">
            <p className="num text-xs text-muted" aria-live="polite">
              Showing {shown.length} of {sorted.length} opportunities
            </p>
            {visible < sorted.length && <Button onClick={() => setVisible((v) => v + PAGE)}>Load more</Button>}
          </div>
        </>
      )}
    </>
  )
}
