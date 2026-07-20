import { Link } from 'react-router'
import { Icon } from '@/shared/ui'
import { useTitle } from '@/shared/lib'

export default function NotFoundPage() {
  useTitle('Page Not Found')
  return (
    <div className="page-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
      <div className="orb" style={{ width: 400, height: 400, background: 'rgba(124,106,247,0.07)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className="afu" style={{ position: 'relative' }}>
        <div style={{ fontSize: 'clamp(7rem, 22vw, 13rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.06em', marginBottom: 16, background: 'linear-gradient(135deg, var(--s3) 0%, var(--b2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', userSelect: 'none' }}>
          404
        </div>
        <h1 className="afu1" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--t1)', marginBottom: 12, letterSpacing: '-0.02em' }}>Page not found</h1>
        <p className="afu2" style={{ color: 'var(--t2)', marginBottom: 36, maxWidth: 340, margin: '0 auto 36px', lineHeight: 1.65, fontSize: '0.95rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="afu3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg"><Icon name="home" size={16} /> Go home</Link>
          <Link to="/users" className="btn btn-ghost btn-lg"><Icon name="users" size={16} /> Browse users</Link>
        </div>
      </div>
    </div>
  )
}
