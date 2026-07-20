import { useEffect, useRef, useState } from 'react'
import { UserApi } from '@/entities'
import { setAccessToken, useTitle } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import type { User } from '@/shared/types'

interface Props { user: User; setUser: (user: User) => void }

export default function ProfilePage({ user, setUser }: Props) {
  useTitle('My Profile')
  const [isLoading, setIsLoading]           = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError]                   = useState('')
  const [success, setSuccess]               = useState('')
  const [isEditing, setIsEditing]           = useState(false)
  const [name, setName]                     = useState('')
  const [email, setEmail]                   = useState('')
  const [selectedFile, setSelectedFile]     = useState<File | null>(null)
  const [previewUrl, setPreviewUrl]         = useState<string | null>(null)
  const fileInputRef                        = useRef<HTMLInputElement>(null)

  useEffect(() => { setName(user.name); setEmail(user.email) }, [user])

  const flash = (type: 'ok' | 'err', msg: string) => {
    if (type === 'ok') { setSuccess(msg); setError('') }
    else { setError(msg); setSuccess('') }
    setTimeout(() => { setSuccess(''); setError('') }, 4000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) { flash('err', 'File must be under 1 MB'); return }
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      flash('err', 'Only JPEG, PNG, GIF, WEBP allowed'); return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append('avatar', selectedFile)
      const res = await UserApi.uploadAvatar(user.id, fd)
      setUser(res.data.user)
      setAccessToken(res.data.accessToken)
      flash('ok', 'Avatar updated')
      setSelectedFile(null); setPreviewUrl(null)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      flash('err', e.response?.data?.message || 'Upload failed')
    } finally { setUploadingAvatar(false) }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await UserApi.updateProfile(user.id, { name: name.trim(), email: email.trim() })
      setUser(res.data.user)
      setAccessToken(res.data.accessToken)
      flash('ok', 'Profile updated')
      setIsEditing(false)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      flash('err', e.response?.data?.message || 'Update failed')
    } finally { setIsLoading(false) }
  }

  const cancelEdit = () => { setName(user.name); setEmail(user.email); setIsEditing(false); setError('') }
  const avatarSrc = previewUrl || (user.avatar ? `${import.meta.env.VITE_SERVER_URL}${user.avatar}` : null)
  const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null

  const infoRows = [
    { icon: 'user',     label: 'Name',         value: user.name,       mono: false },
    { icon: 'mail',     label: 'Email',         value: user.email,      mono: false },
    { icon: 'id',       label: 'User ID',       value: String(user.id), mono: true },
    { icon: 'calendar', label: 'Member since',  value: joined,          mono: false },
  ].filter(r => r.value) as { icon: string; label: string; value: string; mono: boolean }[]

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="afu" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 4 }}>My Profile</h1>
        <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Manage your account information and avatar</p>
      </div>

      {error   && <div className="alert alert-err afu" style={{ marginBottom: 20 }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="xCircle" size={16}/>{error}</div></div>}
      {success && <div className="alert alert-ok afu"  style={{ marginBottom: 20 }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="checkCircle" size={16}/>{success}</div></div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div className="card-flat afu1" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', marginBottom: 24 }}>Profile picture</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar" className="avatar" style={{ width: 120, height: 120, border: '3px solid var(--b2)' }} />
                : <div className="avatar-placeholder" style={{ width: 120, height: 120, fontSize: '2.8rem', border: '3px solid var(--ag2)' }}>{user.name?.charAt(0).toUpperCase()}</div>
              }
              {previewUrl && <span className="badge badge-a" style={{ position: 'absolute', bottom: 0, right: 0 }}>Preview</span>}
            </div>
            <form onSubmit={handleUpload} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              <button type="button" className="btn btn-ghost btn-full" onClick={() => fileInputRef.current?.click()}>
                <Icon name="photo" size={15} /> {selectedFile ? selectedFile.name : 'Choose photo'}
              </button>
              {selectedFile && (
                <button type="submit" disabled={uploadingAvatar} className="btn btn-primary btn-full">
                  {uploadingAvatar ? <><span className="spin spin-sm" /> Uploading…</> : <><Icon name="upload" size={15} /> Upload avatar</>}
                </button>
              )}
            </form>
            <p style={{ fontSize: '0.78rem', color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>Max 1 MB · JPEG, PNG, GIF, WEBP</p>
          </div>
        </div>

        <div className="card-flat afu2" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--t1)' }}>Profile information</h2>
            {!isEditing && <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}><Icon name="edit" size={13} /> Edit</button>}
          </div>

          {!isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {infoRows.map((row, i) => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < infoRows.length - 1 ? '1px solid var(--b1)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--s2)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a2)', flexShrink: 0 }}>
                    <Icon name={row.icon} size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--t1)', fontWeight: 500, fontFamily: row.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="lbl" htmlFor="pname">Name</label>
                <input className="inp" id="pname" type="text" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="lbl" htmlFor="pemail">Email</label>
                <input className="inp" id="pemail" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ flex: 1 }}>
                  {isLoading ? <><span className="spin spin-sm" /> Saving…</> : <><Icon name="save" size={15} /> Save</>}
                </button>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={cancelEdit}><Icon name="x" size={15} /> Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
