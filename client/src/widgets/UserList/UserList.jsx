import { useEffect, useState } from "react";
import { Link } from "react-router";
import { UserApi } from "../../entities/UserApi";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const response = await UserApi.getAll();
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No users found</p>
            </div>
        );
    }

    // Вычисление пагинации
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Функции для переключения страниц
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* Информация о пагинации */}
            <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(indexOfLastUser, users.length)}</span> of{' '}
                    <span className="font-semibold">{users.length}</span> users
                </p>
                <p className="text-sm text-gray-700">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                </p>
            </div>

            {/* Список пользователей */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <ul role="list" className="divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                        <li key={user.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-center gap-x-6">
                                <div className="flex min-w-0 gap-x-4 items-center">
                                    {/* Avatar */}
                                    {user.avatar ? (
                                        <img
                                            src={`${import.meta.env.VITE_SERVER_URL}${user.avatar}`}
                                            alt={user.name}
                                            className="h-12 w-12 flex-shrink-0 rounded-full object-cover border-2 border-indigo-200"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    {/* User Info */}
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-base font-semibold text-gray-900">{user.name}</p>
                                        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>

                                {/* Link Button */}
                                <Link
                                    to={`/users/${user.id}`}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {/* Кнопка "Previous" */}
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        Previous
                    </button>

                    {/* Номера страниц */}
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === pageNumber
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>

                    {/* Кнопка "Next" */}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}