import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white md:flex-row">
            <Head title="Register" />

            {/* Left Side - Visual (Hidden on mobile) */}
            <div className="relative items-center justify-center flex-1 hidden overflow-hidden bg-gray-900 md:flex">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-indigo-900 to-gray-900 opacity-90"></div>
                <div className="relative z-10 max-w-lg p-12 text-center text-white">
                    <h2 className="mb-4 text-4xl font-bold">Start Selling More, Today.</h2>
                    <p className="text-lg text-indigo-200">Join 10,000+ marketers and founders generating high-converting copy with AI.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center flex-1 p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-right md:text-left">
                        <Link href="/" className="block mb-2 text-3xl font-black tracking-tighter text-indigo-600">
                            Copy<span className="text-gray-900">AI.</span>
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-500">Let's get started with your 14-day free trial.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                id="name" name="name" value={data.name} 
                                className="block w-full px-4 py-3 mt-1 transition border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="name" isFocused={true} onChange={(e) => setData('name', e.target.value)} required 
                            />
                            <span className="mt-1 text-xs text-red-500">{errors.name}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                id="email" type="email" name="email" value={data.email} 
                                className="block w-full px-4 py-3 mt-1 transition border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="username" onChange={(e) => setData('email', e.target.value)} required 
                            />
                            <span className="mt-1 text-xs text-red-500">{errors.email}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                id="password" type="password" name="password" value={data.password} 
                                className="block w-full px-4 py-3 mt-1 transition border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} required 
                            />
                            <span className="mt-1 text-xs text-red-500">{errors.password}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input 
                                id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} 
                                className="block w-full px-4 py-3 mt-1 transition border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} required 
                            />
                            <span className="mt-1 text-xs text-red-500">{errors.password_confirmation}</span>
                        </div>

                        <button disabled={processing} className={`w-full mt-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-bold text-lg ${processing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200`}>
                            Create Account
                        </button>

                        <p className="mt-6 text-sm text-center text-gray-600">
                            Already have an account? <Link href={route('login')} className="font-semibold text-indigo-600 hover:text-indigo-500">Log in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}