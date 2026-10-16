import { myTasks } from '../lib/selectors'
import { assertAssigned, commit, currentEmployee, getState, nowStamp, pause, replaceById, ServiceError, uid } from './base'

/**
 * Allowed task transitions:
 *   To Do → In Progress (start) or Blocked
 *   In Progress → Completed or Blocked
 *   Blocked → In Progress (resume)
 *   Completed → none
 */
export const TASK_TRANSITIONS = {
  'To Do': ['In Progress', 'Blocked'],
  'In Progress': ['Completed', 'Blocked'],
  Blocked: ['In Progress'],
  Completed: [],
}

const find = (id) => assertAssigned(getState().tasks.find((t) => t.id === id), 'Task')

export async function getMyTasks() {
  await pause()
  return myTasks(getState(), currentEmployee().id)
}

export async function getTaskById(id) {
  await pause()
  return find(id)
}

/**
 * Changes a task's status. Blocking requires a reason; completion notes are optional.
 * Tasks needing approval enter a pending-review state (no administrator is notified in the demo).
 */
export async function updateTaskStatus(id, status, note = '') {
  await pause()
  const task = find(id)
  const emp = currentEmployee()
  if (task.status === status) throw new ServiceError(`This task is already ${status}.`)
  if (!TASK_TRANSITIONS[task.status].includes(status)) throw new ServiceError(`A task that is ${task.status} cannot be changed to ${status}.`)
  if (status === 'Blocked' && !note.trim()) throw new ServiceError('Please give a short reason for blocking this task.')

  const at = nowStamp()
  const patch = { status, history: [...task.history, { at, from: task.status, to: status, by: emp.name, note: note.trim() }] }
  if (status === 'Blocked') patch.blockedReason = note.trim()
  if (status === 'In Progress') patch.blockedReason = ''
  if (status === 'Completed') {
    patch.completedAt = at
    patch.progress = task.supportsProgress ? 100 : task.progress
    if (task.requiresApproval) patch.reviewState = 'pending'
  }

  const verb = { 'In Progress': task.status === 'Blocked' ? 'Resumed' : 'Started', Completed: 'Completed', Blocked: 'Blocked' }[status]
  commit((s) => {
    let next = { ...s, tasks: replaceById(s.tasks, id, patch) }
    if (status === 'Completed' && task.requiresApproval) {
      next = {
        ...next,
        notifications: [
          { id: uid('NT'), employeeId: emp.id, at, type: 'review', title: 'Submitted for review', description: `${task.reference} is awaiting administrator review. Demo mode: no administrator was actually notified.`, link: `/tasks/${id}`, read: false },
          ...next.notifications,
        ],
      }
    }
    return next
  }, { message: `${verb} ${task.reference}`, link: `/tasks/${id}` })
  return status
}

export async function addTaskNote(id, text) {
  await pause()
  const task = find(id)
  const clean = text.trim()
  if (!clean) throw new ServiceError('Note cannot be empty.')
  const note = { id: uid('N'), at: nowStamp(), by: currentEmployee().name, text: clean }
  commit((s) => ({ ...s, tasks: replaceById(s.tasks, id, { notes: [...task.notes, note] }) }), { message: `Added a note to ${task.reference}`, link: `/tasks/${id}` })
  return note.id
}

/** Progress (0–100) for tasks that support it, while In Progress. */
export async function updateTaskProgress(id, progress) {
  await pause()
  const task = find(id)
  const value = Math.round(Number(progress))
  if (!task.supportsProgress) throw new ServiceError('Progress is not tracked for this task.')
  if (task.status !== 'In Progress') throw new ServiceError('Progress can be updated only while the task is In Progress.')
  if (!(value >= 0 && value <= 100)) throw new ServiceError('Progress must be between 0 and 100.')
  commit((s) => ({ ...s, tasks: replaceById(s.tasks, id, { progress: value }) }), { message: `Updated ${task.reference} progress to ${value}%`, link: `/tasks/${id}` })
  return value
}
