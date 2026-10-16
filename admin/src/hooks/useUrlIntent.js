import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Reads one-off "intent" query params (e.g. ?new=1&quotation=QT-001) once,
 * then removes them from the URL so a refresh doesn't repeat the action.
 * Filter params listed in `keep` stay in the URL.
 */
export default function useUrlIntent(intentKeys) {
  const [params, setParams] = useSearchParams()
  const [intent] = useState(() => Object.fromEntries(intentKeys.map((k) => [k, params.get(k)])))

  useEffect(() => {
    if (!intentKeys.some((k) => params.has(k))) return
    const next = new URLSearchParams(params)
    intentKeys.forEach((k) => next.delete(k))
    setParams(next, { replace: true })
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { intent, params }
}
