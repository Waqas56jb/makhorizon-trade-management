import { useState } from 'react'
import { ArrowLeftRight, Pencil, Trash2, TriangleAlert } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { InventoryFormModal, MovementFormModal } from '../components/forms/InventoryForms'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList, StatCard } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedTable from '../components/ui/RelatedTable'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { movementDelta, stockStatus } from '../lib/calc'
import { useAppState } from '../lib/store'
import { inventoryService } from '../services/inventoryService'
import NotFound from './NotFound'

export default function InventoryDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const item = s.inventory.find((i) => i.id === id)

  const del = useConfirmAction({
    action: (i) => inventoryService.remove(i.id),
    title: 'Delete inventory item?',
    message: (i) => `${i.name} and its movement history will be permanently removed from the demo data.`,
    success: (i) => `${i.name} deleted.`,
    onDone: () => navigate('/inventory'),
  })

  if (!item) return <NotFound title="Item not found" backTo="/inventory" backLabel="Back to inventory" />
  const supplier = s.suppliers.find((x) => x.id === item.supplierId)
  const status = stockStatus(item)

  // Running balance (oldest → newest), shown newest first.
  const movements = s.movements
    .filter((m) => m.itemId === id)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .reduce((acc, m) => [...acc, { ...m, delta: movementDelta(m), balance: (acc.at(-1)?.balance ?? 0) + movementDelta(m) }], [])
    .reverse()

  return (
    <>
      <PageHeader
        title={item.name}
        meta={<StatusBadge status={status} />}
        description={`${item.sku} · ${item.category}`}
        breadcrumbs={[{ label: 'Inventory', to: '/inventory' }, { label: item.name }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(item)}>
              Delete
            </Button>
            <Button icon={Pencil} onClick={() => setModal('edit')}>
              Edit
            </Button>
            <Button variant="primary" icon={ArrowLeftRight} onClick={() => setModal('movement')}>
              Record movement
            </Button>
          </>
        }
      />
      {status !== 'In Stock' && (
        <p role="status" className="mb-5 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-ink">
          <TriangleAlert className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          {status === 'Out of Stock' ? 'This item is out of stock.' : `Stock is at or below the minimum level of ${item.minStock} ${item.unit}.`}
        </p>
      )}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Available quantity" value={`${item.quantity.toLocaleString('en-US')} ${item.unit}`} tone={status === 'In Stock' ? 'navy' : 'warning'} />
        <StatCard label="Minimum stock level" value={`${item.minStock.toLocaleString('en-US')} ${item.unit}`} />
        <StatCard label="Stock value at cost" value={f.money(item.quantity * item.cost, f.primary)} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader title="Item information" />
          <div className="p-5">
            <DetailList
              columns={1}
              items={[
                { label: 'SKU / reference', value: <span className="font-mono">{item.sku}</span> },
                { label: 'Category', value: item.category },
                { label: 'Description', value: item.description },
                { label: 'Purchase cost', value: f.money(item.cost, f.primary) },
                { label: 'Reference selling price', value: item.price ? f.money(item.price, f.primary) : '' },
                { label: 'Supplier', value: supplier ? <Link to={`/suppliers/${supplier.id}`} className="hover:underline">{supplier.company}</Link> : '' },
                { label: 'Storage location', value: item.location },
              ]}
            />
          </div>
        </Card>
        <RelatedTable
          title="Stock movement history"
          description="Received stock adds, issued stock subtracts, adjustments can be either."
          rows={movements}
          emptyText="No movements recorded."
          actions={<Button size="sm" icon={ArrowLeftRight} onClick={() => setModal('movement')}>Record movement</Button>}
          columns={[
            { header: 'Date', cell: (m) => f.date(m.date) },
            { header: 'Type', cell: (m) => <Badge tone={m.type === 'Received' ? 'success' : m.type === 'Issued' ? 'info' : 'gold'}>{m.type}</Badge> },
            { header: 'Change', align: 'right', cell: (m) => <span className={m.delta < 0 ? 'text-danger' : 'text-success'}>{m.delta > 0 ? '+' : ''}{m.delta.toLocaleString('en-US')}</span> },
            { header: 'Balance', align: 'right', cell: (m) => m.balance.toLocaleString('en-US') },
            { header: 'Reason', cell: (m) => m.reason },
            { header: 'Reference', cell: (m) => m.reference || '—' },
          ]}
        />
      </div>
      <InventoryFormModal open={modal === 'edit'} item={item} onClose={() => setModal(null)} />
      <MovementFormModal open={modal === 'movement'} item={item} onClose={() => setModal(null)} />
      {del.dialog}
    </>
  )
}
