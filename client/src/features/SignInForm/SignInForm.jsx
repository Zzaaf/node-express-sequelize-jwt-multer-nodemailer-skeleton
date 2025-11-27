import { useState } from "react";
import { useNavigate } from "react-router";
import { setAccessToken } from "../../shared/lib/axiosInstance";
import { AuthApi } from "../../entities/AuthApi";

const INITIAL_INPUTS_DATA = {
    email: '',
    password: '',
};

export default function SignInForm({ setUser }) {
    const [inputs, setInputs] = useState(INITIAL_INPUTS_DATA);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        setInputs((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
        setError('');
    };

    async function signInUserHandler(event) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await AuthApi.signIn(inputs);
            setUser(response.data.user);
            setAccessToken(response.data.accessToken);
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Sign in failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={signInUserHandler} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    {error.includes('not activated') && (
                                        <p className="mt-2 text-sm text-red-700">
                                            📧 Please check your email and click the activation link we sent you during registration.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                autoFocus={true}
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
                                autoFocus={false}
                                placeholder="Password"
                                id="password"
                                onChange={onChangeHandler}
                                value={inputs.password}
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="/signUp" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

