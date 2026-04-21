import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, page }) {
    const content = page.generated_content;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Viewing: {page.product_name}
                    </h2>
                    <Link 
                        href={route('generate.history')} 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                        &larr; Back to History
                    </Link>
                </div>
            }
        >
            <Head title={`View - ${page.product_name}`} />

            <div className="min-h-screen py-12 bg-gray-50">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl">
                        
                        {/* Hero Section */}
                        <div className="p-8 text-center md:p-20 bg-gradient-to-br from-white to-indigo-50">
                            <h1 className="mb-6 text-5xl font-black leading-tight text-gray-900 md:text-7xl">
                                {content.headline}
                            </h1>
                            <p className="max-w-3xl mx-auto mb-10 text-xl text-gray-600 md:text-2xl">
                                {content.subheadline}
                            </p>
                            <button className="px-12 py-5 text-xl font-bold text-white transition transform bg-indigo-600 rounded-full shadow-xl hover:bg-indigo-700 hover:-translate-y-1">
                                {content.call_to_action}
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 space-y-20 md:p-16">
                            
                            {/* Product Description */}
                            <section className="max-w-3xl mx-auto text-center">
                                <h2 className="mb-6 text-3xl font-bold text-gray-900">About the Product</h2>
                                <p className="text-xl italic leading-relaxed text-gray-700">
                                    "{content.product_description}"
                                </p>
                            </section>

                            {/* Features & Benefits Grid */}
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                                <div className="p-10 border border-gray-100 bg-gray-50 rounded-3xl">
                                    <h3 className="mb-6 text-2xl font-bold text-indigo-900">Why Choose Us?</h3>
                                    <ul className="space-y-4">
                                        {content.benefits?.map((benefit, i) => (
                                            <li key={i} className="flex items-start text-lg text-gray-700">
                                                <span className="mt-1 mr-3 text-green-500">✔</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-10 bg-white border border-indigo-100 shadow-sm rounded-3xl">
                                    <h3 className="mb-6 text-2xl font-bold text-gray-900">Key Features</h3>
                                    <ul className="space-y-4">
                                        {content.features_breakdown?.map((feature, i) => (
                                            <li key={i} className="flex items-center text-lg text-gray-700">
                                                <span className="w-3 h-3 mr-4 bg-indigo-500 rounded-full"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <section className="text-center bg-gray-900 text-white p-12 md:p-20 rounded-[3rem] shadow-2xl">
                                <h2 className="mb-4 text-5xl font-black">{content.pricing_display}</h2>
                                <p className="mb-10 text-lg tracking-widest text-gray-400 uppercase">Limited Time Offer</p>
                                <button className="px-16 py-5 text-2xl font-black text-gray-900 transition bg-white shadow-lg rounded-2xl hover:bg-indigo-50">
                                    Get Started Now
                                </button>
                            </section>
                        </div>
                    </div>

                    {/* Footer Info (Metadata) */}
                    <div className="mt-8 text-sm text-center text-gray-400">
                        Original Input: {page.input_data.product_name} • Generated by AI 
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}