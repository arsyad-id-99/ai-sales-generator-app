import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, pages }) {
    const handleDelete = (id) => {
        if (confirm('Permanently delete this campaign?')) {
            router.delete(route('generate.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Campaign History</h2>
                    <Link href={route('generate.create')} className="px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition shadow-lg bg-slate-900 rounded-xl hover:bg-slate-800">
                        New Campaign
                    </Link>
                </div>
            }
        >
            <Head title="Your Campaigns" />

            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {pages.length === 0 ? (
                    <div className="text-center bg-white rounded-[2rem] p-20 border border-slate-200">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-slate-50">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Your gallery is empty</h3>
                        <p className="mt-2 mb-8 text-slate-500">Start by generating your first AI-powered sales page.</p>
                        <Link href={route('generate.create')} className="font-bold text-indigo-600 hover:underline">Create now &rarr;</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {pages.map((page) => (
                            <div key={page.id} className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1">
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 text-xl transition-transform duration-500 bg-indigo-50 rounded-2xl group-hover:scale-110">
                                            🚀
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">AI Success</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold truncate text-slate-900">{page.product_name}</h3>
                                    <p className="h-10 mb-8 text-sm text-slate-500 line-clamp-2">
                                        {page.input_data.description}
                                    </p>
                                    <div className="flex gap-3">
                                        <Link 
                                            href={route('generate.show', page.id)} 
                                            className="flex-1 py-3 text-sm font-bold text-center transition duration-300 bg-slate-50 text-slate-900 rounded-xl hover:bg-indigo-600 hover:text-white"
                                        >
                                            View Page
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(page.id)}
                                            className="flex items-center justify-center w-12 transition duration-300 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}