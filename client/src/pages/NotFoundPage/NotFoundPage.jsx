import { useNavigate } from 'react-router';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full text-center">
                {/* Large 404 with gradient */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-extrabold leading-none mb-4">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            404
                        </span>
                    </h1>
                </div>

                {/* Title and description */}
                <div className="mb-8 space-y-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Page Not Found
                    </h2>
                    <p className="text-base text-gray-600">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Go Home button */}
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go Home
                </button>
            </div>
        </div>
    );
}

