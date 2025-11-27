import { Link } from 'react-router';

export default function HomePage({ user }) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Welcome to JWT Demo Skeleton
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    A modern authentication and task management system
                </p>
                {!user && (
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/signUp"
                            className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/signIn"
                            className="rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="text-indigo-600 text-4xl mb-4">🔐</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Secure Authentication
                    </h3>
                    <p className="text-gray-600">
                        JWT-based authentication with access and refresh tokens for maximum security
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="text-indigo-600 text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Task Management
                    </h3>
                    <p className="text-gray-600">
                        Create, update, and manage your tasks with an intuitive interface
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="text-indigo-600 text-4xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        User Management
                    </h3>
                    <p className="text-gray-600">
                        View and manage users with a modern, responsive interface
                    </p>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Built With Modern Technologies
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        React 19
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        Node.js + Express
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        PostgreSQL + Sequelize
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        JWT Authentication
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        Tailwind CSS
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        Axios + Interceptors
                    </span>
                </div>
            </div>
        </div>
    );
}
