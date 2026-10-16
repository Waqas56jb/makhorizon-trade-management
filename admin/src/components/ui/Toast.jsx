import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const ToastContext = createContext(null)

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info }
const TONES = { success: 'border-success/30 text-success', error: 'border-danger/30 text-danger', info: 'border-info/30 text-info' }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const seq = useRef(0)

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback(
    (type, message, title) => {
      const id = ++seq.current
      setToasts((t) => [...t.slice(-3), { id, type, message, title }])
      setTimeout(() => dismiss(id), type === 'error' ? 6500 : 4000)
    },
    [dismiss],
  )
  const api = useMemo(
    () => ({
      success: (m, t) => push('success', m, t),
      error: (m, t) => push('error', m, t),
      info: (m, t) => push('info', m, t),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="no-print pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          return (
            <div key={t.id} role={t.type === 'error' ? 'alert' : 'status'} className={cn('pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-3.5 shadow-pop', TONES[t.type])}>
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1 text-sm text-ink">
                {t.title && <p className="font-semibold">{t.title}</p>}
                <p className={t.title ? 'text-muted' : ''}>{t.message}</p>
              </div>
              <button type="button" onClick={() => dismiss(t.id)} className="rounded p-0.5 text-muted hover:text-ink" aria-label="Dismiss notification">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)
