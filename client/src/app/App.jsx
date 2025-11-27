import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '../pages/HomePage/HomePage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import ActivatePage from '../pages/ActivatePage/ActivatePage';
import CurrentUserPage from '../pages/CurrentUserPage/CurrentUserPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import UsersPage from '../pages/UsersPage/UsersPage';
import TasksPage from '../pages/TasksPage/TasksPage';
import MyTasksPage from '../pages/MyTasksPage/MyTasksPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import Nav from '../widgets/Nav/Nav';
import { useEffect, useState } from 'react';
import { setAccessToken } from '../shared/lib/axiosInstance';
import { AuthApi } from '../entities/AuthApi';
import AuthGuard from '../shared/hocs/AuthGuard';
import PublicGuard from '../shared/hocs/PublicGuard';

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    AuthApi.refreshTokens()
      .then(response => {
        setUser(response.data.user);
        setAccessToken(response.data.accessToken)
      })
      .catch(() => {
        // Пользователь не авторизован
        setUser(null);
      })
  }, [])

  const handleSignOut = async () => {
    try {
      await AuthApi.signOut();
      setUser(null);
      setAccessToken('');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  return (
    <BrowserRouter>
      <Nav user={user} handleSignOut={handleSignOut} />
      <main className="container mx-auto px-4">
        <Routes>
          {/* Публичные страницы */}
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<CurrentUserPage />} />

          {/* Приватные страницы - требуют авторизации */}
          <Route path="/profile" element={
            <AuthGuard user={user}>
              <ProfilePage user={user} setUser={setUser} />
            </AuthGuard>
          }
          />
          <Route path="/tasks" element={
            <AuthGuard user={user}>
              <TasksPage user={user} />
            </AuthGuard>
          }
          />
          <Route path="/my-tasks" element={
            <AuthGuard user={user}>
              <MyTasksPage user={user} />
            </AuthGuard>
          }
          />

          {/* Страницы авторизации - доступны только неавторизованным */}
          <Route path="/signUp" element={
            <PublicGuard user={user}>
              <SignUpPage setUser={setUser} />
            </PublicGuard>
          }
          />
          <Route path="/signIn" element={
            <PublicGuard user={user}>
              <SignInPage setUser={setUser} />
            </PublicGuard>
          }
          />

          {/* Страница активации аккаунта - доступна всем */}
          <Route path="/activate/:token" element={<ActivatePage setUser={setUser} />} />

          {/* 404 - Страница не найдена (должна быть последней) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}