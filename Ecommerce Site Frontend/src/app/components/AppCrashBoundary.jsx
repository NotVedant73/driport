import React from "react";
import { Link } from "react-router-dom";

export default class AppCrashBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected application error.",
    };
  }

  componentDidCatch(error) {
    // Keep this for production diagnostics in browser console.
    console.error("AppCrashBoundary caught an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#f5f0e8] min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-xl w-full bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-stone-600 mb-2">{this.state.message}</p>
            <p className="text-xs text-stone-500 mb-6">
              Please refresh once. If it still happens, check network and
              backend status.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-stone-900 text-white rounded hover:bg-stone-700 transition"
              >
                Reload Page
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

    return this.props.children;
  }
}
