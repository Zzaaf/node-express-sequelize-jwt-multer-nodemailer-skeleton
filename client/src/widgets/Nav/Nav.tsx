import { NavLink, Link } from 'react-router'
import { Icon } from '@/shared/ui'
import type { User } from '@/shared/types'

interface NavProps {
  user: User | null
  handleSignOut: () => void
}

interface NavItemProps {
  to: string
  icon: string
  label: string
  end?: boolean
}

export default function Nav({ user, handleSignOut }: NavProps) {
  return (
    <header className="nav-glass">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', gap: 24 }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--a) 0%, #b78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px var(--ag2)' }}>
            <Icon name="shield" size={16} style={{ color: '#fff' }} strokeWidth={2.2} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--t1)', letterSpacing: '-0.02em' }}>
            Auth<span style={{ color: 'var(--a2)' }}>Kit</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <NavItem to="/" icon="home" label="Home" end />
          <NavItem to="/users" icon="users" label="Users" />
          {user && <NavItem to="/tasks" icon="tasks" label="All Tasks" />}
          {user && <NavItem to="/my-tasks" icon="myTasks" label="My Tasks" />}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <Link
                to="/profile"
                style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '5px 10px', borderRadius: 10, transition: 'background 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--b1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {user.avatar
                  ? <img src={`${import.meta.env.VITE_SERVER_URL}${user.avatar}`} alt={user.name} className="avatar" style={{ width: 28, height: 28 }} />
                  : <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: '0.78rem' }}>{user.name?.charAt(0).toUpperCase()}</div>
                }
                <span style={{ fontSize: '0.87rem', fontWeight: 600, color: 'var(--t1)' }}>{user.name}</span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                <Icon name="signOut" size={14} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signIn" className="btn btn-ghost btn-sm"><Icon name="signIn" size={14} /> Sign in</Link>
              <Link to="/signUp" className="btn btn-primary btn-sm">Get started <Icon name="arrowRight" size={13} /></Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, icon, label, end }: NavItemProps) {
  return (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 11px', borderRadius: 8,
      fontSize: '0.86rem', fontWeight: 600,
      textDecoration: 'none',
      color: isActive ? 'var(--t1)' : 'var(--t2)',
      background: isActive ? 'var(--ag)' : 'transparent',
      transition: 'all 0.18s',
    })}>
      {({ isActive }) => (
        <>
          <Icon name={icon} size={14} style={{ color: isActive ? 'var(--a2)' : 'currentColor' }} />
          {label}
        </>
      )}
    </NavLink>
  )
}
