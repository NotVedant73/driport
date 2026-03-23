import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({ children }) {
  const { isLoggedIn, userRole, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="bg-amber-50/30 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mb-4"></div>
          <p className="text-amber-900 font-semibold">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to admin login
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in but not admin, redirect to home with error
  if (userRole !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  // User is admin, render protected admin pages
  return children;
}

