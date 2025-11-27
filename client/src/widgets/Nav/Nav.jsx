import { NavLink } from 'react-router';

export default function Nav({ user, handleSignOut }) {
    return (
        <nav className="bg-white shadow-md mb-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <NavLink
                        to="/"
                        className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
                    >
                        JWT Demo Skeleton
                    </NavLink>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${isActive
                                    ? 'text-indigo-600'
                                    : 'text-gray-700 hover:text-indigo-600'
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/users"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${isActive
                                    ? 'text-indigo-600'
                                    : 'text-gray-700 hover:text-indigo-600'
                                }`
                            }
                        >
                            Users
                        </NavLink>

                        {user && (
                            <>
                                <NavLink
                                    to="/my-tasks"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors ${isActive
                                            ? 'text-indigo-600'
                                            : 'text-gray-700 hover:text-indigo-600'
                                        }`
                                    }
                                >
                                    My Tasks
                                </NavLink>

                                <NavLink
                                    to="/tasks"
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors ${isActive
                                            ? 'text-indigo-600'
                                            : 'text-gray-700 hover:text-indigo-600'
                                        }`
                                    }
                                >
                                    All Tasks
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                                            ? 'text-indigo-600'
                                            : 'text-gray-700 hover:text-indigo-600'
                                        }`
                                    }
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`${import.meta.env.VITE_SERVER_URL}${user.avatar}`}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className="font-semibold">{user.name}</span>
                                </NavLink>
                                <button
                                    onClick={handleSignOut}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/signIn"
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                                >
                                    Sign In
                                </NavLink>
                                <NavLink
                                    to="/signUp"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
