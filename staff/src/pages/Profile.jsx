import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Lock, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, DetailList } from '../components/ui/Card'
import { TextField } from '../components/ui/Fields'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../components/ui/Toast'
import useMine from '../hooks/useMine'
import { phone, required } from '../lib/schemas'
import { initials } from '../lib/utils'
import { updateProfile } from '../services/accountService'
import ResetDemoData from '../components/ui/ResetDemoData'

const schema = z.object({ name: required('Display name', 80), phone })

function ProfileForm({ employee }) {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: employee.name, phone: employee.phone } })
  const submit = handleSubmit(async (v) => {
    try {
      await updateProfile(v)
      reset(v)
      toast.success('Profile saved to the demo data.')
    } catch (err) {
      toast.error(err.message, 'Not saved')
    }
  })
  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <TextField id="pf-name" label="Display name" required autoComplete="name" registration={register('name')} error={errors.name} />
        <TextField id="pf-phone" type="tel" label="Phone" hint="Optional. Include the country code." autoComplete="tel" registration={register('phone')} error={errors.phone} />
      </div>
      <div className="flex justify-end gap-2 border-t border-line bg-[#fafbfc] px-5 py-3">
        <Button onClick={() => reset()} disabled={!isDirty || isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" icon={Save} loading={isSubmitting} disabled={!isDirty && !isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

export default function Profile() {
  const { employee, state } = useMine()
  if (!employee) return null
  return (
    <>
      <PageHeader title="My Profile" description="Your demo employee details." />
      <p className="mb-5 flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
        This is a fictional demo employee. Changes are temporary demo data saved only in this browser until backend integration.
      </p>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <Card className="self-start">
          <div className="flex flex-col items-center p-6 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-2xl font-bold text-gold" aria-hidden="true">
              {initials(employee.name)}
            </span>
            <p className="mt-4 text-lg font-semibold">{employee.name}</p>
            <p className="text-sm text-muted">{employee.role}</p>
            <StatusBadge status={employee.status} className="mt-3" />
          </div>
          <div className="border-t border-line p-5">
            <DetailList
              columns={1}
              items={[
                { label: 'Email', value: employee.email },
                { label: 'Phone', value: employee.phone },
                { label: 'Department', value: employee.department },
                { label: 'Location', value: employee.location },
              ]}
            />
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Editable details" description="You can change your display name and phone number." />
            <ProfileForm key={`${employee.name}|${employee.phone}|${state.seededOn}`} employee={employee} />
          </Card>
          <Card>
            <CardHeader title="Role and access" description="Managed by the administrator." />
            <div className="p-5">
              <DetailList
                items={[
                  { label: 'Role', value: employee.role },
                  { label: 'Department', value: employee.department },
                  { label: 'Sign-in email', value: employee.email },
                  { label: 'Access', value: 'Staff portal — assigned work only' },
                ]}
              />
              <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                These fields are read-only. Contact your administrator if something is wrong.
              </p>
            </div>
          </Card>
          <Card>
            <CardHeader title="Demo data" description="Restore the original sample tasks, shipments and documents." actions={<ResetDemoData />} />
          </Card>
        </div>
      </div>
    </>
  )
}
