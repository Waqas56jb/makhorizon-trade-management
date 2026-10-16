import { useState } from 'react'
import { Bell, CheckCheck, ClipboardList, FileText, FolderOpen, MailOpen, MessagesSquare, Ship } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import usePartnerData from '../hooks/usePartnerData'
import { formatDateTime } from '../lib/format'
import { cn } from '../lib/utils'
import { markAllNotificationsRead, markNotificationRead, markNotificationUnread } from '../services/notificationService'

const ICONS = { quotation: FileText, order: ClipboardList, shipment: Ship, document: FolderOpen, message: MessagesSquare }

export default function Notifications() {
  const { notifications, unreadNotifications } = usePartnerData()
  const navigate = useNavigate()
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const list = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Updates about your quotations, orders, shipments, documents and messages."
        actions={
          <Button
            icon={CheckCheck}
            disabled={!unreadNotifications}
            onClick={() => {
              markAllNotificationsRead()
              toast.success('All notifications marked as read.')
            }}
          >
            Mark all as read
          </Button>
        }
      />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div role="group" aria-label="Filter notifications" className="flex rounded-lg border border-[#d5dce3] p-0.5">
            {[
              { v: 'all', label: `All (${notifications.length})` },
              { v: 'unread', label: `Unread (${unreadNotifications})` },
            ].map(({ v, label }) => (
              <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v} className={cn('num rounded-md px-3 py-1.5 text-sm font-medium', filter === v ? 'bg-navy text-white' : 'text-muted hover:text-ink')}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">Select a notification to open the related record.</p>
        </div>
        {list.length === 0 ? (
          <EmptyState icon={Bell} title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'} message={filter === 'unread' ? 'You’re all caught up.' : undefined} />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((n) => {
              const Icon = ICONS[n.type] ?? Bell
              return (
                <li key={n.id} className={cn('flex items-start gap-3 px-4 py-3.5 sm:px-5', !n.read && 'bg-[#fbf8f1]')}>
                  <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', n.read ? 'bg-canvas text-muted' : 'bg-gold/15 text-gold-deep')}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      markNotificationRead(n.id)
                      navigate(n.link || '/notifications')
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className={cn('flex items-center gap-2 text-sm', n.read ? 'font-medium text-ink' : 'font-semibold')}>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />}
                      <span className="hover:underline">{n.title}</span>
                      <span className="sr-only">{n.read ? '(read)' : '(unread)'}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{n.description}</span>
                    <span className="num mt-1 block text-xs text-muted">{formatDateTime(n.at)}</span>
                  </button>
                  {n.read ? (
                    <button type="button" onClick={() => markNotificationUnread(n.id)} className="btn btn-ghost btn-sm shrink-0 text-muted" aria-label={`Mark “${n.title}” as unread`}>
                      <MailOpen aria-hidden="true" />
                      <span className="hidden sm:inline">Mark unread</span>
                    </button>
                  ) : (
                    <button type="button" onClick={() => markNotificationRead(n.id)} className="btn btn-ghost btn-sm shrink-0" aria-label={`Mark “${n.title}” as read`}>
                      <CheckCheck aria-hidden="true" />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </>
  )
}
