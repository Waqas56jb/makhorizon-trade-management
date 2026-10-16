import { useState } from 'react'
import { Trash2, UserPlus, Users } from 'lucide-react'
import { z } from 'zod'
import FormModal from '../components/forms/FormModal'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DemoNotice } from '../components/ui/Controls'
import DataTable from '../components/ui/DataTable'
import { SelectField, TextField } from '../components/ui/Fields'
import { FilterBar, FilterSelect, SearchInput } from '../components/ui/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { teamRoles } from '../data/partners'
import useConfirmAction from '../hooks/useConfirmAction'
import useListState from '../hooks/useListState'
import usePartnerData from '../hooks/usePartnerData'
import { formatDate } from '../lib/format'
import { email, required } from '../lib/schemas'
import { initials } from '../lib/utils'
import { canManageTeam, changeRole, inviteMember, removeMember } from '../services/teamService'

const inviteSchema = z.object({ name: required('Name', 120), email, role: z.string().min(1, 'Select a role.') })

const ROLE_HELP = {
  'Company Owner': 'Full access, including team management',
  Manager: 'Manage quotations, orders, documents and team',
  'Staff Member': 'Work on quotations, orders and documents',
  Viewer: 'Read-only access',
}

export default function TeamMembers() {
  const { team, user } = usePartnerData()
  const toast = useToast()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [savingRole, setSavingRole] = useState('')
  const manager = canManageTeam(user)
  const list = useListState(team, (m) => [m.name, m.email], { role: (m, v) => m.role === v, status: (m, v) => m.status === v })
  const remove = useConfirmAction({
    action: (m) => removeMember(m.id),
    title: (m) => `Remove ${m.name}?`,
    message: (m) => `${m.name} (${m.email}) will lose access to your company’s partner portal. Demo only — no account is actually changed.`,
    confirmLabel: 'Remove member',
    success: (m) => `${m.name} was removed from the team.`,
  })

  const onRole = async (m, role) => {
    setSavingRole(m.id)
    try {
      await changeRole(m.id, role)
      toast.success(`${m.name} is now ${role}.`)
    } catch (err) {
      toast.error(err.message, 'Role not changed')
    } finally {
      setSavingRole('')
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      mobile: 'title',
      sort: (m) => m.name,
      cell: (m) => (
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/5 text-xs font-bold text-navy" aria-hidden="true">
            {initials(m.name)}
          </span>
          <span className="font-medium">
            {m.name}
            {m.id === user?.id && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}
          </span>
        </span>
      ),
    },
    { key: 'email', header: 'Email', mobile: 'subtitle', sort: (m) => m.email, cell: (m) => <span className="break-all">{m.email}</span> },
    {
      key: 'role',
      header: 'Role',
      mobile: true,
      mobileFull: true,
      sort: (m) => teamRoles.indexOf(m.role),
      cell: (m) =>
        manager && m.id !== user?.id ? (
          <select value={m.role} onChange={(e) => onRole(m, e.target.value)} disabled={savingRole === m.id} aria-label={`Role for ${m.name}`} className="field-control h-8 min-h-8 w-auto py-1 text-[0.82rem]">
            {teamRoles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        ) : (
          m.role
        ),
    },
    { key: 'status', header: 'Status', mobile: true, sort: (m) => m.status, cell: (m) => <StatusBadge status={m.status} /> },
    { key: 'active', header: 'Last active', mobile: true, sort: (m) => m.lastActive || null, cell: (m) => (m.lastActive ? formatDate(m.lastActive) : <span className="text-muted">{m.invitedAt ? `Invited ${formatDate(m.invitedAt)}` : '—'}</span>), className: 'whitespace-nowrap', hideBelow: 'xl' },
  ]

  return (
    <>
      <PageHeader
        title="Team Members"
        description="People from your organisation who can access this partner portal."
        actions={
          manager && (
            <Button variant="primary" icon={UserPlus} onClick={() => setInviteOpen(true)}>
              Invite team member
            </Button>
          )
        }
      />
      <DemoNotice className="mb-4" title="Simulated invitations">
        Invitations are recorded in this browser only. No email is sent and no account is created. Real access rules will be enforced by the backend.
      </DemoNotice>
      <Card>
        <FilterBar active={list.active} onReset={list.reset} resultCount={list.filtered.length}>
          <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search name or email" label="Search team members" />
          <FilterSelect label="Role" value={list.filters.role ?? ''} onChange={(v) => list.setFilter('role', v)} options={teamRoles} />
          <FilterSelect label="Status" value={list.filters.status ?? ''} onChange={(v) => list.setFilter('status', v)} options={['Active', 'Invitation Pending']} />
        </FilterBar>
        <DataTable
          caption="Team members"
          columns={columns}
          rows={list.filtered}
          resetKey={list.resetKey}
          actions={
            manager
              ? (m) =>
                  m.id !== user?.id && (
                    <button type="button" onClick={() => remove.ask(m)} className="btn btn-ghost btn-sm btn-icon text-muted hover:text-danger" aria-label={`Remove ${m.name}`} title="Remove">
                      <Trash2 aria-hidden="true" />
                    </button>
                  )
              : undefined
          }
          empty={<EmptyState icon={Users} title="No team members match your filters" action={<Button onClick={list.reset}>Reset filters</Button>} />}
        />
      </Card>

      <Card className="mt-5">
        <dl className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {teamRoles.map((r) => (
            <div key={r}>
              <dt className="text-sm font-semibold">{r}</dt>
              <dd className="text-xs text-muted">{ROLE_HELP[r]}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <FormModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite team member"
        description="Simulated — no invitation email will be sent."
        size="md"
        schema={inviteSchema}
        defaultValues={{ name: '', email: '', role: 'Staff Member' }}
        onSubmit={inviteMember}
        submitLabel="Send invitation (demo)"
        successMessage={(v) => `Invitation simulated for ${v.name}. Status: Invitation Pending.`}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-4">
            <TextField id="inv-name" label="Full name" required registration={register('name')} error={errors.name} />
            <TextField id="inv-email" label="Email address" type="email" required registration={register('email')} error={errors.email} />
            <SelectField id="inv-role" label="Role" required registration={register('role')} error={errors.role} options={teamRoles.map((r) => ({ value: r, label: `${r} — ${ROLE_HELP[r]}` }))} />
          </div>
        )}
      </FormModal>
      {remove.dialog}
    </>
  )
}
