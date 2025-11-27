import { Navigate } from 'react-router';

export default function AuthGuard({ children, user }) {
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  // Если пользователь авторизован, отображаем защищённую страницу
  return children;
}

