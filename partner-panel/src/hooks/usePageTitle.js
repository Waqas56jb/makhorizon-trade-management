import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · MAKHORIZON Partner Portal` : 'MAKHORIZON Staff Portal'
  }, [title])
}
