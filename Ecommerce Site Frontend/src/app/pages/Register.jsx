import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { UserPlus, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();  // ✅ Use auth context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Frontend validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email must be valid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Use AuthContext login method (updates global state + localStorage)
      login(response.data.token, response.data.email, response.data.role);

      toast.success("Welcome to DriPort! 🎉");
      navigate("/shop");
    } catch (error) {
      const data = error.response?.data;

      // Handle field-level validation errors from backend
      if (typeof data === "object" && !data.message) {
        setErrors(data);
      } else {
        // Handle single error message
        const message = data?.message || data || "Registration failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f0e8] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg p-8 border-2 border-stone-200 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-900 mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-serif text-stone-900 mb-2">
            Create Account
          </h1>
          <p className="text-stone-600">Join DriPort and start shopping</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              <UserIcon size={16} className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-amber-300 ${
                errors.name ? "border-red-500" : "border-stone-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-amber-300 ${
                errors.email ? "border-red-500" : "border-stone-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-amber-300 ${
                errors.password ? "border-red-500" : "border-stone-300"
              }`}
              placeholder="Create a password (min 6 characters)"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              <Lock size={16} className="inline mr-2" />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-amber-300 ${
                errors.confirmPassword ? "border-red-500" : "border-stone-300"
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3 rounded hover:bg-stone-700 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-stone-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-stone-900 font-semibold hover:text-stone-500"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
