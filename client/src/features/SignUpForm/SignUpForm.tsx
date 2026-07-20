import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTitle } from '@/shared/lib'
import { AuthApi } from '@/entities'
import { Icon } from '@/shared/ui'

const INIT = { name: '', email: '', password: '', confirmPassword: '' }

export default function SignUpForm() {
  useTitle('Create Account')
  const [inputs, setInputs] = useState(INIT)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const navigate = useNavigate()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const passwordMismatch = inputs.password !== inputs.confirmPassword && inputs.confirmPassword !== ''

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (inputs.password !== inputs.confirmPassword) { setError('Passwords do not match'); return }
    setIsLoading(true)
    setError('')
    try {
      await AuthApi.signUp(inputs)
      setSuccess(true)
      setInputs(INIT)
      let c = 5
      const id = setInterval(() => {
        c--
        setCountdown(c)
        if (c <= 0) { clearInterval(id); navigate('/signIn') }
      }, 1000)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-center">
        <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }} className="afu">
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--okg)', border: '2px solid rgba(15,212,156,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--ok)' }}>
            <Icon name="checkCircle" size={34} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: 'var(--t1)', letterSpacing: '-0.02em' }}>Check your inbox</h2>
          <p style={{ color: 'var(--t2)', lineHeight: 1.65, marginBottom: 28, fontSize: '0.95rem' }}>
            We sent an activation link to your email.<br />Click it to activate your account.
          </p>
          <div style={{ background: 'var(--s2)', border: '1px solid var(--b1)', borderRadius: 12, padding: '14px 20px', color: 'var(--t2)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="arrowRight" size={14} style={{ color: 'var(--a2)' }} />
            Redirecting to sign in in <strong style={{ color: 'var(--t1)' }}>{countdown}s</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div className="afu" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, var(--a) 0%, #b78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px var(--ag2)' }}>
            <Icon name="user" size={22} style={{ color: '#fff' }} strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Join and explore the skeleton</p>
        </div>

        <div className="card-flat afu1" style={{ padding: 32 }}>
          {error && (
            <div className="alert alert-err" style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="xCircle" size={16} style={{ flexShrink: 0 }} />{error}</div>
            </div>
          )}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="lbl" htmlFor="name">Full name</label>
              <input className="inp" id="name" name="name" type="text" autoComplete="name" autoFocus required placeholder="Alex Johnson" value={inputs.name} onChange={onChange} />
            </div>
            <div>
              <label className="lbl" htmlFor="email">Email</label>
              <input className="inp" id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" value={inputs.email} onChange={onChange} />
            </div>
            <div>
              <label className="lbl" htmlFor="password">Password</label>
              <input className="inp" id="password" name="password" type="password" autoComplete="new-password" required placeholder="Min 8 chars, uppercase, number…" value={inputs.password} onChange={onChange} />
            </div>
            <div>
              <label className="lbl" htmlFor="confirmPassword">Confirm password</label>
              <input className="inp" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required placeholder="Repeat your password" value={inputs.confirmPassword} onChange={onChange}
                style={passwordMismatch ? { borderColor: 'var(--err)', boxShadow: '0 0 0 3px var(--errg)' } : {}} />
              {passwordMismatch && (
                <p style={{ fontSize: '0.8rem', color: 'var(--err)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="exclamation" size={13} /> Passwords do not match
                </p>
              )}
            </div>
            <button type="submit" disabled={passwordMismatch || isLoading} className="btn btn-primary btn-full" style={{ marginTop: 6, padding: '13px 20px', fontSize: '0.95rem' }}>
              {isLoading ? <><span className="spin spin-sm" /> Creating account…</> : <><Icon name="arrowRight" size={16} /> Create account</>}
            </button>
          </form>
        </div>

        <p className="afu2" style={{ textAlign: 'center', marginTop: 22, color: 'var(--t2)', fontSize: '0.88rem' }}>
          Already have an account?{' '}<Link to="/signIn" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
