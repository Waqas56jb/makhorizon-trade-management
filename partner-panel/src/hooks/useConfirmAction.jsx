import { useState } from 'react'
import { ConfirmDialog } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'

/**
 * Confirmation flow for destructive actions.
 * const del = useConfirmAction({ action: (row) => service.remove(row.id), ... })
 * del.ask(row) opens the dialog; render {del.dialog}.
 */
export default function useConfirmAction({ action, title, message, confirmLabel = 'Delete', success, onDone, tone = 'danger' }) {
  const toast = useToast()
  const [target, setTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const confirm = async () => {
    setBusy(true)
    try {
      await action(target)
      toast.success(typeof success === 'function' ? success(target) : success)
      const t = target
      setTarget(null)
      onDone?.(t)
    } catch (err) {
      toast.error(err.message, 'Action not completed')
      setTarget(null)
    } finally {
      setBusy(false)
    }
  }

  const dialog = (
    <ConfirmDialog
      open={!!target}
      onClose={() => !busy && setTarget(null)}
      onConfirm={confirm}
      busy={busy}
      tone={tone}
      confirmLabel={confirmLabel}
      title={target ? (typeof title === 'function' ? title(target) : title) : ''}
      message={target ? (typeof message === 'function' ? message(target) : message) : ''}
    />
  )

  return { ask: setTarget, dialog }
}
