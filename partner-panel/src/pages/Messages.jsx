import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Inbox, Link2, Send } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/Controls'
import { SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import usePartnerData from '../hooks/usePartnerData'
import { formatDate, formatDateTime } from '../lib/format'
import { lastMessage, relatedInfo } from '../lib/selectors'
import { cn, initials, matchesSearch } from '../lib/utils'
import { markConversationRead, MAX_MESSAGE_LENGTH, sendMessage } from '../services/messageService'

function Composer({ conversation }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const send = async (e) => {
    e?.preventDefault()
    setError('')
    setStatus('')
    if (!text.trim()) {
      setError('Type a message before sending.')
      return
    }
    setBusy(true)
    try {
      await sendMessage(conversation.id, text)
      setText('')
      setStatus('Message added to the conversation. Demo only — it was not delivered to MAKHORIZON.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={send} noValidate className="border-t border-line bg-white p-3 sm:p-4">
      <label htmlFor="message-body" className="sr-only">
        Message to {conversation.contact}
      </label>
      <div className="flex items-end gap-2">
        <textarea
          id="message-body"
          rows={2}
          value={text}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => {
            setText(e.target.value)
            if (error) setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) send(e)
          }}
          placeholder={`Write to ${conversation.contact}…`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby="message-help"
          className="field-control min-h-[2.75rem] flex-1 resize-none"
        />
        <Button type="submit" variant="primary" icon={Send} loading={busy} aria-label="Send message">
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
      <p id="message-help" role={error ? 'alert' : 'status'} className={cn('mt-1.5 text-xs', error ? 'font-medium text-danger' : status ? 'text-success' : 'text-muted')}>
        {error || status || 'Enter to send · Shift + Enter for a new line'}
      </p>
    </form>
  )
}

function Conversation({ conversation, data, onBack }) {
  const endRef = useRef(null)
  const rel = relatedInfo(conversation.related, data)
  const count = conversation.messages.length

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [count, conversation.id])

  return (
    <section aria-label={`Conversation with ${conversation.contact}`} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm btn-icon md:hidden" aria-label="Back to conversations">
          <ArrowLeft aria-hidden="true" />
        </button>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">{initials(conversation.contact)}</span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{conversation.contact}</h2>
          <p className="truncate text-xs text-muted">MAKHORIZON · {conversation.department}</p>
        </div>
        {rel && (
          <Link to={rel.to} className="hidden shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium hover:bg-canvas sm:flex">
            <Link2 className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            {rel.label}
          </Link>
        )}
      </header>
      <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-canvas/60 px-4 py-4" aria-label="Message history">
        {conversation.messages.map((m, i) => {
          const day = m.at.slice(0, 10)
          const showDay = i === 0 || conversation.messages[i - 1].at.slice(0, 10) !== day
          const mine = m.from === 'partner'
          return (
            <li key={m.id}>
              {showDay && <p className="num my-2 text-center text-[0.7rem] font-medium uppercase tracking-wide text-muted">{formatDate(day)}</p>}
              <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-card sm:max-w-[70%]', mine ? 'rounded-br-sm bg-navy text-white' : 'rounded-bl-sm border border-line bg-white')}>
                  <p className={cn('text-[0.7rem] font-semibold', mine ? 'text-gold-light' : 'text-gold-deep')}>{mine ? `${m.senderName} (you)` : `${m.senderName} · MAKHORIZON`}</p>
                  <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">{m.body}</p>
                  <p className={cn('num mt-1 text-right text-[0.68rem]', mine ? 'text-white/60' : 'text-muted')}>{formatDateTime(m.at).split(' · ')[1]}</p>
                </div>
              </div>
            </li>
          )
        })}
        <li ref={endRef} aria-hidden="true" />
      </ol>
      <Composer conversation={conversation} />
    </section>
  )
}

export default function Messages() {
  const data = usePartnerData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const activeId = params.get('c')
  const active = data.conversations.find((c) => c.id === activeId)

  // Opening a conversation marks it as read (demo state).
  useEffect(() => {
    if (active?.unread) markConversationRead(active.id)
  }, [active])

  const select = (id) => setParams(id ? { c: id } : {}, { replace: false })
  const list = data.conversations.filter((c) => matchesSearch([c.contact, c.department, c.related?.id, lastMessage(c)?.body], query))

  return (
    <>
      <PageHeader title="Messages" description="Conversations with MAKHORIZON’s coordination teams. These team identities are demo contacts, not real individuals." />
      <DemoNotice className="mb-4" title="Demo messaging">
        Messages are stored in this browser only. No email, WhatsApp or other external service is used, and no automatic replies are generated.
      </DemoNotice>
      <div className="card flex h-[calc(100dvh-15rem)] min-h-[28rem] overflow-hidden">
        <div className={cn('flex w-full shrink-0 flex-col border-r border-line md:w-80', active && 'hidden md:flex')}>
          <div className="border-b border-line p-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Search conversations" label="Search conversations" />
          </div>
          {list.length === 0 ? (
            <EmptyState icon={Inbox} title={data.conversations.length ? 'No matching conversations' : 'No conversations yet'} />
          ) : (
            <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto" aria-label="Conversations">
              {list.map((c) => {
                const last = lastMessage(c)
                const rel = relatedInfo(c.related, data)
                const selected = c.id === active?.id
                return (
                  <li key={c.id}>
                    <button type="button" onClick={() => select(c.id)} aria-current={selected ? 'true' : undefined} className={cn('flex w-full items-start gap-3 px-4 py-3 text-left transition-colors', selected ? 'bg-[#fbf8f1]' : 'hover:bg-canvas')}>
                      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/5 text-xs font-bold text-navy">
                        {initials(c.contact)}
                        {c.unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-white" aria-hidden="true" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={cn('truncate text-sm', c.unread ? 'font-semibold' : 'font-medium')}>{c.contact}</span>
                          <span className="num shrink-0 text-[0.68rem] text-muted">{formatDate(last?.at)}</span>
                        </span>
                        <span className="block truncate text-xs text-muted">{c.department}</span>
                        <span className={cn('mt-0.5 block truncate text-xs', c.unread ? 'text-ink' : 'text-muted')}>
                          {last?.from === 'partner' ? 'You: ' : ''}
                          {last?.body}
                        </span>
                        <span className="mt-1 flex items-center gap-2">
                          {rel && <span className="rounded bg-canvas px-1.5 py-0.5 text-[0.65rem] font-medium text-muted">{rel.short}</span>}
                          {c.unread > 0 && <span className="rounded-full bg-gold px-1.5 text-[0.65rem] font-bold text-midnight">{c.unread} unread</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        {active ? (
          <Conversation key={active.id} conversation={active} data={data} onBack={() => select(null)} />
        ) : (
          <div className="hidden flex-1 md:flex">
            <EmptyState icon={Inbox} title="Select a conversation" message="Choose a conversation to read the message history and reply." className="m-auto" />
          </div>
        )}
      </div>
    </>
  )
}
