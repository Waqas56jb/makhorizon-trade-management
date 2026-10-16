import { useCallback, useState } from 'react'

/** Tracks idle → submitting → success | error for a submission service call. */
export default function useDemoSubmit(serviceFn) {
  const [state, setState] = useState({ status: 'idle', result: null, error: null })

  const submit = useCallback(
    async (data) => {
      setState({ status: 'submitting', result: null, error: null })
      try {
        const result = await serviceFn(data)
        if (!result?.ok) throw new Error('The submission could not be completed.')
        setState({ status: 'success', result, error: null })
      } catch (err) {
        setState({ status: 'error', result: null, error: err?.message || 'Something went wrong. Please try again.' })
      }
    },
    [serviceFn],
  )

  const reset = useCallback(() => setState({ status: 'idle', result: null, error: null }), [])

  return { ...state, submit, reset }
}
