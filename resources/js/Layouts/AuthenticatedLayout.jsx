import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header / Navbar */}
            <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-600">
                                    Copy<span className="text-slate-900">AI.</span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link href={route('generate.history')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${route().current('generate.history') ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                    Dashboard
                                </Link>
                                <Link href={route('generate.create')} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${route().current('generate.create') ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                    Create New
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-600">{user.name}</span>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="text-xs font-bold tracking-widest uppercase transition text-slate-400 hover:text-red-600"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Heading */}
            {header && (
                <header className="bg-white">
                    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}