import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { resetDemoData } from '../../services/settingsService'
import { Button } from './Button'
import { ConfirmDialog } from './Modal'
import { useToast } from './Toast'

/** Restores the original sample data (with confirmation). */
export default function ResetDemoData() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const confirm = async () => {
    setBusy(true)
    await resetDemoData()
    setBusy(false)
    setOpen(false)
    toast.success('Demo data restored to the original sample.')
  }
  return (
    <>
      <Button icon={RotateCcw} onClick={() => setOpen(true)}>
        Reset demo data
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => !busy && setOpen(false)}
        onConfirm={confirm}
        busy={busy}
        title="Reset demo data?"
        message="All quotations, documents, messages, profile changes, team changes and read notifications made in this browser will be replaced with the original sample data."
        confirmLabel="Reset data"
      />
    </>
  )
}
