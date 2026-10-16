import { assertOwn, commit, currentUser, getState, nowStamp, own, pause, replaceById, ServiceError, uid } from './base'

/**
 * Partner ↔ MAKHORIZON conversations. Messages are stored in the demo store only:
 * no email, WhatsApp or external messaging is used, and no automatic replies are generated.
 * Integration points: GET /api/conversations, POST /api/conversations/:id/messages,
 * POST /api/conversations/:id/read (later with realtime updates).
 */
export const MAX_MESSAGE_LENGTH = 2000

export async function getConversations() {
  await pause()
  return own(getState().conversations)
}

export async function sendMessage(conversationId, body) {
  await pause(250)
  const user = currentUser()
  assertOwn(getState().conversations.find((c) => c.id === conversationId), 'Conversation')
  const text = body.trim()
  if (!text) throw new ServiceError('Type a message before sending.')
  if (text.length > MAX_MESSAGE_LENGTH) throw new ServiceError(`Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`)
  const msg = { id: uid('MS'), at: nowStamp(), from: 'partner', senderName: user.name, body: text }
  commit((s) => ({ ...s, conversations: replaceById(s.conversations, conversationId, (c) => ({ messages: [...c.messages, msg] })) }))
  return msg
}

/** Synchronous so the unread badge updates the moment a conversation opens. */
export function markConversationRead(conversationId) {
  const conv = getState().conversations.find((c) => c.id === conversationId)
  if (!conv || conv.partnerId !== currentUser().partnerId || !conv.unread) return
  commit((s) => ({ ...s, conversations: replaceById(s.conversations, conversationId, { unread: 0 }) }))
}
