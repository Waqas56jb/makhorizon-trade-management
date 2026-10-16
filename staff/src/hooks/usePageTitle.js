import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · MAKHORIZON Staff Portal` : 'MAKHORIZON Staff Portal'
  }, [title])
}
