import { useMemo } from 'react'
import { toPrimary } from '../lib/calc'
import { formatDate } from '../lib/dates'
import { useSettings } from '../lib/store'

const DECIMALS = { DJF: 0, USD: 2, EUR: 2 }

export function formatMoney(amount, currency) {
  const n = Number(amount) || 0
  const digits = DECIMALS[currency] ?? 2
  return `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

/** Formatting helpers bound to the current settings. */
export default function useFormat() {
  const settings = useSettings()
  return useMemo(
    () => ({
      settings,
      primary: settings.company.currency,
      money: formatMoney,
      /** Amount converted to the primary currency and formatted. */
      primaryMoney: (amount, currency = settings.company.currency) => formatMoney(toPrimary(amount, currency, settings), settings.company.currency),
      date: (iso) => formatDate(iso, settings.preferences.dateFormat),
      dateTime: (stamp) => {
        if (!stamp) return '—'
        const [d, t] = stamp.split('T')
        return `${formatDate(d, settings.preferences.dateFormat)}${t ? ` · ${t.slice(0, 5)}` : ''}`
      },
    }),
    [settings],
  )
}
