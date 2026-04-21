import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white md:flex-row">
            <Head title="Log in" />

            {/* Left Side - Form */}
            <div className="flex items-center justify-center flex-1 p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <Link href="/" className="block mb-2 text-3xl font-black tracking-tighter text-indigo-600">
                            Copy<span className="text-gray-900">AI.</span>
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                id="email" type="email" name="email" value={data.email} 
                                className="block w-full px-4 py-3 mt-1 transition border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="username" isFocused={true} onChange={(e) => setData('email', e.target.value)}
                            />
                            <span className="mt-1 text-xs text-red-500">{errors.email}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                id="password" type="password" name="password" value={data.password}
                                className="block w-full px-4 py-3 mt-1 transition border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="current-password" onChange={(e) => setData('password', e.target.value)}
                            />
                            <span className="mt-1 text-xs text-red-500">{errors.password}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="text-indigo-600 border-gray-300 rounded shadow-sm focus:ring-indigo-500" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button disabled={processing} className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-bold text-lg ${processing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200`}>
                            Sign In
                        </button>

                        <p className="mt-6 text-sm text-center text-gray-600">
                            Don't have an account? <Link href={route('register')} className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up for free</Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Visual/Image (Hidden on mobile) */}
            <div className="relative items-center justify-center flex-1 hidden overflow-hidden bg-gray-900 md:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-90"></div>
                <div className="relative z-10 max-w-lg p-12 text-center text-white">
                    <h2 className="mb-6 text-4xl font-bold">"This tool saved me 10 hours a week on copywriting."</h2>
                    <p className="text-lg text-indigo-200">- Sarah J., Marketing Director</p>
                </div>
            </div>
        </div>
    );
}