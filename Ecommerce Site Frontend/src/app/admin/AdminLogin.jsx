import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import apiClient from "../../api/apiClient";
import { Shield, Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoggedIn, userRole } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to admin dashboard
  if (isLoggedIn && userRole === "ROLE_ADMIN") {
    navigate("/admin");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use dedicated admin login endpoint - backend validates admin role
      const response = await apiClient.post("/auth/admin/login", formData);

      // Use AuthContext login method
      login(response.data.token, response.data.email, response.data.role);

      toast.success("Welcome, Admin! 👑");
      navigate("/admin");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else {
        const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Admin login failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50/30 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-serif text-amber-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-amber-800">Secure admin access only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              <Mail size={16} className="inline mr-2" />
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              placeholder="admin@driport.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              placeholder="Enter admin password"
            />
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-600 p-3 text-sm text-amber-800">
            <strong>🔒 Secure Access:</strong> Only users with ROLE_ADMIN can
            access this area.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-900 text-amber-50 py-3 rounded hover:bg-amber-800 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Login as Admin"}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-amber-900 hover:text-amber-700 transition text-sm"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
