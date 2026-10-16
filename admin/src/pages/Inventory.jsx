import { useMemo, useState } from 'react'
import { ArrowLeftRight, Boxes, Download, Plus } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { InventoryFormModal, MovementFormModal } from '../components/forms/InventoryForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, StatCard } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import RowActions, { CellLink } from '../components/ui/RowActions'
import { EmptyState } from '../components/ui/States'
import { inventoryCategories } from '../data/inventory'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import useListState from '../hooks/useListState'
import { stockStatus } from '../lib/calc'
import { downloadCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { useAppState } from '../lib/store'
import { inventoryService } from '../services/inventoryService'

const STOCK_OPTIONS = [{ value: 'attention', label: 'Low or out of stock' }, 'In Stock', 'Low Stock', 'Out of Stock'].map((o) => (typeof o === 'string' ? { value: o, label: o } : o))

export default function Inventory() {
  const s = useAppState()
  const f = useFormat()
  const [modal, setModal] = useState({ type: null, item: null })
  const [params] = useSearchParams()

  const rows = useMemo(() => s.inventory.map((i) => ({ ...i, stock: stockStatus(i), value: i.quantity * i.cost })), [s.inventory])
  const list = useListState(
    rows,
    (r) => [r.name, r.sku, r.category, r.location],
    {
      stock: (r, v) => (v === 'attention' ? r.stock !== 'In Stock' : r.stock === v),
      category: (r, v) => r.category === v,
    },
    { stock: params.get('stock') ?? '' },
  )
  const totals = useMemo(() => ({ value: rows.reduce((sum, r) => sum + r.value, 0), attention: rows.filter((r) => r.stock !== 'In Stock').length }), [rows])

  const del = useConfirmAction({
    action: (i) => inventoryService.remove(i.id),
    title: 'Delete inventory item?',
    message: (i) => `${i.name} (${i.sku}) and its stock movement history will be permanently removed from the demo data.`,
    success: (i) => `${i.name} deleted.`,
  })

  const exportCSV = () =>
    downloadCSV(`makhorizon-inventory-${todayISO()}.csv`, list.filtered, [
      { header: 'SKU', value: (r) => r.sku },
      { header: 'Item', value: (r) => r.name },
      { header: 'Category', value: (r) => r.category },
      { header: 'Quantity', value: (r) => r.quantity },
      { header: 'Unit', value: (r) => r.unit },
      { header: 'Minimum stock', value: (r) => r.minStock },
      { header: `Purchase cost (${f.primary})`, value: (r) => r.cost },
      { header: `Reference price (${f.primary})`, value: (r) => r.price ?? '' },
      { header: 'Stock status', value: (r) => r.stock },
      { header: 'Location', value: (r) => r.location },
    ])

  const columns = [
    { key: 'name', header: 'Item', mobile: 'title', sort: (r) => r.name, cell: (r) => <CellLink to={`/inventory/${r.id}`} sub={r.location}>{r.name}</CellLink> },
    { key: 'sku', header: 'SKU', mobile: 'subtitle', sort: (r) => r.sku, cell: (r) => <span className="font-mono text-xs">{r.sku}</span> },
    { key: 'category', header: 'Category', sort: (r) => r.category },
    { key: 'qty', header: 'Available', align: 'right', mobile: true, sort: (r) => r.quantity, cell: (r) => r.quantity.toLocaleString('en-US') },
    { key: 'unit', header: 'Unit' },
    { key: 'cost', header: 'Cost', align: 'right', sort: (r) => r.cost, cell: (r) => f.money(r.cost, f.primary) },
    { key: 'price', header: 'Ref. price', align: 'right', sort: (r) => r.price ?? -1, cell: (r) => (r.price ? f.money(r.price, f.primary) : <span className="text-muted">—</span>) },
    { key: 'stock', header: 'Stock', mobile: true, sort: (r) => r.stock, cell: (r) => <StatusBadge status={r.stock} /> },
  ]

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Products and materials held in stock. Quantities change only through recorded stock movements."
        actions={
          <>
            <Button icon={Download} onClick={exportCSV} disabled={!list.filtered.length}>
              Export CSV
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setModal({ type: 'item', item: null })}>
              Add item
            </Button>
          </>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Inventory items" value={rows.length} icon={Boxes} />
        <StatCard label="Low or out of stock" value={totals.attention} tone={totals.attention ? 'warning' : 'navy'} hint="At or below minimum level" />
        <StatCard label="Stock value at cost" value={f.money(totals.value, f.primary)} hint="Quantity × purchase cost" />
      </div>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search item, SKU, category" label="Search inventory" />
          <FilterSelect label="Stock" value={list.filters.stock ?? ''} onChange={(v) => list.setFilter('stock', v)} options={STOCK_OPTIONS} />
          <FilterSelect label="Category" value={list.filters.category ?? ''} onChange={(v) => list.setFilter('category', v)} options={inventoryCategories} />
        </FilterBar>
        <DataTable
          caption="Inventory items"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          initialSort={{ key: 'name', dir: 'asc' }}
          actions={(r) => (
            <>
              <button type="button" onClick={() => setModal({ type: 'movement', item: r })} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-ink" aria-label={`Record stock movement for ${r.name}`} title="Record movement">
                <ArrowLeftRight aria-hidden="true" />
              </button>
              <RowActions label={r.name} viewTo={`/inventory/${r.id}`} onEdit={() => setModal({ type: 'item', item: r })} onDelete={() => del.ask(r)} />
            </>
          )}
          empty={s.inventory.length === 0 ? <EmptyState icon={Boxes} title="No inventory items yet" /> : <EmptyState title="No items match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>
      <InventoryFormModal open={modal.type === 'item'} item={modal.item} onClose={() => setModal({ type: null, item: null })} />
      <MovementFormModal open={modal.type === 'movement'} item={modal.item ? s.inventory.find((i) => i.id === modal.item.id) : null} onClose={() => setModal({ type: null, item: null })} />
      {del.dialog}
    </>
  )
}
