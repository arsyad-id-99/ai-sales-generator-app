import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 selection:bg-indigo-500 selection:text-white">
            <Head title="Welcome to CopyAI - Sales Page Generator" />

            {/* Navbar */}
            <nav className="z-10 flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm md:px-12">
                <div className="text-2xl font-black tracking-tighter text-indigo-600">
                    Copy<span className="text-gray-900">AI.</span>
                </div>
                <div>
                    {auth.user ? (
                        <Link href={route('generate.history')} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600">
                            Go to Dashboard &rarr;
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link href={route('login')} className="text-sm font-semibold text-gray-600 transition hover:text-indigo-600">
                                Log in
                            </Link>
                            <Link href={route('register')} className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
                                Get Started Free
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative flex flex-col items-center justify-center flex-grow px-4 py-20 overflow-hidden text-center sm:px-6 lg:px-8">
                {/* Background Decoration */}
                <div className="absolute top-0 w-full h-full transform -translate-x-1/2 pointer-events-none left-1/2 max-w-7xl opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                <div className="z-10 max-w-4xl">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-7xl">
                        Write High-Converting <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Sales Pages in Seconds.
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto mt-4 mb-10 text-xl text-gray-600">
                        Stop staring at a blank page. Just describe your product, and our advanced AI will instantly generate persuasive copy, headlines, and layouts designed to sell.
                    </p>
                    
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        {auth.user ? (
                            <Link href={route('generate.create')} className="px-8 py-4 text-lg font-bold text-white transition transform bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105">
                                Start Generating Now
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')} className="px-8 py-4 text-lg font-bold text-white transition transform bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105">
                                    Start 14-Day Free Trial
                                </Link>
                                <a href="#features" className="px-8 py-4 text-lg font-bold text-gray-900 transition bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50">
                                    See How it Works
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}