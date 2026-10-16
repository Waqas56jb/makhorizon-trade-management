import { teamRoles } from '../data/partners'
import { assertOwn, commit, currentUser, getState, nowStamp, own, pause, replaceById, ServiceError, uid } from './base'

/**
 * Team members of the partner's own organisation. Invitations are SIMULATED —
 * no email is sent. Kept deliberately simple: Company Owners and Managers may
 * manage the team; real authorisation will be enforced by the backend.
 * Integration points: GET /api/team, POST /api/team/invitations,
 * PATCH /api/team/:id, DELETE /api/team/:id.
 */
export const canManageTeam = (user) => ['Company Owner', 'Manager'].includes(user?.role)

function assertManager() {
  const me = currentUser()
  if (!canManageTeam(me)) throw new ServiceError('Only Company Owners and Managers can manage team members.')
  return me
}

const owners = (list, pid) => list.filter((u) => u.partnerId === pid && u.role === 'Company Owner' && u.status !== 'Invitation Pending')

export async function getTeamMembers() {
  await pause()
  return own(getState().users)
}

export async function inviteMember({ name, email, role }) {
  await pause(450)
  const me = assertManager()
  const normalized = email.trim().toLowerCase()
  if (!teamRoles.includes(role)) throw new ServiceError('Select a valid role.')
  if (role === 'Company Owner' && me.role !== 'Company Owner') throw new ServiceError('Only a Company Owner can invite another owner.')
  if (getState().users.some((u) => u.email.toLowerCase() === normalized)) throw new ServiceError('A team member with this email already exists.')
  const member = { id: uid('TM'), partnerId: me.partnerId, name: name.trim(), email: email.trim(), role, status: 'Invitation Pending', lastActive: '', invitedAt: nowStamp().slice(0, 10) }
  commit((s) => ({ ...s, users: [...s.users, member] }), { message: `Invitation simulated for ${member.name}`, status: 'Invitation Pending', link: '/users' })
  return member
}

export async function changeRole(id, role) {
  await pause()
  const me = assertManager()
  const member = assertOwn(getState().users.find((u) => u.id === id), 'Team member')
  if (!teamRoles.includes(role)) throw new ServiceError('Select a valid role.')
  if (member.id === me.id) throw new ServiceError('You cannot change your own role.')
  if ((role === 'Company Owner' || member.role === 'Company Owner') && me.role !== 'Company Owner') throw new ServiceError('Only a Company Owner can change owner roles.')
  if (member.role === 'Company Owner' && role !== 'Company Owner' && owners(getState().users, me.partnerId).length <= 1) throw new ServiceError('The organisation needs at least one active Company Owner.')
  commit((s) => ({ ...s, users: replaceById(s.users, id, { role }) }), { message: `${member.name}’s role changed to ${role}`, status: 'Saved', link: '/users' })
}

export async function removeMember(id) {
  await pause()
  const me = assertManager()
  const member = assertOwn(getState().users.find((u) => u.id === id), 'Team member')
  if (member.id === me.id) throw new ServiceError('You cannot remove yourself.')
  if (member.role === 'Company Owner' && me.role !== 'Company Owner') throw new ServiceError('Only a Company Owner can remove another owner.')
  commit((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }), { message: `${member.name} removed from the team`, status: 'Removed', link: '/users' })
}
