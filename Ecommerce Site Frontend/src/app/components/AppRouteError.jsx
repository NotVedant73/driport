import { Link, useRouteError } from "react-router-dom";

export default function AppRouteError() {
  const error = useRouteError();

  const message =
    error?.statusText ||
    error?.message ||
    "Something went wrong while loading this page.";

  return (
    <div className="bg-[#f5f0e8] min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-3">
          Page load issue
        </h1>
        <p className="text-stone-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-stone-900 text-white rounded hover:bg-stone-700 transition"
          >
            Retry
          </button>
          <Link
            to="/"
            className="px-5 py-2 border-2 border-stone-900 text-stone-900 rounded hover:bg-stone-100 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
