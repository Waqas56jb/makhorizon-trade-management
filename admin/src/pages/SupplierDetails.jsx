import { useMemo, useState } from 'react'
import { FilePlus, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { SupplierFormModal } from '../components/forms/ContactForms'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { RecordFormModal } from '../components/forms/FinanceForms'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, StatCard } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedTable from '../components/ui/RelatedTable'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { stockStatus, supplierPayable, toPrimary } from '../lib/calc'
import { useAppState } from '../lib/store'
import { supplierService } from '../services/contactServices'
import NotFound from './NotFound'

export default function SupplierDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null) // 'edit' | 'purchase' | 'document'
  const supplier = s.suppliers.find((x) => x.id === id)

  const rel = useMemo(() => {
    const items = s.inventory.filter((i) => i.supplierId === id)
    const records = s.records.filter((r) => r.supplierId === id).sort((a, b) => b.date.localeCompare(a.date))
    const docs = s.documents.filter((d) => d.relatedType === 'supplier' && d.relatedId === id)
    const paid = records.filter((r) => r.status === 'Paid').reduce((sum, r) => sum + toPrimary(r.amount, r.currency, s.settings), 0)
    return { items, records, docs, paid, payable: supplierPayable(id, s) }
  }, [s, id])

  const del = useConfirmAction({
    action: (x) => supplierService.remove(x.id),
    title: 'Delete supplier?',
    message: (x) => `${x.company} will be permanently removed from the demo data.`,
    success: (x) => `${x.company} deleted.`,
    onDone: () => navigate('/suppliers'),
  })

  if (!supplier) return <NotFound title="Supplier not found" backTo="/suppliers" backLabel="Back to suppliers" />

  return (
    <>
      <PageHeader
        title={supplier.company}
        meta={<StatusBadge status={supplier.status} />}
        description={`${supplier.category} · ${supplier.country}`}
        breadcrumbs={[{ label: 'Suppliers', to: '/suppliers' }, { label: supplier.company }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(supplier)}>
              Delete
            </Button>
            <Button icon={Pencil} onClick={() => setModal('edit')}>
              Edit
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setModal('purchase')}>
              Record purchase
            </Button>
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Contact details" />
            <div className="space-y-3 p-5 text-sm">
              <p className="font-medium">{supplier.contactName}</p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <a href={`mailto:${supplier.email}`} className="break-all hover:underline">
                  {supplier.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {supplier.phone || <span className="text-muted">Not provided</span>}
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {[supplier.address, supplier.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Supplied products and services" />
            <div className="p-5 text-sm">
              <p>
                <span className="text-muted">Category:</span> {supplier.category}
              </p>
              {rel.items.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {rel.items.map((i) => (
                    <li key={i.id} className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium">
                      {i.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-muted">No inventory items linked yet.</p>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader title="Internal notes" />
            <p className="whitespace-pre-line p-5 text-sm">{supplier.notes || <span className="text-muted">No notes.</span>}</p>
          </Card>
        </div>
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Outstanding payable" value={f.money(rel.payable, f.primary)} hint="Pending expense records" tone={rel.payable ? 'warning' : 'navy'} />
            <StatCard label="Paid to supplier" value={f.money(rel.paid, f.primary)} hint="Paid expense records" />
          </div>
          <RelatedTable
            title="Purchases and payments"
            description="Expense records linked to this supplier."
            rows={rel.records}
            actions={<Button size="sm" icon={Plus} onClick={() => setModal('purchase')}>Record purchase</Button>}
            columns={[
              { header: 'Date', cell: (r) => f.date(r.date) },
              { header: 'Description', cell: (r) => r.description },
              { header: 'Reference', cell: (r) => r.reference || '—' },
              { header: 'Amount', align: 'right', cell: (r) => f.money(r.amount, r.currency) },
              { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
          <RelatedTable
            title="Inventory supplied"
            rows={rel.items}
            linkTo={(i) => `/inventory/${i.id}`}
            columns={[
              { header: 'Item', cell: (i) => i.name },
              { header: 'SKU', cell: (i) => i.sku },
              { header: 'Quantity', align: 'right', cell: (i) => `${i.quantity} ${i.unit}` },
              { header: 'Stock', cell: (i) => <StatusBadge status={stockStatus(i)} /> },
            ]}
          />
          <RelatedTable
            title="Documents"
            rows={rel.docs}
            linkTo={(d) => `/documents/${d.id}`}
            actions={<Button size="sm" icon={FilePlus} onClick={() => setModal('document')}>Add document</Button>}
            columns={[
              { header: 'Name', cell: (d) => d.name },
              { header: 'Type', cell: (d) => d.type },
              { header: 'Added', cell: (d) => f.date(d.uploadDate) },
            ]}
          />
        </div>
      </div>
      <SupplierFormModal open={modal === 'edit'} supplier={supplier} onClose={() => setModal(null)} />
      <RecordFormModal open={modal === 'purchase'} prefill={{ type: 'Expense', category: 'Supplier Purchase', supplierId: supplier.id }} onClose={() => setModal(null)} />
      <DocumentFormModal open={modal === 'document'} prefill={{ relatedType: 'supplier', relatedId: supplier.id }} onClose={() => setModal(null)} />
      {del.dialog}
    </>
  )
}
