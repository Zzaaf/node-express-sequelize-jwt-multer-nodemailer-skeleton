import { UserList } from '@/widgets'
import { Icon } from '@/shared/ui'
import { useTitle } from '@/shared/lib'

export default function UsersPage() {
  useTitle('Users')
  return (
    <div className="page">
      <div className="afu" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 4 }}>Users</h1>
        <p style={{ color: 'var(--t2)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="users" size={14} style={{ color: 'var(--t3)' }} />
          Browse all registered members
        </p>
      </div>
      <UserList />
    </div>
  )
}
