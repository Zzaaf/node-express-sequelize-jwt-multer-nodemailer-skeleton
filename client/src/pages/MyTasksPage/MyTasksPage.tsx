import { useEffect, useState } from 'react'
import { TaskApi } from '@/entities'
import { Icon } from '@/shared/ui'
import { useTitle } from '@/shared/lib'
import type { Task, User } from '@/shared/types'

interface Props { user: User }

export default function MyTasksPage({ user }: Props) {
  useTitle('My Tasks')
  const [tasks, setTasks]         = useState<Task[]>([])
  const [newTitle, setNewTitle]   = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [error, setError]         = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    TaskApi.getByUserId(user.id)
      .then(r => setTasks(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setIsLoading(false))
  }, [user.id])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const r = await TaskApi.create({ title: newTitle.trim(), status: false, user_id: user.id })
      setTasks(p => [...p, r.data])
      setNewTitle('')
    } catch { setError('Failed to create task') }
  }

  const toggle = async (id: number, status: boolean) => {
    try {
      const r = await TaskApi.updateById(id, { status: !status })
      setTasks(p => p.map(t => t.id === id ? r.data : t))
    } catch { setError('Failed to update task') }
  }

  const saveEdit = async (id: number) => {
    if (!editTitle.trim()) return
    try {
      const r = await TaskApi.updateById(id, { title: editTitle.trim() })
      setTasks(p => p.map(t => t.id === id ? r.data : t))
      setEditingId(null)
    } catch { setError('Failed to update task') }
  }

  const deleteTask = async (id: number) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await TaskApi.deleteById(id)
      setTasks(p => p.filter(t => t.id !== id))
    } catch { setError('Failed to delete task') }
  }

  const total = tasks.length
  const done = tasks.filter(t => t.status).length
  const inProgress = total - done

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div className="afu" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 4 }}>My Tasks</h1>
        <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Track and manage your personal tasks</p>
      </div>

      {error && <div className="alert alert-err afu" style={{ marginBottom: 20 }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="xCircle" size={16}/>{error}</div></div>}

      <form className="card-flat afu1" onSubmit={addTask} style={{ padding: 18, marginBottom: 24, display: 'flex', gap: 10 }}>
        <input className="inp" style={{ flex: 1 }} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Add a new task…" />
        <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}><Icon name="plus" size={15} /> Add</button>
      </form>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}><span className="spin spin-md" /></div>
      ) : tasks.length === 0 ? (
        <div className="card-flat" style={{ padding: 48, textAlign: 'center' }}>
          <Icon name="tasks" size={36} style={{ color: 'var(--t3)', marginBottom: 16 }} />
          <p style={{ color: 'var(--t2)', fontWeight: 600 }}>No tasks yet</p>
          <p style={{ color: 'var(--t3)', fontSize: '0.88rem', marginTop: 4 }}>Create your first task above</p>
        </div>
      ) : (
        <>
          <div className="afu2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[{ label: 'Total', value: total, color: 'var(--a2)' }, { label: 'Done', value: done, color: 'var(--ok)' }, { label: 'In progress', value: inProgress, color: 'var(--warn)' }].map(s => (
              <div key={s.label} className="card-inner" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map((task, i) => (
              <div key={task.id} className={`card-flat afu${Math.min(i + 2, 5)}`} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, borderColor: task.status ? 'rgba(15,212,156,0.15)' : 'var(--b1)' }}>
                <button onClick={() => toggle(task.id, task.status)} style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: 'pointer', background: task.status ? 'var(--ok)' : 'transparent', border: task.status ? '2px solid var(--ok)' : '2px solid var(--b3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: '#fff' }}>
                  {task.status && <Icon name="check" size={12} strokeWidth={3} />}
                </button>
                {editingId === task.id
                  ? <input className="inp" style={{ flex: 1, padding: '6px 10px' }} autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveEdit(task.id); if (e.key === 'Escape') setEditingId(null) }} />
                  : <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 500, color: task.status ? 'var(--t3)' : 'var(--t1)', textDecoration: task.status ? 'line-through' : 'none', transition: 'all 0.2s' }}>{task.title}</span>
                }
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {editingId === task.id ? (
                    <>
                      <button className="btn btn-ok btn-sm" onClick={() => saveEdit(task.id)}><Icon name="check" size={13} strokeWidth={2.5}/> Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}><Icon name="x" size={13}/></button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditingId(task.id); setEditTitle(task.title) }}><Icon name="edit" size={13}/></button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}><Icon name="trash" size={13}/></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
