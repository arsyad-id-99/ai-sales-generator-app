import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Index({ auth, pages }) {
  // State untuk Modal Konfirmasi Hapus
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  // State untuk Toast/Snackbar
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // Otomatis tutup toast setelah 3 detik
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const confirmDelete = (page) => {
    setPageToDelete(page);
    setIsModalOpen(true);
  };

  const executeDelete = () => {
    if (!pageToDelete) return;

    router.delete(route("generate.destroy", pageToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsModalOpen(false);
        setPageToDelete(null);
        // Trigger Toast Sukses
        setToast({
          show: true,
          message: "Campaign has been permanently deleted.",
        });
      },
    });
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setPageToDelete(null);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Campaign History
          </h2>
          <Link
            href={route("generate.create")}
            className="px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition shadow-lg bg-slate-900 rounded-xl hover:bg-slate-800"
          >
            New Campaign
          </Link>
        </div>
      }
    >
      <Head title="Your Campaigns" />

      <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {pages.length === 0 ? (
          <div className="text-center bg-white rounded-[2rem] p-20 border border-slate-200">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-slate-50">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Your gallery is empty
            </h3>
            <p className="mt-2 mb-8 text-slate-500">
              Start by generating your first AI-powered sales page.
            </p>
            <Link
              href={route("generate.create")}
              className="font-bold text-indigo-600 hover:underline"
            >
              Create now &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <div
                key={page.id}
                className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center justify-center w-12 h-12 text-xl transition-transform duration-500 bg-indigo-50 rounded-2xl group-hover:scale-110">
                      🚀
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                      AI Success
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold truncate text-slate-900">
                    {page.product_name}
                  </h3>
                  <p className="h-10 mb-8 text-sm text-slate-500 line-clamp-2">
                    {page.input_data.description}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href={route("generate.show", page.id)}
                      className="flex-1 py-3 text-sm font-bold text-center transition duration-300 bg-slate-50 text-slate-900 rounded-xl hover:bg-indigo-600 hover:text-white"
                    >
                      View Page
                    </Link>
                    <Link
                      href={route("generate.edit", page.id)}
                      className="flex-1 py-3 text-sm font-bold text-center text-indigo-600 transition duration-300 bg-slate-50 rounded-xl hover:bg-indigo-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(page)}
                      className="flex items-center justify-center w-12 transition duration-300 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CUSTOM TOAST / SNACKBAR --- */}
      <div
        className={`fixed bottom-8 right-8 z-[60] transition-all duration-500 transform ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-4 text-white border shadow-2xl bg-slate-900 rounded-2xl border-slate-700">
          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-green-500 rounded-full">
            <svg
              className="w-4 h-4 text-white"
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
          </div>
          <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 transition text-slate-500 hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* --- MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm"
            onClick={cancelDelete}
          ></div>
          <div className="relative z-10 w-full max-w-md p-8 duration-200 bg-white shadow-2xl rounded-3xl animate-in fade-in zoom-in">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-center text-slate-900">
              Delete Campaign?
            </h3>
            <p className="mb-8 text-center text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-700">
                "{pageToDelete?.product_name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3 font-bold transition bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 font-bold text-white transition bg-red-600 shadow-lg rounded-xl hover:bg-red-700 shadow-red-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
