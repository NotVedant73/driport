import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();  // ✅ Use auth context
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", formData);

      // Use AuthContext login method (updates global state + localStorage)
      login(response.data.token, response.data.email, response.data.role);

      toast.success(`Welcome back! 👋`);

      // Redirect to previous page or shop
      const from = location.state?.from || "/shop";
      navigate(from);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Login failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50/30 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-serif text-amber-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-amber-800">Login to your DriPort account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-amber-700 hover:text-amber-900"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-900 text-amber-50 py-3 rounded hover:bg-amber-800 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-amber-800">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-900 font-semibold hover:text-amber-700"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
