import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, page }) {
  const content = page.generated_content;
  const template = page.input_data.template || "modern";

  const themes = {
    modern: {
      bg: "bg-gray-50",
      card: "bg-white shadow-2xl border-gray-100",
      text: "text-slate-900",
      accent: "bg-indigo-600 hover:bg-indigo-700 text-white",
      sub: "text-slate-500",
      sectionBg: "bg-gray-50",
    },
    dark: {
      bg: "bg-slate-950",
      card: "bg-slate-900 shadow-indigo-500/10 border-slate-800",
      text: "text-white",
      accent: "bg-indigo-500 hover:bg-indigo-400 text-white",
      sub: "text-slate-400",
      sectionBg: "bg-slate-800",
    },
    minimal: {
      bg: "bg-white",
      card: "bg-white border-2 border-black shadow-none rounded-none",
      text: "text-black",
      accent: "bg-black hover:bg-gray-800 text-white rounded-none",
      sub: "text-gray-600",
      sectionBg: "bg-white border-2 border-black",
    },
  };

  const style = themes[template];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Bagian Kiri: Tombol Back & Judul */}
          <div className="flex items-center gap-4">
            <Link
              href={route("generate.history")}
              className="flex items-center justify-center w-10 h-10 transition bg-white border shadow-sm border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 text-slate-500"
              title="Back to History"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h2 className="text-xl font-bold leading-tight text-slate-900">
                {page.product_name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Live Preview</span>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Tombol Export */}
          <a
            href={route("generate.export", page.id)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white transition shadow-lg bg-slate-900 rounded-xl hover:bg-slate-800 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download HTML
          </a>
          
        </div>
      }
    >
      <Head title={`View - ${page.product_name}`} />

      <div className={`min-h-screen py-12 ${style.bg} transition-colors duration-500`}>
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className={`${style.card} overflow-hidden rounded-[3rem] border transition-colors duration-500`}>
            
            {/* Hero Section */}
            <div className="p-8 text-center md:p-20">
              <h1 className={`mb-6 text-5xl font-black leading-tight md:text-7xl ${style.text}`}>
                {content.headline}
              </h1>
              <p className={`max-w-3xl mx-auto mb-10 text-xl md:text-2xl ${style.sub}`}>
                {content.subheadline}
              </p>
              <a href={page.input_data.cta_link || "#"} target="_blank" rel="noopener noreferrer" className={`inline-block px-12 py-5 text-xl font-bold transition transform shadow-xl hover:-translate-y-1 ${style.accent} ${style.template === "minimal" ? "" : "rounded-full"}`}>
                {content.call_to_action}
              </a>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-20 md:p-16">
              <section className="max-w-3xl mx-auto text-center">
                <h2 className={`mb-6 text-3xl font-bold ${style.text}`}>About the Product</h2>
                <p className={`text-xl italic leading-relaxed ${style.sub}`}>"{content.product_description}"</p>
              </section>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className={`p-10 rounded-3xl ${style.sectionBg}`}>
                  <h3 className={`mb-6 text-2xl font-bold ${style.text}`}>Why Choose Us?</h3>
                  <ul className="space-y-4">
                    {content.benefits?.map((benefit, i) => (
                      <li key={i} className={`flex items-start text-lg ${style.sub}`}>
                        <span className="mt-1 mr-3 text-green-500">✔</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-10 rounded-3xl ${style.sectionBg}`}>
                  <h3 className={`mb-6 text-2xl font-bold ${style.text}`}>Key Features</h3>
                  <ul className="space-y-4">
                    {content.features_breakdown?.map((feature, i) => (
                      <li key={i} className={`flex items-center text-lg ${style.sub}`}>
                        <span className="w-3 h-3 mr-4 bg-indigo-500 rounded-full"></span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <section className="text-center bg-gray-900 text-white p-12 md:p-20 rounded-[3rem] shadow-2xl">
                <h2 className="mb-4 text-5xl font-black">{content.pricing_display}</h2>
                <p className="mb-10 text-lg tracking-widest text-gray-400 uppercase">Limited Time Offer</p>
                <a href={page.input_data.cta_link || "#"} className="inline-block px-16 py-5 text-2xl font-black text-gray-900 transition bg-white shadow-lg rounded-2xl hover:bg-indigo-50">
                  {content.call_to_action}
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}