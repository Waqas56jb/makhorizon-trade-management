import { useState } from 'react'
import { Ban, CircleCheck, Play, RotateCcw } from 'lucide-react'
import { z } from 'zod'
import { optional, required } from '../../lib/schemas'
import { updateTaskStatus } from '../../services/taskService'
import FormModal from '../forms/FormModal'
import { Button } from '../ui/Button'
import { TextareaField } from '../ui/Fields'
import { useToast } from '../ui/Toast'

const blockSchema = z.object({ reason: required('Reason', 300) })
const completeSchema = z.object({ note: optional(500) })

/**
 * Status actions for a task, enforcing allowed transitions:
 * To Do → Start / Block · In Progress → Complete / Block · Blocked → Resume · Completed → none.
 * `compact` shows only the main next step (for lists and the dashboard).
 */
export default function TaskActions({ task, compact = false }) {
  const toast = useToast()
  const [modal, setModal] = useState(null)
  const [busy, setBusy] = useState(false)

  const quick = async (status, message) => {
    setBusy(true)
    try {
      await updateTaskStatus(task.id, status)
      toast.success(message)
    } catch (err) {
      toast.error(err.message, 'Not updated')
    } finally {
      setBusy(false)
    }
  }

  const size = compact ? 'sm' : undefined
  const buttons = []
  if (task.status === 'To Do') {
    buttons.push(<Button key="start" size={size} variant="primary" icon={Play} loading={busy} onClick={() => quick('In Progress', `${task.reference} started.`)}>Start task</Button>)
    if (!compact) buttons.push(<Button key="block" icon={Ban} onClick={() => setModal('block')} disabled={busy}>Mark blocked</Button>)
  } else if (task.status === 'In Progress') {
    buttons.push(<Button key="done" size={size} variant="primary" icon={CircleCheck} onClick={() => setModal('complete')} disabled={busy}>Mark complete</Button>)
    if (!compact) buttons.push(<Button key="block" icon={Ban} onClick={() => setModal('block')} disabled={busy}>Mark blocked</Button>)
  } else if (task.status === 'Blocked') {
    buttons.push(<Button key="resume" size={size} icon={RotateCcw} loading={busy} onClick={() => quick('In Progress', `${task.reference} resumed.`)}>Resume task</Button>)
  }

  return (
    <>
      {buttons}
      <FormModal
        open={modal === 'block'}
        onClose={() => setModal(null)}
        size="md"
        title="Mark task as blocked"
        description={`${task.reference} · ${task.title}`}
        schema={blockSchema}
        defaultValues={{ reason: '' }}
        onSubmit={(v) => updateTaskStatus(task.id, 'Blocked', v.reason)}
        successMessage={`${task.reference} marked blocked.`}
        submitLabel="Mark blocked"
      >
        {(form) => <TextareaField id={`block-${task.id}`} label="What is blocking this task?" required rows={3} hint="This reason is saved in the task history." registration={form.register('reason')} error={form.formState.errors.reason} />}
      </FormModal>
      <FormModal
        open={modal === 'complete'}
        onClose={() => setModal(null)}
        size="md"
        title="Mark task as complete"
        description={`${task.reference} · ${task.title}`}
        schema={completeSchema}
        defaultValues={{ note: '' }}
        onSubmit={(v) => updateTaskStatus(task.id, 'Completed', v.note)}
        successMessage={task.requiresApproval ? `${task.reference} completed and waiting for administrator review.` : `${task.reference} completed.`}
        submitLabel="Mark complete"
      >
        {(form) => (
          <>
            <TextareaField id={`done-${task.id}`} label="Completion note" hint="Optional." rows={3} registration={form.register('note')} error={form.formState.errors.note} />
            {task.requiresApproval && (
              <p className="rounded-lg bg-info/10 p-3 text-sm text-ink">
                This task needs administrator review. It will show as <strong>Pending review</strong>. In this demo no administrator is actually notified.
              </p>
            )}
          </>
        )}
      </FormModal>
    </>
  )
}
