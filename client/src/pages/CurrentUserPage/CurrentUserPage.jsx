import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UserApi } from "../../entities/UserApi";

export default function CurrentUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        setIsLoading(true);
        try {
            const response = await UserApi.getById(id);
            setUser(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load user');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-500">Loading user...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="rounded-md bg-red-50 p-4 mb-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
            >
                ← Back to Users
            </button>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Header with Avatar */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-12 text-center">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white mb-4 overflow-hidden">
                        {user.avatar ? (
                            <img
                                src={`${import.meta.env.VITE_SERVER_URL}${user.avatar}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-indigo-600 font-bold text-4xl">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                </div>

                {/* User Details */}
                <div className="px-6 py-8">
                    <dl className="space-y-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">User ID</dt>
                            <dd className="mt-1 text-base text-gray-900">{user.id}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                            <dd className="mt-1 text-base text-gray-900">{user.email}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="mt-1 text-base text-gray-900">{user.name}</dd>
                        </div>

                        {user.createdAt && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                <dd className="mt-1 text-base text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
}