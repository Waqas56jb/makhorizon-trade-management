import { useState } from 'react'
import { CircleCheck, ClipboardList, FileText, Hourglass, Megaphone, Ship, TriangleAlert } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import NoteForm from '../components/forms/NoteForm'
import TaskActions from '../components/tasks/TaskActions'
import { PriorityBadge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import History, { NotesList } from '../components/ui/History'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import { fmtDate, fmtDateTime } from '../hooks/useFormat'
import useMine from '../hooks/useMine'
import { relativeDays } from '../lib/dates'
import { employeeName, isDueToday, isOverdue, taskDisplayStatus } from '../lib/selectors'
import { addTaskNote, updateTaskProgress } from '../services/taskService'
import NotFound from './NotFound'

function ProgressControl({ task }) {
  const toast = useToast()
  const [value, setValue] = useState(task.progress)
  const [saving, setSaving] = useState(false)
  const editable = task.status === 'In Progress'
  const save = async () => {
    setSaving(true)
    try {
      await updateTaskProgress(task.id, value)
      toast.success(`Progress saved: ${value}%.`)
    } catch (err) {
      toast.error(err.message, 'Not saved')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={`progress-${task.id}`} className="font-medium">
          Progress
        </label>
        <span className="num font-semibold">{value}%</span>
      </div>
      <input
        id={`progress-${task.id}`}
        type="range"
        min="0"
        max="100"
        step="10"
        value={value}
        disabled={!editable || saving}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-2 w-full accent-navy disabled:opacity-60"
      />
      {editable ? (
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={save} loading={saving} disabled={value === task.progress}>
            Save progress
          </Button>
        </div>
      ) : (
        <p className="mt-1 text-xs text-muted">Progress can be updated while the task is In Progress.</p>
      )}
    </div>
  )
}

export default function TaskDetails() {
  const { id } = useParams()
  const mine = useMine()
  const task = mine.tasks.find((t) => t.id === id)
  if (!task) return <NotFound title="Task not found" message="This task doesn’t exist or isn’t assigned to you." backTo="/my-tasks" backLabel="Back to my tasks" />

  const order = mine.orderById(task.orderId)
  const shipment = mine.shipmentById(task.shipmentId)
  const docs = task.documentIds.map((did) => mine.documents.find((d) => d.id === did)).filter(Boolean)
  const status = taskDisplayStatus(task)
  const overdue = isOverdue(task)

  return (
    <>
      <PageHeader
        title={task.title}
        meta={
          <>
            <StatusBadge status={status} />
            <PriorityBadge priority={task.priority} />
          </>
        }
        description={`${task.reference} · assigned by ${employeeName(mine.state, task.assignedBy)}`}
        breadcrumbs={[{ label: 'My Tasks', to: '/my-tasks' }, { label: task.reference }]}
        actions={<TaskActions task={task} />}
      />

      {overdue && (
        <p role="alert" className="mb-5 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm">
          <TriangleAlert className="h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
          This task was due {relativeDays(task.dueDate)}. Update its status or mark it blocked with a reason.
        </p>
      )}
      {task.status === 'Blocked' && (
        <p className="mb-5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm">
          <strong>Blocked:</strong> {task.blockedReason}
        </p>
      )}
      {status === 'Pending Review' && (
        <p role="status" className="mb-5 flex items-start gap-2 rounded-lg border border-info/30 bg-info/10 px-4 py-3 text-sm">
          <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
          <span>
            Completed on {fmtDateTime(task.completedAt)} and <strong>waiting for administrator review</strong>. It has not been approved yet. Demo mode: no administrator was actually notified.
          </span>
        </p>
      )}
      {status === 'Completed' && (
        <p role="status" className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm">
          <CircleCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          Completed on {fmtDateTime(task.completedAt)}.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Task details" />
            <div className="space-y-5 p-5">
              <p className="whitespace-pre-line text-sm leading-relaxed">{task.description}</p>
              <DetailList
                columns={3}
                items={[
                  { label: 'Reference', value: <span className="font-mono">{task.reference}</span> },
                  { label: 'Assigned', value: fmtDateTime(task.assignedAt) },
                  { label: 'Due date', value: <span className={overdue ? 'font-semibold text-danger' : isDueToday(task) ? 'font-semibold text-warning' : ''}>{fmtDate(task.dueDate)}{isDueToday(task) && ' (today)'}</span> },
                  { label: 'Priority', value: task.priority },
                  { label: 'Status', value: status },
                  { label: 'Review', value: task.requiresApproval ? 'Administrator review required' : 'Not required' },
                ]}
              />
              {task.supportsProgress && <ProgressControl key={`${task.status}-${task.progress}`} task={task} />}
            </div>
          </Card>

          <Card className="border-gold/40">
            <div className="flex items-start gap-3 p-5">
              <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">Instructions from the administrator</h2>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{task.instructions || 'No additional instructions.'}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Notes" description="Operational notes for this task." />
            <div className="space-y-5 p-5">
              <NotesList notes={task.notes} />
              <NoteForm id={`note-${task.id}`} placeholder="e.g. Supplier confirmed the document will arrive tomorrow." onSubmit={(text) => addTaskNote(task.id, text)} />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Related work" />
            <ul className="divide-y divide-line">
              <li className="flex items-start gap-3 px-5 py-3 text-sm">
                <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {order ? (
                  <div>
                    <Link to={`/orders/${order.id}`} className="font-semibold hover:underline">
                      {order.number}
                    </Link>
                    <p className="text-xs text-muted">{order.client.company}</p>
                  </div>
                ) : (
                  <span className="text-muted">No related order</span>
                )}
              </li>
              <li className="flex items-start gap-3 px-5 py-3 text-sm">
                <Ship className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {shipment ? (
                  <div>
                    <Link to={`/shipments/${shipment.id}`} className="font-semibold hover:underline">
                      {shipment.reference}
                    </Link>
                    <p className="text-xs text-muted">
                      {shipment.origin} → {shipment.destination} · {shipment.status}
                    </p>
                  </div>
                ) : (
                  <span className="text-muted">No related shipment</span>
                )}
              </li>
            </ul>
          </Card>
          <Card>
            <CardHeader title="Documents" />
            {docs.length === 0 ? (
              <p className="p-5 text-sm text-muted">No document references.</p>
            ) : (
              <ul className="divide-y divide-line">
                {docs.map((d) => (
                  <li key={d.id}>
                    <Link to={`/documents/${d.id}`} className="flex items-start gap-3 px-5 py-3 text-sm hover:bg-[#fafbfc]">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{d.name}</span>
                        <span className="block text-xs text-muted">{d.type}</span>
                      </span>
                      <StatusBadge status={d.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Status history" />
            <div className="p-5">
              <History entries={task.history} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
