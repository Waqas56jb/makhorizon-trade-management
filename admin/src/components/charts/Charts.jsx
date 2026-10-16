import { useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMoney } from '../../hooks/useFormat'
import { EmptyState } from '../ui/States'

// Palette validated with the dataviz checks (lightness, chroma, CVD, contrast).
const SERIES = { income: '#1f6aa5', expense: '#b8862b' }
const GRID = '#e9edf1'
const AXIS = { fontSize: 11, fill: '#647282' }

const compact = (n) => {
  const a = Math.abs(n)
  if (a >= 1e9) return `${(n / 1e9).toFixed(1).replace(/\.0$/, '')}B`
  if (a >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`
  if (a >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return String(n)
}

function TooltipBox({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-pop">
      <p className="mb-1 font-semibold text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="num flex items-center gap-2 text-ink">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} aria-hidden="true" />
          <span className="text-muted">{p.name}</span>
          <span className="ml-auto pl-3 font-medium">{currency ? formatMoney(p.value, currency) : p.value}</span>
        </p>
      ))}
    </div>
  )
}

function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-4 text-xs text-muted" aria-hidden="true">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  )
}

function ViewToggle({ table, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className="btn btn-ghost btn-sm" aria-pressed={table}>
      {table ? <BarChart3 aria-hidden="true" /> : <Table2 aria-hidden="true" />}
      {table ? 'Chart' : 'Table'}
    </button>
  )
}

/** Monthly income vs expenses (grouped columns, primary currency). */
export function IncomeExpenseChart({ data, currency, height = 260 }) {
  const [table, setTable] = useState(false)
  const hasData = data.some((d) => d.income || d.expenses)
  if (!hasData) return <EmptyState title="No income or expenses in this period" message="Records within the selected range will appear here." />
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <Legend items={[{ label: 'Income', color: SERIES.income }, { label: 'Expenses', color: SERIES.expense }]} />
        <ViewToggle table={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {table ? (
        <div className="overflow-x-auto">
          <table className="table-base">
            <caption className="sr-only">Monthly recorded income and expenses in {currency}</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col" className="text-right">Income</th>
                <th scope="col" className="text-right">Expenses</th>
                <th scope="col" className="text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.month}>
                  <td>{d.label}</td>
                  <td className="num text-right">{formatMoney(d.income, currency)}</td>
                  <td className="num text-right">{formatMoney(d.expenses, currency)}</td>
                  <td className="num text-right">{formatMoney(d.income - d.expenses, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div role="img" aria-label={`Column chart of monthly income and expenses in ${currency}. Use the Table button for exact values.`} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={2} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
              <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={compact} width={44} />
              <Tooltip cursor={{ fill: 'rgb(23 43 58 / 0.04)' }} content={<TooltipBox currency={currency} />} />
              <Bar dataKey="income" name="Income" fill={SERIES.income} radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="expenses" name="Expenses" fill={SERIES.expense} radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

/** Single-series horizontal bars for counts by status. */
export function CountBarChart({ data, label, height }) {
  const [table, setTable] = useState(false)
  const total = data.reduce((s, d) => s + d.count, 0)
  if (!total) return <EmptyState title="No records yet" />
  const h = height ?? Math.max(160, data.length * 34 + 20)
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <ViewToggle table={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {table ? (
        <table className="table-base">
          <caption className="sr-only">{label}</caption>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col" className="text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td className="num text-right">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div role="img" aria-label={`${label}: ${data.map((d) => `${d.name} ${d.count}`).join(', ')}.`} style={{ height: h }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 28, bottom: 0, left: 0 }} barCategoryGap="30%">
              <CartesianGrid horizontal={false} stroke={GRID} />
              <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={AXIS} tickLine={false} axisLine={false} width={112} />
              <Tooltip cursor={{ fill: 'rgb(23 43 58 / 0.04)' }} content={<TooltipBox />} />
              <Bar dataKey="count" name="Records" fill={SERIES.income} radius={[0, 4, 4, 0]} maxBarSize={20} label={{ position: 'right', fontSize: 11, fill: '#263746' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
