import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { AuthApi } from '@/entities'
import { setAccessToken, useTitle } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import type { User } from '@/shared/types'

interface Props { setUser: (user: User) => void }
type Status = 'loading' | 'success' | 'error'

export default function ActivatePage({ setUser }: Props) {
  useTitle('Account Activation')
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const run = async () => {
      if (!token) { setStatus('error'); setMessage('Activation token is missing.'); return }
      try {
        const response = await AuthApi.activateAccount(token)
        setUser(response.data.user)
        setAccessToken(response.data.accessToken)
        setStatus('success')
        setMessage(response.message || 'Account activated successfully!')
        setTimeout(() => navigate('/'), 3000)
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { error?: string } } }
        setStatus('error')
        setMessage(axiosErr.response?.data?.error || 'Activation failed. Please try again.')
        setTimeout(() => navigate('/signIn'), 5000)
      }
    }
    run()
  }, [token, setUser, navigate])

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        {status === 'loading' && (
          <div className="afi">
            <span className="spin spin-lg" style={{ display: 'inline-block', marginBottom: 28 }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--t1)', marginBottom: 10 }}>Activating your account</h2>
            <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Verifying your activation link…</p>
          </div>
        )}
        {status === 'success' && (
          <div className="afu">
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--okg)', border: '2px solid rgba(15,212,156,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--ok)' }}>
              <Icon name="checkCircle" size={36} strokeWidth={1.4} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', marginBottom: 12, letterSpacing: '-0.02em' }}>Account activated</h2>
            <p style={{ color: 'var(--t2)', marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
            <div className="alert alert-ok" style={{ marginBottom: 20 }}>You are now signed in. Redirecting to home in 3 seconds…</div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/')}><Icon name="home" size={16} /> Go home now</button>
          </div>
        )}
        {status === 'error' && (
          <div className="afu">
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--errg)', border: '2px solid rgba(255,92,92,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--err)' }}>
              <Icon name="xCircle" size={36} strokeWidth={1.4} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--t1)', marginBottom: 12, letterSpacing: '-0.02em' }}>Activation failed</h2>
            <p style={{ color: 'var(--t2)', marginBottom: 20, lineHeight: 1.6 }}>{message}</p>
            <div className="card-inner" style={{ padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--t2)', fontWeight: 600, marginBottom: 8 }}>Possible reasons:</p>
              {['Link has expired', 'Account already activated', 'Invalid token'].map(r => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: '0.84rem', color: 'var(--t3)' }}>
                  <Icon name="chevronRight" size={12} style={{ color: 'var(--t3)', flexShrink: 0 }} />{r}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/signIn')}><Icon name="signIn" size={15} /> Sign in</button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/signUp')}>Register</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
