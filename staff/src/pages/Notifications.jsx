import { useState } from 'react'
import { AlarmClock, BellRing, CheckCheck, ClipboardCheck, FileQuestion, Hourglass, Megaphone, Ship, TriangleAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { fmtDateTime } from '../hooks/useFormat'
import useMine from '../hooks/useMine'
import { cn } from '../lib/utils'
import { markNotificationRead, markNotificationsRead } from '../services/accountService'

const ICON = { assigned: ClipboardCheck, due: AlarmClock, overdue: TriangleAlert, shipment: Ship, document: FileQuestion, instructions: Megaphone, review: Hourglass }
const ACTION = { assigned: 'Open task', due: 'Open task', overdue: 'Open task', shipment: 'Open shipment', document: 'Open document', instructions: 'Open task', review: 'Open task' }

export default function Notifications() {
  const { notifications } = useMine()
  const navigate = useNavigate()
  const [unreadOnly, setUnreadOnly] = useState(false)
  const unread = notifications.filter((n) => !n.read)
  const list = unreadOnly ? unread : notifications

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Assignments, deadlines and requests. Generated in this demo — no email, SMS or push messages are sent."
        actions={
          <Button icon={CheckCheck} onClick={() => markNotificationsRead(notifications.map((n) => n.id))} disabled={!unread.length}>
            Mark all as read
          </Button>
        }
      />
      <div role="group" aria-label="Filter notifications" className="mb-4 flex gap-1.5">
        <button type="button" onClick={() => setUnreadOnly(false)} aria-pressed={!unreadOnly} className={cn('btn btn-sm', !unreadOnly ? 'btn-primary' : 'btn-secondary')}>
          All <span className="num">{notifications.length}</span>
        </button>
        <button type="button" onClick={() => setUnreadOnly(true)} aria-pressed={unreadOnly} className={cn('btn btn-sm', unreadOnly ? 'btn-primary' : 'btn-secondary')}>
          Unread <span className="num">{unread.length}</span>
        </button>
      </div>
      <Card>
        {list.length === 0 ? (
          <EmptyState icon={BellRing} title={unreadOnly ? 'No unread notifications' : 'No notifications'} message={unreadOnly ? 'You’re all caught up.' : 'New assignments and alerts will appear here.'} />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((n) => {
              const Icon = ICON[n.type] ?? BellRing
              return (
                <li key={n.id} className={cn('flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5', !n.read && 'bg-[#fbf8f1]')}>
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', n.type === 'overdue' ? 'bg-danger/10 text-danger' : 'bg-navy/5 text-navy')}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className={cn('text-sm', n.read ? 'text-ink' : 'font-semibold')}>
                        {!n.read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-gold align-middle" aria-hidden="true" />}
                        {n.title}
                        <span className="sr-only">{n.read ? ' (read)' : ' (unread)'}</span>
                      </p>
                      <p className="text-sm text-muted">{n.description}</p>
                      <p className="num mt-0.5 text-xs text-muted">
                        {fmtDateTime(n.at)}
                        {n.generated && ' · generated from your work'}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 pl-12 sm:pl-0">
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)} aria-label={`Mark “${n.title}” as read`}>
                        Mark read
                      </Button>
                    )}
                    {n.link && (
                      <Button
                        size="sm"
                        onClick={() => {
                          markNotificationRead(n.id)
                          navigate(n.link)
                        }}
                      >
                        {ACTION[n.type] ?? 'Open'}
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </>
  )
}
