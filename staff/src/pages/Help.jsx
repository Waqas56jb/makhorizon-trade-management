import { useId, useState } from 'react'
import { ChevronDown, ClipboardList, FilePlus, ListChecks, MessageCircle, Search, Ship, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { cn } from '../lib/utils'
import ResetDemoData from '../components/ui/ResetDemoData'

const GUIDES = [
  { icon: ListChecks, title: 'Review your tasks', to: '/my-tasks', steps: ['Open My Tasks. Overdue tasks are at the top.', 'Use “Due today” or “Overdue” to focus.', 'Open a task to read the full description and the administrator’s instructions.'] },
  { icon: ListChecks, title: 'Update a task', to: '/my-tasks', steps: ['Press “Start task” when you begin.', 'Press “Mark complete” when finished. A note is optional.', 'If a task needs review, it shows “Pending review” until the administrator checks it.'] },
  { icon: Ship, title: 'Record a shipment update', to: '/my-shipments', steps: ['Open the shipment from My Shipments.', 'Press “Record update” and choose the new status.', 'Use “Mark delivered” only when delivery is confirmed — you will be asked to confirm.'] },
  { icon: ClipboardList, title: 'Find an order', to: '/my-orders', steps: ['Open My Orders, or type the order number in the search box at the top of any page.', 'Open the order to see its tasks, shipment and documents.', 'Use “Add an operational update” to record progress.'] },
  { icon: FilePlus, title: 'Add a document', to: '/documents', steps: ['Open Documents and press “Add document”.', 'Enter the name and type, and link it to an order or shipment.', 'Choose the file. In this demo the file is not uploaded — only its details are saved.'] },
  { icon: TriangleAlert, title: 'Report a delay or blocker', to: '/my-tasks', steps: ['For a task: press “Mark blocked” and explain the reason.', 'For a shipment: record the “Delayed” status with a short reason.', 'Tell your administrator about anything urgent.'] },
]

const FAQS = [
  { q: 'Why can’t I see some orders or shipments?', a: 'The portal shows only the work assigned to you. If something is missing, ask your administrator to assign it.' },
  { q: 'Can I change prices or delete orders?', a: 'No. Prices, commercial terms, cancellations and deletions are handled by the administrator. You can add operational updates.' },
  { q: 'Are my files uploaded?', a: 'Not in this demo. Files you choose stay in your browser tab for preview only. Document storage will be connected later.' },
  { q: 'Does the administrator see my updates?', a: 'Not in this demo. Updates are saved only in this browser. When the system is connected to the server, updates will be shared.' },
  { q: 'What does “Pending review” mean?', a: 'You completed a task that the administrator must check. It is not approved yet.' },
  { q: 'How do I start again with the sample data?', a: 'Use “Reset demo data” below or on your profile page. All demo changes in this browser are replaced.' },
]

function Faq({ item }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="border-b border-line last:border-0">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold hover:bg-[#fafbfc]">
          {item.q}
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </h3>
      <div id={id} role="region" hidden={!open} className="px-5 pb-4 text-sm text-muted">
        {item.a}
      </div>
    </div>
  )
}

export default function Help() {
  return (
    <>
      <PageHeader title="Help & Instructions" description="Quick guides for everyday work in the staff portal." />
      <section aria-label="How-to guides" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GUIDES.map((g) => (
          <Card key={g.title} as="article" className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5 text-navy">
                <g.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="text-sm font-semibold">{g.title}</h2>
            </div>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink">
              {g.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <Link to={g.to} className="mt-3 inline-block text-xs font-semibold text-navy hover:underline">
              Go there →
            </Link>
          </Card>
        ))}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Frequently asked questions" />
          {FAQS.map((f) => (
            <Faq key={f.q} item={f} />
          ))}
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">Contact your administrator</h2>
                <p className="mt-1 text-sm text-muted">No support contact has been configured for this demo. Please contact your administrator through the company’s usual communication channel.</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Search className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">Tip: quick search</h2>
                <p className="mt-1 text-sm text-muted">
                  Press <kbd className="rounded border border-line bg-canvas px-1.5 text-xs">/</kbd> on any page to search your tasks, orders, shipments and documents.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Demo data</h2>
            <p className="mt-1 text-sm text-muted">Start again with the original sample records.</p>
            <div className="mt-3">
              <ResetDemoData />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
