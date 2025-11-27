import { useState } from "react";
import { useNavigate } from "react-router";
import { setAccessToken } from "../../shared/lib/axiosInstance";
import { AuthApi } from "../../entities/AuthApi";

const INITIAL_INPUTS_DATA = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export default function SignUpForm({ setUser }) {
    const [inputs, setInputs] = useState(INITIAL_INPUTS_DATA);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        setInputs((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
        setError('');
        setSuccess('');
    };

    async function registrationUserHandler(event) {
        event.preventDefault();
        
        if (inputs.password !== inputs.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await AuthApi.signUp(inputs);
            
            // После регистрации НЕ устанавливаем пользователя (нужна активация)
            // Показываем сообщение об отправке письма
            setSuccess(response.message || 'Registration successful! Please check your email to activate your account.');
            setInputs(INITIAL_INPUTS_DATA);
            
            // Через 5 секунд редиректим на страницу входа
            setTimeout(() => {
                navigate('/signIn');
            }, 5000);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={registrationUserHandler} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {success && (
                        <div className="rounded-md bg-green-50 p-4 border-2 border-green-200">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">{success}</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>📧 We've sent an activation link to your email. Please check your inbox (and spam folder).</p>
                                        <p className="mt-1">Redirecting to sign in page in 5 seconds...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                            Your name
                        </label>
                        <div className="mt-2">
                            <input
                                autoFocus={true}
                                placeholder="Your name"
                                id="name"
                                onChange={onChangeHandler}
                                value={inputs.name}
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                autoFocus={false}
                                placeholder="Email address"
                                id="email"
                                onChange={onChangeHandler}
                                value={inputs.email}
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                placeholder="Password"
                                id="password"
                                onChange={onChangeHandler}
                                value={inputs.password}
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Must contain uppercase, lowercase, number, special character, min 8 chars
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                                Confirm Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                placeholder="Confirm Password"
                                id="confirmPassword"
                                onChange={onChangeHandler}
                                value={inputs.confirmPassword}
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={inputs.password !== inputs.confirmPassword || isLoading}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/signIn" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}