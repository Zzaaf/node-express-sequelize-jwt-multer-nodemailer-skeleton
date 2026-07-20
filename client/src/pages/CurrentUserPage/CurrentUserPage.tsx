import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { UserApi } from '@/entities'
import { Icon } from '@/shared/ui'
import { useTitle } from '@/shared/lib'
import type { User } from '@/shared/types'

export default function CurrentUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  useTitle(user ? user.name : 'User Profile')

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    UserApi.getById(id)
      .then(r => { setUser(r.data); setError('') })
      .catch(() => setError('Failed to load user'))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 62px)' }}>
      <span className="spin spin-lg" />
    </div>
  )

  if (error) return (
    <div className="page" style={{ maxWidth: 600 }}>
      <div className="alert alert-err" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="xCircle" size={16} />{error}</div>
      </div>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}><Icon name="arrowLeft" size={15} /> Go back</button>
    </div>
  )

  if (!user) return null

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const rows = [
    { icon: 'mail',     label: 'Email',        value: user.email,      mono: false },
    { icon: 'id',       label: 'User ID',       value: String(user.id), mono: true },
    { icon: 'calendar', label: 'Member since',  value: joined,          mono: false },
  ].filter(r => r.value) as { icon: string; label: string; value: string; mono: boolean }[]

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <button className="btn btn-ghost btn-sm afu" style={{ marginBottom: 28 }} onClick={() => navigate(-1)}>
        <Icon name="arrowLeft" size={14} /> Back to users
      </button>

      <div className="card-flat afu1" style={{ overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--s3) 0%, var(--s2) 100%)', borderBottom: '1px solid var(--b1)', padding: '40px 32px', display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
          <div className="orb" style={{ width: 200, height: 200, background: 'var(--ag)', top: -50, right: -50, animationDuration: '6s' }} />
          {user.avatar
            ? <img src={`${import.meta.env.VITE_SERVER_URL}${user.avatar}`} alt={user.name} className="avatar" style={{ width: 80, height: 80, border: '3px solid var(--b2)', position: 'relative' }} />
            : <div className="avatar-placeholder" style={{ width: 80, height: 80, fontSize: '2rem', border: '3px solid var(--ag2)', position: 'relative' }}>{user.name?.charAt(0).toUpperCase()}</div>
          }
          <div style={{ position: 'relative' }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em', marginBottom: 6 }}>{user.name}</h1>
            <span className="badge badge-a"><Icon name="checkCircle" size={11} />Active member</span>
          </div>
        </div>

        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {rows.map((row, i) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--b1)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a2)', flexShrink: 0 }}>
                <Icon name={row.icon} size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontSize: '0.92rem', color: 'var(--t1)', fontWeight: 500, fontFamily: row.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
