import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { UserApi } from '@/entities'
import { Icon } from '@/shared/ui'
import type { User } from '@/shared/types'

const PER_PAGE = 6

export default function UserList() {
  const [users, setUsers]         = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState('')
  const [page, setPage]           = useState(1)

  useEffect(() => {
    UserApi.getAll()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load users'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
      <span className="spin spin-lg" />
    </div>
  )

  if (error) return (
    <div className="alert alert-err">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="xCircle" size={16}/>{error}</div>
    </div>
  )

  if (users.length === 0) return (
    <div className="card-flat" style={{ padding: 64, textAlign: 'center' }}>
      <Icon name="users" size={40} style={{ color: 'var(--t3)', marginBottom: 16 }} />
      <p style={{ color: 'var(--t2)', fontWeight: 600 }}>No users found</p>
    </div>
  )

  const totalPages = Math.ceil(users.length / PER_PAGE)
  const slice      = users.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: '0.84rem', color: 'var(--t3)', fontWeight: 600 }}>
          {users.length} member{users.length !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && <p style={{ fontSize: '0.84rem', color: 'var(--t3)' }}>Page {page} of {totalPages}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {slice.map((u, i) => (
          <div key={u.id} className={`card afu${Math.min(i + 1, 5)}`} style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              {u.avatar
                ? <img src={`${import.meta.env.VITE_SERVER_URL}${u.avatar}`} alt={u.name} className="avatar" style={{ width: 48, height: 48, border: '2px solid var(--b2)' }} />
                : <div className="avatar-placeholder" style={{ width: 48, height: 48, fontSize: '1.2rem' }}>{u.name?.charAt(0).toUpperCase()}</div>
              }
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--t1)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
              </div>
            </div>
            <Link to={`/users/${u.id}`} className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'center' }}>
              View profile <Icon name="arrowRight" size={13} />
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <Icon name="chevronLeft" size={15} /> Prev
          </button>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-ghost'}`} style={{ minWidth: 36 }}>{n}</button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next <Icon name="chevronRight" size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
