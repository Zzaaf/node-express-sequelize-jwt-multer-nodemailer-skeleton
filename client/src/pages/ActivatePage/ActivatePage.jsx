import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthApi } from '../../entities/AuthApi';
import { setAccessToken } from '../../shared/lib/axiosInstance';

export default function ActivatePage({ setUser }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const activateAccount = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Activation token is missing');
                return;
            }

            try {
                const response = await AuthApi.activateAccount(token);
                
                // Устанавливаем пользователя и токен (активация успешна)
                setUser(response.data.user);
                setAccessToken(response.data.accessToken);
                
                setStatus('success');
                setMessage(response.message || 'Account activated successfully!');
                
                // Редирект на главную через 3 секунды
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } catch (error) {
                setStatus('error');
                const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Activation failed. Please try again.';
                setMessage(errorMessage);
                
                // Редирект на вход через 5 секунд
                setTimeout(() => {
                    navigate('/signIn');
                }, 5000);
            }
        };

        activateAccount();
    }, [token, setUser, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                Loading...
                            </span>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">
                            Activating your account...
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please wait while we verify your activation link.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="rounded-lg bg-white shadow-lg p-8">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-gray-900">
                                Account Activated! 🎉
                            </h2>
                            <p className="mt-3 text-base text-gray-600">
                                {message}
                            </p>
                            <div className="mt-6 rounded-md bg-green-50 p-4">
                                <p className="text-sm text-green-800">
                                    You are now logged in and will be redirected to the home page in 3 seconds...
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Go to Home Page Now
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="rounded-lg bg-white shadow-lg p-8">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-gray-900">
                                Activation Failed
                            </h2>
                            <p className="mt-3 text-base text-gray-600">
                                {message}
                            </p>
                            <div className="mt-6 rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-800">
                                    <strong>Possible reasons:</strong>
                                </p>
                                <ul className="mt-2 text-sm text-red-700 list-disc list-inside text-left">
                                    <li>Activation link has expired</li>
                                    <li>Account is already activated</li>
                                    <li>Invalid activation token</li>
                                </ul>
                            </div>
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => navigate('/signIn')}
                                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Go to Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/signUp')}
                                    className="w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Register New Account
                                </button>
                            </div>
                            <p className="mt-4 text-xs text-gray-500">
                                Redirecting to sign in page in 5 seconds...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

