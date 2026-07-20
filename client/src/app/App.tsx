import { BrowserRouter, Routes, Route } from 'react-router'
import { useEffect, useState } from 'react'
import {
  HomePage, SignUpPage, SignInPage, ActivatePage,
  CurrentUserPage, ProfilePage, UsersPage, TasksPage,
  MyTasksPage, NotFoundPage,
} from '@/pages'
import { Nav } from '@/widgets'
import { setAccessToken } from '@/shared/lib'
import { AuthApi } from '@/entities'
import { AuthGuard, PublicGuard } from '@/shared/hocs'
import type { User } from '@/shared/types'

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    AuthApi.refreshTokens()
      .then(response => {
        setUser(response.data.user)
        setAccessToken(response.data.accessToken)
      })
      .catch(() => setUser(null))
  }, [])

  const handleSignOut = async () => {
    try {
      await AuthApi.signOut()
      setUser(null)
      setAccessToken('')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <BrowserRouter>
      <Nav user={user} handleSignOut={handleSignOut} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<CurrentUserPage />} />

          <Route path="/profile" element={
            <AuthGuard user={user}>
              <ProfilePage user={user!} setUser={setUser} />
            </AuthGuard>
          } />
          <Route path="/tasks" element={
            <AuthGuard user={user}>
              <TasksPage user={user!} />
            </AuthGuard>
          } />
          <Route path="/my-tasks" element={
            <AuthGuard user={user}>
              <MyTasksPage user={user!} />
            </AuthGuard>
          } />

          <Route path="/signUp" element={
            <PublicGuard user={user}>
              <SignUpPage />
            </PublicGuard>
          } />
          <Route path="/signIn" element={
            <PublicGuard user={user}>
              <SignInPage setUser={setUser} />
            </PublicGuard>
          } />

          <Route path="/activate/:token" element={<ActivatePage setUser={setUser} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
