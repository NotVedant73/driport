import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ADMIN_SESSION_KEY } from "./AdminGuard";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  const expected = import.meta.env.VITE_ADMIN_PIN || "1234";

  const submit = (e) => {
    e.preventDefault();
    if (pin === expected) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      toast.success("Welcome, Admin!");
      navigate("/admin");
      return;
    }
    toast.error("Invalid PIN");
  };

  return (
    <div className="bg-amber-50/30 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10 w-full max-w-md">
        <h1 className="text-3xl font-serif text-amber-900 mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-amber-800 text-center mb-6">
          Demo-only login for midterm review
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-3 py-2 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
              placeholder="Enter PIN"
            />
            <p className="text-xs text-amber-700 mt-2">
              Set `VITE_ADMIN_PIN` in your `.env` (defaults to `1234`).
            </p>
          </div>

          <button className="w-full bg-amber-900 text-amber-50 py-3 rounded hover:bg-amber-800 transition font-semibold">
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-amber-900 hover:text-amber-700 transition">
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}

