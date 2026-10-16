import { useMemo, useState } from 'react'
import { ListChecks, RotateCcw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import TaskCard from '../components/tasks/TaskCard'
import { Button } from '../components/ui/Button'
import { FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { taskPriorities, taskStatuses } from '../data/tasks'
import useMine from '../hooks/useMine'
import { employeeName, isDueToday, isOpen, isOverdue, sortTasks } from '../lib/selectors'
import { cn, matchesSearch } from '../lib/utils'

const VIEWS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'today', label: 'Due today', test: isDueToday },
  { id: 'overdue', label: 'Overdue', test: isOverdue },
  { id: 'open', label: 'Open', test: isOpen },
  { id: 'completed', label: 'Completed', test: (t) => t.status === 'Completed' },
]

export default function MyTasks() {
  const mine = useMine()
  const [params] = useSearchParams()
  const [view, setView] = useState(() => (VIEWS.some((v) => v.id === params.get('view')) ? params.get('view') : 'all'))
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(() => (taskStatuses.includes(params.get('status')) ? params.get('status') : ''))
  const [priority, setPriority] = useState('')
  const [dueBy, setDueBy] = useState('')

  const counts = useMemo(() => Object.fromEntries(VIEWS.map((v) => [v.id, mine.tasks.filter(v.test).length])), [mine.tasks])

  const filtered = useMemo(() => {
    const viewTest = VIEWS.find((v) => v.id === view).test
    return sortTasks(
      mine.tasks.filter((t) => {
        const order = mine.orderById(t.orderId)
        const sh = mine.shipmentById(t.shipmentId)
        return (
          viewTest(t) &&
          matchesSearch([t.title, t.reference, order?.number, sh?.reference], query) &&
          (!status || t.status === status) &&
          (!priority || t.priority === priority) &&
          (!dueBy || t.dueDate <= dueBy)
        )
      }),
    )
  }, [mine, view, query, status, priority, dueBy])

  const active = view !== 'all' || query || status || priority || dueBy
  const reset = () => {
    setView('all')
    setQuery('')
    setStatus('')
    setPriority('')
    setDueBy('')
  }

  return (
    <>
      <PageHeader title="My Tasks" description="Tasks assigned to you. Overdue tasks are shown first." />

      <div role="group" aria-label="Quick filters" className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={cn('btn btn-sm shrink-0', view === v.id ? 'btn-primary' : 'btn-secondary', v.id === 'overdue' && counts.overdue > 0 && view !== v.id && 'text-danger')}
          >
            {v.label}
            <span className={cn('num rounded-full px-1.5 text-[0.68rem]', view === v.id ? 'bg-white/20' : 'bg-canvas')}>{counts[v.id]}</span>
          </button>
        ))}
      </div>

      <div className="card mb-5 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder="Search title or reference" label="Search tasks" />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={taskStatuses} />
          <FilterSelect label="Priority" value={priority} onChange={setPriority} options={taskPriorities} />
          <label className="flex items-center gap-2 text-xs text-muted">
            Due by
            <input type="date" value={dueBy} onChange={(e) => setDueBy(e.target.value)} className="field-control w-auto" aria-label="Due on or before" />
          </label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="num text-xs text-muted" aria-live="polite">
            {filtered.length} task{filtered.length === 1 ? '' : 's'}
          </span>
          {active && (
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {mine.tasks.length === 0 ? (
        <div className="card">
          <EmptyState icon={ListChecks} title="No tasks assigned" message="Tasks assigned to you by the administrator will appear here." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState title="No tasks match your filters" action={<Button onClick={reset}>Clear filters</Button>} />
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((t) => (
            <li key={t.id}>
              <TaskCard task={t} order={mine.orderById(t.orderId)} shipment={mine.shipmentById(t.shipmentId)} assignedByName={employeeName(mine.state, t.assignedBy)} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
