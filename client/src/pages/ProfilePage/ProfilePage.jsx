import { useEffect, useState } from "react";
import { setAccessToken } from "../../shared/lib/axiosInstance";
import { UserApi } from "../../entities/UserApi";

export default function ProfilePage({ user, setUser }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Состояния для редактирования профиля
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Состояния для загрузки аватара
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
    }, [user]);

    // Обработка выбора файла
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Проверка размера файла (1 МБ)
            if (file.size > 1024 * 1024) {
                setError('File size must not exceed 1 MB');
                return;
            }

            // Проверка типа файла
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only image files are allowed (JPEG, PNG, GIF, WEBP)');
                return;
            }

            setSelectedFile(file);
            setError('');

            // Создаём превью
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Загрузка аватара
    const handleUploadAvatar = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setUploadingAvatar(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            const response = await UserApi.uploadAvatar(user.id, formData);

            setUser(response.data.user);
            setAccessToken(response.data.accessToken);
            setSuccess('Avatar updated successfully!');
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Обновление профиля
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await UserApi.updateProfile(user.id, {
                name: name.trim(),
                email: email.trim(),
            });

            setUser(response.data.user);
            setAccessToken(response.data.accessToken);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Отмена редактирования
    const handleCancelEdit = () => {
        setName(user.name);
        setEmail(user.email);
        setIsEditing(false);
        setError('');
    };

    if (!user) {
        return null;
    }

    const avatarUrl = user.avatar
        ? `${import.meta.env.VITE_SERVER_URL}${user.avatar}`
        : null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <p className="text-sm text-green-800">{success}</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Секция аватара */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>

                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center mb-4">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-bold text-6xl">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Превью выбранного файла */}
                        {previewUrl && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-600">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleUploadAvatar} className="w-full">
                            <label className="block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100
                                        cursor-pointer mb-4"
                                />
                            </label>

                            {selectedFile && (
                                <button
                                    type="submit"
                                    disabled={uploadingAvatar}
                                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                                </button>
                            )}
                        </form>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Max size: 1 MB. Allowed formats: JPEG, PNG, GIF, WEBP
                        </p>
                    </div>
                </div>

                {/* Секция профиля */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

                    {!isEditing ? (
                        <div>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-base text-gray-900">{user.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-base text-gray-900">{user.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                    <dd className="mt-1 text-base text-gray-900">{user.id}</dd>
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

                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

