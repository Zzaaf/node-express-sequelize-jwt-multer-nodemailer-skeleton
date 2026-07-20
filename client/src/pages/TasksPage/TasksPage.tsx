import { useEffect, useState } from 'react'
import { TaskApi } from '@/entities'
import { Icon } from '@/shared/ui'
import { useTitle } from '@/shared/lib'
import type { Task, User } from '@/shared/types'

interface Props { user: User }

export default function TasksPage({ user }: Props) {
  useTitle('All Tasks')
  const [tasks, setTasks]         = useState<Task[]>([])
  const [newTitle, setNewTitle]   = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [error, setError]         = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    TaskApi.getAll()
      .then(r => setTasks(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setIsLoading(false))
  }, [])

  const isOwner = (task: Task) => task.user_id === user.id

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const r = await TaskApi.create({ title: newTitle.trim(), status: false, user_id: user.id })
      setTasks(p => [...p, r.data])
      setNewTitle('')
    } catch { setError('Failed to create task') }
  }

  const toggle = async (id: number, status: boolean, uid: number) => {
    if (uid !== user.id) { setError('You can only modify your own tasks'); return }
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

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div className="afu" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 4 }}>All Tasks</h1>
        <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Community task board — edit only your own</p>
      </div>

      {error && <div className="alert alert-err afu" style={{ marginBottom: 20 }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="xCircle" size={16}/>{error}</div></div>}

      <form className="card-flat afu1" onSubmit={addTask} style={{ padding: 18, marginBottom: 24, display: 'flex', gap: 10 }}>
        <input className="inp" style={{ flex: 1 }} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Add a new task to the board…" />
        <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}><Icon name="plus" size={15} /> Add</button>
      </form>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spin spin-md" /></div>
      ) : tasks.length === 0 ? (
        <div className="card-flat" style={{ padding: 48, textAlign: 'center' }}>
          <Icon name="tasks" size={36} style={{ color: 'var(--t3)', marginBottom: 16 }} />
          <p style={{ color: 'var(--t2)', fontWeight: 600 }}>No tasks yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map((task, i) => {
            const mine = isOwner(task)
            return (
              <div key={task.id} className={`card-flat afu${Math.min(i + 1, 5)}`} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, borderColor: task.status ? 'rgba(15,212,156,0.15)' : 'var(--b1)', opacity: task.status ? 0.75 : 1, transition: 'all 0.2s' }}>
                <button onClick={() => toggle(task.id, task.status, task.user_id)} disabled={!mine} style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: mine ? 'pointer' : 'not-allowed', background: task.status ? 'var(--ok)' : 'transparent', border: task.status ? '2px solid var(--ok)' : '2px solid var(--b3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: '#fff', opacity: mine ? 1 : 0.4 }}>
                  {task.status && <Icon name="check" size={12} strokeWidth={3} />}
                </button>
                {editingId === task.id
                  ? <input className="inp" style={{ flex: 1, padding: '6px 10px' }} autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveEdit(task.id); if (e.key === 'Escape') setEditingId(null) }} />
                  : (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 500, color: task.status ? 'var(--t3)' : 'var(--t1)', textDecoration: task.status ? 'line-through' : 'none', transition: 'all 0.2s' }}>{task.title}</div>
                      {task.User && (
                        <div style={{ fontSize: '0.77rem', color: 'var(--t3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Icon name="user" size={11} />{task.User.name}
                          {mine && <span className="badge badge-a" style={{ marginLeft: 4, padding: '1px 7px', fontSize: '0.68rem' }}>you</span>}
                        </div>
                      )}
                    </div>
                  )
                }
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {mine ? (
                    editingId === task.id ? (
                      <>
                        <button className="btn btn-ok btn-sm" onClick={() => saveEdit(task.id)}><Icon name="check" size={13} strokeWidth={2.5}/> Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}><Icon name="x" size={13}/></button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingId(task.id); setEditTitle(task.title) }}><Icon name="edit" size={13}/></button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}><Icon name="trash" size={13}/></button>
                      </>
                    )
                  ) : (
                    <span className="badge badge-dim">View only</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
