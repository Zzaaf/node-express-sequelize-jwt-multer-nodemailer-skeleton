import { Navigate } from 'react-router';

export default function PublicGuard({ children, user }) {
    // Если пользователь авторизован, перенаправляем на главную страницу
    if (user) {
        return <Navigate to="/" replace />;
    }

    // Если пользователь не авторизован, отображаем публичную страницу
    return children;
}

