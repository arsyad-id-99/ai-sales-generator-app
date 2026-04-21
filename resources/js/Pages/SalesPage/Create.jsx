import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Create({ auth }) {
    const { data, setData, errors } = useForm({
        product_name: '', price: '', description: '', features: '', target_audience: '', usp: '',
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPage, setGeneratedPage] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const response = await axios.post(route('generate.store'), data);
            setGeneratedPage(response.data.ai_result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-2xl font-bold text-slate-900">Create Campaign</h2>}
        >
            <Head title="Create New Sales Page" />

            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12">
                    
                    {/* Left: Form Input */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
                            <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-900">
                                <span className="flex items-center justify-center w-8 h-8 text-sm text-indigo-600 bg-indigo-100 rounded-lg">1</span>
                                Product Intelligence
                            </h3>
                            
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Product Name</label>
                                    <input type="text" className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50" placeholder="e.g. UltraBoost Runner" value={data.product_name} onChange={e => setData('product_name', e.target.value)} required />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Price Point</label>
                                    <input type="text" className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50" placeholder="e.g. $99.00" value={data.price} onChange={e => setData('price', e.target.value)} required />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Core Description</label>
                                    <textarea className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50" rows="3" placeholder="What does it do?" value={data.description} onChange={e => setData('description', e.target.value)} required />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Target Audience</label>
                                    <input type="text" className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50" placeholder="e.g. Marathon Runners" value={data.target_audience} onChange={e => setData('target_audience', e.target.value)} required />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isGenerating} 
                                    className={`w-full py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg ${isGenerating ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}`}
                                >
                                    {isGenerating ? 'AI is Writing...' : 'Generate Sales Page'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Preview Area */}
                    <div className="lg:col-span-8">
                        {!generatedPage ? (
                            <div className="h-[600px] bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /></svg>
                                <p className="font-medium">Fill the form to see the AI magic</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 ring-1 ring-slate-200/50">
                                <div className="flex items-center gap-2 px-6 py-3 bg-slate-900">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-4">AI-Generated Preview</span>
                                </div>
                                
                                {/* Inner Preview Content */}
                                <div className="p-8 md:p-16 h-[800px] overflow-y-auto scrollbar-hide">
                                    <div className="max-w-2xl mx-auto text-center">
                                        <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl text-slate-900">{generatedPage.headline}</h1>
                                        <p className="mb-10 text-xl text-slate-500">{generatedPage.subheadline}</p>
                                        <div className="inline-block px-8 py-4 font-bold text-white bg-indigo-600 rounded-full shadow-xl">{generatedPage.call_to_action}</div>
                                    </div>
                                    <div className="pt-20 mt-20 border-t border-slate-100">
                                        <div className="grid grid-cols-2 gap-8 text-sm">
                                            <div className="space-y-4">
                                                <h4 className="font-bold uppercase text-slate-900">Benefits</h4>
                                                {generatedPage.benefits?.map((b, i) => <p key={i} className="flex gap-2 text-slate-500"><span>✓</span> {b}</p>)}
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-bold uppercase text-slate-900">Features</h4>
                                                {generatedPage.features_breakdown?.map((f, i) => <p key={i} className="flex gap-2 text-slate-500"><span>•</span> {f}</p>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}