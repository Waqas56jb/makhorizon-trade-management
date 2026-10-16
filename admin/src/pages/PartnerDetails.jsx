import { useState } from 'react'
import { ExternalLink, FilePlus, Globe, Mail, MapPin, Pencil, Phone, Plus, Trash2, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { OpportunityFormModal, PartnerFormModal } from '../components/forms/ContactForms'
import { DocumentFormModal } from '../components/forms/DocumentForm'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import RelatedTable from '../components/ui/RelatedTable'
import { EmptyState } from '../components/ui/States'
import useConfirmAction from '../hooks/useConfirmAction'
import useFormat from '../hooks/useFormat'
import { useAppState } from '../lib/store'
import { partnerService } from '../services/contactServices'
import NotFound from './NotFound'

export default function PartnerDetails() {
  const { id } = useParams()
  const s = useAppState()
  const f = useFormat()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const partner = s.partners.find((p) => p.id === id)
  const docs = s.documents.filter((d) => d.relatedType === 'partner' && d.relatedId === id)

  const del = useConfirmAction({
    action: (p) => partnerService.remove(p.id),
    title: 'Delete partner?',
    message: (p) => `${p.company} will be permanently removed from the demo data.`,
    success: (p) => `${p.company} deleted.`,
    onDone: () => navigate('/partners'),
  })
  const delOpp = useConfirmAction({
    action: (o) => partnerService.removeOpportunity(id, o.id),
    title: 'Remove opportunity?',
    message: (o) => `“${o.title}” will be removed from this partner.`,
    confirmLabel: 'Remove',
    success: 'Opportunity removed.',
  })

  if (!partner) return <NotFound title="Partner not found" backTo="/partners" backLabel="Back to partners" />
  const website = partner.website && (partner.website.startsWith('http') ? partner.website : `https://${partner.website}`)

  return (
    <>
      <PageHeader
        title={partner.company}
        meta={
          <>
            <StatusBadge status={partner.status} />
            <Badge tone="gold">{partner.type}</Badge>
          </>
        }
        description={`${partner.contact} · ${partner.country}`}
        breadcrumbs={[{ label: 'Partners', to: '/partners' }, { label: partner.company }]}
        actions={
          <>
            <Button icon={Trash2} onClick={() => del.ask(partner)}>
              Delete
            </Button>
            <Button variant="primary" icon={Pencil} onClick={() => setModal('edit')}>
              Edit
            </Button>
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Contact information" />
            <div className="space-y-3 p-5 text-sm">
              <p className="font-medium">{partner.contact}</p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <a href={`mailto:${partner.email}`} className="break-all hover:underline">
                  {partner.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {partner.phone || <span className="text-muted">Not provided</span>}
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {partner.country}
              </p>
              <p className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {website ? (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    {partner.website}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="text-muted">No website</span>
                )}
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Notes" />
            <p className="whitespace-pre-line p-5 text-sm">{partner.notes || <span className="text-muted">No notes.</span>}</p>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Business opportunities" description="Simple log of discussions with this partner." actions={<Button size="sm" icon={Plus} onClick={() => setModal('opportunity')}>Add</Button>} />
            {partner.opportunities.length === 0 ? (
              <EmptyState className="py-8" title="No opportunities recorded" />
            ) : (
              <ul className="divide-y divide-line">
                {partner.opportunities.map((o) => (
                  <li key={o.id} className="flex items-start gap-4 px-5 py-3.5">
                    <span className="num w-24 shrink-0 text-xs text-muted">{f.date(o.date)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{o.title}</p>
                      {o.note && <p className="mt-0.5 text-sm text-muted">{o.note}</p>}
                    </div>
                    <Button variant="ghost" size="sm" iconOnly icon={X} aria-label={`Remove opportunity ${o.title}`} onClick={() => delOpp.ask(o)} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <RelatedTable
            title="Documents"
            rows={docs}
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
      <PartnerFormModal open={modal === 'edit'} partner={partner} onClose={() => setModal(null)} />
      <OpportunityFormModal open={modal === 'opportunity'} partner={partner} onClose={() => setModal(null)} />
      <DocumentFormModal open={modal === 'document'} prefill={{ relatedType: 'partner', relatedId: partner.id }} onClose={() => setModal(null)} />
      {del.dialog}
      {delOpp.dialog}
    </>
  )
}
