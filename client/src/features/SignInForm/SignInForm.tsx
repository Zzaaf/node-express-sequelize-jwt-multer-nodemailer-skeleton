import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { setAccessToken, useTitle } from '@/shared/lib'
import { AuthApi } from '@/entities'
import { Icon } from '@/shared/ui'
import type { User } from '@/shared/types'

interface Props {
  setUser: (user: User) => void
}

const INIT = { email: '', password: '' }

export default function SignInForm({ setUser }: Props) {
  useTitle('Sign In')
  const [inputs, setInputs] = useState(INIT)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await AuthApi.signIn(inputs)
      setUser(response.data.user)
      setAccessToken(response.data.accessToken)
      navigate('/')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error || 'Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div className="afu" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, var(--a) 0%, #b78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px var(--ag2)' }}>
            <Icon name="signIn" size={22} style={{ color: '#fff' }} strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Sign in to your account to continue</p>
        </div>

        <div className="card-flat afu1" style={{ padding: 32 }}>
          {error && (
            <div className="alert alert-err" style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Icon name="xCircle" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div>{error}</div>
                  {error.toLowerCase().includes('not activated') && (
                    <div style={{ marginTop: 6, fontSize: '0.84rem', opacity: 0.85 }}>Check your inbox for the activation email.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="lbl" htmlFor="email">Email</label>
              <input className="inp" id="email" name="email" type="email" autoComplete="email" autoFocus required placeholder="you@example.com" value={inputs.email} onChange={onChange} />
            </div>
            <div>
              <label className="lbl" htmlFor="password">Password</label>
              <input className="inp" id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={inputs.password} onChange={onChange} />
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary btn-full" style={{ marginTop: 4, padding: '13px 20px', fontSize: '0.95rem' }}>
              {isLoading ? <><span className="spin spin-sm" /> Signing in…</> : <><Icon name="signIn" size={16} /> Sign in</>}
            </button>
          </form>
        </div>

        <p className="afu2" style={{ textAlign: 'center', marginTop: 22, color: 'var(--t2)', fontSize: '0.88rem' }}>
          Don't have an account?{' '}<Link to="/signUp" className="link">Create one</Link>
        </p>
      </div>
    </div>
  )
}
