import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { STORE_CONFIG } from "../../config";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, userRole } = useAuth();
  const { items } = useCart();
  const isAdmin = userRole === "ROLE_ADMIN";
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-amber-50 border-b-2 border-amber-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-1.5 sm:py-2 text-[11px] sm:text-sm border-b border-amber-900/10 gap-2">
          <div className="text-amber-900 truncate">
            Free shipping on orders over ₹{STORE_CONFIG.freeShippingThreshold}
          </div>
          <div className="hidden sm:flex gap-4 text-amber-900 shrink-0">
            <Link to="/profile" className="hover:text-amber-700">
              Track Order
            </Link>
            <Link to="/contact" className="hover:text-amber-700">
              Help
            </Link>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-serif text-amber-900"
          >
            DriPort
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Shop
            </Link>
            <Link
              to="/ai-stylist"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              AI Stylist
            </Link>
            <Link
              to="/about"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-amber-900 hover:text-amber-700 transition"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-amber-900 hover:text-amber-700 transition font-semibold"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="text-amber-900 hover:text-amber-700 hidden md:block">
              <Search size={20} />
            </button>
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="text-amber-900 hover:text-amber-700 hidden md:block"
                title="My Profile"
              >
                <User size={20} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-amber-900 hover:text-amber-700 hidden md:block"
                title="Login"
              >
                <User size={20} />
              </Link>
            )}
            <Link
              to="/cart"
              className="text-amber-900 hover:text-amber-700 relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-900 text-amber-50 text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-amber-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-amber-900/10">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-amber-900 hover:text-amber-700"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="text-amber-900 hover:text-amber-700"
              >
                Shop
              </Link>
              <Link
                to="/ai-stylist"
                onClick={() => setIsMenuOpen(false)}
                className="text-amber-900 hover:text-amber-700"
              >
                AI Stylist
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-amber-900 hover:text-amber-700"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-amber-900 hover:text-amber-700"
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-1 text-amber-900 hover:text-amber-700 font-semibold"
                >
                  <Shield size={16} />
                  Admin Panel
                </Link>
              )}
              {isLoggedIn ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-amber-900 hover:text-amber-700"
                >
                  My Profile
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-amber-900 hover:text-amber-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-amber-900 hover:text-amber-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
