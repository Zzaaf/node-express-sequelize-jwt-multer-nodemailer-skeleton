import { Link } from 'react-router'
import { Icon } from '@/shared/ui'
import { useTitle } from '@/shared/lib'
import type { User } from '@/shared/types'

interface Feature { icon: string; title: string; desc: string }

const features: Feature[] = [
  { icon: 'shield', title: 'Secure Auth',      desc: 'JWT access & refresh tokens, email activation, HTTP-only cookies — done right.' },
  { icon: 'tasks',  title: 'Task Management',  desc: 'Create, complete, and track tasks. Real-time ownership control per user.' },
  { icon: 'users',  title: 'User Directory',   desc: 'Browse all users, view profiles, upload avatars. Fully connected to the backend.' },
]

const stack = ['React 19', 'Node.js', 'Express 5', 'PostgreSQL', 'Sequelize', 'JWT', 'Nodemailer', 'Tailwind CSS']

export default function HomePage({ user }: { user: User | null }) {
  useTitle('Home')
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 600, height: 600, background: 'rgba(124,106,247,0.09)', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="orb" style={{ width: 350, height: 350, background: 'rgba(183,139,250,0.06)', top: 300, right: -80, animationDelay: '2.5s' }} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', position: 'relative' }}>
        <h1 className="afu" style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.04em', marginBottom: 22, color: 'var(--t1)' }}>
          Ship auth.<br /><span className="grad">Ship fast.</span>
        </h1>
        <p className="afu1" style={{ fontSize: '1.1rem', color: 'var(--t2)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px', fontWeight: 500 }}>
          A production-ready skeleton with JWT, email activation, tasks, and user management — ready to clone and extend.
        </p>
        {!user ? (
          <div className="afu2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signUp" className="btn btn-primary btn-lg">Create account <Icon name="arrowRight" size={16} /></Link>
            <Link to="/signIn" className="btn btn-outline btn-lg"><Icon name="signIn" size={16} /> Sign in</Link>
          </div>
        ) : (
          <div className="afu2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/my-tasks" className="btn btn-primary btn-lg"><Icon name="myTasks" size={16} /> My tasks</Link>
            <Link to="/users" className="btn btn-outline btn-lg"><Icon name="users" size={16} /> Browse users</Link>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={f.title} className={`card afu${i + 2}`} style={{ padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--ag)', border: '1px solid rgba(124,106,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: 'var(--a2)' }}>
                <Icon name={f.icon} size={20} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 10, color: 'var(--t1)' }}>{f.title}</h3>
              <p style={{ color: 'var(--t2)', lineHeight: 1.65, fontSize: '0.92rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 20 }}>Built with</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {stack.map(s => (
            <span key={s} style={{ background: 'var(--s2)', border: '1px solid var(--b2)', borderRadius: 99, padding: '6px 16px', fontSize: '0.84rem', fontWeight: 600, color: 'var(--t2)' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
