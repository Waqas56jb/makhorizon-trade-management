import { useMemo } from 'react'
import { useAuth } from '../lib/auth'
import { todayISO } from '../lib/dates'
import { selectPartnerData } from '../lib/selectors'
import { useAppState } from '../lib/store'

/** Records visible to the signed-in partner, plus derived counts and lookups. */
export default function usePartnerData() {
  const s = useAppState()
  const { session } = useAuth()
  const userId = session?.userId
  return useMemo(() => {
    const data = selectPartnerData(s, userId, todayISO())
    const find = (list) => (id) => list.find((x) => x.id === id)
    return {
      ...data,
      opportunityById: find(data.opportunities),
      quotationById: find(data.quotations),
      orderById: find(data.orders),
      shipmentById: find(data.shipments),
      documentById: find(data.documents),
    }
  }, [s, userId])
}
