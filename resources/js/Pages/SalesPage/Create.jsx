import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

export default function Create({ auth, page = null }) {
  const { data, setData } = useForm({
    product_name: page ? page.product_name : "",
    price: page ? page.input_data.price : "",
    description: page ? page.input_data.description : "",
    features: page ? page.input_data.features : "",
    target_audience: page ? page.input_data.target_audience : "",
    usp: page ? page.input_data.usp : "",
    cta_link: page ? page.input_data.cta_link || "" : "",
    template: page ? page.input_data.template || "modern" : "modern",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPage, setGeneratedPage] = useState(
    page ? page.generated_content : null
  );

  // STATE BARU: Untuk menyimpan ID halaman agar tombol action (View/Export) bisa langsung berfungsi
  const [currentPageId, setCurrentPageId] = useState(page ? page.id : null);

  const submit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const url =
        page || currentPageId
          ? route("generate.update", currentPageId || page.id)
          : route("generate.store");

      const response =
        page || currentPageId
          ? await axios.patch(url, data)
          : await axios.post(url, data);

      setGeneratedPage(response.data.ai_result);

      // Simpan ID yang dikembalikan oleh backend agar Next Steps berfungsi
      if (response.data.page_id) {
        setCurrentPageId(response.data.page_id);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan, cek console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const themes = {
    modern: {
      card: "bg-white text-slate-900",
      accent: "bg-indigo-600",
      sub: "text-slate-500",
    },
    dark: {
      card: "bg-slate-900 text-white border-slate-700",
      accent: "bg-indigo-500",
      sub: "text-slate-400",
    },
    minimal: {
      card:
        "bg-white text-black border-2 border-black rounded-none shadow-none",
      accent: "bg-black rounded-none",
      sub: "text-gray-600",
    },
  };
  const style = themes[data.template];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-2xl font-bold text-slate-900">
          {page ? "Edit & Re-generate" : "Create Campaign"}
        </h2>
      }
    >
      <Head title={page ? "Edit Sales Page" : "Create Sales Page"} />

      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Form Input & Next Steps */}
          <div className="space-y-6 lg:col-span-4">
            <div className="p-6 bg-white border shadow-sm rounded-3xl border-slate-200 md:p-8">
              <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-900">
                <span className="flex items-center justify-center w-8 h-8 text-sm text-indigo-600 bg-indigo-100 rounded-lg">
                  1
                </span>
                Product Intelligence
              </h3>

              <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    placeholder="e.g. UltraBoost Runner"
                    value={data.product_name}
                    onChange={(e) => setData("product_name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Price Point
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    placeholder="e.g. $99.00"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Core Description
                  </label>
                  <textarea
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    rows="2"
                    placeholder="What does it do?"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    placeholder="e.g. Marathon Runners"
                    value={data.target_audience}
                    onChange={(e) => setData("target_audience", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Key Features
                  </label>
                  <textarea
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    rows="2"
                    placeholder="Comma-separated"
                    value={data.features}
                    onChange={(e) => setData("features", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Unique Selling Points (USP)
                  </label>
                  <textarea
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    rows="2"
                    placeholder="Why choose this over competitors?"
                    value={data.usp}
                    onChange={(e) => setData("usp", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Button Destination Link (URL)
                  </label>
                  <input
                    type="url"
                    className="w-full py-3 border-0 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50/50"
                    placeholder="e.g. https://wa.me/yournumber"
                    value={data.cta_link}
                    onChange={(e) => setData("cta_link", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    Design Style
                  </label>
                  <select
                    className="w-full py-3 border-0 rounded-xl bg-slate-50 focus:ring-indigo-500"
                    value={data.template}
                    onChange={(e) => setData("template", e.target.value)}
                  >
                    <option value="modern">Modern Clean (Light)</option>
                    <option value="dark">Midnight Pro (Dark)</option>
                    <option value="minimal">Minimalist (Black & White)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
                    isGenerating
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5"
                  }`}
                >
                  {isGenerating
                    ? "AI is Working..."
                    : generatedPage
                    ? "↻ Re-generate Page"
                    : "Generate Sales Page"}
                </button>
              </form>
            </div>

            {/* --- PANEL NEXT STEPS BARU MUNCUL DI SINI --- */}
            {generatedPage && currentPageId && (
              <div className="p-6 transition-all duration-500 border-indigo-100 shadow-sm bg-indigo-50 rounded-3xl animate-in slide-in-from-bottom-4 fade-in">
                <h4 className="flex items-center gap-3 mb-2 text-lg font-bold text-indigo-900">
                  <span className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Saved to Database!
                </h4>
                <p className="mb-6 text-sm text-indigo-700">
                  Your sales page has been successfully generated and saved.
                  What would you like to do next?
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href={route("generate.show", currentPageId)}
                    className="w-full py-3 font-bold text-center text-indigo-700 transition bg-white border border-indigo-200 shadow-sm rounded-xl hover:bg-indigo-100"
                  >
                    🔍 View Full Page
                  </Link>
                  <a
                    href={route("generate.export", currentPageId)}
                    className="flex items-center justify-center w-full gap-2 py-3 font-bold text-center text-white transition bg-green-600 shadow-sm rounded-xl hover:bg-green-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download HTML File
                  </a>
                  <Link
                    href={route("generate.history")}
                    className="w-full py-2 mt-2 text-sm font-bold text-center transition text-slate-500 hover:text-indigo-600"
                  >
                    &rarr; Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
            {/* ------------------------------------------- */}
          </div>

          {/* Right: Preview Area */}
          <div className="lg:col-span-8">
            {!generatedPage ? (
              <div className="h-[600px] bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 sticky top-24">
                <svg
                  className="w-16 h-16 mb-4 opacity-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="font-medium">Fill the form to see the AI magic</p>
              </div>
            ) : (
              <div
                className={`${
                  style.card
                } sticky top-24 shadow-2xl overflow-hidden border ring-1 ring-slate-200/50 transition-colors duration-500 ${
                  data.template === "minimal" ? "" : "rounded-[2.5rem]"
                }`}
              >
                <div className="flex items-center gap-2 px-6 py-3 border-b bg-slate-900 border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-4">
                    Live Preview ({data.template})
                  </span>
                </div>

                <div className="p-8 md:p-16 h-[800px] overflow-y-auto scrollbar-hide">
                  {/* Hero Section */}
                  <div className="max-w-2xl mx-auto text-center">
                    <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
                      {generatedPage.headline}
                    </h1>
                    <p className={`mb-10 text-xl ${style.sub}`}>
                      {generatedPage.subheadline}
                    </p>
                    <div
                      className={`inline-block px-8 py-4 font-bold text-white shadow-xl ${
                        style.accent
                      } ${data.template === "minimal" ? "" : "rounded-full"}`}
                    >
                      {generatedPage.call_to_action}
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="max-w-3xl mx-auto mt-16 text-center">
                    <h2 className={`mb-4 text-2xl font-bold opacity-90`}>
                      About the Product
                    </h2>
                    <p
                      className={`text-lg italic leading-relaxed ${style.sub}`}
                    >
                      "{generatedPage.product_description}"
                    </p>
                  </div>

                  {/* Benefits & Features */}
                  <div className="pt-16 mt-16 border-t border-slate-200/50">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                      <div className="p-8 border rounded-3xl bg-slate-50/50 border-slate-100">
                        <h4 className="mb-6 text-lg font-bold uppercase opacity-80">
                          Why Choose Us?
                        </h4>
                        <ul className="space-y-4">
                          {generatedPage.benefits?.map((b, i) => (
                            <li
                              key={i}
                              className={`flex items-start text-base ${style.sub}`}
                            >
                              <span className="mt-0.5 mr-3 text-green-500">
                                ✔
                              </span>{" "}
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-8 border rounded-3xl bg-slate-50/50 border-slate-100">
                        <h4 className="mb-6 text-lg font-bold uppercase opacity-80">
                          Key Features
                        </h4>
                        <ul className="space-y-4">
                          {generatedPage.features_breakdown?.map((f, i) => (
                            <li
                              key={i}
                              className={`flex items-start text-base ${style.sub}`}
                            >
                              <span className="mt-2 mr-4 w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0"></span>{" "}
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-12 mt-16 text-center text-white bg-gray-900 shadow-2xl rounded-[2.5rem]">
                    <h2 className="mb-4 text-4xl font-black md:text-5xl">
                      {generatedPage.pricing_display}
                    </h2>
                    <p className="mb-8 text-sm tracking-widest text-gray-400 uppercase">
                      Limited Time Offer
                    </p>
                    <div className="inline-block px-10 py-4 font-black text-gray-900 transition bg-white shadow-lg rounded-2xl hover:bg-indigo-50">
                      {generatedPage.call_to_action}
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
